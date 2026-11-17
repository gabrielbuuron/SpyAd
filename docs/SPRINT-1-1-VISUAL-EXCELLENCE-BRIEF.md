# SPYAD — SPRINT 1.1: VISUAL EXCELLENCE / EXECUTION BRIEF

## Missão
Atue como Staff Frontend Engineer, Product Designer de SaaS de inteligência publicitária, especialista em design systems, acessibilidade e QA. A tarefa é realizar um refinamento profundo, cirúrgico e coerente do produto SpyAd, não uma troca cosmética de cores. Faça a implementação de ponta a ponta, execute testes, revise no navegador e documente o que realmente validou.

## Fonte da verdade e segurança
- Repositório gabrielbuuron/SpyAd, branch EXCLUSIVA sprint-1-foundation, base mínima 4cab0fd07af8c69b1f961fe3d80fbed95f747614. Confira HEAD antes de editar. Não tocar em main, não fazer merge, não publicar na Vercel, não conectar serviços externos.
- Leia README, AUDITORIA-SPYAD-SPRINT-1.md, docs/SPRINT-1-AUDITORIA-E-REFINAMENTO.md, package.json, globals.css, todos os componentes, hooks, testes e fixtures antes de alterar. Respeite a migração existente para Next 16 e o lockfile; não atualizar dependências sem justificativa.
- Mantenha Meta Ads como plataforma do MVP. TikTok/Google somente previsão, sem simular integração. Toda informação é DEMONSTRATIVA, sem dados de faturamento, ROAS, gasto ou escala de concorrentes. Não inventar resultados.
- Preserve todos os fluxos aprovados: hash navigation, seis seções, Dashboard, Explorer, busca sem caixa/acentos, filtros, galeria/lista, dossiê acessível, persistência local, avisos de falha de storage e estados vazios. Não remover recursos para melhorar aparência.

## Evidência visual fornecida pelo cliente
Desktop Opera em Windows, viewport aproximadamente 1366×768 (área de app menor por barras do navegador e sistema). Há três capturas: Dashboard rolada, Explorer rolado e Explorer no topo. Na última: sidebar esquerda ~245 px; breadcrumb e cabeçalho com respiro excessivo; título 'Ad Explorer'; faixa de aviso demo; campo de busca e alternância galeria/lista; filtro colapsado; 3 cards em colunas. Observações concretas: microtextos e labels muito pequenos; contraste e densidade de informação desiguais; muita altura consumida antes dos resultados; CTA principal de pesquisa pouco expressivo; cards com ações discretas; sidebar longa com scroll interno; marca correta mas ainda pouco memorável. NÃO confundir barras do Opera, ícones laterais do navegador, taskbar do Windows e marca d'água de ativação do Windows com elementos da aplicação. Não tentar alterar esses elementos. As capturas são referências, não prova de falhas de tablet/mobile.

## Direção de arte
SpyAd deve transmitir inteligência publicitária premium: editorial-tech, preciso, sóbrio, confiável e ágil. Visual próprio, não dashboard genérico, nem neon/cyberpunk excessivo. Base carvão/navy profundo, camadas de superfície distinguíveis, acento ciano elétrico controlado e violeta apenas secundário. Proporções e alinhamentos consistentes. Componentes com microinterações discretas e responsivas. Preferir legibilidade a estética de microtextos. Não inserir gráficos/métricas falsas para preencher espaço.

### 1. Sistema tipográfico
- Criar escala semântica documentada: display, H1, H2, H3, body, small, label, overline, numerais tabulares; pesos e line-height consistentes, fluidos e adaptativos.
- Selecionar fonte de interface adequada ao português (acentos e números) com fallback confiável e sem dependência de CDN em runtime; se fonte local/empacotada não estiver legalmente disponível, usar stack de sistema de alto padrão, sem baixar fonte sem licença.
- Remover microtextos difíceis de ler. Revisar sidebar, status, badges, metadados dos anúncios, filtros, textos do card, botões, labels e breadcrumbs. Não usar all caps com letter-spacing exagerado para informações essenciais.
- Garantir zoom 200%, overflow e truncamentos com tooltip ou quebra adequada onde necessário.

