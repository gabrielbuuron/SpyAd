'use client';
import { useState } from 'react';
import { ads, emptyFilters, sections } from '../lib/data';
import { filterAds } from '../lib/domain.mjs';
import type { Ad, Section } from '../lib/types';
import { useCollections } from '../lib/use-collections';
import { useSection } from '../lib/use-section';
import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { DemoBadge } from './demo-badge';
import { Icon } from './icon';
import { SearchBar } from './search-bar';
import { FilterPanel } from './filter-panel';
import { AdCard } from './ad-card';
import { AdListRow } from './ad-list-row';
import { AdDetail } from './ad-detail';
import { EmptyState } from './empty-state';
import { Dashboard } from './dashboard';
import { PlannedArea } from './planned-area';
import { Settings } from './settings';

const descriptions = {
  dashboard: 'Seu ponto de partida para descobrir, analisar e organizar.',
  explorer: 'Explore criativos. Encontre contexto. Construa referências.',
  collections: 'Uma biblioteca pessoal para suas próximas ideias.',
  radar: 'Acompanhe o que está previsto para o produto.',
  dna: 'Conheça a proposta desta área de análise.',
  settings: 'Seu workspace, com tudo às claras.',
};
export function AppShell() {
  const section = useSection();
  return <Workspace key={section} section={section}/>;
}
function Workspace({ section }: { section: Section }) {
  const { saved, invalid, toggle, clear } = useCollections();
  const [mode, setMode] = useState<'gallery' | 'list'>('gallery');
  const [filters, setFilters] = useState(emptyFilters);
  const [selected, setSelected] = useState<{ ad: Ad; section: string } | null>(null);
  const [notice, setNotice] = useState({ message: '', error: false });
  const collection = section === 'collections';
  const filtered = filterAds(ads, filters, collection ? saved : null);
  const hasFilters = !!filters.query || filters.format !== 'all' || filters.platform !== 'all';
  function save(id: number) {
    const wasSaved = saved.includes(id);
    const result = toggle(id);
    setNotice({ message: result.ok ? (wasSaved?'Removido da':'Salvo na')+' coleção local.' : result.error, error: !result.ok });
  }
  function clearCollection() {
    const result = clear();
    setNotice({ message: result.ok ? 'Coleção demonstrativa redefinida.' : result.error, error: !result.ok });
  }
  function open(ad: Ad) { setSelected({ ad, section }); }
  return <div className="app-shell"><a className="skip-link" href="#main-content" onClick={event=>{event.preventDefault();document.getElementById('main-content')?.focus();}}>Pular para o conteúdo</a><Sidebar section={section} count={saved.length}/><div className="workspace">
    <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><strong>{sections.find(item=>item.id===section)?.label}</strong></div><div className="topbar-right"><DemoBadge/><span className="topbar-divider"/><span className="sprint-label">Sprint 1.0</span><span className="avatar" aria-label="Workspace sem conta conectada">S</span></div></header>
    <main id="main-content" className="main-content" tabIndex={-1}><div className="page-heading"><div><span className="eyebrow">{collection?'SUA BIBLIOTECA':'SPYAD INTELLIGENCE'}</span><h1>{sections.find(item=>item.id===section)?.label}</h1><p>{descriptions[section]}</p></div>{section!=='explorer'?<a className="button secondary heading-action" href="#explorer"><Icon name="search" size={17}/>Explorar anúncios</a>:<span className="meta-chip"><span className="meta-mark">∞</span>Meta · Dados demo</span>}</div>
    {invalid?<div className="storage-warning" role="alert">Não foi possível ler a coleção local. Nada foi sobrescrito. Você pode redefini-la em <a href="#settings">Configurações</a>.</div>:null}
    {notice.message?<div className={'feedback '+(notice.error?'feedback-error':'')} role={notice.error?'alert':'status'}><Icon name={notice.error?'shield':'check'} size={17}/><span>{notice.message}</span><button className="icon-button" aria-label="Fechar aviso" onClick={()=>setNotice({message:'',error:false})}><Icon name="close" size={16}/></button></div>:null}
    {section==='dashboard'?<Dashboard count={saved.length} onOpen={id=>{const ad=ads.find(item=>item.id===id);if(ad)open(ad);}}/>:section==='explorer'||collection?<>
      <div className="demo-notice"><DemoBadge compact/><p>Exemplos editoriais fictícios. Prévias ilustrativas, sem métricas ou anúncios reais.</p></div>
      <div className="explorer-tools"><SearchBar query={filters.query} onChange={query=>setFilters({...filters,query})}/><div className="view-toggle" role="group" aria-label="Modo de visualização"><button aria-label="Galeria" aria-pressed={mode==='gallery'} onClick={()=>setMode('gallery')}><Icon name="grid" size={18}/><span>Galeria</span></button><button aria-label="Lista" aria-pressed={mode==='list'} onClick={()=>setMode('list')}><Icon name="list" size={18}/><span>Lista</span></button></div></div>
      <FilterPanel filters={filters} onChange={setFilters} onReset={()=>setFilters(emptyFilters)}/>
      <div className="results-line"><p aria-live="polite"><strong>{filtered.length}</strong> {filtered.length===1?'exemplo':'exemplos'} {collection?'na coleção':'disponíveis'}{hasFilters?' com os filtros atuais':''}</p><span><span className="local-dot"/>Biblioteca demonstrativa</span></div>
      {filtered.length?<div className={mode==='gallery'?'ad-grid':'ad-list'}>{filtered.map(ad=>{const props={ad,saved:saved.includes(ad.id),onOpen:open,onSave:save};return mode==='gallery'?<AdCard key={ad.id} {...props}/>:<AdListRow key={ad.id} {...props}/>;})}</div>:<EmptyState collection={collection} filtered={hasFilters} onReset={()=>setFilters(emptyFilters)}/>}
      <div className="results-footer"><span>Você chegou ao fim dos exemplos.</span><span>Nenhuma coleta em tempo real</span></div>
    </>:section==='settings'?<Settings count={saved.length} onClear={clearCollection}/>:<PlannedArea radar={section==='radar'}/>}
    <div className="workspace-credit"><span>SpyAd · Sprint 1.0</span><span>Clareza para decisões melhores.</span></div></main></div>
    <BottomNav section={section}/>{selected&&selected.section===section?<AdDetail key={selected.ad.id} ad={selected.ad} error={notice.error?notice.message:''} saved={saved.includes(selected.ad.id)} onClose={()=>setSelected(null)} onSave={save}/>:null}
  </div>;
}
