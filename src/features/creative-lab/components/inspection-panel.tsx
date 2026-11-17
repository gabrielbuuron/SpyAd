import type { Inspection, Comparison } from '../types';

export function bytesLabel(bytes:number){return new Intl.NumberFormat('pt-BR').format(bytes)+' bytes';}
const statusLabels={found:'Encontrado','not-found':'Não encontrado',unsupported:'Não suportado',unverified:'Não verificado'};
const reportLabels={removed:'Removido',preserved:'Preservado','not-found':'Não encontrado',unverifiable:'Não verificável'};

export function InspectionPanel({inspection}:{inspection:Inspection}){
  return <>
    <dl className="lab-facts">
      <div><dt>Formato real</dt><dd>{inspection.format.toUpperCase()}</dd></div>
      <div><dt>Tamanho</dt><dd>{bytesLabel(inspection.bytes)}</dd></div>
      <div><dt>Dimensões visuais</dt><dd>{inspection.displayWidth} × {inspection.displayHeight} px</dd></div>
      <div><dt>Proporção</dt><dd>{(inspection.displayWidth/inspection.displayHeight).toFixed(3)}:1</dd></div>
      <div><dt>Decodificação</dt><dd>{inspection.decoded?'Confirmada':'Não verificada'}</dd></div>
      <div><dt>Transparência</dt><dd>{inspection.alpha==='present'?'Canal/capacidade detectado':inspection.alpha==='not-found'?'Não encontrada no cabeçalho':'Não verificada'}</dd></div>
    </dl>
    <details className="lab-advanced"><summary>Avançado · metadados e diagnóstico</summary>
      <p>Os campos abaixo podem conter informações sensíveis do seu próprio arquivo. Permanecem nesta sessão.</p>
      <dl className="lab-metadata">{Object.entries(inspection.metadata).map(([id,field])=><div key={id}><dt>{field.label}</dt><dd><strong data-status={field.status}>{statusLabels[field.status]}</strong><span>{field.value}</span></dd></div>)}</dl>
      <p><strong>Cor:</strong> {inspection.color}. Um perfil ICC é identificado por contêiner; sua interpretação completa não está coberta.</p>
      <p><strong>Dimensões codificadas:</strong> {inspection.width} × {inspection.height} px. Orientação efetiva: {inspection.orientation}.</p>
      {inspection.details.length?<dl className="lab-metadata">{inspection.details.map((field,index)=><div key={index}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>:<p>Nenhum campo textual adicional foi lido.</p>}
      <p className="lab-hash"><strong>SHA-256:</strong> {inspection.sha256??'Não verificado'}</p>
      {inspection.warnings.map(warning=><p key={warning}>{warning}</p>)}
    </details>
  </>;
}
export function ComparisonPanel({before,after,comparison}:{before:Inspection;after:Inspection;comparison:Comparison}){
  const delta=after.bytes-before.bytes;
  return <section className="lab-comparison" aria-labelledby="lab-comparison-title">
    <div className="section-title"><div><span className="eyebrow">Verificação local</span><h2 id="lab-comparison-title">O que mudou no arquivo</h2></div></div>
    <p>Antes: {bytesLabel(before.bytes)}. Depois: {bytesLabel(after.bytes)}. Diferença: {delta>0?'+':''}{bytesLabel(delta)}. Um arquivo maior não indica falha na limpeza.</p>
    <p>Resultado decodificado: {after.width} × {after.height} px. Orientação visual normalizada. Isso não garante fidelidade de pixels, compressão ou cores.</p>
    <div className="lab-comparison-rows" role="list">{comparison.map(row=><div role="listitem" className="lab-comparison-row" key={row.id}>
      <div><h3>{row.label}</h3><span className={'lab-status status-'+row.status}>{reportLabels[row.status]}</span></div>
      <dl><div><dt>Antes</dt><dd>{row.before}</dd></div><div><dt>Depois</dt><dd>{row.after}</dd></div></dl>
    </div>)}</div>
    <p className="lab-note">Removido significa que o contêiner reconhecido não foi encontrado na reinspeção. Campos não cobertos continuam não verificáveis. Preservado aplica-se somente a um valor de orientação efetivamente lido e igual. Não é uma garantia de arquivo sem metadados.</p>
  </section>;
}
