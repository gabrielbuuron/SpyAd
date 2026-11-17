# SpyAd — Sprint 2.1 / Signal S

Identidade vetorial e experiência de produto sobre o Creative Lab P0. A direção Signal S recebe interpretação original em SVG, pendente de comparação com o estudo escolhido e aprovação final do usuário.

## Rodar

Node 24, npm 11.19.1:

```powershell
npm ci
npm run dev
```

Preview: http://127.0.0.1:3240 (Creative Lab em #creative-lab).

```powershell
npm run brand:generate
npm run brand:generate -- --proof
npm run lint
npm run typecheck
npm test
npm run build
npm start
# Em outro terminal:
npm run test:http
```

[Guia da marca](docs/BRAND-SPYAD-SIGNAL-S.md) · [Relatório técnico](docs/SPRINT-2-1-BRAND-RELATORIO.md) · [Homologação](docs/SPRINT-2-1-BRAND-HOMOLOGACAO.md).

Assets canônicos em public/brand/. A prancha gerada fica em .brand-review/ (fora do Git); não é captura da aplicação. Manifesto e ícones não significam PWA instalada/offline homologada.

A suíte atual tem 77 testes, mantendo os 68 anteriores. O núcleo de processamento do Creative Lab e o lockfile permanecem intactos. Só a apresentação do diagnóstico foi refinada. Não há novas APIs, fontes remotas, trackers ou upload. A marca da SpyAd não é aplicada a arquivos importados/exportados.

O Creative Lab continua aceitando JPEG, PNG e WebP estáticos de arquivos próprios/autorizados, com limites e metadados cobertos descritos no [relatório P0](docs/SPRINT-2-CREATIVE-LAB-RELATORIO.md). Os testes de imagem usam adaptador Node/Sharp e não homologam canvas/worker nativo.

Histórico: [Sprint 1.1](docs/SPRINT-1-1-HOMOLOGACAO-FINAL.md), [Sprint 2.0](docs/SPRINT-2-CREATIVE-LAB-RELATORIO.md). As homologações reais de navegador continuam pendentes. Nenhum merge ou deploy foi realizado.
