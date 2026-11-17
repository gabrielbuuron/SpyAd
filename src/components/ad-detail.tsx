'use client';
import { useEffect, useRef } from 'react';
import type { Ad } from '../lib/types';
import { CreativePreview } from './creative-preview';
import { Icon } from './icon';
import { DemoBadge } from './demo-badge';
export function AdDetail({ ad, saved, error, onClose, onSave }: { ad: Ad; saved: boolean; error: string; onClose: () => void; onSave: (id: number) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    return () => { dialog?.close(); if (previous?.isConnected) previous.focus(); else document.getElementById('main-content')?.focus(); };
  }, []);
  return <dialog ref={dialogRef} className="ad-detail" aria-labelledby="dossier-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}}><div className="detail-content"><header className="detail-header"><div><span className="eyebrow">DOSSIÊ DO ANÚNCIO</span><h2 id="dossier-title">{ad.brand}</h2></div><button className="icon-button" aria-label="Fechar dossiê" onClick={onClose} autoFocus><Icon name="close"/></button></header><CreativePreview ad={ad}/><div className="detail-body"><DemoBadge/><h3>{ad.headline}</h3><p>Material fictício criado para demonstrar a experiência da SpyAd. Não corresponde a um anúncio publicado.</p><section><h4>Ficha do exemplo</h4><dl><div><dt>Plataforma ilustrada</dt><dd>{ad.platform}</dd></div><div><dt>Formato ilustrado</dt><dd>{ad.format}</dd></div><div><dt>País ilustrado</dt><dd>{ad.country}</dd></div><div><dt>Categoria editorial</dt><dd>{ad.category}</dd></div></dl></section><section className="evidence-note"><Icon name="shield"/><div><h4>Contexto antes de conclusões.</h4><p>Não há observações de campanhas reais. Gasto, receita, engajamento, duração e escala não estão disponíveis. Nenhum desempenho pode ser inferido deste exemplo.</p></div></section><button className={'button '+(saved?'secondary':'primary')} aria-pressed={saved} onClick={()=>onSave(ad.id)}><Icon name={saved?'check':'collection'} size={18}/>{saved?'Remover da coleção':'Salvar na coleção'}</button>{error?<p className="detail-error" role="alert">{error}</p>:null}</div></div></dialog>;
}
