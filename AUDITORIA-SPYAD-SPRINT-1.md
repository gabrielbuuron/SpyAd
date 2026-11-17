# Auditoria SpyAd — Sprint 1.0 (parcial)

## Escopo
Branch exclusiva `sprint-1-foundation`. Nenhum merge, deploy ou conexão externa.

## Inventário inspecionado
`package.json`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `eslint.config.mjs` e documento de especificação.

## Achados
- **Alto:** ausência de evidência de lint, typecheck, build e testes em navegador. **Pendente.**
- **Médio:** navegação móvel omitia Coleções e Configurações. **Corrigido no código** com navegação rolável horizontalmente, incluindo todas as áreas.
- **Médio:** tela inicial abria Ad Explorer, divergindo do fluxo acordado. **Corrigido** para Dashboard, que ainda é um placeholder.
- **Médio:** tipografia e controles tinham hierarquia limitada. **Refinamento parcial aplicado** com stack local de fontes, escala fluida, line-height, foco e área mínima de toque.
- **Médio:** arquivo de página monolítico, coleções voláteis e telas incompletas. **Pendentes.**
- **Médio:** galeria sem criativos reais. **Aceito como demonstração**, com indicação explícita de conteúdo ilustrativo.

## Alterações realizadas nesta rodada
- `src/app/page.tsx`: entrada no Dashboard e acesso móvel a todas as seções.
- `src/app/globals.css`: hierarquia tipográfica, fallback de fontes, legibilidade e alvos de toque.

## Verificações
- Inspeção estática dos arquivos: **realizada**.
- Instalação de dependências e lockfile: **não executada**.
- `npm run lint`: **não executado**.
- `npm run typecheck`: **não executado**.
- `npm run build`: **não executado**.
- Testes automatizados e navegador real (320 a 1440 px, tablet retrato/paisagem, zoom 200%): **não executados**.
- Capturas de tela: **não disponíveis**.

## Próxima etapa obrigatória
Executar o prompt em `docs/SPRINT-1-AUDITORIA-E-REFINAMENTO.md` em um ambiente Codex com checkout e execução de comandos. Separar componentes, implementar persistência demonstrativa, validar lint/typecheck/build e navegação em dispositivos. Não marcar a sprint como concluída sem evidências. Não iniciar Sprint 2.
