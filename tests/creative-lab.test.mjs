import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { fixtures,jpegExif,pngChunk,pngInsert,tiff } from './lab-fixtures.mjs';
import { testBackend } from './lab-backend.mjs';
import { checkSize,LIMITS,formatOf,outputName } from '../src/features/creative-lab/lib/file-validation.mjs';
import { inspectImage } from '../src/features/creative-lab/lib/inspect-image.mjs';
import { neutralizeOrientation } from '../src/features/creative-lab/lib/binary.mjs';
import { inspectAndDecode,sanitizeImage } from '../src/features/creative-lab/lib/sanitize-image.mjs';
import { compareMetadata } from '../src/features/creative-lab/lib/verify-image.mjs';
const images=await fixtures();
const hash=b=>createHash('sha256').update(b).digest('hex');

test('assinaturas reais JPEG/PNG/WebP e saída usam o formato, não a extensão/MIME',()=>{
  for(const format of ['jpeg','png','webp'])assert.equal(formatOf(images[format]),format);
  assert.equal(outputName('arquivo.exe','png'),'arquivo.spyad-limpo.png');
  assert.equal(outputName('../unsafe<name>.JPG','jpeg'),'-unsafe-name-.spyad-limpo.jpg');
});
test('vazio, formato inválido e oversized são rejeitados antes de decodificar',()=>{
  for(const bytes of [new Uint8Array(),new Uint8Array([1,2,3,4])])assert.throws(()=>inspectImage(bytes));
  assert.throws(()=>checkSize(LIMITS.maxBytes+1),error=>error.code==='SIZE');
  assert.throws(()=>formatOf(new Uint8Array(LIMITS.maxBytes+1)),error=>error.code==='SIZE');
});
test('EXIF sintético lê orientação, fabricante e GPS sem inventar campos',()=>{
  const image=inspectImage(images.jpegGps);
  assert.equal(image.orientation,6);assert.equal(image.displayWidth,2);assert.equal(image.displayHeight,4);
  assert.equal(image.metadata.gps.status,'found');
  assert.ok(image.details.some(v=>v.label==='Fabricante'&&v.value==='SpyAd test'));
  assert.ok(image.details.some(v=>v.label==='Latitude GPS'&&v.value==='-23.500000'));
  assert.ok(image.details.some(v=>v.label==='Longitude GPS'&&v.value==='-46.616667'));
  assert.equal(inspectImage(images.jpeg).metadata.exif.status,'not-found');
});
test('PNG lê texto, informa texto comprimido não suportado e detecta transparência',()=>{
  const png=inspectImage(images.pngText);
  assert.equal(png.metadata.text.status,'found');assert.equal(png.alpha,'present');
  assert.ok(png.details.some(v=>v.label==='Author'&&v.value==='SpyAd synthetic fixture'));
  assert.equal(inspectImage(images.pngCompressed).metadata.text.status,'unsupported');
});
test('neutralização EXIF é em cópia, mantém CRC PNG válido e não duplica rotação',()=>{
  for(const input of [images.jpegGps,images.pngExif,images.webpExif]){
    const before=hash(input),inspection=inspectImage(input),copy=neutralizeOrientation(input,inspection);
    assert.equal(inspectImage(copy).orientation,1);assert.equal(hash(input),before);
    assert.notEqual(hash(copy),before);assert.equal(inspection.orientation,6);
  }
});
test('APNG e WebP animado são bloqueados explicitamente',async()=>{
  assert.throws(()=>inspectImage(images.apng),error=>error.code==='ANIMATED');
  assert.throws(()=>inspectImage(images.animatedWebp),error=>error.code==='ANIMATED');
  const animated=await sharp(images.animatedWebp).metadata();assert.equal(animated.pages,2);
});
test('CRC, RIFF, JPEG truncado e diretório EXIF inválido são rejeitados',()=>{
  const png=Buffer.from(images.png);png[40]^=255;assert.throws(()=>inspectImage(png));
  const webp=Buffer.from(images.webp);webp.writeUInt32LE(999999,4);assert.throws(()=>inspectImage(webp));
  assert.throws(()=>inspectImage(images.jpeg.subarray(0,images.jpeg.length-2)));
  const bad=tiff();bad.writeUInt16LE(500,8);
  assert.throws(()=>inspectImage(pngInsert(images.png,pngChunk('eXIf',bad))),error=>error.code==='EXIF');
});
test('limites de resolução são validados antes do decoder',()=>{
  const original=images.png,header=Buffer.from(original.subarray(16,29));header.writeUInt32BE(20_000,0);
  const replacement=Buffer.concat([original.subarray(0,8),pngChunk('IHDR',header),original.subarray(33)]);
  assert.throws(()=>inspectImage(replacement),error=>error.code==='PIXELS');
});
test('cabeçalho válido sem dados de pixels decodificáveis não passa na inspeção completa',async()=>{
  const invalid=Buffer.concat([images.png.subarray(0,33),pngChunk('IDAT',Buffer.from([0,0,0])),pngChunk('IEND',Buffer.alloc(0))]);
  assert.equal(inspectImage(invalid).decoded,false);
  await assert.rejects(()=>inspectAndDecode(invalid,testBackend()));
});
for(const format of ['jpeg','png','webp']){
  test('pipeline real Node '+format+': re-encoding, reinspeção, original intacto e saída decodificável',async()=>{
    const input=images[format],before=hash(input),backend=testBackend(),stages=[];
    const inspected=await inspectAndDecode(input,backend);
    const result=await sanitizeImage(input,'original.'+format,format,backend,undefined,stage=>stages.push(stage),inspected.sha256);
    assert.equal(hash(input),before);assert.equal(result.before.sha256,before);assert.equal(result.after.decoded,true);
    assert.equal(result.after.format,format);assert.equal(result.after.bytes,result.bytes.length);
    assert.equal(result.after.width,4);assert.equal(result.after.height,2);
    assert.ok(result.outputName.includes('.spyad-limpo.'));assert.ok(stages.includes('encoding')&&stages.includes('verifying'));
    assert.ok(backend.closed>=3);
    const decoded=await sharp(Buffer.from(result.bytes)).raw().toBuffer({resolveWithObject:true});assert.equal(decoded.info.width,4);
  });
}
test('limpeza efetivamente remove EXIF/GPS/texto cobertos e mantém outros não verificáveis',async()=>{
  for(const input of [images.jpegGps,images.pngText,images.webpExif]){
    const result=await sanitizeImage(input,'teste','png',testBackend());
    for(const id of ['exif','gps','text'])if(result.before.metadata[id].status==='found')assert.equal(result.comparison.find(v=>v.id===id).status,'removed');
    assert.equal(result.after.metadata.exif.status,'not-found');assert.equal(result.comparison.find(v=>v.id==='other').status,'unverifiable');
  }
});
test('texto comprimido não é anunciado como removido com garantia',async()=>{
  const result=await sanitizeImage(images.pngCompressed,'teste','png',testBackend());
  assert.equal(result.comparison.find(v=>v.id==='text').status,'unverifiable');
});
test('perfil detectado antes/depois não é falsamente anunciado como idêntico',()=>{
  const before=inspectImage(images.png),after=inspectImage(images.png);
  before.metadata.icc={label:'ICC',status:'found',value:'Perfil encontrado'};
  after.metadata.icc={...before.metadata.icc};
  assert.equal(compareMetadata(before,after).find(v=>v.id==='icc').status,'unverifiable');
});
for(let orientation=1;orientation<=8;orientation++){
  test('orientação EXIF '+orientation+' normaliza dimensões e pixels com referência independente',async()=>{
    const input=jpegExif(images.jpeg,orientation),result=await sanitizeImage(input,'orientacao','png',testBackend());
    const actual=await sharp(Buffer.from(result.bytes)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const expected=await sharp(input).autoOrient().ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(actual.info.width,expected.info.width);assert.equal(actual.info.height,expected.info.height);
    assert.deepEqual(actual.data,expected.data);assert.equal(result.after.orientation,1);
  });
}
test('alpha é preservado em PNG e WebP; JPEG compõe sobre branco',async()=>{
  for(const format of ['png','webp']){
    const result=await sanitizeImage(images.pngText,'alpha',format,testBackend());
    assert.equal(result.after.alpha,'present');
    const {data}=await sharp(Buffer.from(result.bytes)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(data.at(-1),0);assert.equal(data.at(-5),128);
  }
  const jpeg=await sanitizeImage(images.png,'alpha','jpeg',testBackend());assert.equal(jpeg.after.alpha,'not-found');
});
test('cancelamento, encoder incorreto e original divergente bloqueiam exportação',async()=>{
  const controller=new AbortController();controller.abort();
  await assert.rejects(()=>sanitizeImage(images.png,'teste','png',testBackend(),controller.signal),error=>error.name==='AbortError');
  await assert.rejects(()=>sanitizeImage(images.png,'teste','png',testBackend(),undefined,()=>{},'wrong-hash'),error=>error.code==='CHANGED');
  const backend=testBackend();backend.encode=async()=>new Uint8Array(images.png);
  await assert.rejects(()=>sanitizeImage(images.jpeg,'teste','jpeg',backend),error=>error.code==='ENCODER');
});
test('bitmap é fechado quando o encoder falha',async()=>{
  const backend=testBackend();backend.encode=async()=>{throw Error('encoder failure');};
  await assert.rejects(()=>sanitizeImage(images.png,'teste','png',backend));
  assert.equal(backend.closed,1);
});

test('resultado com orientação incorreta ou GPS residual é bloqueado',async()=>{
  const backend=testBackend();backend.encode=async()=>new Uint8Array(images.jpegGps);
  await assert.rejects(()=>sanitizeImage(images.jpeg,'teste','jpeg',backend),error=>error.code==='VERIFY');
  backend.encode=async()=>new Uint8Array(jpegExif(images.jpeg,1));
  await assert.rejects(()=>sanitizeImage(images.jpeg,'teste','jpeg',backend),error=>error.code==='VERIFY');
});

test('cancelar durante decodificação fecha o bitmap e não exporta',async()=>{
  const controller=new AbortController(),backend=testBackend(),decode=backend.decode;
  let encoded=false;
  backend.decode=async bytes=>{const bitmap=await decode(bytes);controller.abort();return bitmap;};
  backend.encode=async()=>{encoded=true;return new Uint8Array(images.png);};
  await assert.rejects(()=>sanitizeImage(images.png,'teste','png',backend,controller.signal),error=>error.name==='AbortError');
  assert.equal(backend.closed,1);assert.equal(encoded,false);
});
