# SpyAd — Signal S / Guia de identidade

**Status: interpretação vetorial original para revisão comparativa. Não é uma declaração de logotipo oficial final aprovado.**
A direção Signal S foi informada como escolhida pelo usuário. O estudo visual correspondente não está disponível como asset nesta árvore; portanto, não se afirma reprodução exata. A comparação com a imagem escolhida continua obrigatória antes da aprovação.

## Conceito

Um S geométrico desenhado como um percurso contínuo, com dois terminais circulares. A forma combina leitura de letra e associação a conexão/sinal, sem usar gráficos de desempenho ou símbolos de certificação. O wordmark SpyAd tem cinco letras desenhadas em caminhos vetoriais próprios, com Spy claro e Ad ciano no fundo escuro.

A marca é sóbria: sem filtros, brilho neon, sombra no símbolo, animação de desenho ou textura. Os contornos arredondados reduzem aspereza sem abandonar a geometria. Não foi incorporado asset de outra marca.

## Fonte da verdade e variações

Geometria e paleta: `src/brand/signal-s.mjs`.
Componente: `src/components/brand-mark.tsx`.
Exports: `public/brand/`.

| Composição | Aplicação |
| --- | --- |
| lockup | Símbolo + wordmark horizontal |
| symbol | Rail de tablet, Início mobile, avatar do workspace e ícones |
| wordmark | Cabeçalho desktop compacto |
| brand | Spy claro, Ad e símbolo ciano, em fundo escuro |
| on-light | Spy grafite, Ad e símbolo teal escuro, em fundo claro |
| mono-light | Uma tinta clara em fundo escuro |
| mono-dark | Uma tinta grafite em fundo claro |

O componente possui nome acessível por padrão. Em links já nomeados, usar decorative para evitar leitura duplicada. Não substituir o texto acessível do link por um SVG sem nome.

Exemplos:

```tsx
<BrandMark />
<BrandMark variant="symbol" tone="mono-light" />
<a href="#dashboard" aria-label="SpyAd, visão geral">
  <BrandMark decorative />
</a>
```

## Construção e proporções

- Módulo do símbolo: viewBox de 32 × 32 unidades.
- Percurso: M25 7 → H12 → L7 12 → L12 16 → H20 → L25 20 → L20 25 → H7.
- Espessura: 4,25 unidades; terminais circulares de raio 2,75.
- Wordmark: módulo 110 × 32; espessura nominal 3,1, curvas próprias e finais arredondados.
- Lockup: 152 × 32; símbolo 32, separação nominal 10, wordmark 110.
- Preservar o viewBox e a proporção; não esticar na horizontal ou vertical.
- Área de proteção recomendada: ao menos 8 unidades do módulo do símbolo em cada lado, proporcional à escala. Textos de assinatura formam um grupo e devem manter separação visual equivalente.

Tamanhos projetados:

| Uso | Piso técnico | Recomendado |
| --- | --- | --- |
| Símbolo isolado | 16 px no favicon | 22–36 px na interface |
| Lockup | 104 px de largura no cabeçalho mobile | 152–180 px |
| Wordmark isolado | 82 px de largura | 110 px ou mais |
| App icon | PNG dedicado à dimensão pedida | 180 / 192 / 512 px |

Esses pisos não substituem a conferência de legibilidade em dispositivo. Os arquivos 16/32 px foram decodificados em testes e vistos ampliados na prancha; não foi possível validar sua exibição na aba do navegador.

## Paleta

| Token / papel | Hex |
| --- | --- |
| Grafite profundo / fundo | #0b0e14 |
| Superfície | #11161f |
| Superfície elevada | #171d28 |
| Tinta clara / Spy | #ecf0f7 |
| Ciano principal / símbolo e Ad | #80d9e5 |
| Violeta pontual | #c4b1ed |
| Tinta em fundo claro | #11161f |
| Teal em fundo claro | #126978 |
| Texto secundário de interface | #aeb9cb |
| Texto auxiliar | #9daac0 |

Não usar o ciano claro como texto pequeno sobre branco. A variante on-light existe para esse caso. O contraste foi calculado nos testes para os fundos claros/escuros indicados; não representa certificação de acessibilidade de todas as combinações possíveis.

No produto, paleta e hierarquia existentes foram preservadas. Violeta não colore o símbolo principal. Amarelo moderado continua reservado a limitações e estados não verificáveis, não à marca.

