# Auditoria SpyAd — Sprint 1.0

Status: implementação técnica pronta para revisão; homologação visual pendente.
Data: 17/11/2026.
Repositório: gabrielbuuron/SpyAd. Branch exclusiva: sprint-1-foundation.
Base inspecionada: 34c61f967aa8b46fd57db028d7137c306a9c9088.

## Escopo e ambiente

Os documentos docs/SPRINT-1-AUDITORIA-E-REFINAMENTO.md e esta auditoria anterior foram lidos integralmente, assim como os demais arquivos da base. Nenhum AGENTS.md existia na árvore remota inspecionada.

Git não está instalado no PATH e nenhum checkout foi localizado nas pastas verificadas. A fonte da branch foi obtida pelo conector GitHub e preparada em C:\Users\User\Documents\SpyAd-sprint-1-foundation. Essa pasta é uma cópia de trabalho, sem metadados .git; não deve ser confundida com um clone. O salvamento remoto usa os objetos Git e atualização da ref exclusiva da sprint, com conferência do SHA esperado. Não houve merge ou deploy. Nenhuma API de anúncios, serviço pago, scraping ou autenticação foi conectada. Sprint 2 não foi iniciada.

## Base técnica e decisão de dependências

A instalação original (Next ^15.5 e React ^19) não foi concluída: o acesso ao registry npm retornou EACCES e a tentativa offline retornou ENOTCACHED para @rushstack/eslint-patch. O cache local continha o conjunto Next 16.4.4/React 19.3.1.

Para tornar a base executável, foi feita uma migração explícita para Next 16.4.4, React/ReactDOM 19.3.1, TypeScript 5.9.3, Tailwind 4.3.4 e ESLint/config Next compatíveis com esse conjunto disponível. Todas as dependências diretas foram fixadas e package-lock.json foi gerado. A migração foi confrontada com a documentação versionada distribuída com Next; a base não utiliza APIs de request síncronas, middleware ou rotas dinâmicas afetadas. JSX foi ajustado para react-jsx e os tipos de desenvolvimento do Next foram incluídos em tsconfig.

npm install --offline --ignore-scripts --no-audit --no-fund e npm ci --offline --no-audit --no-fund foram executados com sucesso. Houve aviso de depreciação do ESLint 9.39.5. Não foi possível consultar auditoria de segurança online; build aprovado não equivale a auditoria de vulnerabilidades. engines exige Node 24 e packageManager declara npm 11.19.1, versões utilizadas nesta máquina. Desenvolvimento/build usam Webpack explicitamente para previsibilidade no ambiente Windows. Servidor local vinculado a 127.0.0.1, porta 3220.

## Inventário e arquitetura

- src/app/page.tsx: ponto de entrada mínimo, delegando a AppShell.
- src/components/app-shell.tsx: composição, filtros, modo de visualização e feedback; estado transitório reiniciado por área.
- Sidebar e BottomNav: seis destinos, área atual e contagem de referências locais.
- SearchBar e FilterPanel: busca acessível, filtros reais de formato/plataforma e limpeza.
- AdCard, AdListRow e CreativePreview: duas visualizações dos mesmos dados e prévias editoriais locais, claramente ilustrativas.
- AdDetail: dialog nativo, foco inicial no fechamento, Esc, fundo inerte, fechamento por backdrop e retorno ao acionador; fallback para o conteúdo principal se o acionador foi removido.
- EmptyState e DemoBadge: estados vazios acionáveis e sinalização consistente de demonstração.
- Dashboard: atalhos e contagens calculadas exclusivamente dos três exemplos locais e dos itens salvos.
- PlannedArea: Spy Radar e Offer DNA indisponíveis, sem ações que aparentem coleta ou análise real.
- Settings: informações verdadeiras do ambiente e redefinição funcional da coleção demonstrativa.
- src/lib/types.ts e data.ts: tipos e dados separados da apresentação; prioridade Meta. TikTok e Google permanecem previstos, sem integração.
- src/lib/domain.mjs: busca, filtragem, validação/versionamento e atualização de coleções, testáveis sem navegador.
- use-collections.ts: armazenamento externo com useSyncExternalStore, sincronização por storage/evento local e tratamento de falhas.
- use-section.ts: navegação por hash, recarga em uma área e histórico do navegador; hash desconhecido retorna à visão geral.

## Refinamento visual implementado

Base escura preservada, com superfícies carvão, bordas discretas e ciano seletivo; violeta reservado a elementos secundários. Sidebar agrupada, topo com contexto do workspace, hierarquia de títulos e cards com espaçamento consistente. Dashboard recebeu conteúdo útil sem métricas de marketing inventadas.

Fontes do sistema (Segoe UI Variable/Segoe UI/system-ui), sem fontes remotas e sem redistribuição de arquivos de fontes. A licença aplicável é a da fonte instalada no sistema; os fallbacks nativos cobrem outros sistemas. Títulos fluidos, escala semântica para corpo/labels/microcopy, números tabulares e foco visível. A identidade exata variará conforme a fonte do dispositivo.

