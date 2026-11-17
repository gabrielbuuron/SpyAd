# Sprint 1.1 — Visual Excellence

Data: 17/11/2026. Branch: `sprint-1-foundation`.
Base conferida antes da edição: `1cf7d45f745d70888edc015e6c25572e2ab6f502`.
Commit de implementação: `2b9a26bbaaae863ff3961021810664816120dde1`.

**Estado:** implementação e verificações técnicas concluídas; homologação visual e interativa pendente. Não há novas capturas nesta entrega, porque o navegador não estava acessível. Não houve merge, deploy, alteração de main, atualização de dependências, integração externa ou início da Sprint 2.

## Inventário, riscos e plano executado

Foram lidos integralmente briefing, auditoria anterior, README, especificação Sprint 1, package.json, CSS, componentes, hooks, testes e fixtures. A árvore local foi comparada por hash de blob Git com os arquivos da branch remota: nenhuma diferença local foi encontrada antes das alterações. O briefing novo foi sincronizado. Não há Git instalado nem metadados .git nesta cópia de trabalho; leitura e salvamento usam o conector GitHub, preservando a branch e verificando o SHA esperado.

Riscos identificados: microtipografia espalhada por regras duplicadas; topo do Explorer alto; economia de espaço feita às custas de labels pequenas; seis itens comprimidos no rodapé móvel; buscas por conceito sem consultar o campo concept; navegação sem foco previsível; ausência de navegador para avaliação visual real.

Plano aplicado:
1. Consolidar tokens tipográficos e reduzir duplicação do CSS sem trocar a stack.
2. Dar protagonismo à pesquisa e ao início dos resultados.
3. Reorganizar ações, prévias, Dashboard e navegação por tipo de dispositivo.
4. Preservar funções existentes e ampliar testes de componentes e contraste.
5. Fazer uma segunda revisão, corrigir achados e executar novamente verificações.

Next 16.4.4, React 19.3.1 e o lockfile anterior foram mantidos. `npm ci --offline --no-audit --no-fund` instalou 359 pacotes. Node v24.22.0, npm 11.19.1. O aviso de depreciação já conhecido do ESLint 9.39.5 permanece; auditoria online de vulnerabilidades não foi executada.

## Antes e depois descritivo

| Área | Base anterior | Implementação 1.1 |
| --- | --- | --- |
| Tipografia | Regras por componente de 5–13 px e overrides finais | Escala semântica única; corpo 15–16 px, labels 14 px e overlines 12 px |
| Shell desktop | Sidebar de 246 px, topbar de 76 px e bloco promocional lateral | Sidebar de 224 px, topbar mínima de 56 px e rodapé lateral compacto |
| Explorer | Aviso em faixa separada, busca discreta e linhas sucessivas de controles | Demonstração no contexto, pesquisa de destaque com CTA, filtros e resultados na mesma faixa |
| Cards | Salvar somente por ícone; abrir dossiê pouco destacado | Duas ações textuais claras, estados salvos e nomes acessíveis específicos |
| Preview | Alto, com textos minúsculos e símbolo de play | Proporção editorial 1.9, legenda de 12 px e sem sugestão de playback |
| Dashboard | Hero com cartões e órbitas decorativas | CTA Explorar anúncios, guia real de uso e contagens derivadas das fixtures |
| Tablet | Desktop espremido ou bottom nav | Rail lateral de 104 px entre 700 e 1099 px, seis destinos com labels e galeria de duas colunas |
| Celular | Seis links comprimidos em uma linha | Início, Explorer, Coleções e disclosure Mais com Radar, DNA e Configurações |
| Busca por conceito | Campo concept não entrava na pesquisa | Conceitos passam a ser pesquisáveis com caixa/acentos normalizados |

Essas comparações derivam do código anterior e do briefing do cliente. Não são medições de capturas nem afirmações de validação em dispositivo. Elementos do Opera, Windows, taskbar e marca d'água não foram tratados como parte da aplicação.

## Sistema tipográfico e identidade

Fontes: stack de sistema Segoe UI Variable, Segoe UI, system-ui, -apple-system, BlinkMacSystemFont e sans-serif. Monoespaçada somente em numerais editoriais e contagens específicas. Sem CDN, arquivos de fontes baixados ou bibliotecas novas.

| Token | Valor | Uso |
| --- | --- | --- |
| --type-display | clamp(30px, 22.4px + 1.2vw, 40px) | Título de ação do Dashboard |
| --type-h1 | clamp(28px, 22.4px + .7vw, 34px) | Área atual |
| --type-h2 | clamp(20px, 17.6px + .35vw, 24px) | Seções |
| --type-h3 | clamp(16px, 15.2px + .15vw, 18px) | Conteúdo de cards |
| --type-body | clamp(15px, 14.4px + .1vw, 16px) | Corpo |
| --type-small / --type-label | 14px | Controles e metadados principais |
| --type-overline | 12px | Contexto e legendas auxiliares |
| --type-numeral | clamp(26px, 22.4px + .6vw, 32px) | Contagens com tabular-nums |

