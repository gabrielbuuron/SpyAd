# Homologação manual e capturas — Sprint 1.1

**Estado: todas as capturas abaixo estão pendentes.** O serviço de navegador retornou `The browser access host is unavailable`. Este arquivo é um roteiro, não uma evidência de execução.

## Preparação

1. Na branch sprint-1-foundation, com Node 24 e npm 11.19.1, executar `npm ci`, `npm run build`, `npm start`.
2. Abrir http://127.0.0.1:3220 em navegador real. Todas as ações usam somente exemplos locais.
3. Usar zoom 100%. Nas ferramentas de desenvolvedor, ativar modo responsivo e definir **viewport CSS**, não resolução total da tela. Barras do Opera/Windows não são parte da SpyAd.
4. Registrar navegador, versão, sistema, viewport, zoom e SHA avaliado junto de cada captura.

## Capturas solicitadas

Para cada largura, registrar Dashboard topo, Explorer topo e modal aberto. No desktop, capturar também lista e galeria completas.

| Tamanho | Arquivos sugeridos | Estado |
| --- | --- | --- |
| 1440×900 | desktop-1440-dashboard.png, explorer-galeria.png, explorer-lista.png, dossie.png | Pendente |
| 1366×768 | desktop-1366-explorer-topo.png, dashboard-topo.png | Pendente |
| 1280×720 | desktop-1280-explorer-topo.png | Pendente |
| 1024×768 | ipad-paisagem-explorer.png, dossie.png | Pendente |
| 820×1180 | ipad-820-explorer.png, dashboard.png | Pendente |
| 768×1024 | tablet-768-explorer.png, navegacao.png | Pendente |
| 430×932 | mobile-430-explorer.png, mais.png | Pendente |
| 390×844 | iphone-390-explorer.png, dossie.png, lista.png | Pendente |
| 375×812 | mobile-375-dashboard.png, explorer.png | Pendente |
| 320×568 | compacto-320-explorer.png, mais.png, dossie.png | Pendente |

Repetir celulares em paisagem (812×375, 844×390 e 932×430), tablets em orientação inversa e desktop em zoom de 200%. Emulação não substitui toque, safe-area e teclado em aparelhos reais.

## Fluxos

- Abrir #dashboard: conferir contagens 03 exemplos, referências salvas reais e 02 plataformas representadas; CTA Explorar anúncios leva a #explorer.
- Em #explorer, buscar `VIDEO instagram`: um exemplo. Buscar `PONTO VISTA`: um exemplo. Buscar `não existe`: estado vazio com limpeza funcional.
- Filtrar Facebook + Vídeo: somente Marca Exemplo C. Trocar galeria/lista: manter filtros e os mesmos resultados. Limpar tudo: três exemplos.
- Acionar Pesquisar/Enter: foco no resumo de resultados. Limpar campo: foco no input.
- Salvar A e B; abrir #collections: dois itens. Recarregar: manter os dois. Abrir uma segunda aba na mesma origem; remover A na primeira; conferir atualização na segunda.
- No dossiê, conferir texto de demonstração, fechar visível e scroll interno. Testar Esc e backdrop, foco inicial, foco retornando ao acionador e remoção de um salvo enquanto o modal está aberto em Coleções.
- No celular: testar Início, Explorer, Coleções e Mais. Em Mais, testar Radar, DNA, Configurações, clique fora e Esc. Confirmar acesso aos seis destinos.
- No tablet: testar os seis destinos da rail com toque, sem depender de hover. Conferir duas colunas e painéis.
- Em cada área, usar Tab/Shift+Tab/Enter/Espaço. O skip link deve mover foco para main sem trocar a área. Testar voltar/avançar do navegador.
- Digitar no celular com teclado virtual aberto: verificar input, resultados e modal sem controles obstruídos.

## Falhas de storage, somente nos dados demo

Usar a aba de armazenamento do DevTools, na origem local. A chave é `spyad:collections:v1`.

- Valor válido: `{"version":1,"ids":[1,2]}`.
- Valor corrompido: `conteúdo inválido`. Recarregar: aviso deve aparecer. Salvar não pode sobrescrever silenciosamente. Configurações → Redefinir coleção deve restaurar estado vazio.
- Bloquear armazenamento para essa origem em um perfil de teste, recarregar e tentar salvar: apresentar falha, sem falso sucesso. Restaurar a permissão após o teste.
- Não limpar dados de outros sites. Esta operação não requer inserir dados pessoais nem conectar serviços.

## Critérios de revisão

Conferir títulos e textos sem cortes; áreas de toque >=44 px; ausência de scroll horizontal; início dos resultados na primeira dobra útil do Explorer; label Demo inequívoca; contraste/foco perceptíveis; layout confortável no zoom 200%. Guardar capturas de falhas antes de corrigi-las.
