import { ascii, checkDimensions, fail, formatOf, MIMES } from './file-validation.mjs';
import { bounds, crc32, view } from './binary.mjs';
import { readExif } from './exif.mjs';

const labels = { exif:'EXIF (contêiner)', gps:'GPS no EXIF', xmp:'XMP (contêiner)', icc:'Perfil ICC', text:'Texto PNG', comment:'Comentário JPEG', orientation:'Tag de orientação EXIF', other:'Outros dados' };
/** @returns {import('../types').Inspection} */
export function inspectImage(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const format = formatOf(bytes), data = view(bytes);
  const metadata = Object.fromEntries(Object.entries(labels).map(([id,label])=>[id,{label,status:'not-found',value:'Não encontrado nos contêineres cobertos.'}]));
  metadata.other = {label:labels.other,status:'unverified',value:'Dados nos pixels, esteganografia e contêineres não cobertos não são verificados.'};
  const details = [], warnings = [];
  let width=0, height=0, color='', alpha='not-found', orientation=1, patch=null, exifCount=0;
  function field(id, value, status='found') {
    if(metadata[id].status==='unsupported')return;
    metadata[id]={label:labels[id],status,value};
  }
  function exif(start,length,crc) {
    if(++exifCount>1)fail('EXIF','Múltiplos contêineres EXIF não são suportados.');
    const result=readExif(bytes.subarray(start,start+length),start);
    orientation=result.orientation; patch=result.patch;
    if(patch&&crc)patch.crc=crc;
    field('exif','EXIF TIFF clássico encontrado.');
    if(result.gps)field('gps','Diretório GPS encontrado.');
    if(result.orientationFound)field('orientation',String(orientation));
    details.push(...result.details);
  }
  function addText(label,value) {
    if(details.length>=100)fail('METADATA','Mais de 100 campos de metadados; arquivo não suportado.');
    details.push({label:String(label).slice(0,100),value:String(value).slice(0,1000)});
  }

  if(format==='jpeg') {
    let position=2, scan=false, ended=false, sawScan=false, frames=0, segments=0;
    while(position<bytes.length) {
      if(++segments>4096)fail('CORRUPT','JPEG excede o limite de segmentos.');
      if(scan) {
        while(position<bytes.length) {
          if(bytes[position++]!==255)continue;
          while(bytes[position]===255)position++;
          if(bytes[position]===0){position++;continue;}
          if(bytes[position]>=0xd0&&bytes[position]<=0xd7){position++;continue;}
          position--; break;
        }
        scan=false;
      }
      bounds(bytes,position,2);
      if(bytes[position++]!==255)fail('CORRUPT','Marcador JPEG inválido.');
      while(bytes[position]===255)position++;
      const marker=bytes[position++];
      if(marker===0xd9){if(position!==bytes.length||!sawScan)fail('CORRUPT','JPEG com final inválido ou dados após EOI.');ended=true;break;}
      if(marker===0xd8||marker===0||marker===1||(marker>=0xd0&&marker<=0xd7))fail('CORRUPT','Sequência JPEG não suportada.');
      bounds(bytes,position,2);
      const length=data.getUint16(position);
      if(length<2)fail('CORRUPT','Segmento JPEG inválido.');
      bounds(bytes,position,length);
      const start=position+2, size=length-2;
      if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)){
        if(![0xc0,0xc2].includes(marker))fail('VARIANT','Apenas JPEG baseline e progressivo de 8 bits são suportados.');
        if(size<6)fail('CORRUPT','Cabeçalho SOF truncado.');
        bounds(bytes,start,6);
        if(++frames!==1||bytes[start]!==8||![1,3].includes(bytes[start+5]))fail('VARIANT','JPEG multiquadro, CMYK ou variante não suportada.');
        height=data.getUint16(start+1);width=data.getUint16(start+3);
        color=bytes[start+5]===1?'JPEG, 1 componente (cinza)':'JPEG, 3 componentes; conversão de cor depende do navegador';
        checkDimensions(width,height);
      }
      if(marker===0xe1&&ascii(bytes,start,6)==='Exif\0\0')exif(start,size);
      else if(marker===0xe1&&ascii(bytes,start,Math.min(size,60)).includes('ns.adobe.com/'))field('xmp','Pacote XMP encontrado; conteúdo XML não interpretado.');
      if(marker===0xe2&&ascii(bytes,start,12)==='ICC_PROFILE\0')field('icc','Fragmento de perfil ICC encontrado; perfil não interpretado.');
      if(marker===0xfe){field('comment','Comentário COM encontrado.');addText('Comentário JPEG',ascii(bytes,start,Math.min(size,1000)));}
      if(marker===0xda){if(!frames||size<6)fail('CORRUPT','JPEG sem quadro ou cabeçalho de scan válido.');scan=true;sawScan=true;}
      position+=length;
    }
    if(!ended)fail('CORRUPT','JPEG truncado ou sem EOI.');
  }

  if(format==='png') {
    let position=8, chunks=0, header=false, image=false, ended=false;
    const colorTypes={0:'Cinza',2:'RGB',3:'Indexado',4:'Cinza + alpha',6:'RGBA'};
    while(position<bytes.length) {
      if(++chunks>4096)fail('CORRUPT','PNG excede o limite de chunks.');
      bounds(bytes,position,12);
      const length=data.getUint32(position), type=ascii(bytes,position+4,4), start=position+8, end=start+length;
      bounds(bytes,start,length+4);
      if(!/^[A-Za-z]{4}$/.test(type)||bytes[position+6]&32)fail('CORRUPT','Tipo de chunk PNG inválido.');
      if(data.getUint32(end)!==crc32(bytes.subarray(position+4,end)))fail('CRC','CRC inválido: PNG corrompido.');
      if(!header&&type!=='IHDR')fail('CORRUPT','PNG sem IHDR inicial.');
      if(['acTL','fcTL','fdAT'].includes(type))fail('ANIMATED','PNG animado (APNG) não é suportado no P0.');
      if(type==='IHDR') {
        if(header||length!==13)fail('CORRUPT','IHDR inválido.');
        header=true;width=data.getUint32(start);height=data.getUint32(start+4);
        const depth=bytes[start+8], kind=bytes[start+9];
        const depths={0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]};
        if(!depths[kind]?.includes(depth)||bytes[start+10]!==0||bytes[start+11]!==0||bytes[start+12]>1)fail('VARIANT','Variante PNG não suportada.');
        color=colorTypes[kind]+' · '+depth+' bits por amostra';
        if(depth===16)warnings.push('PNG de 16 bits será convertido para a precisão do canvas (normalmente 8 bits).');
        alpha=[4,6].includes(kind)?'present':'not-found';checkDimensions(width,height);
      } else if(type==='eXIf')exif(start,length,{start:position+4,end,offset:end});
      else if(type==='iCCP')field('icc','Perfil iCCP comprimido encontrado; perfil não interpretado.');
      else if(type==='sRGB')details.push({label:'Declaração de cor',value:'Chunk sRGB encontrado.'});
      else if(type==='tRNS')alpha='present';
      else if(type==='tEXt') {
        const raw=bytes.subarray(start,end), zero=raw.indexOf(0);
        if(zero<1||zero>79)fail('CORRUPT','Campo tEXt inválido.');
        field('text','Campos tEXt encontrados.');addText(ascii(raw,0,zero),ascii(raw,zero+1,raw.length-zero-1));
        if(ascii(raw,0,zero)==='XML:com.adobe.xmp')field('xmp','Pacote XMP em texto PNG encontrado; XML não interpretado.');
      } else if(type==='zTXt')field('text','Texto zTXt comprimido detectado, mas não interpretado.','unsupported');
      else if(type==='iTXt') {
        const raw=bytes.subarray(start,end), zero=raw.indexOf(0);
        if(zero<1||zero>79||zero+3>raw.length)fail('CORRUPT','Campo iTXt inválido.');
        if(ascii(raw,0,zero)==='XML:com.adobe.xmp')field('xmp','Pacote XMP em iTXt encontrado; XML não interpretado.');
        if(raw[zero+1]!==0)field('text','iTXt comprimido detectado, mas não interpretado.','unsupported');
        else {
          const langEnd=raw.indexOf(0,zero+3), translatedEnd=raw.indexOf(0,langEnd+1);
          if(langEnd<0||translatedEnd<0)fail('CORRUPT','Campo iTXt truncado.');
          field('text','Campos iTXt não comprimidos encontrados.');
          addText(ascii(raw,0,zero),new TextDecoder().decode(raw.subarray(translatedEnd+1,translatedEnd+1001)));
        }
      } else if(type==='IDAT')image=true;
      else if(type==='IEND') {
        if(length!==0||!image||end+4!==bytes.length)fail('CORRUPT','Final PNG inválido ou dados após IEND.');
        ended=true;break;
      } else if(!(bytes[position+4]&32)&&type!=='PLTE')fail('VARIANT','Chunk PNG crítico desconhecido: '+type);
      position=end+4;
    }
    if(!ended)fail('CORRUPT','PNG truncado ou sem IEND.');
  }

  if(format==='webp') {
    if(data.getUint32(4,true)+8!==bytes.length)fail('CORRUPT','Tamanho RIFF inconsistente.');
    let position=12,chunks=0,payload=0,extended=null;
    while(position<bytes.length) {
      if(++chunks>4096)fail('CORRUPT','WebP excede o limite de chunks.');
      bounds(bytes,position,8);
      const type=ascii(bytes,position,4),length=data.getUint32(position+4,true),start=position+8;
      bounds(bytes,start,length+(length&1));
      if(['ANIM','ANMF'].includes(type))fail('ANIMATED','WebP animado não é suportado no P0.');
      if(type==='VP8X') {
        if(extended||length!==10||position!==12)fail('CORRUPT','VP8X inválido.');
        if(bytes[start]&2)fail('ANIMATED','WebP animado não é suportado no P0.');
        if((bytes[start]&0xc1)||bytes[start+1]||bytes[start+2]||bytes[start+3])fail('VARIANT','Flags VP8X não suportadas.');
        const u24=o=>bytes[o]+bytes[o+1]*256+bytes[o+2]*65536;
        extended={width:u24(start+4)+1,height:u24(start+7)+1};
        if(bytes[start]&16)alpha='present';
        checkDimensions(extended.width,extended.height);
      } else if(type==='VP8 ') {
        if(++payload!==1||length<10||ascii(bytes,start+3,3)!=='\x9d\x01\x2a')fail('CORRUPT','Quadro VP8 inválido.');
        width=data.getUint16(start+6,true)&0x3fff;height=data.getUint16(start+8,true)&0x3fff;
      } else if(type==='VP8L') {
        if(++payload!==1||length<5||bytes[start]!==0x2f)fail('CORRUPT','Quadro VP8L inválido.');
        const bits=data.getUint32(start+1,true);
        if(bits>>>29)fail('VARIANT','Versão VP8L não suportada.');
        width=(bits&0x3fff)+1;height=((bits>>>14)&0x3fff)+1;
        if(bits&0x10000000)alpha='present';
      } else if(type==='ALPH')alpha='present';
      else if(type==='EXIF')exif(start,length);
      else if(type==='XMP ')field('xmp','Pacote XMP encontrado; XML não interpretado.');
      else if(type==='ICCP')field('icc','Perfil ICCP encontrado; perfil não interpretado.');
      position=start+length+(length&1);
    }
    if(payload!==1||!width||!height)fail('CORRUPT','WebP sem quadro estático válido.');
    if(extended&&(extended.width!==width||extended.height!==height))fail('CORRUPT','Dimensões VP8X e quadro divergem.');
    color='WebP estático · RGB'+(alpha==='present'?' com alpha':'');
  }
  checkDimensions(width,height);
  const swapped=orientation>=5&&orientation<=8;
  if(exifCount)warnings.push('EXIF será normalizado para orientação visual antes do re-encoding.');
  return {format,mime:MIMES[format],bytes:bytes.length,width,height,displayWidth:swapped?height:width,displayHeight:swapped?width:height,color,alpha,orientation,patch,metadata,details,warnings,decoded:false,sha256:null};
}
