import { Icon } from './icon';
import type { Filters } from '../lib/types';

export function FilterPanel({ filters, onChange, onReset }: { filters: Filters; onChange: (value: Filters) => void; onReset: () => void }) {
  const count = Number(filters.platform !== 'all') + Number(filters.format !== 'all');
  return <details className="filter-panel">
    <summary><Icon name="filter" size={18}/>Filtros{count?<span className="filter-active">{count} {count===1?'ativo':'ativos'}</span>:null}</summary>
    <div className="filter-fields">
      <label>Plataforma<select value={filters.platform} onChange={event=>onChange({...filters,platform:event.target.value})}><option value="all">Todas as plataformas Meta</option><option>Instagram</option><option>Facebook</option></select></label>
      <label>Formato<select value={filters.format} onChange={event=>onChange({...filters,format:event.target.value})}><option value="all">Todos os formatos</option><option>Vídeo</option><option>Imagem</option></select></label>
      <p className="filter-note">Brasil · Exemplos fictícios. TikTok e Google ainda não estão disponíveis.</p>
      <button className="button quiet" onClick={onReset}>Limpar filtros e busca</button>
    </div>
  </details>;
}
