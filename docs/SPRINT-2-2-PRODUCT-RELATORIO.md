# Sprint 2.2 — Product Experience & Creative Lab Refinement

## Estado

Implementação concluída na branch `sprint-2-2-product-experience`, partindo do commit `b034a02d5e0edcdd9d5d36ecd8e20adbbc158f48`. A homologação visual em navegador e o fluxo real de canvas, worker e download ainda precisam de conferência manual.

## Diagnóstico do ambiente

- Node `v24.22.0` e npm `11.19.1`, conforme o intervalo indicado em `package.json`.
- Registry `https://registry.npmjs.org/`. `omit` vazio, `production` nulo, `offline` falso e proxy npm não configurado.
- O lockfile usa `lockfileVersion: 3`, inclui o pacote raiz `spyad@0.1.0`, todas as 11 dependências e devDependencies do manifesto, sem divergências de versão ou entradas `resolved` sem integridade.
- Durante as primeiras tentativas de recuperação, `npm ci` encontrou `ENOTEMPTY` ao limpar diretórios dentro de `node_modules`. As tentativas sobrepostas deixaram uma instalação parcial. O conteúdo anterior foi preservado em `%TEMP%\SpyAd-sprint-2-2-node_modules-recovery-backup`.
- A auditoria npm tentou acessar `https://registry.npmjs.org/-/npm/v1/security/advisories/bulk` e recebeu `EACCES` de rede. A instalação limpa foi concluída com `npm ci --no-audit --no-fund`, que instalou 359 pacotes e manteve o lockfile intacto. A auditoria remota de vulnerabilidades não foi executada.

## Falhas de integridade da marca

O Git estava configurado com `core.autocrlf=true`, sem atributos de fim de linha para os SVGs de marca e o manifesto. O checkout materializava `CRLF`, enquanto `scripts/generate-brand-assets.mjs` escreve `LF`. O teste vetorial compara o conteúdo exato, e o teste de reprodutibilidade calcula SHA-256 dos bytes antes e depois da geração. Por isso, os dois testes falhavam apesar de o desenho e os parâmetros de geração serem iguais. O manifesto também era reescrito pelo gerador.

Foi adicionado `.gitattributes` com `eol=lf` para `public/brand/*.svg` e `public/manifest.webmanifest`. Os hashes esperados, o código de geração e a geometria Signal S não foram alterados. Os 8 testes de marca passaram depois da correção e os assets gerados durante os testes foram restaurados antes da verificação final.

## Alterações de produto

- Sidebar desktop recebeu mais largura útil, espaçamento mais contido e indicadores “Planejado” com borda e largura intrínseca. Textos podem quebrar sem empurrar a área de conteúdo. O rail tablet e a navegação móvel continuam apresentando os sete destinos.
- O breadcrumb do Dashboard omite o rótulo repetido “Visão geral”, mantendo o H1 e o nome SpyAd. Os rótulos de contexto foram atualizados para Sprint 2.2.
- Os indicadores do Dashboard alinham ícone, rótulo e valor, reservam altura estável para os números e usam algarismos tabulares. O hero e as métricas ocupam menos espaço em janelas desktop baixas.
- O Creative Lab reduz espaçamentos da privacidade, etapa e zona de importação abaixo de 800 px de altura. As etapas concluídas mostram marca de seleção, e a etapa atual mantém destaque. A inspeção, comparação, autorização, resultado e exportação continuam usando os estados e mensagens existentes.
- A navegação, os estados de armazenamento, busca, filtros, dossiê e controles foram revisados nos componentes compartilhados. A suíte automatizada cobre os fluxos e contraste registrados abaixo.

O núcleo do processamento de imagens não foi modificado. Valores SHA-256 finais dos arquivos de processamento:

| Arquivo | SHA-256 |
|---|---|
| `src/features/creative-lab/use-creative-lab.ts` | `e37eda9d6afb31d20ee03095d233472697d414886d4089a4391b225a45c683d4` |
| `src/features/creative-lab/types.ts` | `4c9ef9466dde2257dc18c0744c9e52694bc3db4c1078b41acb79cd028f842ab7` |
| `src/features/creative-lab/lib/binary.mjs` | `d611f92ca5c576c9504b7e0be725b2ee1f6dc3b12f459f29c30e7c8780bd3f42` |
| `src/features/creative-lab/lib/exif.mjs` | `8f860a4f30b5bc52dbe5e2b6d87a05d00186ccf549504476eeba2e7d2d7d5bc5` |
| `src/features/creative-lab/lib/file-validation.mjs` | `00d5e777c66e0e0d53075069dadd9ff1fe55f830474e2935d90f358d64ae114d` |
| `src/features/creative-lab/lib/inspect-image.mjs` | `725946b470eee2e0630a57eac4cc23e74eb8e01802bd5afef9f298369ab4c1c3` |
| `src/features/creative-lab/lib/sanitize-image.mjs` | `f14f5bee8c1ab237483dcf249d175ce3bca5a81154812952114a34c0523bb539` |
| `src/features/creative-lab/lib/verify-image.mjs` | `17bf345e1e5606665986a48424cff4d921ea94f1ad6fad26a4ee5c3b9b5ee178` |
| `src/features/creative-lab/lib/run-job.ts` | `594bc134a866ea4be1f95a3242428f4f4dba7900c881a43fe65b6222344fab69` |
| `src/features/creative-lab/lib/browser-backend.ts` | `34ce535fc28cec9cf755036fe460fe94eb5ba1787a98191ea623add16deb6f75` |
| `src/features/creative-lab/lib/image.worker.ts` | `6199e6308430335ac2562b61d87511ba4cf06d97dea0257c98538c12abf7fcdd` |

## Arquivos modificados

- `.gitattributes`
- `next-env.d.ts` (arquivo de tipos gerado pelo Next.js durante o build)
- `src/app/globals.css`
- `src/components/app-shell.tsx`
- `src/components/sidebar.tsx`
- `src/features/creative-lab/components/creative-lab.tsx`
- `docs/SPRINT-2-2-PRODUCT-RELATORIO.md`
- `docs/SPRINT-2-2-HOMOLOGACAO.md`

`package.json`, `package-lock.json`, dados demonstrativos, arquivos do núcleo do Lab e assets geométricos da marca não foram alterados.

## Validação executada

| Comando | Resultado |
|---|---|
| `npm ci --no-audit --no-fund` | Passou, 359 pacotes instalados, lockfile inalterado. Auditoria remota indisponível por `EACCES`. |
| `npm run lint` | Passou. |
| `npm run typecheck` | Passou. |
| `npm test` | Passou, 77 testes. |
| `npm run build` | Passou, Next.js 16.4.4, páginas estáticas geradas. |
| `npm run test:http` | Passou com servidor de produção local, sete destinos, SSR, CSS, manifesto, CSP, chunks do worker e resposta 404. |

## Limitações e pendências

- O host de browser não estava disponível. Não foram capturadas screenshots nem conferidos zoom de 200%, canvas, interações reais de upload, worker ou download no navegador.
- O smoke HTTP não verifica essas interações nem as viewports de 390×844, 820×1180, 1024×768 e 1366×768. Use o roteiro em `SPRINT-2-2-HOMOLOGACAO.md`.
- A comparação do símbolo vetorial com a segunda proposta aprovada e o aceite final de marca dependem de revisão do usuário.
- O relatório registra validação técnica, não aceite de produto. Não houve merge, deploy ou publicação.
