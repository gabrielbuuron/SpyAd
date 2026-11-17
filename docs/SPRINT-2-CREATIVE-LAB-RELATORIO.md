# Sprint 2.0 — Creative Lab / Relatório P0

Data: 17/11/2026. Branch exclusiva: `sprint-2-creative-lab`.
Base conferida: `cd43946447491d93457a9f69059e2acb6b54ba91`, derivada de `5da5c6af5ec4a5d1c4b5edb830b71ce54ab7926d`.
Commit de implementação: `8e34af7329513908c7e1a3e73fc48b3e2240f71d`.

**Entrega para revisão:** o fluxo P0 está implementado com APIs reais de imagem do navegador. A suíte técnica passou. A execução do canvas/worker em navegador real e a homologação visual permanecem pendentes por indisponibilidade da ferramenta de navegador. Não se trata de uma aprovação final do produto nem de uma alegação de que a Sprint 1.1 foi homologada integralmente.

## Escopo e preservação

Foi lido integralmente docs/SPRINT-2-CREATIVE-LAB-EXECUCAO.md. A árvore, componentes, hooks, CSS, fixtures, testes, package.json e lockfile existentes foram inventariados antes das alterações. A fonte foi comparada por hash de blob com a branch remota; não havia divergências locais.

A implementação foi preparada em C:\Users\User\Documents\SpyAd-sprint-2-creative-lab, separada da cópia da Sprint 1. Git não está instalado; os objetos e a referência da branch são administrados pelo conector GitHub com checagem de SHA esperado. main e sprint-1-foundation foram apenas consultadas, sem alteração, merge ou deploy. Nenhum serviço externo foi conectado.

As dependências diretas e package-lock.json foram preservados. package.json muda somente a porta local de 3220 para 3230, evitando conflito com a Sprint 1. Nenhuma biblioteca foi instalada para estética ou processamento em produção.

## P0 implementado

Fluxo: **Importar → Inspecionar → Limpar → Verificar → Exportar**.

- Destino #creative-lab em desktop e rail de tablet; no celular, acesso pelo menu Mais, mantendo os seis destinos anteriores.
- Seletor de arquivo acessível pelo botão Escolher imagem e drag/drop de um arquivo por vez.
- JPEG, PNG e WebP estáticos. Formato real identificado por assinatura, sem confiar em extensão ou File.type; a imagem também precisa ser decodificada.
- Limites: 10 MiB por entrada/saída, 8.000.000 pixels e 8.192 px por dimensão. Os limites são explícitos na UI e centralizados em LIMITS.
- Inspeção de bytes, dimensões codificadas e visuais, proporção, modelo de cor tecnicamente detectado, capacidade de alpha e metadados cobertos.
- Confirmação de propriedade/autorização antes de gerar a nova imagem.
- Re-encoding real com ImageBitmap e canvas. PNG usa o encoder nativo; JPEG/WebP solicitam qualidade 0,92, cuja interpretação depende do navegador.
- Padrão simples: mesmo formato do original. Opções de saída e diagnóstico detalhado ficam em Avançado.
- Reinspeção estrutural, nova decodificação, conferência de dimensões, orientação, GPS residual e relatório de metadados antes de habilitar download.
- Nome distinto, com sufixo .spyad-limpo e extensão do formato real de saída. O original não é sobrescrito.
- Etapas reais, sem porcentagem inventada; cancelar, retirar arquivo, recomeçar e falhas explícitas.
- URLs blob revogadas, bitmaps fechados, canvas zerado e estado descartado ao reset/sair da área, quando o runtime permite. Não há promessa de apagamento físico seguro de memória.

Paste, vídeo, lote, IA, biblioteca permanente e integração Meta não foram implementados: não fazem parte do P0 disponibilizado.

## Arquitetura

A feature fica em src/features/creative-lab/:

