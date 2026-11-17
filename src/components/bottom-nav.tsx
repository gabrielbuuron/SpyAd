'use client';
import { useEffect, useRef } from 'react';
import { sections } from '../lib/data';
import type { Section } from '../lib/types';
import { Icon } from './icon';

export function BottomNav({ section }: { section: Section }) {
  const moreRef = useRef<HTMLDetailsElement>(null);
  const primary = sections.filter(item=>['dashboard','explorer','collections'].includes(item.id));
  const extra = sections.filter(item=>['creative-lab','radar','dna','settings'].includes(item.id));
  const moreActive = extra.some(item=>item.id===section);
  useEffect(()=>{
    function outside(event: PointerEvent) {
      if(event.target instanceof Node&&!moreRef.current?.contains(event.target)) moreRef.current?.removeAttribute('open');
    }
    document.addEventListener('pointerdown',outside);
    return ()=>document.removeEventListener('pointerdown',outside);
  },[]);
  return <nav className="bottom-nav" aria-label="Navegação móvel">
    {primary.map(item=><a key={item.id} href={'#'+item.id} aria-current={section===item.id?'page':undefined}>
      <Icon name={item.icon} size={21}/><span>{item.id==='dashboard'?'Início':item.id==='explorer'?'Explorer':'Coleções'}</span>
    </a>)}
    <details className={'more-navigation'+(moreActive?' more-active':'')} ref={moreRef} onKeyDown={event=>{
      if(event.key==='Escape'){event.preventDefault();moreRef.current?.removeAttribute('open');moreRef.current?.querySelector('summary')?.focus();}
    }}>
      <summary aria-label="Mais áreas: Creative Lab, Spy Radar, Offer DNA e Configurações"><Icon name="more" size={21}/><span>Mais</span></summary>
      <div className="more-menu"><p>Mais áreas</p>{extra.map(item=><a key={item.id} href={'#'+item.id} aria-current={section===item.id?'page':undefined} onClick={()=>{moreRef.current?.removeAttribute('open');moreRef.current?.querySelector('summary')?.focus();}}>
        <Icon name={item.icon}/><span>{item.label}</span>{['radar','dna'].includes(item.id)?<small>Planejado</small>:null}
      </a>)}</div>
    </details>
  </nav>;
}
