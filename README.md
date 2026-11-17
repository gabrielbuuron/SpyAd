# SpyAd — Sprint 1.1

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

Refinamento atual: [Sprint 1.1 — Visual Excellence](docs/SPRINT-1-1-VISUAL-EXCELLENCE.md). O Explorer ganhou busca e ações claras, tokens tipográficos consolidados e navegação própria para tablet/celular. O menu Mais reúne Radar, DNA e Configurações no celular. Os 38 testes não substituem a homologação em navegador; novas capturas continuam pendentes. Veja o [roteiro manual](docs/evidencias/sprint-1-1/HOMOLOGACAO-MANUAL.md).

Rodada mais recente: [Homologação final da Sprint 1.1](docs/SPRINT-1-1-HOMOLOGACAO-FINAL.md). Dossiê com rodapé interno de ações e conteúdo rolável independente; verificações técnicas passaram, mas dispositivos, teclado, persistência real após reload e zoom ainda aguardam navegador.