Valores acima usam a conversão de 1rem=16px para descrição; CSS usa rem e respeita ajustes do usuário. Pesos 400/500/600/650/750 conforme hierarquia; line-height 1.18 em H1, 1.25 em H2, 1.4 em H3 e 1.55 no corpo. Informações funcionais não dependem de caixa alta, tracking amplo, truncamento ou tooltip. Textos quebram quando necessário. Campos de pesquisa/select têm 16 px para reduzir zoom automático em iOS, ainda sem validação em aparelho.

Superfícies: background #0b0e14, surface #11161f, raised #171d28. Ciano #80d9e5 para pesquisa e estados ativos; violeta #c4b1ed secundário. Texto #ecf0f7, muted #aeb9cb e subtle #9daac0. Borda funcional #67778e para distinguir controles; bordas estruturais discretas #303b4c. O contraste foi calculado em testes, incluindo bordas de controles, ações, salvo, erro, badge e legenda. Isso não representa certificação WCAG completa.

## Explorer e primeira dobra

A topbar foi reduzida, o overline duplicado saiu do título e o aviso demo passou a fazer parte do contexto do Explorer. Não há banner extra antes da busca. Galeria/lista ficam ao lado da pesquisa no desktop; filtro, ação de limpeza e contagem compartilham a faixa seguinte. A grade começa imediatamente depois.

A pesquisa continua instantânea; clicar Pesquisar ou usar Enter leva foco ao resumo dos resultados, sem request, cobrança ou operação fictícia. Limpar busca retorna foco ao campo. Filtros continuam sendo controles reais e têm contador de condições ativas; Limpar tudo aparece fora do painel. As duas visualizações usam os mesmos dados e callbacks.

A altura de preview mudou de aspect-ratio 1.3 para 1.9, reduzindo altura sem cortar títulos dos anúncios. Marca, plataforma, formato, categoria e país têm hierarquia própria. Salvar/Salvo e Abrir dossiê são ações visíveis no rodapé. O rótulo acessível de Salvo continua dizendo Remover da coleção para deixar clara a ação reversa.

A ocupação efetiva da primeira dobra em 1366×768 permanece **pendente de medição em navegador**. O CSS foi organizado para esse objetivo, mas não foi declarado aprovado sem captura.

## Dashboard, dossiê e demais áreas

Dashboard mantém a entrada aprovada e dá acesso direto ao Explorer. O hero deixa de ter ilustração ornamental e mostra um guia de descoberta → contexto → coleção. Cards compactos de referência têm botão de dossiê específico. Três contagens: total das fixtures, itens salvos e número de plataformas representadas; nenhuma métrica comercial ou de campanhas foi criada.

Dossiê preserva dialog nativo, showModal, Esc, backdrop, scroll interno e retorno ao acionador; fallback de foco permanece no conteúdo principal se o acionador for removido. Cabeçalho agora é sticky, fechar tem contorno visível e aria-describedby relaciona a descrição da demonstração. Erros de storage também aparecem dentro do dialog. Comportamento do foco/modal foi revisto no código; a interação real ainda precisa ser testada.

Coleções, Configurações, Radar e DNA usam os mesmos tokens. Coleções preservam storage versionado, sinais entre abas e feedback de falha. Radar e DNA continuam explicitamente planejados. Não existe playback, integração Meta, TikTok, Google ou autenticação simulada como real.

## Segunda revisão executada

Revisão estática do layout e do HTML SSR, depois da primeira implementação:
- Detectada e corrigida a busca que prometia conceito sem incluir concept na indexação.
- Detectado e corrigido foco perdido na navegação: troca de área volta ao topo e foca o conteúdo principal.
- Menu Mais fecha por clique fora, seleção e Esc; ao fechá-lo pela seleção da área atual, o foco retorna ao summary.
- Dashboard deixou de usar um botão envolvendo blocos/heading de referência; passou a article com ação textual.
- Salvamento ganhou componente compartilhado para evitar divergência entre galeria e lista.
- Contraste de bordas e estados ampliado nos testes.
- O lint detectou a variável reservada module no helper de SSR; renomeada, com suíte repetida.

**Não houve segunda revisão visual por screenshot.** A segunda passagem disponível foi de código, semântica, markup renderizado e contraste calculado.

## Testes e evidências reais

| Verificação | Resultado |
| --- | --- |
| npm ci --offline --no-audit --no-fund | Exit 0, 359 pacotes |
| npm run lint | Exit 0, sem avisos finais |
| npm run typecheck | Exit 0 |
| npm test | Exit 0; 37 testes passaram |
| npm run build | Exit 0; Next 16.4.4, / e /_not-found estáticos |
| npm start | Servidor local em 127.0.0.1:3220 iniciou |
| npm run test:http | Exit 0; SSR, seis destinos, CSS servido, cabeçalho e 404 |