| Módulo | Responsabilidade |
| --- | --- |
| types.ts | Tipos de inspeção, relatório, formato e etapas |
| lib/file-validation.mjs | Assinaturas, limites, erros e nome de saída |
| lib/binary.mjs | Bounds, CRC32 e cópia de normalização EXIF |
| lib/exif.mjs | TIFF clássico limitado: orientação, fabricante/modelo/data/software e GPS quando interpretável |
| lib/inspect-image.mjs | JPEG/PNG/WebP; contêineres e propriedades, sem decodificação de pixels |
| lib/sanitize-image.mjs | Hash, decoder, re-encoding, reinspeção e bloqueios de exportação |
| lib/verify-image.mjs | Comparação conservadora e matrizes das oito orientações EXIF |
| lib/browser-backend.ts | createImageBitmap, OffscreenCanvas ou HTMLCanvasElement |
| lib/image.worker.ts | Protocolo de inspeção/conversão e mensagens de etapas |
| lib/run-job.ts | Worker, fallback local, leitura cancelável e timeout |
| use-creative-lab.ts | Estado transitório, cancelamento, concorrência e ciclo de vida das URLs |
| components/creative-lab.tsx | Fluxo simples, autorização, preview, ações e exportação |
| components/inspection-panel.tsx | Diagnóstico, campos e comparação |

O laboratório é carregado por importação dinâmica no AppShell. O worker é empacotado localmente pelo Webpack. Há handshake de capacidade antes de transferir bytes: se worker/OffscreenCanvas não estiver disponível, usa o thread principal com as mesmas verificações. Um erro após transferência ao worker não dispara uma segunda conversão silenciosa. O worker é terminado em cancelamento/conclusão; há timeout de 60 s.

No fallback, cancelamento é cooperativo: uma operação nativa de decode/encode já iniciada pode continuar até terminar, mas seu resultado é ignorado e não habilita download após cancelamento. Não se afirma que cancelar interrompe instantaneamente qualquer operação do browser.

## Orientação e transparência

A tag de orientação é lida do TIFF clássico. A imagem de decodificação é uma **cópia**, com a tag ajustada para 1; no PNG, o CRC do chunk eXIf é recalculado. Os pixels são então desenhados com a transformação correspondente à orientação original, incluindo espelhamentos e rotações de 1 a 8. Isso evita aplicar rotação duas vezes.

O resultado precisa ter dimensões visuais esperadas e orientação efetiva 1. Resultado com GPS EXIF reconhecido ainda presente é bloqueado. JPEG compõe transparência sobre branco; PNG/WebP precisam continuar declarando alpha quando o cabeçalho de entrada o indicava. Essa verificação é conservadora e pode rejeitar um encoder que otimize um canal alpha inteiramente opaco.

Cor e fidelidade: canvas pode converter perfil, espaço de cor e precisão; PNG de 16 bits recebe aviso de redução para precisão do canvas. Não existe garantia de pixels ou bytes idênticos. O formato pode alterar compressão e tamanho; um arquivo maior não significa falha na limpeza.

## Cobertura dos metadados

A UI distingue Encontrado, Não encontrado, Não suportado e Não verificado. Campos adicionais só são exibidos quando lidos.

| Campo | Cobertura |
| --- | --- |
| EXIF | Contêiner JPEG APP1, PNG eXIf e WebP EXIF, com TIFF clássico suportado |
| Orientação | Tag IFD0 SHORT única, valores 1–8; variantes ambíguas/invalidas bloqueadas |
| GPS | Diretório GPS no EXIF; latitude/longitude interpretadas apenas com tipos/referências compatíveis |
| Campos EXIF adicionais | Fabricante, modelo, data TIFF e software, quando presentes na IFD0 suportada |
| XMP | Presença de contêiner JPEG/WebP e convenção XML:com.adobe.xmp em texto PNG; XML não interpretado |
| ICC | Presença em APP2/iCCP/ICCP; perfil completo, nome interno e fidelidade de cor não interpretados |
| Texto PNG | tEXt e iTXt não comprimido, com limites de leitura; zTXt/iTXt comprimido detectados como não suportados |
| Comentário JPEG | COM, com leitura limitada |
| Outros | Sempre não verificável; não se verifica esteganografia nem dados nos pixels |

O relatório usa Removido somente quando um contêiner reconhecido estava presente e não foi encontrado na reinspeção. Preservado aplica-se somente a orientação numericamente lida e igual. Dois perfis ICC detectados, ou dois contêineres genéricos presentes, **não** são anunciados como idênticos. Metadados não interpretados não recebem garantia de remoção.

Não há remoção de marca d'água, texto, rosto ou sinal visível na imagem; não existe promessa de aprovação pela Meta, indetectabilidade ou evasão de revisão.

## Validação e variantes