Prévias criadas com HTML/CSS e SVGs de ícones locais; não são criativos reais nem vídeos reproduzíveis. O formato Vídeo é um atributo fictício, sem botão falso de reprodução. Não há imagens externas ou rastreadores.

Breakpoints em 359, 699, 1023, 1199 e 1600 px. Galeria em 1/2/3 colunas; listas reorganizam ações no celular. Navegação inferior inclui os seis destinos em seis colunas abaixo de 1024 px, sem itens escondidos; sidebar rolável no desktop. Dialog usa unidades dinâmicas de viewport, rolagem interna e limites de largura. Controles principais têm área mínima de 44 px e há tratamento para reduced-motion e safe-area.

## Fluxos e integridade

Busca trata caixa, acentos e espaços; termos compostos funcionam em conjunto com plataforma/formato e coleção. Alternância galeria/lista usa o mesmo resultado e preserva filtros enquanto a área permanece aberta. Ao trocar de área, filtros e modo reiniciam; coleções permanecem.

Coleções usam a chave spyad:collections:v1, com esquema versionado, IDs conhecidos e deduplicação. Erros de acesso/quota são reportados sem falso sucesso. Dados corrompidos não são sobrescritos por um salvamento; a redefinição é explícita em Configurações. Persistência é somente neste navegador, sem conta ou sincronização entre dispositivos.

Dossiê diferencia atributos do exemplo e ausência de observações reais. Gasto, receita, duração, engajamento e escala não são apresentados. Não existem inferências automáticas de desempenho.

O link de pular para o conteúdo move foco sem alterar o hash da área. Navegação tem aria-current e modos/salvamento têm aria-pressed. Erros de salvamento também aparecem dentro do dialog.

## Achados por gravidade

| Gravidade | Achado | Situação |
| --- | --- | --- |
| Alta | Ausência de instalação e lockfile | Resolvido com versões fixadas, instalação offline e npm ci executados |
| Alta | Ausência de lint, tipos e build executados | Resolvido; comandos finais passaram |
| Alta | Ausência de evidência em navegador e dispositivos | Pendente; infraestrutura impediu inspeção |
| Média | Página monolítica | Resolvido com componentes e lógica separados |
| Média | Coleções desapareciam na recarga | Persistência local implementada e lógica testada; recarga real no navegador pendente |
| Média | Mobile sem todos os destinos | Corrigido no código; verificação visual/touch pendente |
| Média | Dashboard apenas placeholder | Substituído por visão geral baseada nos exemplos disponíveis |
| Média | Acessibilidade do dossiê | Dialog nativo e foco implementados; teste de teclado/leitor de tela pendente |
| Média | Dependências originais indisponíveis no ambiente | Migração Next 15→16 documentada; homologar no CI habitual do projeto |
| Baixa | ESLint 9.39.5 emite aviso de depreciação | Pendente de atualização futura compatível, sem erro de lint |
| Informativa | Spy Radar, Offer DNA, APIs e autenticação ausentes | Fora da implementação funcional desta sprint; sinalizados |

## Evidências executadas

| Comando | Resultado |
| --- | --- |
| npm install --offline --ignore-scripts --no-audit --no-fund | Sucesso no conjunto fixado; 360 pacotes na instalação inicial |
| npm ci --offline --no-audit --no-fund | Sucesso; 359 pacotes instalados a partir do lockfile |
| npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund | Sucesso após ajuste dos metadados |
| npm run lint | Exit 0, sem erros ou avisos finais |
| npm run typecheck | Exit 0 |
| npm test | 22 testes, 22 passaram, zero falhas |
| npm run build | Exit 0; página / e _not-found pré-renderizadas |
| npm start | Servidor de produção local iniciou em 127.0.0.1:3220 |
| npm run test:http | Exit 0; SSR, seis links de destino, CSS servido, ausência de X-Powered-By e 404 |

Logs de lint, tipos, testes e smoke HTTP: docs/evidencias/sprint-1/. O teste HTTP comprova resposta/markup do servidor; não comprova hidratação, cliques ou responsividade. Os 22 testes abrangem 13 verificações de contraste dos tokens/CTA e 9 testes de busca, filtros, persistência, falhas e integridade dos dados. Não equivalem a certificação WCAG completa.

## Bloqueio visual e matriz de homologação

O navegador integrado retornou: "The browser access host is unavailable". O inventário nativo encontrou o Opera, mas a tentativa de selecioná-lo foi interrompida pelo Computer Use: não conseguiu determinar a URL atual com confiança suficiente para aplicar a política. Nenhuma captura do preview foi obtida; não há screenshots de antes/depois.

