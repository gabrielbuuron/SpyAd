export const COLLECTION_KEY = 'spyad:collections:v1';
export const COLLECTION_EVENT = 'spyad:collections-change';
/** @param {string} value */
export function normalize(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR').trim();
}
/** @param {import('./types').Ad[]} ads @param {import('./types').Filters} filters @param {number[] | null} saved */
export function filterAds(ads, filters, saved = null) {
  const words = normalize(filters.query).split(/\s+/).filter(Boolean);
  return ads.filter(ad => {
    const text = normalize([ad.brand, ad.headline, ad.concept, ad.format, ad.country, ad.platform, ad.category].join(' '));
    return words.every(word => text.includes(word)) &&
      (filters.format === 'all' || ad.format === filters.format) &&
      (filters.platform === 'all' || ad.platform === filters.platform) &&
      (saved === null || saved.includes(ad.id));
  });
}
/** @param {string | null} raw @param {number[]} allowedIds */
export function parseCollection(raw, allowedIds) {
  if (raw === null) return { ids: [], invalid: false };
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || !Array.isArray(value.ids) || !value.ids.every(id => Number.isInteger(id))) throw Error();
    return { ids: [...new Set(value.ids.filter(id => allowedIds.includes(id)))], invalid: false };
  } catch { return { ids: [], invalid: true }; }
}
/** @param {number[]} ids @param {number} id */
export function toggleSaved(ids, id) {
  return ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id];
}
/** @param {{getItem:(key:string)=>string|null,setItem:(key:string,value:string)=>void}} storage @param {number[]} allowedIds @param {number | null} id */
export function updateCollection(storage, allowedIds, id) {
  try {
    if (id !== null && !allowedIds.includes(id)) throw Error();
    const current = parseCollection(storage.getItem(COLLECTION_KEY), allowedIds);
    if (current.invalid && id !== null) return { ok: false, error: 'A coleção local está inválida. Redefina nas configurações.' };
    const ids = id === null ? [] : toggleSaved(current.ids, id);
    storage.setItem(COLLECTION_KEY, JSON.stringify({ version: 1, ids }));
    return { ok: true, ids, error: '' };
  } catch { return { ok: false, error: 'O navegador bloqueou o armazenamento. A coleção não foi alterada.' }; }
}
