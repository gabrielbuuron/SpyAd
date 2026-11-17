# SpyAd — Sprint 2.0 / Creative Lab — contrato de execução

## Status e origem
Branch exclusiva `sprint-2-creative-lab`, criada a partir de `5da5c6af5ec4a5d1c4b5edb830b71ce54ab7926d` (`sprint-1-foundation`). A Sprint 1.1 possui 38 testes e build reportados como aprovados, mas sua homologação de navegador real permanece parcial. Não afirmar que foi concluída integralmente. Não tocar em `main`, não fazer merge/deploy, não usar serviços externos nem expor arquivos dos usuários.

## Objetivo do MVP
Criar ferramenta de uso recorrente para arquivos próprios/autorizados: **Importar → Inspecionar → Limpar → Verificar → Exportar**. Valor central: preparar imagens com transparência técnica e sem alterar o original. Não implementar cloaking ou evasão de revisão de anúncios.

## Etapa 0 — investigação obrigatória
Leia a árvore de código, componentes, fixtures, estilos, package.json, lockfile e testes atuais. Verifique o HEAD. Defina arquitetura modular antes de editar. Reutilize design system e navegação existente. Preserve funcionalidades do Explorer, Dashboard, Coleções, Dossiê, Radar, DNA e Configurações. Não invente métricas de anúncios.

## Escopo P0
1. **Entrada e navegação:** novo destino Creative Lab na navegação desktop/tablet/mobile, com acesso pelo menu Mais quando necessário; tela inicial com dropzone e seletor de arquivo acessível por teclado, suporte a drag/drop e paste opcional apenas se seguro.
2. **Formatos:** JPEG, PNG, WebP. Validação por assinatura/decodificação, não confiar apenas em extensão/MIME; tamanho máximo inicial explícito e ajustável por avaliação de memória, com erros claros. Não prometer suporte universal a todas as variantes.
3. **Inspeção:** exibir tamanho em bytes, formato real, dimensões, proporção, perfil/cores quando tecnicamente detectáveis e campos de metadados realmente lidos. Separar “não encontrado”, “não suportado” e “não verificado”. Não inventar EXIF ausente.
4. **Limpeza:** gerar NOVO arquivo por re-encoding local no browser, com avisos de possíveis alterações de compressão, transparência, perfil de cor, animação e metadados. Não usar canvas como promessa de preservar fidelidade byte a byte. Se suporte WebP animado ou PNG animado não puder ser garantido, bloquear com explicação. Tratar orientação EXIF corretamente antes de converter.
5. **Verificação:** reinspecionar o arquivo exportado; relatório antes/depois com status por campo: removido, preservado, não encontrado ou não verificável. Se verificação não cobrir um campo, não anunciar remoção garantida. Mostrar nome, formato e tamanho do resultado.
6. **Exportação:** download com nome distinto; arquivo original imutável; URLs blob revogadas; limpar buffers e estados quando possível. Processamento local sem upload.
7. **Estados e erros:** progresso real ou estados de etapa (não inventar porcentagens), cancelamento quando possível, erros de decode/limite/memória, aviso para qualidade e transparência, reset seguro e fluxo completo com mouse, teclado e toque.
8. **Privacidade:** nenhum envio à rede, sem armazenamento automático de conteúdo, sem analytics, sem serviços pagos. Documentar limitações de privacidade e de arquivos; evitar persistir nomes sensíveis.

## Arquitetura sugerida, adaptável após auditoria
- `src/features/creative-lab/` com `components/`, `lib/`, `types.ts` e testes.
- `file-validation.ts`: assinatura e limites; `inspect-image.ts`: propriedades/metadata; `sanitize-image.ts`: re-encoding com salvaguardas; `verify-image.ts`: reinspeção e diff.
- UI separada de processamento; isolar tarefas custosas em worker quando compatível com Next/browser; não adicionar dependências desnecessárias. Se biblioteca for necessária, avaliar licença, bundle, manutenção e cobertura de formatos.
- Dados do usuário permanecem locais, em memória; exportação é ação explícita. Estado de arquivo não deve ser serializado em localStorage.

## UX premium
- Modo simples como padrão, “Avançado” recolhido.
- No desktop, preview e painel de diagnóstico lado a lado; no tablet adaptar à orientação; no mobile fluxo vertical e botões com área de toque confortável.
- Sem promessas de “indetectável”, “aprovado pela Meta”, “100% seguro” ou remoção de marca d’água.
- Explicitar diferença entre metadados do arquivo e sinais visíveis/embutidos na imagem.
- Empty, loading, error, success, focus, keyboard e reduced-motion; preservar identidade grafite/ciano e boa tipografia.

## Fora de escopo P0
- Vídeos MP4/MOV: apenas estudo técnico, não disponibilizar limpeza sem verificação robusta.
- Processamento em lote, biblioteca permanente, IA, conexão Meta, automações, comparação de anúncios reais, Radar e planos pagos.
- Qualquer recurso para burlar revisão, camuflar conteúdo ou contornar bloqueios de terceiros.

## Testes obrigatórios
- Validar magic bytes, extensões enganosas, arquivo vazio, inválido, corrompido e oversized.
- Testar JPEG com EXIF de orientação e GPS (fixtures sintéticas), PNG com chunks de texto, WebP estático e formatos animados rejeitados/explicados.
- Verificar original intacto, resultado decodificável, dimensões esperadas, transparência quando suportada, diferenças de tamanho, limpeza efetivamente reinspecionada.
- Testar fluxos importação/inspeção/limpeza/exportação, falhas e reset, teclado, modal e navegação; garantir 38 testes preexistentes sem regressão.
- Executar `npm ci`, lint, typecheck, test, build, HTTP. Registrar logs, contagem e versões; navegador real se disponível: 390, 820, 1024, 1366 px, zoom 200%, screenshots; se indisponível, registrar pendência sem alegar homologação.

## Entregáveis
- Implementação em commits na branch exclusiva.
- `docs/SPRINT-2-CREATIVE-LAB-RELATORIO.md` com decisões, arquitetura, arquivos, comandos, resultados, limites, matriz de testes, pendências e SHA final.
- Checklist de homologação manual com passos curtos para usuário.
- Não fazer merge/deploy nem alterar branch anterior. Solicitar revisão antes de declarar conclusão.