| Ambiente | Dimensões solicitadas | Estado |
| --- | --- | --- |
| Celular compacto | 320 px | Pendente: overflow horizontal, menus, toque |
| iPhone/Android | 375 / 390 / 430 px, retrato e paisagem | Pendente em navegador/dispositivo real |
| Tablet/iPad | 768 / 820 / 1024 px, retrato e paisagem | Pendente: painéis, navegação e toque |
| Desktop | 1280 / 1440 px | Pendente: comparação visual e capturas |
| Acessibilidade | teclado, Esc, retorno de foco, zoom 200%, leitor de tela | Implementação revisada estaticamente; interação real pendente |

## Arquivos alterados/adicionados

Alterados: package.json, eslint.config.mjs, postcss.config.mjs, tsconfig.json, src/app/page.tsx, src/app/globals.css, README.md e AUDITORIA-SPYAD-SPRINT-1.md.
Adicionados: package-lock.json, next.config.mjs, src/components/{app-shell,sidebar,bottom-nav,search-bar,filter-panel,ad-card,ad-list-row,ad-detail,empty-state,demo-badge,creative-preview,dashboard,planned-area,settings,icon}.tsx; src/lib/{types.ts,data.ts,domain.mjs,use-collections.ts,use-section.ts}; tests/{domain.test.mjs,contrast.test.mjs,http.integration.mjs}; docs/evidencias/sprint-1/*.txt.

## Checklist para homologação

- [x] Base técnica instalável pelo lockfile no ambiente utilizado.
- [x] Lint, TypeScript, build e testes de lógica executados.
- [x] Navegação, busca, filtros, galeria/lista, dossiê e coleção implementados.
- [x] Dados demonstrativos identificados e sem métricas inventadas.
- [x] Nenhum merge, deploy, serviço pago ou Sprint 2.
- [ ] Validar visualmente e capturar todos os tamanhos da matriz.
- [ ] Executar cliques/teclado, recarga, histórico e sincronização de abas em navegador real.
- [ ] Homologar Safari/iOS, Chrome/Android e iPadOS; revisar zoom de 200%.
- [ ] Validar licenças e vulnerabilidades das dependências no ambiente de CI com rede.
- [ ] Aprovar a migração para Next 16 no ambiente habitual antes de qualquer publicação.

A Sprint 1 não está declarada integralmente homologada. As pendências acima devem ser encerradas antes de iniciar a Sprint 2.

---

## Continuação histórica — Sprint 1.1 Visual Excellence (17/11/2026)

A seção anterior registra a Sprint 1.0 e foi preservada. A implementação 1.1 parte do HEAD 1cf7d45f745d70888edc015e6c25572e2ab6f502. Commit de código: 2b9a26bbaaae863ff3961021810664816120dde1.

Aplicados: escala tipográfica de 12–40 px por tokens; shell compacto; pesquisa protagonista com CTA e foco no resumo; filtros/contagem em uma linha; ações textuais de dossiê e salvamento; Dashboard orientado ao Explorer; rail de tablet e navegação móvel com Mais; descrição acessível do dossiê. Corrigida busca por conceito. Dependências e lockfile não foram alterados.

Verificações desta rodada: npm ci offline, lint, tipos, 37 testes (21 contraste, 9 domínio/storage e 7 SSR), build e teste HTTP executados com sucesso. Segunda revisão de código/semântica e markup SSR realizada, com correções de foco, busca e lint. Nenhuma homologação visual foi declarada: o navegador integrado continua indisponível, e não há novas capturas. Cliques, zoom 200%, dispositivos, duas abas reais e recarga real continuam pendentes.

Relatório completo: [docs/SPRINT-1-1-VISUAL-EXCELLENCE.md](docs/SPRINT-1-1-VISUAL-EXCELLENCE.md). Logs e roteiro exato: [docs/evidencias/sprint-1-1/](docs/evidencias/sprint-1-1/).

Nenhuma alteração de main, merge, deploy, integração externa ou Sprint 2. A aprovação final permanece com o usuário.

---

## Homologação final da Sprint 1.1 — rodada de 17/11/2026

Base: 29e4f64e4509c5e9f765705a3144746e51a546e5, conferida sem diferenças locais. Correções restritas ao dossiê (cabeçalho/conteúdo rolável/rodapé de ações), hero discretamente mais compacto e cards em alturas até 740 px. O botão salvar e os erros deixam a região rolável; nenhum conteúdo é sobreposto por position:fixed. Novo teste SSR confirma a separação estrutural, sem afirmar geometria em navegador.

npm ci, lint, tipos, 38 testes, build e HTTP executados com sucesso. Dependências e lockfile preservados. O navegador retornou novamente The browser access host is unavailable. Permanecem pendentes: persistência após reload real, cliques, galeria/lista, Esc/foco, 390/820/1024/1366 px e zoom 200% no navegador. A homologação não está encerrada, e Sprint 2/branch sprint-2-creative-lab não foram iniciadas.

Relatório desta rodada: [docs/SPRINT-1-1-HOMOLOGACAO-FINAL.md](docs/SPRINT-1-1-HOMOLOGACAO-FINAL.md). Logs: docs/evidencias/homologacao-sprint-1-1/. As avaliações anteriores são mantidas como histórico.

