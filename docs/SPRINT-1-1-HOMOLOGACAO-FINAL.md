# Homologação final da Sprint 1.1 — rodada técnica

Data: 17/11/2026. Repositório: gabrielbuuron/SpyAd.
Branch exclusiva: `sprint-1-foundation`.
HEAD conferido antes da edição: `29e4f64e4509c5e9f765705a3144746e51a546e5`, igual à versão de referência solicitada.

**Resultado:** verificações técnicas executadas com sucesso; homologação visual e interativa ainda pendente. A Sprint 1.1 não está declarada integralmente homologada. Nenhuma Sprint 2 foi iniciada e a branch sprint-2-creative-lab não foi criada.

## Preservação e escopo

A cópia local foi comparada, por hash de blob Git, com todos os arquivos correspondentes da árvore remota. Nenhuma divergência local foi encontrada. Não há Git instalado nesta máquina nem .git na cópia de trabalho; o conector GitHub é usado para ler a branch e salvar um commit com atualização condicionada ao SHA esperado. Não houve alterações em main, merge, deploy, conexão a serviços externos ou instalação de dependências novas.

A avaliação visual do cliente sobre Dashboard, Explorer e dossiê foi usada como referência de escopo. Não foi feita outra reformulação. Cores, fontes, identidade, dados demonstrativos, estrutura do Explorer e navegação foram preservados.

## Correções objetivas

### Dossiê: ação fora da rolagem

Antes, o dialog inteiro rolava e o botão Salvar na coleção ficava no final do conteúdo. Agora:

- Dialog tem altura delimitada pelo viewport: no desktop, até 42rem; no celular, até 40rem, sempre limitado por 100dvh.
- Um grid interno divide cabeçalho, conteúdo com minmax(0,1fr) e rodapé.
- Só a região central tem overflow-y:auto. Cabeçalho e rodapé ficam fora dessa região.
- Salvar/Remover e os erros de armazenamento ficam no rodapé interno, sem posicionamento absoluto e sem cobrir o conteúdo.
- O botão principal tem altura mínima de 48 px. O rodapé considera safe-area no celular.
- A região de conteúdo recebeu nome acessível e tabIndex=0, permitindo foco para rolagem por teclado.
- Foram preservados showModal, fechamento com Esc, fechar visível, backdrop e retorno de foco ao acionador, com fallback para main se ele foi removido.
- O backdrop só fecha quando o gesto também começou nele; arrastar uma seleção de dentro para fora não deve descartar o modal acidentalmente. Esse comportamento foi inspecionado no código, sem teste de ponteiro real.

O teste SSR confirma separação estrutural e nomes/estados acessíveis. A posição efetivamente visível e a rolagem em navegador permanecem pendentes.

### Dashboard

Redução discreta do padding vertical do hero de 1.5rem para 1.25rem e das margens do parágrafo. Título, CTA, três etapas e conteúdos foram mantidos. Não houve mudança de fonte, escala ou composição. Nenhuma redução de altura foi declarada como medida em screenshot.

### Cards em pouca altura

Em viewports com largura a partir de 700 px e altura até 740 px, o preview passa de proporção 1.9 para 2.15, com redução pequena de espaçamento do corpo. Não há line-clamp, corte de título nem redução da altura dos botões. Essa regra busca trazer as ações para cima em janelas baixas; sua eficácia visual ainda precisa ser medida no navegador.

## Auditoria por área

| Área | Evidência executada | Limite |
| --- | --- | --- |
| Dashboard | Revisão da composição e renderização SSR de CTA, demonstração e referências | Primeira dobra não medida nesta rodada |
| Ad Explorer | Testes de normalização, pesquisa por conceito, filtros combinados e recuperação de vazio; SSR do formulário | Digitação e submissão real pendentes |
| Galeria/lista | SSR dos dois componentes confirma mesmos atributos, ação de dossiê e salvamento | Clique no toggle e preservação durante a interação não testados em navegador |
| Coleções | Testes do contrato de storage: salvar, reler dados serializados, remover, IDs inválidos, corrupção e falhas | Reload e duas abas reais não executados |
| Dossiê | Revisão do ciclo de vida e novo teste SSR de conteúdo/rodapé e erro | Esc, foco, rolagem e backdrop reais pendentes |
| Navegação | SSR dos seis destinos, área ativa, menu Mais e HTTP dos links | Histórico, toque e teclado reais pendentes |

A persistência continua somente no navegador, na chave spyad:collections:v1. O teste de releitura do contrato de armazenamento não equivale a recarregar uma página real. Nenhuma integração ou autenticação foi adicionada.

## Verificações executadas

Ambiente: Node v24.22.0, npm 11.19.1, Next 16.4.4. Dependências existentes e package-lock.json preservados.

