import { Icon } from './icon';

export function SaveAdButton({ id, brand, saved, onSave }: { id: number; brand: string; saved: boolean; onSave: (id: number) => void }) {
  return <button className={'button save-action'+(saved?' is-saved':'')} aria-pressed={saved}
    aria-label={(saved?'Remover ':'Salvar ')+brand+(saved?' da coleção':' na coleção')}
    title={saved?'Remover da coleção':'Salvar na coleção'} onClick={()=>onSave(id)}>
    <Icon name={saved?'check':'collection'} size={17}/><span>{saved?'Salvo':'Salvar'}</span>
  </button>;
}
