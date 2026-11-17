# Creative Lab — homologação manual P0

**Não executado no navegador nesta sessão.** O teste automatizado de rasterização usa Node/Sharp; não substitui as etapas abaixo.

## Abrir e preparar

Na branch sprint-2-creative-lab, com Node 24 e npm 11.19.1:

```powershell
npm ci
npm run lint
npm run typecheck
npm test
npm run build
node tests/lab-fixtures.mjs
npm start
```

Abrir http://127.0.0.1:3230/#creative-lab. As fixtures ficam em .lab-fixtures/. Não usar dados privados de terceiros.

## Casos rápidos

1. **jpegGps.jpg:** importar; Avançado deve mostrar orientação 6, fabricante SpyAd test e coordenadas sintéticas. Dimensões codificadas 4×2, visuais 2×4. Autorizar, gerar e conferir resultado 2×4 decodificado, EXIF/GPS removidos nos contêineres cobertos. Baixar e reimportar o resultado: confirmar ausência desses campos.
2. **pngText.png:** deve ler Author = SpyAd synthetic fixture e detectar alpha. Gerar PNG; texto removido, transparência preservada e original intacto.
3. **pngExif.png / webpExif.webp:** confirmar orientação visual 2×4, normalização e reinspeção. Em browser sem encoder WebP, a exportação WebP deve falhar claramente; escolher PNG em Avançado e repetir.
4. **pngCompressed.png:** texto comprimido detectado como não suportado; o relatório não deve garantir sua remoção. Outros dados continuam Não verificável.
5. **apng.png / animatedWebp.webp:** rejeitar explicitamente como animados, sem habilitar download.
6. **jpeg.jpg / png.png / webp.webp:** verificar importação, formato real, novo nome e download legível em outro visualizador.
7. Renomear uma cópia de png.png para falsa.jpg e importar: deve mostrar formato real PNG. Arquivo vazio, SVG/TXT disfarçado e truncado devem falhar. Arquivos acima de 10 MiB ou 8 MP devem ser recusados.
8. Repetir com um arquivo próprio de tamanho representativo. Cancelar durante o processamento, retirar arquivo e trocar de área: não deve aparecer download atrasado ou preview anterior. Voltar ao Lab deve iniciar vazio.
9. Confirmar que a imagem original no disco mantém seu hash. O download precisa ter nome distinto. Não há escrita sobre o arquivo importado.

## Privacidade e rede

Usar npm start (build de produção). Em DevTools → Network, limpar os logs antes de importar. A aplicação pode carregar chunks próprios do Lab/worker; nenhum request deve conter os bytes, nome ou metadados do arquivo. Não deve existir upload, serviço de análise ou chamada externa. Conferir CSP connect-src 'none'. Não confundir carregamento de código da aplicação com transmissão de arquivo.

Inspecionar storage: conteúdo/nome de imagens não deve aparecer no localStorage ou sessionStorage. As coleções demonstrativas antigas da SpyAd continuam usando sua chave própria.

## Teclado e dispositivos

- Tab → Escolher imagem → Enter/Espaço; depois navegar por Avançado, autorização, geração e download.
- Conferir mensagens de etapa/erro e retorno a uma interface utilizável após falha.
- Testar 390×844, 820×1180, 1024×768 e 1366×768, incluindo rolagem e zoom 200%.
- No celular, abrir Lab por Mais. No tablet/desktop, usar navegação lateral. Conferir todos os destinos anteriores.
- Confirmar fundo quadriculado, arquivo longo quebrando corretamente, resultado/relatório e botões sem corte.
- Capturar entrada, inspeção, resultado/relatório e erro em desktop, celular e tablet; registrar navegador, SO, viewport, zoom e SHA.

## Regressão e aprovação

No Explorer, pesquisar VIDEO instagram e PONTO VISTA, alternar galeria/lista e salvar em Coleções. Recarregar e conferir persistência; abrir dossiê, Esc e retorno de foco. A homologação de navegador da Sprint 1.1 continua parcial até executar esses passos.

Registrar aprovação somente após conferir os arquivos baixados e as pendências reais. Não fazer merge ou deploy durante a homologação.
