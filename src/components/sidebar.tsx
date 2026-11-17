import { sections } from '../lib/data';
import type { Section } from '../lib/types';
import { DemoBadge } from './demo-badge';
import { Icon } from './icon';
import { BrandMark } from './brand-mark';

export function Sidebar({ section, count }: { section: Section; count: number }) {
  function link(item: typeof sections[number]) {
    return <a key={item.id} href={'#'+item.id} title={item.label} className={item.id==='explorer'?'explorer-nav':undefined} aria-current={section===item.id?'page':undefined}>
      <Icon name={item.icon}/><span>{item.label}</span>
      {item.id==='collections'?<span className="nav-count">{count}</span>:['radar','dna'].includes(item.id)?<small className="planned-dot">Planejado</small>:null}
    </a>;
  }
  return <aside className="sidebar">
    <a className="brand" href="#dashboard" aria-label="SpyAd, visão geral"><BrandMark decorative className="brand-full"/><BrandMark variant="symbol" decorative className="brand-compact"/><span className="brand-tagline">Inteligência criativa</span></a>
    <div className="workspace-label"><span className="workspace-icon" aria-hidden="true"><BrandMark variant="symbol" decorative/></span><div>Workspace de estudo<small>Local · Sprint 2.1</small></div></div>
    <nav aria-label="Navegação principal"><span className="nav-caption">Workspace</span>{sections.slice(0,3).map(link)}
      <span className="nav-caption">Sua biblioteca</span>{sections.filter(item=>item.id==='collections').map(link)}
      <span className="nav-caption">Ferramentas</span>{sections.filter(item=>['radar','dna','settings'].includes(item.id)).map(link)}
    </nav>
    <div className="sidebar-bottom">{section==='creative-lab'?<><span className="lab-local-badge">Processamento local</span><p>Arquivos em memória.<br/>Nenhum upload.</p></>:<><DemoBadge/><p>Dados fictícios.<br/>Sem conta conectada.</p></>}</div>
  </aside>;
}
