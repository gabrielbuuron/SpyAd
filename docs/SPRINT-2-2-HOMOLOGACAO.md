# Sprint 2.2 — Roteiro de homologação

## Preparação

Na branch `sprint-2-2-product-experience`, instale dependências com `npm ci --no-audit --no-fund` e inicie `npm run dev`. A auditoria npm pode falhar neste ambiente por bloqueio de rede ao endpoint de advisories.

Confira em browser desktop e mobile. O host de navegador estava indisponível durante a implementação, portanto nenhuma etapa visual abaixo foi marcada como aprovada.

## Navegação e layout

- [ ] Acesse os sete destinos pela sidebar desktop e confirme o estado atual e o foco visível.
- [ ] Verifique que “Workspace de estudo” e “Planejado” cabem sem corte em 1366×768.
- [ ] Em 820×1180 e 1024×768, confirme o rail tablet, rótulos dos destinos e área útil do conteúdo.
- [ ] Em 390×844, use a navegação inferior e abra “Mais” para acessar Creative Lab, Spy Radar, Offer DNA e Configurações.
- [ ] Use zoom de 200% e confira ausência de overflow horizontal, rótulos cortados e ações inacessíveis.
- [ ] No Dashboard, confirme um único título “Visão geral” na hierarquia visual, H1 presente, valores alinhados e aviso de dados fictícios.

## Explorer, Coleções e Dossiê

- [ ] Pesquise e combine filtros no Explorer. Alterne galeria e lista e confirme contagem e mensagens de vazio.
- [ ] Salve uma referência, recarregue a página e confirme persistência local em Coleções.
- [ ] Abra o dossiê, percorra seu conteúdo, feche por botão, Escape e fundo. Confirme retorno do foco ao controle de origem.
- [ ] Salve e remova pelo dossiê e confirme o estado anunciado nas ações.

## Creative Lab

- [ ] Importe uma imagem autorizada JPEG, PNG ou WebP estática e observe as etapas Importar, Inspecionar, Limpar, Verificar e Exportar.
- [ ] Confirme prévia local, metadados reconhecidos e estados não verificáveis. Expanda “Avançado”.
- [ ] Teste a autorização e formatos JPEG, PNG e WebP. Confirme que resultado e download só aparecem depois do processamento e acionamento explícito.
- [ ] Compare original e resultado. Leia limitações de cor, compressão e campos não verificáveis.
- [ ] Teste cancelamento, formato incompatível e arquivo inválido. Confirme mensagem de erro e preservação do original.
- [ ] Redimensione para 1024×768 e use zoom 200%. Confirme acesso aos controles, etapas, preview e exportação sem corte.

## Acessibilidade e responsividade

- [ ] Complete os fluxos com teclado. Verifique foco visível, Escape, `aria-current`, `aria-pressed`, regiões de status e alvos de toque.
- [ ] Confirme contraste dos textos, avisos, badges e controles em fundos escuros.
- [ ] Ative `prefers-reduced-motion` e confirme ausência de animações desnecessárias.
- [ ] Registre browser, sistema, viewport, zoom, resultado e capturas desktop, tablet e mobile.

## Limite da validação automatizada

`npm test` cobre 77 testes de dados, componentes, contraste, parsing e pipeline Node. `npm run test:http` confirma SSR, assets, política CSP e presença dos chunks do worker. Esses comandos não substituem a verificação de canvas, worker, upload, cliques, download ou layout real em browser.
