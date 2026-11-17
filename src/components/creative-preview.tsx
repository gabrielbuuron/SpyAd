import type { Ad } from '../lib/types';

export function CreativePreview({ ad, small = false }: { ad: Ad; small?: boolean }) {
  return <div className={'creative creative-'+ad.tone+(small?' creative-small':'')} role="img" aria-label={'Prévia ilustrativa fictícia: '+ad.concept}>
    <span className="creative-art" aria-hidden="true"><i/><i/><i/></span>
    {small?<span className="preview-initial" aria-hidden="true">{ad.brand.slice(-1)}</span>:<>
      <span className="creative-label">Prévia ilustrativa</span>
      <span className="creative-copy"><small>{ad.category}</small><strong>{ad.concept}</strong></span>
    </>}
  </div>;
}