## Tipografia

O wordmark é feito de paths, sem arquivos de fonte e sem depender da fonte instalada.

A interface mantém Segoe UI Variable, Segoe UI, system-ui, -apple-system, BlinkMacSystemFont e sans-serif. Não há CDN nem nova fonte redistribuída. A cobertura de acentos e o aspecto exato dependem do sistema local e precisam ser conferidos em dispositivos.

Escala de interface preservada:
- Display: 30–40 px; H1: 28–34 px; H2: 20–24 px; H3: 16–18 px.
- Corpo: 15–16 px; labels e small: 14 px; overline auxiliar: 12 px.
- Numerais: 26–32 px com tabular-nums quando apropriado.
- Pesos e line-height definidos nos tokens existentes; evitar all caps/tracking em informação essencial.

## Aplicação no produto

- Sidebar desktop: lockup + assinatura Inteligência criativa.
- Tablet: símbolo compacto no topo da rail, mantendo os sete destinos.
- Cabeçalho mobile: lockup dimensionado entre 104–124 px.
- Início na navegação mobile: símbolo; quando inativo, monocromia com ênfase reduzida de interface.
- Cabeçalho desktop: wordmark monocromático e contexto da área.
- Workspace: símbolo no lugar do S tipográfico anterior.
- Dashboard, Explorer, Coleções, dossiê e Configurações recebem a identidade pelo shell, sem inserir a marca nos anúncios ilustrativos.
- Creative Lab: a marca não é desenhada sobre arquivos importados ou exportados. Apenas a interface é alterada. Metadados não suportados/não verificados usam apresentação distinta dos campos encontrados.

## Ícones e manifesto

Arquivos:

| Arquivo | Uso |
| --- | --- |
| favicon.svg | Vetor de aba |
| favicon-16.png / favicon-32.png | Rasters nas dimensões exatas |
| favicon.ico | Contêiner com PNGs 16 e 32 |
| apple-touch-icon-180.png | Ícone Apple 180 × 180 |
| app-icon-192.png / app-icon-512.png | Ícones gerais |
| app-icon-maskable-512.png | Ícone opaco para máscara |
| app-icon.svg / app-icon-maskable.svg | Masters vetoriais dos app icons |

O ícone maskable mantém o símbolo na zona circular segura de raio 40% da largura, comprovada sobre o raster em teste. Favicon usa proporção própria para leitura pequena. O manifesto public/manifest.webmanifest aponta para assets locais.

**Manifesto e ícones não significam PWA homologada.** Não foi criado service worker, cache offline ou fluxo de instalação. Instalação em desktop/iOS/Android não foi testada.

## Gerar e revisar

Node 24, npm 11.19.1 e dependências do lockfile:

```powershell
npm ci
npm run brand:generate
npm run brand:generate -- --proof
npm test
```

A exportação usa Sharp 0.35.5, já presente no lockfile do Next. Não adiciona dependências. SVGs não usam fonte, filtro ou imagem externa; PNG/ICO são derivados dos mesmos vetores. Repetir o gerador no mesmo conjunto de ferramentas produziu os mesmos hashes.

A opção --proof cria .brand-review/ (fora do Git) com prancha de fundo claro/escuro e ampliações dos favicons. A prancha foi renderizada e inspecionada, mas **não é screenshot do produto nem prova de aprovação comparativa**. Suas legendas usam fonte local apenas como anotação; não integram os assets canônicos.

Não desenhar novamente a marca em outro arquivo sem atualizar a fonte da verdade e repetir os testes. Não editar PNG à mão.

## Usos a evitar e aprovação

Não distorcer, rotacionar, trocar a sequência SpyAd, aplicar cores fora das variações, adicionar neon ou introduzir filtros pesados. Não usar o símbolo como selo de segurança ou de aprovação de anúncios. Não colocar a marca sobre criativos de usuários como marca d'água.

Proveniência: paths e geometria criados nesta implementação, sem asset ou fonte de terceiro incorporado ao logotipo. Sharp é ferramenta de exportação com licença Apache-2.0; fontes de sistema continuam sob as condições do respectivo sistema, sem redistribuição neste pacote.

Antes de publicar: comparar com o estudo Signal S escolhido, revisar distintividade visual perante outras marcas e testar as aplicações em browser/dispositivo. Essa revisão não foi executada. O usuário mantém a decisão de aprovação final.
