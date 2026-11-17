// Signal S: interpretação vetorial original da direção de marca, pendente de aprovação comparativa.
export const BRAND = Object.freeze({
  name: 'SpyAd', symbolViewBox: '0 0 32 32', lockupViewBox: '0 0 152 32', wordmarkViewBox: '0 0 110 32',
  symbolPath: 'M25 7H12L7 12L12 16H20L25 20L20 25H7',
  symbolStroke: 4.25, nodeRadius: 2.75, wordmarkStroke: 3.1,
  spyPath: 'M17 8C14.4 5.5 4.1 4.6 2.5 10.4C1 15.6 7.3 16.1 11.7 17.3C17.6 18.9 18.8 23.2 14.5 25.4C10.5 27.5 3.5 26.8 2.5 23.8M24 30V13M24 17C27 11 39 12 39 20C39 28 27 29 24 23M45 13L52 25M60 13L51 30',
  adPath: 'M65 26L74 6L83 26M69 18H79M105 6V26M105 17C102 11 91 12 91 20C91 28 103 29 105 23',
});
export const BRAND_PALETTES = Object.freeze({
  brand: Object.freeze({ symbol: '#80d9e5', spy: '#ecf0f7', ad: '#80d9e5' }),
  'on-light': Object.freeze({ symbol: '#126978', spy: '#11161f', ad: '#126978' }),
  'mono-light': Object.freeze({ symbol: '#ecf0f7', spy: '#ecf0f7', ad: '#ecf0f7' }),
  'mono-dark': Object.freeze({ symbol: '#11161f', spy: '#11161f', ad: '#11161f' }),
});
export function paletteFor(tone='brand'){
  if(!Object.hasOwn(BRAND_PALETTES,tone))throw Error('Variação de marca inválida.');
  return BRAND_PALETTES[tone];
}
export function symbolMarkup(color){
  return '<g fill="none" stroke="'+color+'" stroke-width="'+BRAND.symbolStroke+'" stroke-linecap="round" stroke-linejoin="round"><path d="'+BRAND.symbolPath+'"/></g><g fill="'+color+'"><circle cx="25" cy="7" r="'+BRAND.nodeRadius+'"/><circle cx="7" cy="25" r="'+BRAND.nodeRadius+'"/></g>';
}
export function wordmarkMarkup(palette){
  return '<g fill="none" stroke-width="'+BRAND.wordmarkStroke+'" stroke-linecap="round" stroke-linejoin="round"><path stroke="'+palette.spy+'" d="'+BRAND.spyPath+'"/><path stroke="'+palette.ad+'" d="'+BRAND.adPath+'"/></g>';
}
export function brandSVG({variant='lockup',tone='brand'}={}){
  if(!['lockup','symbol','wordmark'].includes(variant))throw Error('Composição de marca inválida.');
  const palette=paletteFor(tone),width=variant==='lockup'?152:variant==='symbol'?32:110;
  const content=(variant!=='wordmark'?symbolMarkup(palette.symbol):'')+(variant!=='symbol'?'<g transform="translate('+(variant==='lockup'?42:0)+' 0)">'+wordmarkMarkup(palette)+'</g>':'');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="32" viewBox="0 0 '+width+' 32" role="img" aria-label="SpyAd — Signal S"><title>SpyAd — Signal S</title>'+content+'</svg>\n';
}
export function appIconSVG({favicon=false,maskable=false}={}){
  if(favicon)return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><title>SpyAd</title><rect width="32" height="32" rx="7" fill="#0b0e14"/>'+symbolMarkup(BRAND_PALETTES.brand.symbol)+'</svg>\n';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><title>SpyAd</title><rect width="64" height="64" rx="'+(maskable?0:14)+'" fill="#0b0e14"/><g transform="'+(maskable?'translate(8 8) scale(1.5)':'translate(2 2) scale(1.875)')+'">'+symbolMarkup(BRAND_PALETTES.brand.symbol)+'</g></svg>\n';
}
