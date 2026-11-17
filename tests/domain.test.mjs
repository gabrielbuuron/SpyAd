import test from 'node:test';
import assert from 'node:assert/strict';
import { ads, sections } from '../src/lib/data.ts';
import { filterAds, normalize, parseCollection, updateCollection, COLLECTION_KEY } from '../src/lib/domain.mjs';

const defaults = { query: '', platform: 'all', format: 'all' };
function storage(initial = null) {
  const values = new Map(initial === null ? [] : [[COLLECTION_KEY, initial]]);
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
test('busca ignora caixa, acentos, espaços extras e combina termos', () => {
  assert.equal(normalize('  VÍDEO  '), 'video');
  assert.deepEqual(filterAds(ads, { ...defaults, query: '  VIDEO  instagram ' }).map(ad => ad.id), [1]);
  assert.deepEqual(filterAds(ads, { ...defaults, query: 'LANCAMENTO' }).map(ad => ad.id), [1]);
  assert.deepEqual(filterAds(ads, { ...defaults, query: 'PONTO VISTA' }).map(ad => ad.id), [1]);
  assert.deepEqual(filterAds(ads, { ...defaults, query: 'essencial outro' }).map(ad => ad.id), [2]);
});
test('filtros de plataforma e formato compõem e retornam vazio corretamente', () => {
  assert.deepEqual(filterAds(ads, { ...defaults, platform: 'Facebook', format: 'Vídeo' }).map(ad => ad.id), [3]);
  assert.deepEqual(filterAds(ads, { ...defaults, platform: 'Instagram', format: 'Imagem' }), []);
  assert.deepEqual(filterAds(ads, { ...defaults, query: 'não existe' }), []);
  assert.equal(filterAds(ads, defaults).length, 3);
});
test('coleções compõem com busca sem alterar a base original', () => {
  assert.deepEqual(filterAds(ads, { ...defaults, query: 'facebook' }, [1, 2]).map(ad => ad.id), [2]);
  assert.deepEqual(filterAds(ads, defaults, []), []);
  assert.equal(ads.length, 3);
});
test('salvar, recarregar e remover preservam o formato versionado', () => {
  const local = storage();
  assert.equal(updateCollection(local, [1, 2, 3], 1).ok, true);
  assert.deepEqual(parseCollection(local.getItem(COLLECTION_KEY), [1, 2, 3]).ids, [1]);
  assert.equal(updateCollection(local, [1, 2, 3], 2).ok, true);
  assert.deepEqual(parseCollection(local.getItem(COLLECTION_KEY), [1, 2, 3]).ids, [1, 2]);
  updateCollection(local, [1, 2, 3], 1);
  assert.deepEqual(parseCollection(local.getItem(COLLECTION_KEY), [1, 2, 3]).ids, [2]);
});
test('redefinição e reidratação mantêm somente IDs válidos sem duplicatas', () => {
  const local = storage(JSON.stringify({ version: 1, ids: [1, 1, 999] }));
  assert.deepEqual(parseCollection(local.getItem(COLLECTION_KEY), [1, 2, 3]).ids, [1]);
  assert.equal(updateCollection(local, [1, 2, 3], null).ok, true);
  assert.deepEqual(parseCollection(local.getItem(COLLECTION_KEY), [1, 2, 3]).ids, []);
});
test('coleção corrompida é preservada até redefinição explícita', () => {
  const local = storage('conteúdo inválido');
  assert.equal(updateCollection(local, [1, 2, 3], 1).ok, false);
  assert.equal(local.getItem(COLLECTION_KEY), 'conteúdo inválido');
  assert.equal(updateCollection(local, [1, 2, 3], null).ok, true);
  for (const raw of ['{}', '[]', 'null', '{"version":2,"ids":[]}', '{"version":1,"ids":["1"]}']) {
    assert.equal(parseCollection(raw, [1]).invalid, true);
  }
});
test('armazenamento indisponível e quota excedida retornam falha sem falso sucesso', () => {
  assert.equal(updateCollection({ getItem() { throw Error('SecurityError'); }, setItem() {} }, [1], 1).ok, false);
  const local = storage();
  assert.equal(updateCollection({ ...local, setItem() { throw Error('QuotaExceededError'); } }, [1], 1).ok, false);
  assert.equal(local.getItem(COLLECTION_KEY), null);
  assert.equal(updateCollection(local, [1], 99).ok, false);
});
test('gravações sucessivas leem o armazenamento atual, sem perder outro salvamento', () => {
  const local = storage();
  updateCollection(local, [1, 2, 3], 1);
  updateCollection(local, [1, 2, 3], 3);
  assert.deepEqual(parseCollection(local.getItem(COLLECTION_KEY), [1, 2, 3]).ids, [1, 3]);
});
test('navegação tem seis destinos únicos e fixtures explicitamente demonstrativas', () => {
  assert.deepEqual(sections.map(section => section.id), ['dashboard', 'explorer', 'radar', 'dna', 'collections', 'settings']);
  assert.equal(new Set(sections.map(section => section.id)).size, 6);
  assert.equal(new Set(ads.map(ad => ad.id)).size, ads.length);
  assert.ok(ads.every(ad => ad.brand.startsWith('Marca Exemplo')));
  assert.ok(ads.every(ad => !('spend' in ad) && !('revenue' in ad)));
});