- PNG: assinatura, IHDR, CRC por chunk, tamanho/final, dimensões, bit depth/modelo e chunks críticos conhecidos. APNG é bloqueado por acTL/fcTL/fdAT.
- WebP: RIFF e tamanho, chunks, VP8/VP8L/VP8X, dimensões e alpha. ANIM/ANMF ou flag de animação bloqueiam o processamento.
- JPEG: marcadores e comprimentos, SOF baseline/progressivo de 8 bits com 1 ou 3 componentes, SOS/EOI e EXIF. CMYK, multiquadro e variantes não cobertas são recusados.
- Arquivos truncados, CRC incorreto, excesso de segmentos/chunks, EXIF não suportado e dimensões acima do limite são rejeitados.
- Cabeçalho válido não basta: decode real é obrigatório antes de mostrar a inspeção como confirmada e antes da exportação.

Não há suporte universal a todas as variantes desses formatos. Campos EXIF complexos, MakerNote, subdiretórios e dados comprimidos não são interpretados integralmente.

## Privacidade e segurança

O código da feature não usa fetch, XMLHttpRequest, sendBeacon, localStorage ou sessionStorage. Dados e nomes ficam em memória da sessão. Os URLs de preview usam MIME derivado da assinatura, não o MIME informado pelo arquivo. Strings de metadados são renderizadas como texto pelo React, sem HTML ou XML executável.

Não existe endpoint de upload. O browser carrega os arquivos da aplicação e do worker pela mesma origem; o conteúdo da imagem não é enviado ao servidor. Em produção, a CSP contém connect-src 'none', worker-src 'self', img-src 'self' blob:, object-src 'none' e form-action 'none'. Há Referrer-Policy no-referrer e X-Content-Type-Options nosniff. Em desenvolvimento, apenas as conexões locais necessárias ao HMR são permitidas.

O teste HTTP confirmou os headers e que os chunks do launcher, parser compartilhado e worker estão servidos. Não foi possível observar a aba Network em browser real. Extensões, runtime, SO, propriedades do arquivo baixado e liberação física pelo garbage collector estão fora da garantia da aplicação.

## UX e responsividade implementadas

Identidade grafite/ciano e tokens existentes foram reutilizados. O Lab não é rotulado como simulação de processamento; os anúncios do Explorer continuam explicitamente demonstrativos.

Desktop: preview e diagnóstico lado a lado, com relatório abaixo. Até 899 px: fluxo vertical e preview limitado; celular: etapas legíveis, botões de pelo menos 44 px (ações principais 48 px), campos 16 px e controle de transparência por fundo quadriculado. Avançado é recolhido por padrão. Erros, etapas, avisos e resultados têm status/alertas acessíveis; não há modal novo.

Esses comportamentos foram implementados e o HTML inicial foi renderizado nos testes. Sua geometria em browser, toque, teclado, zoom e screenshots não foram validados.

## Testes executados

Ambiente: Node v24.22.0, npm 11.19.1, Next 16.4.4.

| Comando | Resultado |
| --- | --- |
| npm ci --offline --no-audit --no-fund | Exit 0; 359 pacotes |
| npm run lint | Exit 0 |
| npm run typecheck | Exit 0 |
| npm test | Exit 0; 68 testes passaram |
| npm run build | Exit 0; aplicação estática e worker empacotados |
| npm start | Servidor local em 127.0.0.1:3230 |
| npm run test:http | Exit 0; SSR, sete destinos, CSS, CSP, chunks do Lab/worker e 404 |

Logs: docs/evidencias/sprint-2/. O aviso já conhecido de depreciação do ESLint 9.39.5 continua; não foi feita auditoria online de vulnerabilidades.

Os 38 testes anteriores continuam passando, com as expectativas de navegação estendidas para o sétimo destino, sem remover os seis existentes. Foram acrescentados 28 testes de processamento e 2 de SSR do Lab/relatório.

As fixtures são arquivos JPEG/PNG/WebP reais gerados a partir de pixels sintéticos 4×2, incluindo EXIF com GPS fictício, PNG textual/transparente, EXIF em PNG/WebP, texto comprimido e APNG/WebP animado. O teste WebP animado também confirmou dois frames pelo decoder independente.

