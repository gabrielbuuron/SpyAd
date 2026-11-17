# SpyAd — Sprint 2.2: Product Experience & Creative Lab Refinement

## Contexto
Branch exclusiva `sprint-2-2-product-experience`, derivada do commit `07eb95007ae70c6155569c73fdb6e2501131dd0d` da Sprint 2.1. As Sprints 1.1, 2.0 e 2.1 tiveram suites automatizadas reportadas como aprovadas, mas a homologação interativa de navegador continua parcial. A captura desktop 1366×768 enviada pelo usuário mostra o Dashboard com Signal S, sidebar estreita, título de área duplicado entre cabeçalho e corpo, rótulos "Planejado" próximos das bordas e números de métricas com composição melhorável. Essas observações são visuais, não bugs comprovados por testes.

## Objetivo
Melhorar usabilidade e consistência da experiência sem redesenhar a marca, criar dados fictícios adicionais ou alterar os motores de processamento de imagem.

## P0 — inspeção antes de editar
1. Confirmar HEAD e branch, ler código atual, docs e testes. Conferir todos os sete destinos e componentes compartilhados. Inspecionar a captura de referência se estiver disponível no ambiente; se não, usar as observações deste documento e não afirmar comparação pixel a pixel.
2. Mapear hierarquia, larguras, overflow, foco, estados, componentes e responsividade existentes; escolher alterações mínimas justificadas.

## P0 — refinamentos
1. Sidebar desktop: revisar largura, distribuição e truncamento; "Workspace de estudo" e estados "Planejado" devem caber sem recortes, sem desperdiçar espaço da área principal. Tablet rail e mobile bottom nav devem manter sete destinos acessíveis.
2. Header/breadcrumb: reduzir redundância entre "SpyAd / Visão geral" e H1 "Visão geral"; preservar orientação de contexto e acessibilidade. Não remover H1.
3. Dashboard: refinar alinhamento, rótulos e números dos três indicadores demonstrativos; preservar sinalização explícita de dados fictícios. Ajustar hero e CTAs para janelas baixas e zoom.
4. Creative Lab: inspecionar a tela completa e melhorar apresentação das etapas, upload, preview, estados, autorização, painel de inspeção, comparação e exportação; mensagens honestas sobre metadados não verificáveis, conversão, privacidade e formato. Não adicionar promessas de segurança ou compatibilidade. Não alterar lógica de parsers/encoder, worker, hash, limites ou limpeza; se bug funcional real for descoberto, documentar e pedir decisão em vez de alterar silenciosamente.
5. Explorer/Coleções/Dossiê: revisar consistência visual de ações, legibilidade, scroll e foco, sem alterar dados ou comportamento central.
6. Marca Signal S: manter geometria e assets da Sprint 2.1; apenas ajustes de tamanho e aplicação em interface se necessários. O símbolo vetorial ainda depende de comparação com a segunda proposta aprovada; não declarar marca final homologada.
7. Acessibilidade: foco visível, alvos de toque >=44px onde possível, estados aria coerentes, contraste, teclado e reduced-motion; evitar animações desnecessárias.
8. Responsividade: alvos 390×844, 820×1180, 1024×768 e 1366×768; zoom 200%; evitar overflow horizontal e botões cortados. Não afirmar verificação em browser sem execução real.

## Guardrails
- Não modificar `main`, `sprint-1-foundation`, `sprint-2-creative-lab`, `sprint-2-1-brand-experience`.
- Sem merge, deploy, integração externa, coleta de dados, biblioteca nova desnecessária ou alteração de dependências sem justificativa.
- Sem criar funcionalidades "Spy Radar" ou "Offer DNA" falsas; continuar marcadas como planejadas.
- Preservar os 77 testes da base; `npm ci`, lint, typecheck, testes, build e HTTP. Guardar logs reais e hashes dos arquivos de núcleo do Lab.
- Não substituir homologação real de canvas/worker/download por testes Node/Sharp ou SSR.

## Entregáveis
- Commits exclusivos na branch, com alterações cirúrgicas e documentação.
- `docs/SPRINT-2-2-PRODUCT-RELATORIO.md`: inventário, decisões, antes/depois, arquivos, comandos, resultados, SHA, pendências e riscos.
- `docs/SPRINT-2-2-HOMOLOGACAO.md`: roteiro curto de verificação em browser, incluindo navegação, Creative Lab, Explorer, persistência e responsive.
- Se navegador real disponível, screenshots desktop/mobile/tablet com viewport e zoom; se indisponível, registrar explicitamente.
- Não publicar nem declarar aceite final sem revisão do usuário.
