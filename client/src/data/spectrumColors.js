/**
 * Degradê de 5 cores por espectro político — mesmos valores usados no
 * backend (server/src/services/apuracao.service.js -> SPECTRUM_COLORS).
 *
 * Isso é só um token visual (qual hex representa cada categoria), não uma
 * decisão de negócio — QUEM está em cada categoria continua vindo sempre
 * do backend (tabela party_spectrum no Supabase, via getSpectrumForParty).
 * Os candidatos já chegam com `color` pronto; este arquivo só é usado onde
 * não há um candidato específico por trás (ex.: agregações por estado).
 */
export const SPECTRUM_ORDER = [
  'Esquerda',
  'Centro-Esquerda',
  'Centro',
  'Centro-Direita',
  'Direita',
];

export const SPECTRUM_COLORS = {
  Esquerda: '#C0392B',
  'Centro-Esquerda': '#E67E62',
  Centro: '#F1C40F',
  'Centro-Direita': '#52BE80',
  Direita: '#1E8449',
};
