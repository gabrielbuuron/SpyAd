import { ads } from '../lib/data';
import { Icon } from './icon';
import { CreativePreview } from './creative-preview';

export function Dashboard({ count, onOpen }: { count: number; onOpen: (id: number) => void }) {
  const platforms = new Set(ads.map(ad=>ad.platform)).size;
  return <>
    <section className="welcome-panel">
      <div className="welcome-copy"><span className="eyebrow">Seu próximo ponto de vista</span><h2>Boas referências.<br/>Melhores perguntas.</h2>
        <p>Explore conceitos, entenda o contexto e organize suas próximas ideias. Tudo começa no Ad Explorer.</p>
        <a className="button primary" href="#explorer">Explorar anúncios<Icon name="arrow" size={19}/></a>
      </div>
      <ol className="hero-guide" aria-label="Como explorar a SpyAd">
        <li><span>01</span><div><strong>Descubra um conceito</strong><p>Busque nos exemplos do Explorer.</p></div></li>
        <li><span>02</span><div><strong>Examine o contexto</strong><p>Abra o dossiê, sem supor resultados.</p></div></li>
        <li><span>03</span><div><strong>Guarde a referência</strong><p>Salve sua coleção neste navegador.</p></div></li>
      </ol>
    </section>
    <div className="workspace-stats">
      <div><Icon name="dashboard"/><div><span>Exemplos disponíveis</span><strong>{String(ads.length).padStart(2,'0')}<small>Dados fictícios</small></strong></div></div>
      <div><Icon name="collection"/><div><span>Referências salvas</span><strong>{String(count).padStart(2,'0')}<small>Neste navegador</small></strong></div></div>
      <div><Icon name="shield"/><div><span>Plataformas Meta</span><strong>{String(platforms).padStart(2,'0')}<small>Representadas nos exemplos</small></strong></div></div>
    </div>
    <section className="dashboard-section"><div className="section-title"><div><span className="eyebrow">Comece por aqui</span><h2>Referências para explorar</h2></div><a className="text-link" href="#explorer">Ver no Explorer<Icon name="arrow" size={17}/></a></div>
      <div className="reference-grid">{ads.map(ad=><article className="reference-card" key={ad.id}>
        <CreativePreview ad={ad} small/><div><span>{ad.platform} · {ad.format}</span><h3>{ad.brand}</h3><p>{ad.category} · Ilustrativo</p>
          <button className="reference-open" onClick={()=>onOpen(ad.id)} aria-label={'Abrir dossiê de '+ad.brand}>Ver dossiê<Icon name="arrow" size={16}/></button>
        </div>
      </article>)}</div>
    </section>
    <div className="integrity-note"><Icon name="shield" size={19}/><p><strong>Contexto antes de conclusões.</strong> Exemplos demonstrativos, sem métricas de desempenho e sem integrações ativas.</p></div>
  </>;
}
