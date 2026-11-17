# Signal S — revisão comparativa e homologação

Estado: aprovação do símbolo e testes de navegador pendentes. A prancha disponível é exportação de assets, não uma captura da aplicação.

1. Abrir a imagem da segunda proposta escolhida e a prancha .brand-review/signal-s-review-with-icons.png lado a lado.
2. Comparar desenho do S, nós, proporção, peso do wordmark, espaço símbolo/texto e contraste. Registrar explicitamente diferenças: este vetor é interpretação original, não cópia exata validada.
3. Rodar npm ci, npm run brand:generate, npm run build e npm start na branch sprint-2-1-brand-experience.
4. Abrir http://127.0.0.1:3240. Conferir sidebar, cabeçalho e Início mobile nos sete destinos. Confirmar que todos os links continuam funcionais.
5. Em 1366×768, capturar Dashboard, Explorer/galeria/lista, Coleções e dossiê. Em 1024×768 e 820×1180, capturar rail e Lab. Em 390×844, capturar cabeçalho, menu Mais e Lab.
6. Usar zoom 200% e Tab/Shift+Tab/Enter/Esc: conferir foco, recortes, quebra de textos, abertura/fechamento do dossiê e menu Mais. Repetir com reduced motion ativado.
7. Conferir favicon na aba a 16/32 px e Apple/app icon nas plataformas reais. Não declarar instalação/offline/PWA antes de testar os requisitos.
8. No Lab, importar fixture JPEG com GPS e PNG textual, processar e baixar. Conferir que a marca não entra na imagem exportada. O processamento não deve ter mudado.
9. Salvar um anúncio, recarregar Coleções, pesquisar e alternar modos. Não tratar SSR ou contraste calculado como prova de cliques.
10. Registrar navegador, sistema, viewport, zoom, SHA, capturas e parecer sobre a interpretação vetorial. Pedir aprovação explícita do símbolo após a comparação.

A ferramenta de navegador retornou The browser access host is unavailable nesta rodada. Os passos acima não foram executados no browser. Não fazer merge ou deploy durante a revisão.
