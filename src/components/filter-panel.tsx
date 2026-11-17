import { Icon } from './icon';
import type { Filters } from '../lib/types';
export function FilterPanel({ filters, onChange, onReset }: { filters: Filters; onChange: (value: Filters) => void; onReset: () => void }) {
  const active = filters.platform !== 'all' || filters.format !== 'all';
  return <details className="filter-panel"><summary><Icon name="filter" size={17}/>Filtros{active?<span className="filter-active">Ativos</span>:null}</summary><div className="filter-fields"><label>Plataforma<select value={filters.platform} onChange={event=>onChange({...filters,platform:event.target.value})}><option value="all">Todas as plataformas Meta</option><option>Instagram</option><option>Facebook</option></select></label><label>Formato<select value={filters.format} onChange={event=>onChange({...filters,format:event.target.value})}><option value="all">Todos os formatos</option><option>Vídeo</option><option>Imagem</option></select></label><div className="filter-note">Brasil · Dados fictícios<br/>TikTok e Google: planejados</div><button className="button quiet" onClick={onReset}>Limpar filtros e busca</button></div></details>;
}
