# Sprint 2.1 — Signal S / Brand & Product Experience

Data: 17/11/2026.
Branch exclusiva: `sprint-2-1-brand-experience`.
HEAD inicial conferido: `50f2701d364877b3f9b37ca3a24c5d04c0093f7b`.
Base de produto preservada: `404e30a5f9f586be1191f6d1bc1ee05a7de4102a`.
Commit de implementação: `6432df42710a5e31c48ba82db680223f3831d5a4`.

**Entrega para revisão.** Marca vetorial integrada e verificações técnicas executadas. O símbolo não foi declarado oficial final aprovado: o estudo escolhido não está presente como asset na árvore e não houve comparação visual com essa imagem. A homologação de browser das Sprints 1.1/2.0 continua parcial, e a desta rodada também está pendente.

## Inventário e escopo

O briefing docs/SPRINT-2-1-BRAND-EXECUCAO.md foi lido integralmente antes de alterar arquivos. A árvore remota foi inventariada: não havia SVG, PNG, ICO, fonte ou manifesto de marca. A cópia local em C:\Users\User\Documents\SpyAd-sprint-2-1-brand-experience foi preparada isoladamente a partir dos arquivos verificados por hash, sem divergências locais.

Git nativo não está instalado; a leitura e gravação remota usam o conector GitHub com SHA esperado. As branches main, sprint-1-foundation e sprint-2-creative-lab foram apenas consultadas. Não houve merge, publicação, conexão externa ou novo recurso funcional de produto.

As dependências e o lockfile foram mantidos. package.json altera apenas a porta local para 3240 e adiciona brand:generate. A porta do HMR em desenvolvimento foi alinhada; a CSP de produção e a privacidade do Lab foram preservadas.

## Proposta vetorial e assets

Foi criada uma interpretação original Signal S: percurso angular em S com dois terminais circulares, acompanhado de wordmark SpyAd em paths próprios. Spy claro e Ad ciano no escuro; variante de fundo claro usa teal com contraste adequado. Não há dependência de fonte para desenhar o logotipo.

Fonte única: src/brand/signal-s.mjs. Componente BrandMark com variantes lockup, symbol, wordmark e tons brand, on-light, mono-light, mono-dark. Nome acessível por padrão e opção decorativa para links já nomeados.

Entregues 11 SVGs, 6 PNGs, 1 ICO e manifesto:
- Lockup, wordmark, símbolo, fundo claro e monocromias.
- Favicons SVG/16/32 px e ICO com dois PNGs.
- Apple 180 px; app icons 192/512 px; maskable 512 px e masters SVG.
- public/manifest.webmanifest e metadados no RootLayout.

A geração é reprodutível com o conjunto Node/Sharp do lockfile. Não foi instalada biblioteca de ícones, fonte ou rasterização nova. Sharp 0.35.5 já fazia parte do projeto.

O manifesto prepara identificação e ícones; **não representa PWA completa**. Não há service worker ou funcionamento offline implementado, nem instalação homologada.

## Aplicações e refinamento cirúrgico

- Sidebar: lockup, assinatura discreta e símbolo do workspace.
- Tablet: símbolo compacto da mesma geometria no topo da rail.
- Mobile: lockup no cabeçalho e símbolo no destino Início; estado inativo usa monocromia com menor ênfase.
- Cabeçalho desktop: wordmark monocromático e contexto da área.
- Versão da interface passa a Sprint 2.1.
- Cores, fontes e hierarquia de conteúdo existentes foram preservadas. Não houve reformulação de Dashboard/Explorer ou inserção de logos nas marcas ilustrativas de anúncios.
- Ajustes pontuais de alinhamento, foco, transições de 150 ms e reduced motion. A marca não recebe animação de desenho, filtro pesado ou brilho neon.
- Creative Lab: avanços recolhidos têm estado mais claro; campos Encontrado / Não suportado / Não verificado / Não encontrado são diferenciados por texto e cor; resultado exportável ganha painel consistente com o sistema.

As alterações do Lab se limitam a CSS e ao atributo data-status no componente de apresentação. Não foi aplicado logotipo como marca d'água em arquivos importados ou exportados.

## Guarda do processamento

Foram comparados os hashes de 11 arquivos de núcleo: nove módulos em src/features/creative-lab/lib/, types.ts e use-creative-lab.ts. Todos permaneceram idênticos à base. Parsers, encoders, limites, cancelamento, worker e regras de privacidade não foram modificados.

O único arquivo alterado sob a feature é components/inspection-panel.tsx, com o atributo de estado para estilo; cálculos, status e conteúdo do relatório permanecem os mesmos. Os 68 testes preexistentes passaram novamente.

## Tipografia, contraste e identidade

Wordmark original em paths; interface mantém fontes do sistema e a escala semântica anterior. Nenhuma fonte remota ou arquivo de fonte foi adicionado. Paleta, proporções, margens, mínimos, aplicações, proveniência e reprodução dos ícones estão em [BRAND-SPYAD-SIGNAL-S.md](BRAND-SPYAD-SIGNAL-S.md).

