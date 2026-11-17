import type { AdActions } from './ad-card';
import { CreativePreview } from './creative-preview';
import { Icon } from './icon';
import { DemoBadge } from './demo-badge';
import { SaveAdButton } from './save-ad-button';

export function AdListRow({ ad, saved, onOpen, onSave }: AdActions) {
  return <article className={'ad-list-row'+(saved?' ad-card-saved':'')} aria-labelledby={'ad-title-'+ad.id}>
    <CreativePreview ad={ad} small/>
    <div className="list-copy">
      <div><span className="list-brand">{ad.brand}</span><DemoBadge compact/></div>
      <h3 id={'ad-title-'+ad.id}>{ad.headline}</h3>
      <p>{ad.platform} · {ad.format} · {ad.country}</p>
    </div>
    <div className="list-actions">
      <button className="button dossier-link" onClick={()=>onOpen(ad)} aria-label={'Abrir dossiê de '+ad.brand}>Abrir dossiê<Icon name="arrow" size={17}/></button>
      <SaveAdButton id={ad.id} brand={ad.brand} saved={saved} onSave={onSave}/>
    </div>
  </article>;
}