Cobertura:
- Magic bytes, extensão enganosa, vazio, inválido, truncado, CRC/RIFF corrompido, oversized e limite de pixels.
- EXIF/GPS e campos realmente lidos; oito orientações comparadas pixel a pixel com autoOrient independente.
- Neutralização por cópia e CRC PNG válido; SHA-256 do original antes/depois.
- Re-encoding, saída decodificável e dimensões esperadas nos três formatos.
- Alpha em PNG/WebP, composição JPEG, relatório conservador e cobertura não verificável.
- Cancelamento antes e durante decode, fechamento de bitmap em erro, encoder com formato incorreto, hash divergente, orientação/GPS residual.
- SSR da entrada local e ausência de exportação fictícia; preservação dos componentes da Sprint 1.

**Limite importante:** a rasterização automatizada usa um adaptador Node com Sharp 0.35.5, já presente no lockfile como dependência do Next (licença Apache-2.0). Sharp não foi adicionado como dependência direta nem usado no bundle do navegador. Esse adaptador exercita o pipeline, os parsers e as matrizes com imagens reais, mas **não testa OffscreenCanvas, ImageBitmap, FileReader, downloads ou Worker em Chrome/Safari**.

A primeira expectativa HTTP supunha cópias do parser em dois chunks; a inspeção do build mostrou parser compartilhado. O teste foi corrigido para verificar separadamente launcher, worker e parser, incluindo a resposta HTTP de cada asset. Isso não é uma prova de execução do worker no navegador.

## Limites de memória e processamento

O limite inicial de 8 MP e 10 MiB reduz alocações, mas não garante ausência de OOM em todo celular. Decoder, bitmap, canvas, blobs e previews podem coexistir. O navegador pode encerrar uma aba sob pressão de memória, caso em que a aplicação não consegue tratar a falha. Medição em dispositivos reais continua necessária antes de aumentar limites.

O resultado também deve respeitar 10 MiB; uma conversão para PNG de imagem muito detalhada pode exceder esse limite e ser recusada. Canvas limitado, encoder WebP ausente e variante não decodificável recebem falha sem liberar resultado incorreto. JPEG/WebP podem ser recomprimidos; PNG pode mudar representação, metadados e precisão.

## Homologação pendente

A tentativa real de listar navegadores retornou: `The browser access host is unavailable`. Nenhuma nova captura foi criada e nenhum teste visual foi declarado aprovado.

| Teste real de navegador | Estado |
| --- | --- |
| Importar, selecionar, arrastar, limpar, reinspecionar e baixar | Pendente |
| Canvas/worker nativo e fallback em Chrome/Safari | Pendente |
| Orientação/GPS/transparência nas fixtures pelo browser | Pendente |
| Cancelar, reset, sair/voltar e revogar previews | Pendente |
| 390, 820, 1024 e 1366 px | Pendente |
| Zoom 200%, teclado, leitor de tela, toque e screenshot | Pendente |
| Aba Network sem transmissão de arquivos | Pendente |
| Regressão interativa de Explorer, Coleções e dossiê | Pendente |

Roteiro: [SPRINT-2-CREATIVE-LAB-HOMOLOGACAO.md](SPRINT-2-CREATIVE-LAB-HOMOLOGACAO.md).

## Arquivos e entregáveis

- src/features/creative-lab/: processamento, worker, estado e componentes.
- src/lib/{types,data}.ts e src/components/{app-shell,sidebar,bottom-nav,icon,settings}.tsx: integração do destino e contexto de versão.
- src/app/globals.css: estilos escopados do Lab.
- next.config.mjs: CSP e headers.
- package.json: porta local 3230; .gitignore: fixtures locais fora do Git.
- tests/creative-lab.test.mjs, lab-backend.mjs, lab-fixtures.mjs: testes e gerador.
- tests/components.test.mjs, domain.test.mjs, http.integration.mjs: cobertura existente estendida.
- README.md, este relatório, roteiro e docs/evidencias/sprint-2/: documentação.

O gerador local `node tests/lab-fixtures.mjs` cria .lab-fixtures/ ignorada pelo Git. Um ZIP de conveniência foi gerado na máquina em C:\Users\User\Documents\SpyAd-Creative-Lab-fixtures.zip. Não contém arquivos de usuários ou dados pessoais reais.

## Revisão solicitada

A implementação P0 está entregue para revisão. Antes de aprovar ou publicar, execute o roteiro com as fixtures e arquivos próprios/autorizados, conferindo o resultado em browser real e a reinspeção. Permanecem proibidos merge, deploy ou avanço de escopo sem a revisão solicitada pelo usuário.
