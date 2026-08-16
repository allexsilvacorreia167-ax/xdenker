/**
 * Store administrativo — fonte única de verdade
 * Alterações no ADM refletem imediatamente na área do usuário
 */

import { ALL_PARTIES, DEFAULT_SPECTRUM, SPECTRUM_OPTIONS } from '../data/parties.js';

const state = {
  // Candidatos a Presidente
  presidentCandidates: [
    { id: 'lula', name: 'Lula da Silva', party: 'PT', number: '13', active: true, photo: null },
    { id: 'flavio', name: 'Flávio Bolsonaro', party: 'PL', number: '22', active: true, photo: null },
  ],

  // Candidatos a Governador por UF
  governorCandidates: {
    CE: [
      { id: 'elmano', name: 'Elmano de Freitas', party: 'PT', number: '13', active: true, photo: null },
      { id: 'ciro', name: 'Ciro Gomes', party: 'PDT', number: '12', active: true, photo: null },
    ],
  },

  // Perguntas de competência institucional (V/F)
  institutionalQuestions: [
    { id: 1, text: 'O Presidente pode vetar leis aprovadas pelo Congresso?', correctAnswer: true, active: true },
    { id: 2, text: 'O Governador pode nomear secretários sem aprovação?', correctAnswer: false, active: true },
    { id: 3, text: 'A União pode interferir na organização dos municípios?', correctAnswer: false, active: true },
    { id: 4, text: 'O Senado pode julgar o Presidente por crimes de responsabilidade?', correctAnswer: true, active: true },
    { id: 5, text: 'O STF pode declarar inconstitucionalidade de leis federais?', correctAnswer: true, active: true },
  ],

  // Espectro político por sigla (editável no ADM)
  spectrum: { ...DEFAULT_SPECTRUM },
};

// ---------- LEITURA ----------

export function getPresidentCandidates(onlyActive = true) {
  return onlyActive
    ? state.presidentCandidates.filter((c) => c.active)
    : [...state.presidentCandidates];
}

export function getGovernorCandidates(uf = 'CE', onlyActive = true) {
  const list = state.governorCandidates[uf] || [];
  return onlyActive ? list.filter((c) => c.active) : [...list];
}

export function getAllGovernorUFs() {
  return Object.keys(state.governorCandidates);
}

export function getInstitutionalQuestions(onlyActive = true) {
  return onlyActive
    ? state.institutionalQuestions.filter((q) => q.active)
    : [...state.institutionalQuestions];
}

export function getSpectrum() {
  return { ...state.spectrum };
}

export function getSpectrumForParty(sigla) {
  return state.spectrum[sigla] || 'Centro';
}

export function getAllParties() {
  return ALL_PARTIES.map((p) => ({
    ...p,
    spectrum: state.spectrum[p.sigla] || 'Centro',
  }));
}

export function getSpectrumOptions() {
  return [...SPECTRUM_OPTIONS];
}

// ---------- ESCRITA (ADM) ----------

export function upsertPresidentCandidate(data) {
  const idx = state.presidentCandidates.findIndex((c) => c.id === data.id);
  if (idx >= 0) {
    state.presidentCandidates[idx] = { ...state.presidentCandidates[idx], ...data };
  } else {
    const id = data.id || data.name.toLowerCase().replace(/\s+/g, '-').slice(0, 20);
    state.presidentCandidates.push({
      id,
      name: data.name,
      party: data.party,
      number: data.number || '',
      active: data.active !== false,
      photo: data.photo || null,
    });
  }
  return getPresidentCandidates(false);
}

export function deletePresidentCandidate(id) {
  state.presidentCandidates = state.presidentCandidates.filter((c) => c.id !== id);
  return getPresidentCandidates(false);
}

export function upsertGovernorCandidate(uf, data) {
  if (!state.governorCandidates[uf]) state.governorCandidates[uf] = [];
  const list = state.governorCandidates[uf];
  const idx = list.findIndex((c) => c.id === data.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...data };
  } else {
    const id = data.id || data.name.toLowerCase().replace(/\s+/g, '-').slice(0, 20);
    list.push({
      id,
      name: data.name,
      party: data.party,
      number: data.number || '',
      active: data.active !== false,
      photo: data.photo || null,
    });
  }
  return getGovernorCandidates(uf, false);
}

export function deleteGovernorCandidate(uf, id) {
  if (!state.governorCandidates[uf]) return [];
  state.governorCandidates[uf] = state.governorCandidates[uf].filter((c) => c.id !== id);
  return getGovernorCandidates(uf, false);
}

export function updateQuestions(questions) {
  state.institutionalQuestions = questions.map((q, i) => ({
    id: q.id || i + 1,
    text: q.text,
    correctAnswer: Boolean(q.correctAnswer),
    active: q.active !== false,
  }));
  return getInstitutionalQuestions(false);
}

export function updateSpectrum(spectrumMap) {
  Object.entries(spectrumMap).forEach(([sigla, value]) => {
    if (SPECTRUM_OPTIONS.includes(value)) {
      state.spectrum[sigla] = value;
    }
  });
  return getSpectrum();
}

export function getAdminSnapshot() {
  return {
    presidentCandidates: getPresidentCandidates(false),
    governorCandidates: state.governorCandidates,
    questions: getInstitutionalQuestions(false),
    spectrum: getSpectrum(),
    parties: getAllParties(),
    spectrumOptions: getSpectrumOptions(),
  };
}
