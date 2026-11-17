import { Icon } from './icon';
export function SearchBar({ query, onChange }: { query: string; onChange: (query: string) => void }) {
  return <div className="search-field"><Icon name="search"/><label className="sr-only" htmlFor="ad-search">Buscar anúncios ou marcas</label><input id="ad-search" type="search" placeholder="Busque por marca, conceito ou plataforma..." value={query} onChange={event=>onChange(event.target.value)}/>{query?<button className="icon-button" aria-label="Limpar busca" onClick={()=>onChange('')}><Icon name="close" size={16}/></button>:<span className="search-hint">Busca local</span>}</div>;
}
