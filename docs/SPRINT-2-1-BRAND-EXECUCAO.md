# SpyAd — Sprint 2.1: Signal S / Brand & Product Experience

## Origem e restrições
Branch: `sprint-2-1-brand-experience`. Base imutável de referência: `404e30a5f9f586be1191f6d1bc1ee05a7de4102a` (Sprint 2.0 P0). Não modificar `main`, `sprint-1-foundation` ou `sprint-2-creative-lab`. Sem merge, deploy, integração externa ou mudança funcional no processamento de imagens. A Sprint 2.0 tem 68 testes registrados, mas sua homologação real em browser (canvas, worker, download, teclado e dispositivos) permanece pendente. Não declarar aprovação visual ou funcional não realizada.

## Objetivo
Integrar a direção de marca **Signal S — segunda proposta aprovada pelo usuário**: símbolo S geométrico associado a conexões/sinais de dados, wordmark SpyAd com `Spy` claro e `Ad` ciano, grafite profundo, ciano principal, violeta pontual. Refinar experiência de produto sem perder legibilidade, sobriedade ou confiança.

**Importante:** os estudos visuais aprovados em conversa não são arquivos SVG vetoriais. Não afirmar que o SVG implementado é uma reprodução exata de imagem não disponível no repositório. Criar uma interpretação vetorial original, rastreável, e solicitar aprovação comparativa por captura antes de declarar o logotipo oficial final. Se houver asset fornecido pelo usuário, priorizá-lo. Evitar logos semelhantes a marcas registradas; verificar distinção visual manualmente antes de publicar.

## P0: entregáveis
1. Criar componente reutilizável `BrandMark` com símbolo Signal S, wordmark, lockup horizontal e variações compactas. SVG original inline ou asset versionado, acessível; tokens para cores e versão monocromática. Sem filtros pesados nem efeitos de neon.
2. Criar favicon e ícone de app/PWA a partir do mesmo sistema, com versão adequada a 16, 32, 180, 192 e 512 px; preferir SVG para vetor e PNGs gerados de maneira reprodutível quando necessário. Verificar renderização e manifesto existente antes de alterar; não afirmar suporte PWA sem requisitos de instalação verificados.
3. Aplicar marca em sidebar, cabeçalhos, navegação mobile/tablet e estados de interface apropriados. Não ocupar espaço excessivo em telas pequenas.
4. Refinar hierarquia de tipografia e espaçamento onde houver inconsistência real; preservar a identidade grafite/ciano, foco WCAG AA e reduced motion. Não trocar todas as fontes indiscriminadamente. Fontes locais ou fallback confiável; sem dependência remota em tempo de execução.
5. Creative Lab: estados importar/inspecionar/limpar/verificar/exportar claros, mensagens confiáveis, diferenciação de campos verificados e não verificáveis. Melhorar apresentação, não mudar parsers, encoders, limites ou regras de privacidade.
6. Dashboard/Explorer/Coleções/Dossiê: alinhamento de marca, consistência de ícones e ações, feedback de botões; preservar dados demo explicitamente marcados. Não transformar placeholders em funcionalidades falsas.
7. Preparar uma página de guia de marca em `docs/BRAND-SPYAD-SIGNAL-S.md`: conceito, variações, paleta com hex, tipografia, margens de proteção, tamanhos mínimos, fundos claros/escuros, exemplos de aplicação, limitações e licença/atribuição de eventuais assets. Documentar como reproduzir/exportar ícones.
8. Capturar comparações visuais em desktop/tablet/mobile **apenas se navegador real estiver disponível**. Se não estiver, registrar pendência em relatório e orientar homologação posterior.

## Qualidade e aceite
- Nenhuma regressão nas 68 verificações anteriores; `npm ci`, lint, typecheck, testes, build e HTTP com logs reais.
- Sem links quebrados, sem overflow horizontal aparente, sem ações fictícias apresentadas como ativas.
- Contraste AA para textos e botões; foco visível; teclado e zoom 200% quando navegador disponível; 390, 820, 1024 e 1366 px.
- Favicon legível a 16 px e símbolo reconhecível sem wordmark; variantes claro/escuro e monocromático.
- Sem upload de arquivos do Creative Lab, trackers, bibliotecas pagas ou novas chamadas externas.
- Criar `docs/SPRINT-2-1-BRAND-RELATORIO.md` com inventário, arquivos, SHA, testes e logs, capturas quando disponíveis, pendências explícitas. Não aprovar a sprint nem publicar sem revisão do usuário.

## Sequência de execução para Codex
1. Confirmar branch e SHA, inventariar código e assets existentes.
2. Criar proposta vetorial original e guia de marca.
3. Integrar componentes e assets com alterações cirúrgicas.
4. Refinar visual e microcopy; preservar rotas e fluxos.
5. Executar verificações e documentar evidências.
6. Entregar preview local, SHA e screenshots (se possível), solicitando aprovação da marca.
