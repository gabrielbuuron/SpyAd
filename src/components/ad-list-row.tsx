import type { AdActions } from './ad-card';
import { CreativePreview } from './creative-preview';
import { Icon } from './icon';
import { DemoBadge } from './demo-badge';
export function AdListRow({ ad, saved, onOpen, onSave }: AdActions) {
  return <article className="ad-list-row"><CreativePreview ad={ad} small/><div className="list-copy"><div><span className="list-brand">{ad.brand}</span><DemoBadge compact/></div><h2>{ad.headline}</h2><p>{ad.platform} · {ad.format} · {ad.country}</p></div><div className="list-actions"><button className="button secondary" onClick={()=>onOpen(ad)}>Abrir dossiê<Icon name="arrow" size={16}/></button><button className={'icon-button'+(saved?' is-saved':'')} aria-label={(saved?'Remover ':'Salvar ')+ad.brand+(saved?' da coleção':' na coleção')} aria-pressed={saved} onClick={()=>onSave(ad.id)}><Icon name={saved?'check':'collection'}/></button></div></article>;
}