Os 37 testes são: 21 de contraste, 9 de lógica/dados/storage e 7 de renderização SSR de componentes reais. Os novos testes transpõem TSX com o TypeScript já instalado e renderizam com ReactDOMServer, sem instalar bibliotecas. Verificam os dois modos, nomes acessíveis, estado salvo, seis links, disclosure, formulário de busca, vínculos de resultados, recuperação de vazio, descrição/erro do dossiê e ausência de playback falso.

Limites: SSR não executa efeitos, hidratação, cliques, teclado ou layout. Storage em testes é uma implementação em memória do contrato; duas abas reais, reload real e quota do navegador continuam pendentes. O teste HTTP usa o servidor de build local, sem navegador.

Logs preservados em docs/evidencias/sprint-1-1/. Logs da Sprint 1 anterior foram mantidos. O lockfile foi conferido contra a base e não foi alterado.

## Matriz de viewport e evidência visual

A tentativa de listar navegadores nesta rodada retornou exatamente: `The browser access host is unavailable`. O bloqueio nativo registrado anteriormente impediu identificar com segurança a URL do Opera. Nenhuma nova captura foi criada, nenhuma emulação de dispositivo foi executada e nenhuma imagem de mockup foi apresentada como screenshot.

| Viewport CSS | Comportamento projetado | Validação visual |
| --- | --- | --- |
| 320×568 | Uma coluna; quatro entradas + Mais | Pendente |
| 375×812 | Uma coluna; controles touch | Pendente |
| 390×844 | Uma coluna; safe-area e modal | Pendente |
| 430×932 | Uma coluna; labels preservadas | Pendente |
| 768×1024 | Rail 104 px; duas colunas | Pendente |
| 820×1180 | Rail 104 px; duas colunas | Pendente |
| 1024×768 | Rail 104 px; tablet em paisagem | Pendente |
| 1280×720 | Sidebar 224 px; três colunas | Pendente |
| 1366×768 | Sidebar 224 px; Explorer compacto | Pendente |
| 1440×900 | Sidebar 224 px; três colunas | Pendente |
| Paisagens de celular / retratos correspondentes | Reflow e controles de 44 px ou mais | Pendente |
| Zoom 200% | Reflow, unidades rem e textos sem ellipsis | Pendente |

No celular, safe-area é considerada no rodapé e no espaço reservado do conteúdo. No tablet, a rail mantém labels de 12 px e os seis destinos, sem depender de hover. No desktop baixo, espaçamento lateral é reduzido antes de depender de rolagem. Sidebar só rola quando necessária em altura pequena/zoom; não se usa overflow:hidden para mascarar conteúdo.

Roteiro exato e nomes esperados de capturas: [HOMOLOGACAO-MANUAL.md](evidencias/sprint-1-1/HOMOLOGACAO-MANUAL.md).

## Arquivos alterados

- src/app/globals.css: tokens, densidade, componentes e breakpoints consolidados.
- src/components/app-shell.tsx: composição simplificada, contexto compacto e foco na navegação.
- src/components/ad-explorer.tsx: novo componente de busca, filtros, modos e resultados.
- src/components/search-bar.tsx, filter-panel.tsx: pesquisa e limpeza com ação clara.
- src/components/ad-card.tsx, ad-list-row.tsx, save-ad-button.tsx: ações compartilhadas e legíveis.
- src/components/creative-preview.tsx: proporção editorial e ausência de playback aparente.
- src/components/dashboard.tsx: hero útil, contagens e referências compactas.
- src/components/sidebar.tsx, bottom-nav.tsx, icon.tsx: desktop, rail e menu Mais.
- src/components/ad-detail.tsx e settings.tsx: descrição acessível e consistência de versão.
- src/lib/domain.mjs: pesquisa também por conceito.
- tests/components.test.mjs, render-components.mjs, contrast.test.mjs, domain.test.mjs: cobertura ampliada.
- README.md, AUDITORIA-SPYAD-SPRINT-1.md, este relatório e evidências: documentação.

## Pendências reais de homologação

1. Abrir no navegador e validar composição/primeira dobra, sem cortes ou scroll horizontal em toda a matriz.
2. Capturar Dashboard topo, Explorer topo/galeria/lista, dossiê, mobile e tablet. Não há capturas prontas.
3. Confirmar Esc, backdrop, foco, skip link e ordem de Tab; testar leitor de tela.
4. Confirmar menu Mais, teclado virtual, safe-area e orientação em Safari/iPhone, Chrome/Android e Safari/iPad.
5. Exercitar reload, duas abas e estados de storage no navegador.
6. Homologar visualmente os estados hover/focus/pressed, fontes do sistema e zoom 200%.

A aprovação visual final pertence ao usuário. Esta rodada não autoriza publicação nem avanço para Sprint 2.

---

## Rodada posterior de homologação

Sobre a referência 29e4f64, foi aplicada uma correção pontual de ergonomia no dossiê e compactação discreta do hero/cards. A suíte passou a 38 testes. O histórico deste documento permanece; o estado mais recente está em [SPRINT-1-1-HOMOLOGACAO-FINAL.md](SPRINT-1-1-HOMOLOGACAO-FINAL.md). A validação real de navegador continua pendente.
