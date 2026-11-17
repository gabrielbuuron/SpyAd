import { sections } from '../lib/data';
import type { Section } from '../lib/types';
import { DemoBadge } from './demo-badge';
import { Icon } from './icon';
export function Sidebar({ section, count }: { section: Section; count: number }) {
  const link = (item: typeof sections[number]) => <a key={item.id} href={'#'+item.id} aria-current={section===item.id?'page':undefined}><Icon name={item.icon}/><span>{item.label}</span>{['radar','dna'].includes(item.id)?<small className="planned-dot">Em breve</small>:null}</a>;
  return <aside className="sidebar">
    <a className="brand" href="#dashboard" aria-label="SpyAd, visão geral"><span className="brand-mark" aria-hidden="true">S</span><span>Spy<span className="brand-accent">Ad</span><small>AD INTELLIGENCE</small></span></a>
    <div className="workspace-label"><span className="workspace-icon">S</span><div>Workspace de estudo<small>Sprint 1.0 · Local</small></div></div>
    <nav aria-label="Navegação principal"><span className="nav-caption">WORKSPACE</span>{sections.slice(0,1).map(link)}<span className="nav-caption">INTELIGÊNCIA</span>{sections.slice(1,4).map(link)}<span className="nav-caption">BIBLIOTECA</span><a href="#collections" aria-current={section==='collections'?'page':undefined}><Icon name="collection"/><span>Coleções</span><span className="nav-count">{count}</span></a></nav>
    <div className="sidebar-bottom"><div className="demo-card"><Icon name="shield"/><strong>Explore com clareza.</strong><p>Exemplos fictícios. Sem coleta ou integração ativa.</p><DemoBadge compact/></div><a className="settings-link" href="#settings" aria-current={section==='settings'?'page':undefined}><Icon name="settings"/>Configurações</a><div className="workspace-footer"><span className="avatar">S</span><div>Workspace demonstrativo<small>Sem conta conectada</small></div><span className="local-dot"/></div></div>
  </aside>;
}
