import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {BRAND,brandSVG,BRAND_PALETTES} from '../src/brand/signal-s.mjs';
import {renderComponent} from './render-components.mjs';
const directory=resolve('public/brand');

test('BrandMark tem nome acessível e geometria compartilhada sem depender de fonte',async()=>{
  const html=await renderComponent('brand-mark','BrandMark',{});
  assert.ok(html.includes('role="img"'));assert.ok(html.includes('aria-labelledby='));
  assert.ok(html.includes('SpyAd — Signal S'));assert.ok(html.includes(BRAND.symbolPath));
  assert.doesNotMatch(html,/<text|<image|<filter|<script|foreignObject/);
});
test('marca decorativa evita nome duplicado e oferece variações monocromáticas',async()=>{
  const hidden=await renderComponent('brand-mark','BrandMark',{variant:'symbol',decorative:true});
  assert.ok(hidden.includes('aria-hidden="true"'));assert.doesNotMatch(hidden,/<title|role="img"/);
  for(const tone of ['mono-light','mono-dark']){
    const svg=brandSVG({tone});const palette=BRAND_PALETTES[tone];
    assert.ok(svg.includes(palette.symbol));assert.equal(palette.spy,palette.ad);
  }
  assert.throws(()=>brandSVG({tone:'unknown'}));assert.throws(()=>brandSVG({variant:'unknown'}));
});
test('vetores exportados correspondem ao sistema sem scripts, fontes ou recursos externos',()=>{
  assert.equal(readFileSync(resolve(directory,'spyad-lockup.svg'),'utf8'),brandSVG());
  assert.equal(readFileSync(resolve(directory,'signal-s.svg'),'utf8'),brandSVG({variant:'symbol'}));
  for(const file of readdirSync(directory).filter(name=>name.endsWith('.svg'))){
    const svg=readFileSync(resolve(directory,file),'utf8');
    assert.doesNotMatch(svg,/<script|<image|<filter|<text|foreignObject|href=|url\(/);
    assert.ok(svg.includes(BRAND.symbolPath)||svg.includes(BRAND.spyPath));
  }
});
test('ícones 16, 32, 180, 192 e 512 são PNGs válidos, decodificáveis como raster e não vazios',async()=>{
  for(const [size,name]of [[16,'favicon-16'],[32,'favicon-32'],[180,'apple-touch-icon-180'],[192,'app-icon-192'],[512,'app-icon-512'],[512,'app-icon-maskable-512']]){
    const file=resolve(directory,name+'.png'),metadata=await sharp(file).metadata();
    assert.equal(metadata.format,'png');assert.equal(metadata.width,size);assert.equal(metadata.height,size);
    const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    let signal=0;for(let p=0;p<data.length;p+=info.channels)if(data[p+1]>80&&data[p+2]>100&&data[p+3]>0)signal++;
    assert.ok(signal>size,'O símbolo não deve ser rasterizado vazio.');
  }
});
test('ICO contém dois PNGs com dimensões corretas',async()=>{
  const ico=readFileSync(resolve(directory,'favicon.ico'));
  assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),2);
  for(let index=0;index<2;index++){
    const at=6+index*16,size=ico.readUInt32LE(at+8),start=ico.readUInt32LE(at+12);
    const metadata=await sharp(ico.subarray(start,start+size)).metadata();
    assert.equal(metadata.width,[16,32][index]);assert.equal(metadata.height,[16,32][index]);
  }
});
test('maskable é opaco e mantém o símbolo dentro da zona segura circular',async()=>{
  const {data,info}=await sharp(resolve(directory,'app-icon-maskable-512.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    const at=(y*info.width+x)*4;assert.equal(data[at+3],255);
    if(data[at+1]>80&&data[at+2]>100)assert.ok(Math.hypot(x+.5-info.width/2,y+.5-info.height/2)<=info.width*.4);
  }
});
test('manifesto referencia assets locais existentes com dimensões reais',async()=>{
  const manifest=JSON.parse(readFileSync('public/manifest.webmanifest','utf8'));
  assert.equal(manifest.name,'SpyAd');assert.equal(manifest.start_url,'/');
  for(const icon of manifest.icons){assert.ok(icon.src.startsWith('/brand/'));const metadata=await sharp(resolve('public'+icon.src)).metadata();assert.equal(icon.sizes,metadata.width+'x'+metadata.height);}
  assert.ok(manifest.icons.some(icon=>icon.purpose==='maskable'));
});
test('gerador é reprodutível com o mesmo conjunto Node/Sharp',()=>{
  const files=readdirSync(directory).map(name=>resolve(directory,name)).concat(resolve('public/manifest.webmanifest'));
  const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
  const before=files.map(hash);
  execFileSync(process.execPath,['scripts/generate-brand-assets.mjs'],{cwd:process.cwd(),encoding:'utf8'});
  assert.deepEqual(files.map(hash),before);
});
