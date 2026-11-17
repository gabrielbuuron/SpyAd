'use client';
import { useEffect, useRef } from 'react';
import type { Ad } from '../lib/types';
import { CreativePreview } from './creative-preview';
import { Icon } from './icon';
import { DemoBadge } from './demo-badge';

export function AdDetail({ ad, saved, error, onClose, onSave }: { ad: Ad; saved: boolean; error: string; onClose: () => void; onSave: (id: number) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const startedOnBackdrop = useRef(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous?.isConnected) previous.focus();
      else document.getElementById('main-content')?.focus();
    };
  }, []);

  return <dialog ref={dialogRef} className="ad-detail" aria-labelledby="dossier-title" aria-describedby="dossier-description"
    onCancel={event=>{event.preventDefault();onClose();}}
    onPointerDown={event=>{startedOnBackdrop.current=event.target===event.currentTarget;}}
    onClick={event=>{if(startedOnBackdrop.current&&event.target===event.currentTarget)onClose();}}>
    <div className="detail-content">
      <header className="detail-header">
        <div><span className="eyebrow">Dossiê do anúncio</span><h2 id="dossier-title">{ad.brand}</h2></div>
        <button className="icon-button" aria-label="Fechar dossiê" onClick={onClose} autoFocus><Icon name="close"/></button>
      </header>
      <div className="detail-scroll" role="region" aria-label="Conteúdo do dossiê" tabIndex={0}>
        <CreativePreview ad={ad}/>
        <div className="detail-body">
          <DemoBadge/>
          <h3>{ad.headline}</h3>
          <p id="dossier-description">Material fictício criado para demonstrar a experiência da SpyAd. Não corresponde a um anúncio publicado.</p>
          <section><h4>Ficha do exemplo</h4>
            <dl>
              <div><dt>Plataforma ilustrada</dt><dd>{ad.platform}</dd></div>
              <div><dt>Formato ilustrado</dt><dd>{ad.format}</dd></div>
              <div><dt>País ilustrado</dt><dd>{ad.country}</dd></div>
              <div><dt>Categoria editorial</dt><dd>{ad.category}</dd></div>
            </dl>
          </section>
          <section className="evidence-note"><Icon name="shield"/><div>
            <h4>Contexto antes de conclusões.</h4>
            <p>Não há observações de campanhas reais. Gasto, receita, engajamento, duração e escala não estão disponíveis. Nenhum desempenho pode ser inferido deste exemplo.</p>
          </div></section>
        </div>
      </div>
      <footer className="detail-footer" aria-label="Ações do dossiê">
        <button className={'button '+(saved?'secondary':'primary')} aria-pressed={saved}
          aria-label={(saved?'Remover ':'Salvar ')+ad.brand+(saved?' da coleção':' na coleção')}
          onClick={()=>onSave(ad.id)}>
          <Icon name={saved?'check':'collection'} size={18}/>{saved?'Remover da coleção':'Salvar na coleção'}
        </button>
        {error?<p className="detail-error" role="alert">{error}</p>:null}
      </footer>
    </div>
  </dialog>;
}