| Comando | Resultado |
| --- | --- |
| npm ci --offline --no-audit --no-fund | Exit 0; 359 pacotes |
| npm run lint | Exit 0, sem avisos finais |
| npm run typecheck | Exit 0 |
| npm test | Exit 0; 38 testes, 38 passaram, 0 falhas |
| npm run build | Exit 0; / e /_not-found estáticos |
| npm start | Build local iniciou em 127.0.0.1:3220 |
| npm run test:http | Exit 0; SSR, seis destinos, CSS servido, cabeçalho e 404 |

Os 38 testes incluem 21 de contraste, 9 de domínio/storage e 8 de renderização SSR. O novo teste cobre ações e erros fora da região rolável e estado acessível de salvar/remover. Não executa layout nem efeitos de navegador. Houve segunda inspeção do escopo do CSS para preservar inclusive o espaçamento dos estados vazios; o build foi refeito depois dessa inspeção e o teste HTTP foi repetido sobre o novo servidor.

O npm ci exibiu o aviso já conhecido de depreciação do ESLint 9.39.5; não houve atualização de dependências. Não foi feita auditoria de vulnerabilidades online.

Logs desta rodada: [evidencias/homologacao-sprint-1-1/](evidencias/homologacao-sprint-1-1/).
SHA256 do lockfile preservado: `81751C4144E8F3248C17858F0EA74A2C43811F12062F8BF6508733D53F696CA3`.

## Navegador, viewport e zoom

Foi tentado `cua.listBrowsers()` nesta rodada. Resultado: `The browser access host is unavailable`. Portanto, não foram executadas novas capturas, emulação de viewport, cliques, teclado, reload ou zoom no navegador. A aprovação visual anterior relatada pelo cliente não foi usada como prova de execução desses testes.

| Verificação solicitada | Estado |
| --- | --- |
| 390 px, celular | Pendente em navegador |
| 820 px, tablet | Pendente em navegador |
| 1024 px | Pendente em navegador |
| 1366 px, altura útil reduzida | Pendente em navegador |
| Zoom 200%, cortes e overflow horizontal | Pendente em navegador |
| Salvar → Coleções → recarregar | Contrato lógico testado; fluxo real pendente |
| Alternar galeria/lista e pesquisar | Lógica e SSR testados; interação pendente |
| Esc e retorno de foco | Código preservado e inspecionado; interação pendente |
| Rodapé sempre acessível e conteúdo independente | Estrutura implementada/testada por SSR; geometria e toque pendentes |

Não foram inventadas capturas nem testes visuais aprovados.

## Roteiro curto para encerrar a homologação

Com npm start ativo, abrir http://127.0.0.1:3220:

1. Em #explorer, salvar Marca Exemplo A. Abrir #collections e recarregar: ela deve permanecer; remover e recarregar: deve desaparecer.
2. Pesquisar VIDEO instagram e PONTO VISTA. Conferir um resultado em cada caso; combinar Facebook + Vídeo para obter Marca Exemplo C. Alternar Lista/Galeria com esses filtros e limpar tudo para recuperar três exemplos.
3. Abrir o dossiê, rolar a área central e confirmar que fechar e salvar permanecem acessíveis sem cobrir a última informação. Salvar/remover, depois fechar com Esc e conferir foco no botão original.
4. Fazer uma seleção de texto e soltar fora do modal: não deve fechar. Clicar inteiramente no backdrop: deve fechar.
5. Em modo responsivo, conferir 390×844, 820×1180, 1024×768 e 1366×768. Capturar Explorer e dossiê em cada um, incluindo o fim do conteúdo central e o rodapé.
6. A 1366 px, mudar zoom do navegador para 200%. Percorrer Tab/Shift+Tab e conferir ausência de cortes ou rolagem horizontal. Retornar a 100% ao terminar.
7. No celular, testar Mais e os três destinos adicionais; no tablet, testar todos os destinos da rail.

Para uma matriz mais ampla e testes de storage corrompido/duas abas, o [roteiro anterior](evidencias/sprint-1-1/HOMOLOGACAO-MANUAL.md) continua válido. Nenhum desses passos foi marcado como executado nesta rodada.

## Arquivos alterados

Código/testes:
- src/components/ad-detail.tsx
- src/app/globals.css
- tests/components.test.mjs

Documentação:
- docs/SPRINT-1-1-HOMOLOGACAO-FINAL.md
- docs/evidencias/homologacao-sprint-1-1/*.txt
- AUDITORIA-SPYAD-SPRINT-1.md (continuação, sem remover histórico)
- README.md e docs/SPRINT-1-1-VISUAL-EXCELLENCE.md (links para esta rodada)

## Decisão para aprovação

As correções pontuais estão concluídas e a suíte técnica passou. A homologação final permanece aberta exclusivamente pelas verificações reais de navegador descritas acima. Não se recomenda considerar a Sprint 1.1 integralmente encerrada nem criar sprint-2-creative-lab com base em uma aprovação visual não executada. Após resolver as pendências e obter aprovação do usuário, a próxima branch poderá partir da versão aprovada.
