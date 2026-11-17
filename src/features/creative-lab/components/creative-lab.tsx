'use client';
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from 'react';
import { Icon } from '../../../components/icon';
import { useCreativeLab } from '../use-creative-lab';
import { InspectionPanel, ComparisonPanel, bytesLabel } from './inspection-panel';
import type { ImageFormat, LabStage } from '../types';

const stageLabels:Record<LabStage,string>={idle:'Importar',reading:'Lendo arquivo local…',inspecting:'Inspecionando estrutura…',decoding:'Decodificando a imagem…',ready:'Inspeção concluída',encoding:'Gerando uma nova imagem…',verifying:'Reinspecionando o resultado…',complete:'Resultado verificado',error:'Não foi possível continuar'};

export function CreativeLab(){
  const lab=useCreativeLab(),{state}=lab;
  const picker=useRef<HTMLInputElement>(null);
  const [authorized,setAuthorized]=useState(false),[format,setFormat]=useState<ImageFormat>('png'),[preview,setPreview]=useState<'before'|'after'>('before'),[dragging,setDragging]=useState(false);
  const busy=['reading','inspecting','decoding','encoding','verifying'].includes(state.stage);
  async function accept(files:FileList|null){
    if(!files||files.length===0)return;
    if(files.length!==1){lab.reject('Escolha apenas uma imagem. Processamento em lote não faz parte desta versão.');return;}
    setAuthorized(false);setPreview('before');
    const detected=await lab.importFile(files[0]);if(detected)setFormat(detected);
  }
  function reset(){lab.reset();setAuthorized(false);setPreview('before');if(picker.current)picker.current.value='';}
  const original=state.original,output=state.output;
  const previewURL=preview==='after'&&output?output.url:original?.url;
  return <section className="creative-lab" aria-label="Creative Lab">
    <div className="lab-privacy"><Icon name="shield" size={19}/><p><strong>Seu arquivo fica com você.</strong> Processamento local, sem upload e sem armazenamento automático. O original não será sobrescrito.</p></div>
    <ol className="lab-steps" aria-label="Etapas do processamento">{['Importar','Inspecionar','Limpar','Verificar','Exportar'].map((label,index)=>{
      const current=state.stage==='complete'?4:state.stage==='verifying'?3:state.stage==='encoding'?2:original?1:0;
      return <li key={label} className={index<current?'is-complete':undefined} aria-current={index===current?'step':undefined}><span>{index+1}</span>{label}</li>;
    })}</ol>
    <input ref={picker} id="lab-file" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" tabIndex={-1} onChange={event=>{void accept(event.currentTarget.files);event.currentTarget.value='';}}/>
    {!original&&!busy?<div className={'lab-dropzone'+(dragging?' is-dragging':'')} onDragOver={event=>{event.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={event=>{event.preventDefault();setDragging(false);void accept(event.dataTransfer.files);}}>
      <span className="lab-drop-icon"><Icon name="image" size={34}/></span><h2>Prepare seu próximo criativo.</h2>
      <p>Arraste uma imagem ou escolha um arquivo do seu dispositivo.</p>
      <button className="button primary" onClick={()=>picker.current?.click()} aria-describedby="lab-limits">Escolher imagem<Icon name="arrow" size={18}/></button>
      <p id="lab-limits" className="lab-note">JPEG, PNG ou WebP estático · até 10 MiB e 8 megapixels · máximo de 8.192 px por lado.</p>
    </div>:null}
    {busy?<div className="lab-progress" role="status" aria-live="polite"><Icon name="settings" size={22}/><div><strong>{stageLabels[state.stage]}</strong><p>Não feche esta área durante o processamento. Você pode cancelar.</p></div><button className="button secondary" onClick={lab.cancel}>Cancelar</button></div>:null}
    {state.error?<div className="lab-error" role="alert"><Icon name="shield"/><div><strong>O original foi preservado.</strong><p>{state.error}</p></div></div>:null}
    {state.notice?<p className="lab-notice" role="status">{state.notice}</p>:null}
    {original?<div className="lab-workspace" aria-busy={busy}>
      <section className="lab-preview-panel" aria-label="Prévia local">
        <div className="lab-panel-heading"><h2>Seu criativo</h2><span className="lab-local-badge">Somente neste dispositivo</span></div>
        {output?<div className="view-toggle" role="group" aria-label="Comparar prévias"><button aria-pressed={preview==='before'} onClick={()=>setPreview('before')}>Original</button><button aria-pressed={preview==='after'} onClick={()=>setPreview('after')}>Resultado</button></div>:null}
        <div className="lab-preview">{previewURL?<img src={previewURL} width={original.inspection.displayWidth} height={original.inspection.displayHeight} alt={preview==='after'&&output?'Prévia do novo arquivo verificado':'Prévia do arquivo original'}/>:null}</div>
        <p className="lab-filename">{preview==='after'&&output?output.name:original.file.name}</p>
        <p className="lab-note">{preview==='after'&&output?bytesLabel(output.blob.size):bytesLabel(original.file.size)} · Prévia não comprova fidelidade de cor.</p>
        <button className="button quiet" onClick={reset}>Retirar arquivo e começar de novo</button>
      </section>
      <section className="lab-diagnostic-panel" aria-labelledby="lab-inspection-title">
        <span className="eyebrow">Inspeção do original</span><h2 id="lab-inspection-title">Entenda antes de converter.</h2>
        <InspectionPanel inspection={original.inspection}/>
        <details className="lab-advanced"><summary>Avançado · formato de saída</summary>
          <label className="lab-format">Exportar como<select disabled={busy} value={format} onChange={event=>setFormat(event.target.value as ImageFormat)}><option value="jpeg">JPEG</option><option value="png">PNG</option><option value="webp">WebP</option></select></label>
          <p>JPEG e WebP usam qualidade solicitada de 92%. PNG é re-encodificado sem configuração de qualidade. O suporte do encoder depende do navegador.</p>
        </details>
        <div className="lab-conversion-warning"><strong>Uma nova imagem, não uma cópia idêntica.</strong><p>A conversão pode alterar compressão, cores, perfil ICC e precisão. EXIF é normalizado. JPEG compõe transparência sobre branco. APNG e WebP animado são bloqueados.</p></div>
        <label className="lab-consent"><input type="checkbox" checked={authorized} disabled={busy} onChange={event=>setAuthorized(event.target.checked)}/><span>Confirmo que o arquivo é próprio ou tenho autorização para processá-lo.</span></label>
        <button className="button primary lab-clean" disabled={!authorized||busy} onClick={async()=>{await lab.clean(format);setPreview('after');}}>Gerar nova imagem e verificar<Icon name="arrow" size={18}/></button>
        {output?<div className="lab-export"><h3>Pronto para você revisar.</h3><p className="lab-filename">{output.name}</p><p>{output.after.format.toUpperCase()} · {bytesLabel(output.blob.size)} · Decodificação confirmada</p><a className="button primary" href={output.url} download={output.name}>Baixar nova imagem<Icon name="arrow" size={18}/></a><p className="lab-note">Confira também o relatório abaixo. O download só ocorre ao acionar este botão.</p></div>:null}
      </section>
    </div>:null}
    {original&&output?<ComparisonPanel before={original.inspection} after={output.after} comparison={output.comparison}/>:null}
    <p className="lab-boundary">A limpeza atua nos metadados de arquivo cobertos pela inspeção. Não remove marcas d’água, textos, rostos ou dados desenhados nos pixels; não garante aprovação de anúncios. Ao sair desta área, os estados e URLs temporários são descartados. O navegador gerencia a liberação física da memória.</p>
  </section>;
}
