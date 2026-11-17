export type Section = 'dashboard' | 'creative-lab' | 'explorer' | 'radar' | 'dna' | 'collections' | 'settings';
export type Ad = {
  id: number; brand: string; headline: string; format: 'Vídeo' | 'Imagem';
  country: string; platform: 'Instagram' | 'Facebook'; category: string;
  concept: string; tone: 'cyan' | 'violet' | 'amber';
};
export type Filters = { query: string; format: string; platform: string };
