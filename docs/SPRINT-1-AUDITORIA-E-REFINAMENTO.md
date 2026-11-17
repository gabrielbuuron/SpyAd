# SpyAd — Auditoria cirúrgica e refinamento da Sprint 1.0

## Escopo confirmado
Trabalhar exclusivamente na branch `sprint-1-foundation`. Não modificar `main`, não fazer merge, não publicar na Vercel e não conectar serviços externos. Prioridade Meta Ads; TikTok e Google apenas previstos na arquitetura. Dados de demonstração sempre identificados.

## Diagnóstico inicial confirmado pela inspeção do código
- `src/app/page.tsx` concentra navegação, busca, dados, cartões e dossiê em um único componente; separar em componentes testáveis.
- `src/app/globals.css` usava Arial/Helvetica, tokens mínimos e estilos compactados; revisar sistema tipográfico e hierarquia visual.
- As áreas Dashboard, Spy Radar, Offer DNA e Configurações são placeholders, não telas completas.
- O estado de coleções usa `useState` e desaparece após recarregar; implementar persistência local demonstrativa com tratamento de erro, ou explicitar a limitação.
- O menu móvel não inclui Coleções nem Configurações; garantir acesso acessível.
- O projeto não contém evidência de build, lint, testes automatizados ou inspeção visual real.
- A galeria não contém criativos reais e usa placeholders, que devem continuar claramente marcados como ilustrativos.

## Prompt de execução para Codex
Atue como engenheiro sênior de frontend, especialista em design systems e auditor de qualidade. Leia todos os arquivos antes de alterar. Preserve a arquitetura existente onde for adequada. Entregue refinamento premium e funcional, sem reconstrução indiscriminada.

1. **Base técnica:** instalar dependências com lockfile reprodutível; executar lint, TypeScript e build; corrigir erros de forma rastreável. Não declarar sucesso sem logs.
2. **Tipografia:** definir escala fluida de títulos, corpo, números, labels e microcopy; escolher fontes com licenças adequadas, fallback local e boa leitura em português. Evitar dependência de fonte remota em tempo de execução. Validar acentos, pesos, espaçamento, truncamento e zoom 200%.
3. **Identidade:** consolidar tokens semânticos para superfícies, bordas, texto, acentos ciano e violeta seletivo; contraste WCAG AA para texto e controles; foco visível; ícones consistentes; sombras e gradientes discretos. Evitar neon excessivo e aparência de dashboard genérico.
4. **Componentes:** separar AppShell, Sidebar, BottomNav, SearchBar, FilterPanel, AdCard, AdListRow, AdDetail, EmptyState e DemoBadge. Preservar a troca galeria/lista e implementar estados vazios e feedback de ações.
5. **Dispositivos:** testar 320/375/390/430 px, tablet 768/820/1024 px e desktop 1280/1440 px, retrato e paisagem. iPad deve ter experiência própria com toque, painéis adaptativos e navegação sem itens inacessíveis. Testar teclado e zoom.
6. **Fluxos:** busca sem diferenciar maiúsculas/minúsculas, alternância galeria/lista, abertura/fechamento de dossiê, salvar/remover coleção e acesso a todas as áreas no mobile. Não exibir ações falsas como operacionais.
7. **Integridade:** não inventar métricas de escala, faturamento, engajamento ou investimento. Distinguir observações de inferências. Sem scraping, APIs pagas, autenticação fictícia apresentada como real ou dados privados.
8. **Verificação:** executar lint, typecheck, build e testes dos fluxos; testar navegador real quando disponível. Capturar evidências de desktop, tablet e celular. Se navegador indisponível, registrar claramente como pendência.
9. **Entrega:** criar `AUDITORIA-SPYAD-SPRINT-1.md` com inventário, achados classificados por gravidade, arquivos alterados, comandos executados, resultados, capturas quando disponíveis e checklist de pendências. Não iniciar Sprint 2 antes de finalizar esta revisão.

## Critérios de aceite
Nenhum erro bloqueante de build; nenhuma navegação inacessível no celular; modos galeria/lista e busca operacionais; tipografia legível; responsividade verificada ou limitação documentada; dados fictícios sinalizados; nenhum deploy ou merge.
