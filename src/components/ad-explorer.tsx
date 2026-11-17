'use client';
import { useState } from 'react';
import { ads, emptyFilters } from '../lib/data';
import { filterAds } from '../lib/domain.mjs';
import type { Ad } from '../lib/types';
import { SearchBar } from './search-bar';
import { FilterPanel } from './filter-panel';
import { AdCard } from './ad-card';
import { AdListRow } from './ad-list-row';
import { EmptyState } from './empty-state';
import { Icon } from './icon';

export function AdExplorer({ collection, saved, onOpen, onSave }: { collection: boolean; saved: number[]; onOpen: (ad: Ad) => void; onSave: (id: number) => void }) {
  const [mode, setMode] = useState<'gallery' | 'list'>('gallery');
  const [filters, setFilters] = useState(emptyFilters);
  const filtered = filterAds(ads, filters, collection ? saved : null);
  const hasFilters = !!filters.query || filters.format !== 'all' || filters.platform !== 'all';
  return <section className="explorer" aria-label={collection?'Anúncios salvos':'Ad Explorer'}>
    <div className="explorer-tools">
      <SearchBar query={filters.query} onChange={query=>setFilters({...filters,query})}/>
      <div className="view-toggle" role="group" aria-label="Modo de visualização">
        <button aria-label="Galeria" aria-pressed={mode==='gallery'} onClick={()=>setMode('gallery')}><Icon name="grid" size={19}/><span>Galeria</span></button>
        <button aria-label="Lista" aria-pressed={mode==='list'} onClick={()=>setMode('list')}><Icon name="list" size={19}/><span>Lista</span></button>
      </div>
    </div>
    <div className="explorer-refine">
      <FilterPanel filters={filters} onChange={setFilters} onReset={()=>setFilters(emptyFilters)}/>
      {hasFilters?<button className="clear-filters" onClick={()=>setFilters(emptyFilters)}><Icon name="close" size={15}/>Limpar tudo</button>:null}
      <p id="result-summary" className="result-summary" tabIndex={-1} role="status" aria-live="polite" aria-atomic="true">
        <strong>{filtered.length}</strong> {filtered.length===1?'exemplo':'exemplos'} {collection?'na coleção':'disponíveis'}{hasFilters?' · filtrados':''}
      </p>
    </div>
    <div id="ad-results">
      <h2 className="sr-only">{collection?'Referências salvas':'Resultados da busca'}</h2>
      {filtered.length?<div className={mode==='gallery'?'ad-grid':'ad-list'}>{filtered.map(ad=>{
        const props={ad,saved:saved.includes(ad.id),onOpen,onSave};
        return mode==='gallery'?<AdCard key={ad.id} {...props}/>:<AdListRow key={ad.id} {...props}/>;
      })}</div>:<EmptyState collection={collection} filtered={hasFilters} onReset={()=>setFilters(emptyFilters)}/>}
    </div>
    <div className="results-footer"><span>{filtered.length?'Todos os exemplos estão aqui.':'Nenhum resultado com esta seleção.'}</span><span>Dados fictícios · Nenhuma coleta em tempo real</span></div>
  </section>;
}
