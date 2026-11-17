import type { Ad } from '../lib/types';
import { Icon } from './icon';
export function CreativePreview({ ad, small = false }: { ad: Ad; small?: boolean }) {
  return <div className={'creative creative-'+ad.tone+(small?' creative-small':'')} role="img" aria-label={'Prévia ilustrativa fictícia: '+ad.concept}><span className="creative-label">CONCEITO ILUSTRATIVO</span><span className="creative-art" aria-hidden="true"><i/><i/><i/></span><span className="creative-copy"><small>{ad.category.toUpperCase()}</small><strong>{ad.concept}</strong><span>MARCA EXEMPLO · DEMO</span></span><span className="format-badge"><Icon name={ad.format==='Vídeo'?'play':'image'} size={13}/>{ad.format}</span></div>;
}
