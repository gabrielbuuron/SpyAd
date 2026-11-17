import { Icon } from './icon';
export function EmptyState({ collection, filtered, onReset }: { collection: boolean; filtered: boolean; onReset: () => void }) {
  return <div className="empty-state"><span><Icon name={collection?'collection':'search'} size={28}/></span><h2>{filtered?'Nenhum exemplo encontrado':collection?'Suas referências começam aqui.':'Nada para mostrar por enquanto.'}</h2><p>{filtered?'Tente outro termo ou remova os filtros para ampliar a pesquisa.':'Salve anúncios no Ad Explorer para reuni-los nesta coleção local.'}</p>{filtered?<button className="button secondary" onClick={onReset}>Limpar busca e filtros</button>:<a className="button primary" href="#explorer">Explorar anúncios<Icon name="arrow" size={16}/></a>}</div>;
}
