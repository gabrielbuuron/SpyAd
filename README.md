# SpyAd — Sprint 1.0

Protótipo demonstrativo de inteligência publicitária. Sem credenciais, coleta, anúncios reais, APIs pagas ou autenticação.

## Executar localmente

Node 24 e npm 11.19.1.

```powershell
npm ci
npm run dev
```

Preview: http://127.0.0.1:3220

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm start
# Em outro terminal, com o servidor ativo:
npm run test:http
```

A navegação usa hashes: #dashboard, #explorer, #collections, #settings, #radar e #dna. Busca e filtros funcionam sobre três exemplos fictícios. Coleções persistem somente no navegador (localStorage), sem sincronização entre dispositivos. Configurações permite redefinir a coleção demonstrativa. Spy Radar e Offer DNA são áreas planejadas.

A migração Next 15→16, os testes executados e as limitações de validação visual estão em [AUDITORIA-SPYAD-SPRINT-1.md](AUDITORIA-SPYAD-SPRINT-1.md). Não houve deploy ou merge. A homologação visual continua pendente.
