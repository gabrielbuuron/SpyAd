import type { Ad, Section } from './types';

export const sections: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Visão geral', icon: 'dashboard' },
  { id: 'explorer', label: 'Ad Explorer', icon: 'search' },
  { id: 'radar', label: 'Spy Radar', icon: 'radar' },
  { id: 'dna', label: 'Offer DNA', icon: 'dna' },
  { id: 'collections', label: 'Coleções', icon: 'collection' },
  { id: 'settings', label: 'Configurações', icon: 'settings' },
];
// Exemplos editoriais locais; não coletados de plataformas.
export const ads: Ad[] = [
  { id: 1, brand: 'Marca Exemplo A', headline: 'Criativo demonstrativo de lançamento', format: 'Vídeo', country: 'Brasil', platform: 'Instagram', category: 'Lançamento', concept: 'Um novo ponto de vista.', tone: 'cyan' },
  { id: 2, brand: 'Marca Exemplo B', headline: 'Oferta ilustrativa de e-commerce', format: 'Imagem', country: 'Brasil', platform: 'Facebook', category: 'E-commerce', concept: 'O essencial. De outro jeito.', tone: 'violet' },
  { id: 3, brand: 'Marca Exemplo C', headline: 'Campanha fictícia de descoberta', format: 'Vídeo', country: 'Brasil', platform: 'Facebook', category: 'Descoberta', concept: 'Sua próxima descoberta.', tone: 'amber' },
];
export const emptyFilters = { query: '', format: 'all', platform: 'all' };
