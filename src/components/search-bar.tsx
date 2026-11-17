import { Icon } from './icon';

export function SearchBar({ query, onChange }: { query: string; onChange: (query: string) => void }) {
  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById('result-summary')?.focus();
  }
  return <form className="search-form" role="search" aria-label="Pesquisa de anúncios demonstrativos" onSubmit={search}>
    <div className="search-field">
      <Icon name="search" size={21}/>
      <label className="sr-only" htmlFor="ad-search">Buscar anúncios ou marcas</label>
      <input id="ad-search" type="search" enterKeyHint="search" autoComplete="off" aria-controls="ad-results" placeholder="Marca, conceito ou plataforma" value={query} onChange={event=>onChange(event.target.value)}/>
      {query?<button type="button" className="icon-button" aria-label="Limpar busca" onClick={()=>{onChange('');document.getElementById('ad-search')?.focus();}}><Icon name="close" size={18}/></button>:null}
    </div>
    <button className="button primary search-submit" type="submit">Pesquisar<Icon name="arrow" size={18}/></button>
  </form>;
}
