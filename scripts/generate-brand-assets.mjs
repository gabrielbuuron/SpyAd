import { mkdirSync,writeFileSync,readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { brandSVG,appIconSVG,BRAND_PALETTES } from '../src/brand/signal-s.mjs';

const destination=resolve('public/brand');mkdirSync(destination,{recursive:true});
const vectors={
  'spyad-lockup.svg':brandSVG(),
  'spyad-wordmark.svg':brandSVG({variant:'wordmark'}),
  'signal-s.svg':brandSVG({variant:'symbol'}),
  'spyad-lockup-light.svg':brandSVG({tone:'on-light'}),
  'spyad-mono-light.svg':brandSVG({tone:'mono-light'}),
  'spyad-mono-dark.svg':brandSVG({tone:'mono-dark'}),
  'signal-s-mono-light.svg':brandSVG({variant:'symbol',tone:'mono-light'}),
  'signal-s-mono-dark.svg':brandSVG({variant:'symbol',tone:'mono-dark'}),
  'favicon.svg':appIconSVG({favicon:true}),
  'app-icon.svg':appIconSVG(),
  'app-icon-maskable.svg':appIconSVG({maskable:true}),
};
for(const[name,content]of Object.entries(vectors))writeFileSync(resolve(destination,name),content);
for(const[size,name,source]of [
  [16,'favicon-16.png',vectors['favicon.svg']],[32,'favicon-32.png',vectors['favicon.svg']],
  [180,'apple-touch-icon-180.png',vectors['app-icon-maskable.svg']],
  [192,'app-icon-192.png',vectors['app-icon.svg']],[512,'app-icon-512.png',vectors['app-icon.svg']],
  [512,'app-icon-maskable-512.png',vectors['app-icon-maskable.svg']],
]){
  const bytes=await sharp(Buffer.from(source)).resize(size,size).png({compressionLevel:9,adaptiveFiltering:false}).toBuffer();
  writeFileSync(resolve(destination,name),bytes);
}
const pngs=[readFileSync(resolve(destination,'favicon-16.png')),readFileSync(resolve(destination,'favicon-32.png'))];
const ico=Buffer.alloc(6+32);ico.writeUInt16LE(1,2);ico.writeUInt16LE(2,4);
let offset=ico.length;pngs.forEach((png,index)=>{const at=6+index*16;ico[at]=[16,32][index];ico[at+1]=[16,32][index];ico.writeUInt16LE(1,at+4);ico.writeUInt16LE(32,at+6);ico.writeUInt32LE(png.length,at+8);ico.writeUInt32LE(offset,at+12);offset+=png.length;});
writeFileSync(resolve(destination,'favicon.ico'),Buffer.concat([ico,...pngs]));
const manifest={name:'SpyAd',short_name:'SpyAd',description:'Inteligência criativa e ferramentas locais para arquivos autorizados.',lang:'pt-BR',start_url:'/',scope:'/',display:'standalone',background_color:'#0b0e14',theme_color:'#0b0e14',icons:[
  {src:'/brand/app-icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},
  {src:'/brand/app-icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},
  {src:'/brand/app-icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'},
]};
writeFileSync(resolve('public/manifest.webmanifest'),JSON.stringify(manifest,null,2)+'\n');
if(process.argv.includes('--proof')){
  const directory=resolve('.brand-review');mkdirSync(directory,{recursive:true});
  function sample(x,y,width,variant,tone){return '<g transform="translate('+x+' '+y+') scale('+width/(variant==='symbol'?32:152)+')">'+brandSVG({variant,tone}).replace(/<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'')+'</g>';}
  const board='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840" viewBox="0 0 1200 840"><rect width="1200" height="840" fill="#0b0e14"/><rect x="600" y="0" width="600" height="760" fill="#f6f8fb"/><g font-family="Segoe UI,Arial,sans-serif" font-size="16" fill="#aeb9cb"><text x="48" y="54">SPYAD / SIGNAL S</text><text x="48" y="88">Interpretação vetorial original · proposta para revisão</text><text x="48" y="316">Marca em fundo escuro</text><text x="48" y="538">Símbolo e versão monocromática</text></g><g font-family="Segoe UI,Arial,sans-serif" font-size="16" fill="#384454"><text x="648" y="54">SISTEMA DE APLICAÇÃO</text><text x="648" y="88">Sem comparação com a imagem escolhida pelo cliente</text><text x="648" y="316">Marca em fundo claro</text><text x="648" y="538">Monocromia e ícones</text></g>'+sample(48,160,450,'lockup','brand')+sample(648,160,450,'lockup','on-light')+sample(48,380,100,'symbol','brand')+sample(210,390,310,'lockup','mono-light')+sample(648,390,450,'lockup','mono-dark')+'<g font-family="Segoe UI,Arial,sans-serif" font-size="13" fill="#aeb9cb"><text x="48" y="800">Prancha de exportação. Não é captura do produto, homologação de browser ou aprovação final.</text></g></svg>';
  writeFileSync(resolve(directory,'signal-s-review.svg'),board);
  await sharp(Buffer.from(board)).png().toFile(resolve(directory,'signal-s-review.png'));
  const icons=await Promise.all([16,32].map(async size=>({input:await sharp(resolve(destination,'favicon-'+size+'.png')).resize(128,128,{kernel:'nearest'}).png().toBuffer(),top:590,left:size===16?48:220})));
  await sharp(resolve(directory,'signal-s-review.png')).composite(icons).png().toFile(resolve(directory,'signal-s-review-with-icons.png'));
  console.log('Prancha de exportação em .brand-review/; não é screenshot do produto.');
}
console.log('Signal S: vetores, ICO, PNGs e manifesto gerados. Paleta principal '+BRAND_PALETTES.brand.symbol+'.');
