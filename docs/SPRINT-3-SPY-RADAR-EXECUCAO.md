# SpyAd — Sprint 3.0: Spy Radar (execução)

## Objetivo
Entregar um módulo Spy Radar funcional em modo demonstração, que permita cadastrar referências observáveis, registrar snapshots de mudanças, comparar versões, consultar timeline e administrar alertas locais. Sem coleta real nesta sprint.

## Base e isolamento
- Branch: `sprint-3-spy-radar`
- Base: `4c19eda42f761655bd99c6df43d14b92e39a4f93` (Sprint 2.2)
- Preservar main, branches anteriores, Signal S, Creative Lab e os testes existentes.
- Não fazer merge, push, deploy ou conexões externas sem aprovação.
- Antes de editar, conferir HEAD, árvore e arquivos atuais. Preservar alterações preexistentes.

## Produto e escopo
1. Radar deixa de ser uma tela apenas “Planejado”, passando a uma experiência demonstrativa explicitamente identificada.
2. Dashboard Radar com referências acompanhadas, mudanças registradas e itens que exigem revisão; números derivados apenas do dataset local, sem fingir dados de mercado.
3. Criar referência manual com nome, URL pública opcional, plataforma/origem declarada e notas. Validar URLs; não fazer fetch/crawl nem consultar serviços.
4. Snapshots versionados com data de registro, campos observáveis e proveniência: `demonstração` ou `registro manual`. Nunca apresentar horário de observação real sem coleta.
5. Timeline e comparação antes/depois, com diferenciação explícita entre alteração de criativo, texto, URL e status declarados. Distinguir “não informado” de “sem mudança”.
6. Filtros, busca, detalhes, estados vazios e navegação acessível; persistência local por workspace/browser, com esquema versionado e proteção contra registros inválidos.
7. Alertas **dentro do app**, baseados em alterações registradas localmente; não simular notificações externas, monitoramento contínuo ou alertas em tempo real.
8. Integração de navegação com Explorer/Coleções quando tecnicamente coerente, sem reescrever os módulos nem sugerir que os anúncios fictícios são observados externamente.
9. Dados de demonstração suficientes para explorar os estados, com botão claro de restaurar exemplos e separação entre dados demo e registros manuais.

## Fora de escopo
- Scraping, APIs Meta/TikTok, jobs agendados, webhooks, e-mail, WhatsApp, notificações push, IA classificadora, preços, ROAS, spend, receita, métricas privadas, bypass de bloqueios, autenticação ou backend.
- Não afirmar “monitorado agora”, “mudança detectada automaticamente” ou “alerta enviado” quando o evento é local/demonstrativo.
- Não instalar dependências de produção sem justificativa e aprovação.

## Design e engenharia
- Manter grafite/ciano/violeta discreto e Signal S canônico.
- Desktop 1366×768, tablet 820×1180 e mobile 390×844; testar 305 px como caso de estresse.
- Componentes reutilizáveis, tipos claros, estados carregando/erro/vazio, labels, foco, teclado, contraste, redução de movimento, sem overflow.
- Modelagem isolada para permitir futuramente um adapter de fontes reais com consentimento e políticas aplicáveis, sem implementá-lo agora.
- Evitar excesso de cards e painéis; priorizar legibilidade e ações claras.

## Testes e critérios de aceite
- Unitários: validação, diferenciação de proveniência, comparação determinística, ordenação, filtros, persistência, migração/recuperação de dados inválidos, alertas locais, reset.
- Integração: adicionar referência, registrar snapshot, comparar versões, ver alerta, navegar e persistir após reload.
- Executar `npm ci --no-audit --no-fund` (registrar que auditoria remota foi omitida), `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:http`.
- Não declarar QA de navegador executado sem evidências. Ambiente Codex apresentou bloqueios de GPU/CDP; disponibilizar roteiro manual ou suíte reproduzível em Chromium isolado, sem atrasar indevidamente entrega.
- Gerar `docs/SPRINT-3-SPY-RADAR-RELATORIO.md` e `docs/SPRINT-3-SPY-RADAR-HOMOLOGACAO.md` com alterações, resultados, limitações e screenshots reais apenas quando disponíveis.
- Commit somente na branch após validação; sem push/merge/deploy até aprovação.

## Segurança e observabilidade
- Tratar URLs e textos inseridos como dados não confiáveis; não renderizar HTML arbitrário nem executar scripts.
- Evitar armazenar informações pessoais sensíveis; não enviar dados a terceiros.
- A interface deve sempre identificar a origem de cada registro e as limitações da cobertura.
