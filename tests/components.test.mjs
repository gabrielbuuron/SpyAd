import test from 'node:test';
import assert from 'node:assert/strict';
import { ads } from '../src/lib/data.ts';
import { renderComponent } from './render-components.mjs';
const actions = { ad: ads[0], saved: false, onOpen() {}, onSave() {} };

test('galeria e lista mantêm os mesmos dados e ações acessíveis', async () => {
  for (const [file, exported] of [['ad-card', 'AdCard'], ['ad-list-row', 'AdListRow']]) {
    const html = await renderComponent(file, exported, actions);
    for (const value of [ads[0].brand, ads[0].headline, ads[0].platform, ads[0].format, ads[0].country]) assert.ok(html.includes(value));
    assert.ok(html.includes('aria-label="Abrir dossiê de Marca Exemplo A"'));
    assert.ok(html.includes('aria-label="Salvar Marca Exemplo A na coleção"'));
    assert.ok(html.includes('aria-pressed="false"'));
    assert.ok(html.includes('aria-labelledby="ad-title-1"'));
    assert.ok(html.includes('id="ad-title-1"'));
  }
});
test('salvamento expõe estado e nome de remoção nas duas visualizações', async () => {
  for (const [file, exported] of [['ad-card', 'AdCard'], ['ad-list-row', 'AdListRow']]) {
    const html = await renderComponent(file, exported, { ...actions, saved: true });
    assert.ok(html.includes('aria-label="Remover Marca Exemplo A da coleção"'));
    assert.ok(html.includes('aria-pressed="true"'));
    assert.ok(html.includes('>Salvo<'));
  }
});
test('navegação móvel preserva os seis destinos com disclosure explícito', async () => {
  const html = await renderComponent('bottom-nav', 'BottomNav', { section: 'settings' });
  for (const section of ['dashboard','explorer','collections','radar','dna','settings']) assert.ok(html.includes('href="#' + section + '"'));
  assert.ok(html.includes('<details'));
  assert.ok(html.includes('Mais áreas: Spy Radar, Offer DNA e Configurações'));
  assert.match(html, /href="#settings"[^>]*aria-current="page"/);
});
test('Explorer mantém busca, submit, modos e vínculo com os resultados', async () => {
  const html = await renderComponent('ad-explorer', 'AdExplorer', { collection: false, saved: [], onOpen() {}, onSave() {} });
  assert.ok(html.includes('role="search"'));
  assert.ok(html.includes('aria-controls="ad-results"'));
  assert.ok(html.includes('id="result-summary"'));
  assert.ok(html.includes('id="ad-results"'));
  assert.ok(html.includes('type="submit"'));
  assert.ok(html.includes('Pesquisar'));
  assert.ok(html.includes('aria-label="Galeria" aria-pressed="true"'));
  assert.ok(html.includes('aria-label="Lista" aria-pressed="false"'));
});
test('coleção vazia e estados de filtro vazio oferecem ação de recuperação', async () => {
  const html = await renderComponent('ad-explorer', 'AdExplorer', { collection: true, saved: [], onOpen() {}, onSave() {} });
  assert.ok(html.includes('Suas referências começam aqui.'));
  assert.ok(html.includes('href="#explorer"'));
  const filtered = await renderComponent('empty-state', 'EmptyState', { collection: false, filtered: true, onReset() {} });
  assert.ok(filtered.includes('Limpar busca e filtros'));
});
test('dossiê descreve demonstração, fechamento e falha de armazenamento', async () => {
  const html = await renderComponent('ad-detail', 'AdDetail', { ...actions, error: 'Armazenamento indisponível.', onClose() {} });
  assert.ok(html.includes('aria-labelledby="dossier-title"'));
  assert.ok(html.includes('aria-describedby="dossier-description"'));
  assert.ok(html.includes('id="dossier-description"'));
  assert.ok(html.includes('aria-label="Fechar dossiê"'));
  assert.ok(html.includes('role="alert"'));
  assert.ok(html.includes('Não há observações de campanhas reais.'));
});
test('prévia não oferece playback falso e Dashboard mantém CTA do Explorer', async () => {
  const preview = await renderComponent('creative-preview', 'CreativePreview', { ad: ads[0] });
  assert.ok(preview.includes('Prévia ilustrativa fictícia:'));
  assert.doesNotMatch(preview, /<button|<video|<iframe/);
  const dashboard = await renderComponent('dashboard', 'Dashboard', { count: 2, onOpen() {} });
  assert.ok(dashboard.includes('Explorar anúncios'));
  assert.ok(dashboard.includes('Referências para explorar'));
  assert.ok(dashboard.includes('Dados fictícios'));
  assert.ok(dashboard.includes('Neste navegador'));
});

test('dossiê mantém salvar e erros fora da região rolável, com estado acessível', async () => {
  for (const saved of [false, true]) {
    const html = await renderComponent('ad-detail', 'AdDetail', { ...actions, saved, error: 'Falha ao salvar.', onClose() {} });
    assert.ok(html.includes('role="region" aria-label="Conteúdo do dossiê" tabindex="0"'));
    const footerStart = html.indexOf('<footer class="detail-footer"');
    assert.ok(footerStart > html.indexOf('class="detail-scroll"'));
    const scrollContent = html.slice(html.indexOf('class="detail-scroll"'), footerStart);
    assert.doesNotMatch(scrollContent, /Salvar na coleção|Remover da coleção|role="alert"/);
    const footer = html.slice(footerStart);
    assert.ok(footer.includes('aria-label="Ações do dossiê"'));
    assert.ok(footer.includes('aria-pressed="' + saved + '"'));
    assert.ok(footer.includes('aria-label="' + (saved?'Remover Marca Exemplo A da coleção':'Salvar Marca Exemplo A na coleção') + '"'));
    assert.ok(footer.includes('role="alert"'));
    assert.ok(footer.includes('Falha ao salvar.'));
  }
});
