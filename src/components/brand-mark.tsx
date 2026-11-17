import { useId } from 'react';
import { BRAND, paletteFor } from '../brand/signal-s.mjs';

type BrandMarkProps={
  variant?:'lockup'|'symbol'|'wordmark';
  tone?:'brand'|'on-light'|'mono-light'|'mono-dark';
  decorative?:boolean;
  className?:string;
  label?:string;
};
export function BrandMark({variant='lockup',tone='brand',decorative=false,className='',label='SpyAd — Signal S'}:BrandMarkProps){
  const id=useId(),palette=paletteFor(tone),width=variant==='lockup'?152:variant==='symbol'?32:110;
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height="32" viewBox={'0 0 '+width+' 32'} preserveAspectRatio="xMinYMid meet"
    className={'signal-brand signal-brand-'+variant+' '+className} focusable="false"
    role={decorative?undefined:'img'} aria-hidden={decorative?true:undefined} aria-labelledby={decorative?undefined:id}>
    {!decorative?<title id={id}>{label}</title>:null}
    {variant!=='wordmark'?<>
      <g fill="none" stroke={palette.symbol} strokeWidth={BRAND.symbolStroke} strokeLinecap="round" strokeLinejoin="round"><path d={BRAND.symbolPath}/></g>
      <g fill={palette.symbol}><circle cx="25" cy="7" r={BRAND.nodeRadius}/><circle cx="7" cy="25" r={BRAND.nodeRadius}/></g>
    </>:null}
    {variant!=='symbol'?<g transform={'translate('+(variant==='lockup'?42:0)+' 0)'} fill="none" strokeWidth={BRAND.wordmarkStroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={BRAND.spyPath} stroke={palette.spy}/><path d={BRAND.adPath} stroke={palette.ad}/>
    </g>:null}
  </svg>;
}
