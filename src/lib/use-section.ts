'use client';
import { useSyncExternalStore } from 'react';
import { sections } from './data';
import type { Section } from './types';
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
function snapshot(): Section {
  const hash = window.location.hash.slice(1);
  return sections.some(section => section.id === hash) ? hash as Section : 'dashboard';
}
export function useSection() {
  return useSyncExternalStore(subscribe, snapshot, () => 'dashboard' as Section);
}