### 2. Layout e densidade
- Refinar shell, sidebar e header: aproveitar a largura do desktop sem comprometer leitura; harmonizar margens, grids e alinhamento; sidebar compacta e legível, com grupos e estados ativos claros. Não esconder destinos.
- Reduzir a altura ociosa do topo do Explorer, mantendo uma hierarquia clara: contexto > título > pesquisa > filtros > resultados. A faixa 'demo' pode ser mais compacta, mas sempre inequívoca.
- Dashboard: hero orientado à ação, com CTA 'Explorar anúncios' e informação demonstrativa honesta; reduzir decoração gratuita e aumentar valor da primeira dobra; referências e indicadores calculados apenas das fixtures.
- Explorer: busca deve ser elemento central; modo galeria/lista acessível, filtros com estado ativo e limpeza fácil; resultados visíveis sem rolagem desnecessária na altura de ~768 px.
- Cards: mesma lógica e dados em galeria/lista, hierarquia marca/plataforma/formato/conceito, preview editorial consistente e bem proporcionado, salvar e abrir dossiê óbvios; estados hover/focus/pressed/saved/empty; não fingir playback de vídeo. Evitar altura desnecessária e textos cortados.
- Dossiê: cabeçalho, conteúdo, evidências e CTA organizados; botão fechar, Esc, backdrop, scroll interno e retorno de foco; nenhuma afirmação de performance não verificável.
- Configurações, Radar, DNA e Coleções: coerência visual e honestidade sobre funcionalidades ainda não lançadas.

### 3. Responsividade por dispositivo
- Validar 320, 375, 390, 430, 768, 820, 1024, 1280, 1366, 1440 px; retrato e paisagem quando aplicável.
- iPhone/Android: bottom nav com seis destinos legíveis e acessíveis; não depender de hover; respeitar safe-area, teclado virtual, campos e modal.
- Tablet/iPad: desenhar comportamento próprio (não apenas desktop espremido), uso touch, grids e painéis adequados, orientações portrait/landscape; avaliar se seis itens cabem ou se é necessário padrão de navegação mais apropriado, preservando acesso integral.
- Desktop: consistência em viewport com barras do navegador e altura útil reduzida; evitar scroll aninhado sem necessidade.
- Alvos interativos idealmente >=44×44 CSS px; foco visível, reduced motion, contraste AA; sem overflow horizontal inadvertido.

### 4. Qualidade funcional e acessibilidade
- Garantir que busca, filtros e view toggle continuem funcionando com teclado e mouse; nenhum controle decorativo que pareça funcional.
- Testar coleções: salvar/remover, reload, duas abas, storage indisponível/corrompido, redefinição explícita.
- Validar semântica, aria-current, aria-pressed, labels, anúncio de erros, ordem de tabulação, modal, skip link, contraste WCAG AA e zoom 200%.
- Usar CSS tokens e componentes reutilizáveis; reduzir duplicação; não instalar bibliotecas apenas por estética. Preservar performance, SSR e hidratação.

## Processo obrigatório
1. Inventariar código e dependências, registrar riscos e criar plano curto antes de editar.
2. Aplicar alterações incrementais, com commits claros apenas na branch da sprint. Evitar reescrita indiscriminada.
3. Rodar npm ci (ou equivalente documentado), npm run lint, npm run typecheck, npm test, npm run build e teste HTTP. Registrar logs, versões Node/npm e exit codes. Não declarar sucesso sem execução.
4. Abrir no navegador real se disponível e capturar desktop (Dashboard topo, Explorer topo, galeria, lista, dossiê), mobile e tablet em múltiplas larguras. Verificar cliques, teclado, zoom 200%, estados vazios e recarga. Se não houver navegador, registrar limitação e preparar instruções exatas de homologação manual; jamais inventar capturas.
5. Revisar visualmente o resultado, corrigir pontos de desalinhamento e regressões e repetir verificações.
6. Criar docs/SPRINT-1-1-VISUAL-EXCELLENCE.md com antes/depois descritivo, inventário de arquivos, decisões tipográficas, tokens, matriz de viewport, testes reais, evidências e pendências. Atualizar AUDITORIA-SPYAD-SPRINT-1.md sem apagar histórico.
7. Relatar resumo objetivo e SHA final. Não iniciar Sprint 2 nem deploy. A aprovação final é do usuário.

## Critérios de aceite
- Identidade coesa, legibilidade melhorada e hierarquia editorial clara em todas as seis áreas.
- Explorer mostra busca, filtros e início dos resultados com uso eficiente da primeira dobra no desktop.
- Galeria/lista, filtros, dossiê e coleções sem regressão.
- Sem overflow e sem destinos inacessíveis em dispositivos testados; pendências não testadas claramente documentadas.
- Build, lint, typecheck e testes aprovados com evidência; nenhum dado real ou integração simulada como verdadeira.
