'use client';
import { useEffect, useState } from 'react';
import { sections } from '../lib/data';
import type { Ad, Section } from '../lib/types';
import { useCollections } from '../lib/use-collections';
import { useSection } from '../lib/use-section';
import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { DemoBadge } from './demo-badge';
import { Icon } from './icon';
import { AdDetail } from './ad-detail';
import { AdExplorer } from './ad-explorer';
import { Dashboard } from './dashboard';
import { PlannedArea } from './planned-area';
import { Settings } from './settings';
import { ads } from '../lib/data';

const descriptions = {
  dashboard: 'Seu workspace para descobrir, analisar e organizar referências.',
  explorer: 'Descubra conceitos nos exemplos de Meta Ads. Dados fictícios, sem integração ativa.',
  collections: 'Sua biblioteca local de exemplos. Salva somente neste navegador.',
  radar: 'Conheça o que está previsto para esta ferramenta.',
  dna: 'Uma proposta de análise, ainda em planejamento.',
  settings: 'Seu workspace, com tudo às claras.',
};

export function AppShell() {
  const section = useSection();
  return <Workspace key={section} section={section}/>;
}

function Workspace({ section }: { section: Section }) {
  useEffect(()=>{
    if(window.location.hash){
      window.scrollTo(0,0);
      document.getElementById('main-content')?.focus({preventScroll:true});
    }
  },[]);
  const { saved, invalid, toggle, clear } = useCollections();
  const [selected, setSelected] = useState<Ad | null>(null);
  const [notice, setNotice] = useState({ message: '', error: false });
  const title = sections.find(item=>item.id===section)?.label;
  function save(id: number) {
    const wasSaved = saved.includes(id);
    const result = toggle(id);
    setNotice({ message: result.ok ? (wasSaved?'Removido da':'Salvo na')+' coleção local.' : result.error, error: !result.ok });
  }
  function clearCollection() {
    const result = clear();
    setNotice({ message: result.ok ? 'Coleção demonstrativa redefinida.' : result.error, error: !result.ok });
  }
  return <div className="app-shell">
    <a className="skip-link" href="#main-content" onClick={event=>{event.preventDefault();document.getElementById('main-content')?.focus();}}>Pular para o conteúdo</a>
    <Sidebar section={section} count={saved.length}/>
    <div className="workspace">
      <header className="topbar">
        <a className="mobile-brand" href="#dashboard" aria-label="SpyAd, visão geral">Spy<span>Ad</span></a>
        <div className="breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><strong>{title}</strong></div>
        <div className="topbar-right"><DemoBadge/><span className="sprint-label">Sprint 1.1</span></div>
      </header>
      <main id="main-content" className="main-content" tabIndex={-1}>
        <div className="page-heading">
          <div><h1>{title}</h1><p>{descriptions[section]}</p></div>
          {section==='explorer'?<span className="meta-chip">Meta Ads · Demo</span>:section!=='dashboard'?<a className="button secondary heading-action" href="#explorer"><Icon name="search" size={18}/>Explorar anúncios</a>:null}
        </div>
        {invalid?<div className="storage-warning" role="alert">Não foi possível ler a coleção local. Nada foi sobrescrito. Redefina-a em <a href="#settings">Configurações</a>.</div>:null}
        {notice.message?<div className={'feedback '+(notice.error?'feedback-error':'')} role={notice.error?'alert':'status'}><Icon name={notice.error?'shield':'check'} size={18}/><span>{notice.message}</span><button className="icon-button" aria-label="Fechar aviso" onClick={()=>setNotice({message:'',error:false})}><Icon name="close" size={18}/></button></div>:null}
        {section==='dashboard'?<Dashboard count={saved.length} onOpen={id=>{const ad=ads.find(item=>item.id===id);if(ad)setSelected(ad);}}/>
          :section==='explorer'||section==='collections'?<AdExplorer collection={section==='collections'} saved={saved} onOpen={setSelected} onSave={save}/>
          :section==='settings'?<Settings count={saved.length} onClear={clearCollection}/>
          :<PlannedArea radar={section==='radar'}/>}
        <footer className="workspace-credit"><span>SpyAd · Sprint 1.1</span><span>Clareza para decisões melhores.</span></footer>
      </main>
    </div>
    <BottomNav section={section}/>
    {selected?<AdDetail ad={selected} error={notice.error?notice.message:''} saved={saved.includes(selected.id)} onClose={()=>setSelected(null)} onSave={save}/>:null}
  </div>;
}
