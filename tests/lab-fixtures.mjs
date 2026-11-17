// Imagens sintéticas; nenhum dado pessoal real. Sharp já integra o lockfile do Next.
import sharp from 'sharp';
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { crc32 } from '../src/features/creative-lab/lib/binary.mjs';

export const width=4,height=2;
export const pixels=Buffer.from([255,0,0,255,0,255,0,255,0,0,255,255,255,255,0,255,255,0,255,255,0,255,255,255,40,80,120,128,220,40,80,0]);
export function tiff(orientation=6){
  const b=Buffer.alloc(198);b.write('II');b.writeUInt16LE(42,2);b.writeUInt32LE(8,4);b.writeUInt16LE(4,8);
  function entry(at,tag,type,count,value){b.writeUInt16LE(tag,at);b.writeUInt16LE(type,at+2);b.writeUInt32LE(count,at+4);b.writeUInt32LE(value,at+8);}
  entry(10,0x112,3,1,orientation);entry(22,0x10f,2,11,62);entry(34,0x132,2,20,74);entry(46,0x8825,4,1,96);
  b.write('SpyAd test\0',62,'latin1');b.write('2026:01:01 00:00:00\0',74,'latin1');
  b.writeUInt16LE(4,96);entry(98,1,2,2,0x53);entry(110,2,5,3,150);entry(122,3,2,2,0x57);entry(134,4,5,3,174);
  [23,30,0,46,37,0].forEach((n,i)=>{b.writeUInt32LE(n,150+i*8);b.writeUInt32LE(1,154+i*8);});
  return b;
}
export function jpegExif(base,orientation=6){
  const payload=Buffer.concat([Buffer.from('Exif\0\0'),tiff(orientation)]);
  const header=Buffer.alloc(4);header[0]=255;header[1]=225;header.writeUInt16BE(payload.length+2,2);
  return Buffer.concat([base.subarray(0,2),header,payload,base.subarray(2)]);
}
export function pngChunk(type,payload){
  const name=Buffer.from(type),head=Buffer.alloc(4),tail=Buffer.alloc(4);head.writeUInt32BE(payload.length);tail.writeUInt32BE(crc32(Buffer.concat([name,payload])));
  return Buffer.concat([head,name,payload,tail]);
}
export function pngInsert(base,...chunks){return Buffer.concat([base.subarray(0,33),...chunks,base.subarray(33)]);}
export function riffChunk(type,payload){
  const header=Buffer.alloc(8);header.write(type);header.writeUInt32LE(payload.length,4);
  return Buffer.concat([header,payload,...(payload.length&1?[Buffer.alloc(1)]:[])]);
}
export function riff(chunks){
  const payload=Buffer.concat([Buffer.from('WEBP'),...chunks]),head=Buffer.alloc(8);head.write('RIFF');head.writeUInt32LE(payload.length,4);return Buffer.concat([head,payload]);
}
function webpPayload(base){const result=[];for(let p=12;p<base.length;){const length=base.readUInt32LE(p+4),end=p+8+length+(length&1);if(['VP8 ','VP8L','ALPH'].includes(base.toString('latin1',p,p+4)))result.push(base.subarray(p,end));p=end;}return result;}
export async function fixtures(){
  const raw=()=>sharp(pixels,{raw:{width,height,channels:4}});
  const jpeg=await raw().flatten({background:'#ffffff'}).jpeg({quality:100,chromaSubsampling:'4:4:4'}).toBuffer();
  const png=await raw().png().toBuffer(),webp=await raw().webp({lossless:true}).toBuffer();
  const vp8x=Buffer.alloc(10);vp8x[0]=0x18;vp8x.writeUIntLE(width-1,4,3);vp8x.writeUIntLE(height-1,7,3);
  const animatedHeader=Buffer.from(vp8x);animatedHeader[0]=0x12;
  const frame=Buffer.alloc(16);frame.writeUIntLE(width-1,6,3);frame.writeUIntLE(height-1,9,3);frame.writeUIntLE(100,12,3);
  const animation=riff([riffChunk('VP8X',animatedHeader),riffChunk('ANIM',Buffer.alloc(6)),riffChunk('ANMF',Buffer.concat([frame,...webpPayload(webp)])),riffChunk('ANMF',Buffer.concat([frame,...webpPayload(webp)]))]);
  const acTL=Buffer.alloc(8);acTL.writeUInt32BE(1,0);
  const fcTL=Buffer.alloc(26);fcTL.writeUInt32BE(width,4);fcTL.writeUInt32BE(height,8);fcTL.writeUInt16BE(1,20);fcTL.writeUInt16BE(10,22);
  const text=pngChunk('tEXt',Buffer.from('Author\0SpyAd synthetic fixture'));
  const compressed=pngChunk('zTXt',Buffer.concat([Buffer.from('Comment\0\0'),deflateSync('Compressed synthetic metadata')]));
  return {
    jpeg,png,webp,jpegGps:jpegExif(jpeg),
    pngText:pngInsert(png,text),pngExif:pngInsert(png,pngChunk('eXIf',tiff())),
    pngCompressed:pngInsert(png,compressed),
    apng:pngInsert(png,pngChunk('acTL',acTL),pngChunk('fcTL',fcTL)),
    webpExif:riff([riffChunk('VP8X',vp8x),...webpPayload(webp),riffChunk('EXIF',tiff())]),
    animatedWebp:animation,
  };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const directory=resolve('.lab-fixtures');mkdirSync(directory,{recursive:true});
  const images=await fixtures();
  for(const[name,bytes]of Object.entries(images))writeFileSync(resolve(directory,name+(/jpeg/i.test(name)?'.jpg':/webp/i.test(name)?'.webp':'.png')),bytes);
  console.log('Fixtures sintéticas geradas em .lab-fixtures/. Não contêm dados pessoais reais.');
}
