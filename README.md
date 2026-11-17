# SpyAd — Sprint 2.0 / Creative Lab

Laboratório local para imagens próprias/autorizadas: importar, inspecionar, re-encodificar, reinspecionar e exportar sem sobrescrever o original. JPEG, PNG e WebP estáticos; até 10 MiB, 8 MP e 8.192 px por lado. Sem upload ou armazenamento automático.

## Rodar localmente

Node 24, npm 11.19.1.

```powershell
npm ci
npm run dev
```

Abrir http://127.0.0.1:3230/#creative-lab. Para homologar a política de produção, executar npm run build e npm start.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm start
# Em outro terminal:
npm run test:http
# Arquivos sintéticos para homologação:
node tests/lab-fixtures.mjs
```

Fixtures geradas em .lab-fixtures/ (fora do Git). A suíte atual tem 68 testes, incluindo os 38 anteriores. A rasterização automatizada usa adaptador Node/Sharp já presente no lockfile; não homologa o canvas de Chrome/Safari.

[Relatório completo do P0](docs/SPRINT-2-CREATIVE-LAB-RELATORIO.md) · [Homologação manual](docs/SPRINT-2-CREATIVE-LAB-HOMOLOGACAO.md).

O browser usa ImageBitmap, worker/canvas e verificação local. APNG/WebP animado são bloqueados. Campos não cobertos não recebem garantia de remoção. Compressão, cores, precisão, perfil ICC e transparência podem mudar; JPEG compõe sobre branco. Não há remoção de marca d’água nem promessa de aprovação de anúncios.

A navegação mantém Dashboard, Explorer, Radar, DNA, Coleções e Configurações; Creative Lab é o sétimo destino, em Mais no celular. Coleções demonstrativas continuam persistidas localmente; arquivos do Lab ficam somente em memória. Não há autenticação ou APIs de anúncios conectadas.

Histórico preservado: [Sprint 1.1](docs/SPRINT-1-1-VISUAL-EXCELLENCE.md), [última rodada técnica](docs/SPRINT-1-1-HOMOLOGACAO-FINAL.md) e [auditoria](AUDITORIA-SPYAD-SPRINT-1.md). A homologação real de navegador da Sprint 1.1 continua parcial; a Sprint 2 também aguarda testes de browser e revisão do usuário. Nenhum merge/deploy foi feito.
