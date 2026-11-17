import type { Ad } from '../lib/types';
import { CreativePreview } from './creative-preview';
import { DemoBadge } from './demo-badge';
import { Icon } from './icon';
import { SaveAdButton } from './save-ad-button';
export type AdActions = { ad: Ad; saved: boolean; onOpen: (ad: Ad) => void; onSave: (id: number) => void };

export function AdCard({ ad, saved, onOpen, onSave }: AdActions) {
  return <article className={'ad-card'+(saved?' ad-card-saved':'')} aria-labelledby={'ad-title-'+ad.id}>
    <header className="ad-card-heading">
      <span className={'brand-avatar avatar-'+ad.tone} aria-hidden="true">{ad.brand.slice(-1)}</span>
      <div><p className="ad-brand">{ad.brand}</p><p className="ad-metadata">{ad.platform} · {ad.format}</p></div>
      <DemoBadge compact/>
    </header>
    <CreativePreview ad={ad}/>
    <div className="ad-card-body">
      <div className="ad-category"><span>{ad.category}</span><span>{ad.country}</span></div>
      <h3 id={'ad-title-'+ad.id}>{ad.headline}</h3>
      <div className="ad-actions">
        <button className="button dossier-link" onClick={()=>onOpen(ad)} aria-label={'Abrir dossiê de '+ad.brand}>Abrir dossiê<Icon name="arrow" size={17}/></button>
        <SaveAdButton id={ad.id} brand={ad.brand} saved={saved} onSave={onSave}/>
      </div>
    </div>
  </article>;
}
