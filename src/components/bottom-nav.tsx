import { sections } from '../lib/data';
import type { Section } from '../lib/types';
import { Icon } from './icon';
export function BottomNav({ section }: { section: Section }) {
  return <nav className="bottom-nav" aria-label="Navegação móvel">{sections.map(item=><a key={item.id} href={'#'+item.id} aria-current={section===item.id?'page':undefined}><Icon name={item.icon} size={19}/><span>{item.id==='dashboard'?'Início':item.id==='explorer'?'Explorer':item.id==='settings'?'Ajustes':item.label}</span></a>)}</nav>;
}
