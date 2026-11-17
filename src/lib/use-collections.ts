'use client';
import { useSyncExternalStore } from 'react';
import { ads } from './data';
import { COLLECTION_EVENT, COLLECTION_KEY, parseCollection, updateCollection } from './domain.mjs';
const allowedIds = ads.map(ad => ad.id);
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(COLLECTION_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(COLLECTION_EVENT, callback);
  };
}
function snapshot() {
  try { return window.localStorage.getItem(COLLECTION_KEY); }
  catch { return '!unavailable'; }
}
function serverSnapshot() { return null; }
export function useCollections() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const parsed = parseCollection(raw, allowedIds);
  function update(id: number | null) {
    let result;
    try { result = updateCollection(window.localStorage, allowedIds, id); }
    catch { result = { ok: false, error: 'O navegador bloqueou o armazenamento. A coleção não foi alterada.' }; }
    if (result.ok) window.dispatchEvent(new Event(COLLECTION_EVENT));
    return result;
  }
  return { saved: parsed.ids as number[], invalid: parsed.invalid, toggle: (id: number) => update(id), clear: () => update(null) };
}
