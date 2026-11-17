import type { Ad } from '../lib/types';
import { CreativePreview } from './creative-preview';
import { DemoBadge } from './demo-badge';
import { Icon } from './icon';
export type AdActions = { ad: Ad; saved: boolean; onOpen: (ad: Ad) => void; onSave: (id: number) => void };
export function AdCard({ ad, saved, onOpen, onSave }: AdActions) {
  return <article className="ad-card"><div className="ad-card-heading"><span className={'brand-avatar avatar-'+ad.tone}>{ad.brand.slice(-1)}</span><div><h3>{ad.brand}</h3><span>{ad.platform} · {ad.country}</span></div><button className={'icon-button save-button'+(saved?' is-saved':'')} aria-label={(saved?'Remover ':'Salvar ')+ad.brand+(saved?' da coleção':' na coleção')} aria-pressed={saved} onClick={()=>onSave(ad.id)}><Icon name={saved?'check':'collection'} size={18}/></button></div><CreativePreview ad={ad}/><div className="ad-card-body"><div className="ad-category"><span>{ad.category}</span><DemoBadge compact/></div><h2>{ad.headline}</h2><p>Exemplo editorial para explorar formatos e organizar referências.</p><button className="dossier-link" onClick={()=>onOpen(ad)}>Abrir dossiê <Icon name="arrow" size={17}/></button></div></article>;
}