Os testes verificam contraste de Spy/Ad nos fundos indicados, coerência entre ciano de marca e interface e regressões dos tokens anteriores. Não são uma certificação WCAG de todas as telas.

## Evidências disponíveis e o que não foi aprovado

Foi gerada uma prancha raster de revisão com fundos claro/escuro, monocromia e ampliações nearest-neighbor de favicon 16 e 32. A imagem foi inspecionada com view_image. O app-icon 512 px também foi aberto e inspecionado isoladamente. Isso permite revisar a exportação e detectar cortes óbvios, mas **não substitui**:

- comparação com o estudo visual escolhido pelo usuário;
- visualização do favicon na aba real;
- avaliação da marca aplicada ao produto em desktop/tablet/celular;
- teste de instalação de ícone/PWA;
- revisão manual de distintividade visual antes de publicar.

A prancha contém a indicação de que é interpretação original em revisão e não screenshot do produto. Fica em .brand-review/ e foi incluída no ZIP de revisão fora do repositório. Não há novas capturas da aplicação.

A tentativa real `cua.listBrowsers()` retornou `The browser access host is unavailable`. Portanto, não foi declarada homologação visual ou interativa.

## Verificações executadas

Ambiente: Node v24.22.0, npm 11.19.1, Next 16.4.4 e Sharp 0.35.5.

| Comando/verificação | Resultado |
| --- | --- |
| npm ci --offline --no-audit --no-fund | Exit 0, 359 pacotes |
| npm run brand:generate -- --proof | Exit 0; vetores/rasters/manifesto e prancha |
| npm run lint | Exit 0 |
| npm run typecheck | Exit 0 |
| npm test | Exit 0; 77 testes, zero falhas |
| npm run build | Exit 0; / e /_not-found estáticos |
| npm start | Servidor local em 127.0.0.1:3240 |
| npm run test:http | Exit 0; SSR, sete destinos, CSS, CSP, chunks do Lab, favicon e manifesto/assets |
| Hashes do núcleo do Creative Lab | 11 arquivos inalterados |
| package-lock.json | Inalterado |

Os nove testes novos verificam:
1. Nome acessível e paths compartilhados do BrandMark.
2. Uso decorativo, monocromias e rejeição de variação inválida.
3. Consistência dos SVGs sem fontes/scripts/imagens externas.
4. Dimensões e decodificação dos PNGs, sem raster vazio.
5. ICO com PNGs 16/32 corretos.
6. Opacidade e zona segura circular do maskable.
7. Manifesto apontando para assets locais com dimensões reais.
8. Reprodutibilidade por hashes antes/depois do gerador.
9. Contraste de marca nos fundos indicados e ciano igual ao token da interface.

O teste de raster não prova reconhecimento visual pelo usuário. Os 28 testes de imagem continuam usando adaptador Node/Sharp, não canvas de browser. SSR não executa cliques, efeitos, foco, toque, zoom ou layout.

Logs e guarda de hashes em docs/evidencias/sprint-2-1/. O aviso já conhecido de depreciação do ESLint 9.39.5 permanece; não foi executada auditoria online de vulnerabilidades.

## Matriz de homologação pendente

| Verificação | Estado |
| --- | --- |
| Comparar símbolo/wordmark com a segunda proposta escolhida | Pendente: referência gráfica ausente do repo |
| Desktop 1366 px | Pendente em browser |
| Tablet 820 / 1024 px | Pendente em browser |
| Celular 390 px | Pendente em browser |
| Zoom 200%, teclado, foco e reduced motion | Pendente em browser |
| Favicon 16/32 em aba real, Apple/app icon | Pendente na plataforma |
| Canvas/worker/download do Lab | Pendente de homologação anterior e regressão real |
| Revisão manual de distintividade antes de publicar | Pendente |

Roteiro: [SPRINT-2-1-BRAND-HOMOLOGACAO.md](SPRINT-2-1-BRAND-HOMOLOGACAO.md).

## Arquivos alterados/adicionados

- src/brand/signal-s.mjs e src/components/brand-mark.tsx.
- scripts/generate-brand-assets.mjs; public/brand/* e public/manifest.webmanifest.
- src/app/layout.tsx, globals.css; componentes sidebar, app-shell, bottom-nav e settings.
- src/features/creative-lab/components/inspection-panel.tsx: apresentação apenas.
- tests/brand.test.mjs, contrast.test.mjs e http.integration.mjs.
- package.json, next.config.mjs e .gitignore: script, porta isolada, HMR e pasta de revisão.
- Guia, relatório, roteiro, README e evidências.

## Entrega para decisão do usuário

Preview local: http://127.0.0.1:3240. Pacote de revisão local: C:\Users\User\Documents\SpyAd-Signal-S-review.zip.

A implementação está entregue para revisão. Solicita-se aprovação comparativa da interpretação Signal S e da aplicação real no produto antes de declarar a marca final ou publicar. Não houve alteração nas branches anteriores, merge, deploy ou serviços externos.
