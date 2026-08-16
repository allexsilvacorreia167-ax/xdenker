/**
 * Store de resultados em memória (tempo real)
 * - Inicia ZERADO (sem votos fictícios)
 * - Percentual = votos_candidato / total_votos * 100
 * - Áreas prioritárias = média das avaliações (Ruim=25, Médio=50, Bom=75, Excelente=100)
 *
 * Exemplo: 10 pesquisas, 4 no A e 6 no B → A=40%, B=60%
 */

import {
  getPresidentCandidates,
  getGovernorCandidates,
  getSpectrumForParty,
} from './admin.store.js';

const SCALE_MAP = {
  Ruim: 25,
  Médio: 50,
  Bom: 75,
  Excelente: 100,
};

const SECTOR_KEYS = [
  'seguranca',
  'saude',
  'educacao',
  'economia',
  'infraestrutura',
  'combateCorrupcao',
];

const state = {
  totalParticipants: 0,
  presidentVoteCounts: {}, // { candidateId: n }
  governorVoteCounts: {}, // { UF: { candidateId: n } }
  sectorSum: Object.fromEntries(SECTOR_KEYS.map((k) => [k, 0])),
  sectorCount: Object.fromEntries(SECTOR_KEYS.map((k) => [k, 0])),
  knowledgeSum: 0,
  completedSurveys: [], // { userId, fullName, presidentId, governorId, ... }
};

function calcPercent(votes, total) {
  if (!total || total <= 0) return 0;
  return Math.round((votes / total) * 100);
}

export function registerSurveyResult(payload) {
  const {
    userId,
    fullName,
    institutionalAnswers = [],
    sectorAnswers = {},
    presidentId,
    governorId,
    stateUF = 'CE',
    coherenceScore = 0,
  } = payload;

  if (!userId) {
    return { ok: false, error: 'userId obrigatório' };
  }

  if (state.completedSurveys.some((s) => s.userId === userId)) {
    return { ok: false, error: 'Usuário já participou' };
  }

  state.totalParticipants += 1;

  // Voto presidente
  if (presidentId) {
    state.presidentVoteCounts[presidentId] = (state.presidentVoteCounts[presidentId] || 0) + 1;
  }

  // Voto governador
  if (governorId) {
    if (!state.governorVoteCounts[stateUF]) state.governorVoteCounts[stateUF] = {};
    state.governorVoteCounts[stateUF][governorId] =
      (state.governorVoteCounts[stateUF][governorId] || 0) + 1;
  }

  // Áreas prioritárias (média)
  Object.entries(sectorAnswers).forEach(([key, label]) => {
    if (state.sectorSum[key] === undefined) return;
    const value = SCALE_MAP[label] ?? 50;
    state.sectorSum[key] += value;
    state.sectorCount[key] += 1;
  });

  // Conhecimento institucional
  const correctCount = institutionalAnswers.filter((a) => a.isCorrect).length;
  const knowledgePercent = institutionalAnswers.length
    ? Math.round((correctCount / institutionalAnswers.length) * 100)
    : 0;
  state.knowledgeSum += knowledgePercent;

  state.completedSurveys.push({
    userId,
    fullName: fullName || 'Participante',
    presidentId,
    governorId,
    stateUF,
    coherenceScore,
    knowledgePercent,
    sectorAnswers,
    at: new Date().toISOString(),
  });

  return {
    ok: true,
    totalParticipants: state.totalParticipants,
  };
}

export function getAggregatedResults() {
  const presCandidates = getPresidentCandidates(true);
  const totalPresVotes = Object.values(state.presidentVoteCounts).reduce((s, v) => s + v, 0);

  const president = presCandidates.map((c) => {
    const votes = state.presidentVoteCounts[c.id] || 0;
    return {
      id: c.id,
      name: c.name,
      party: c.party,
      number: c.number,
      votes,
      percent: calcPercent(votes, totalPresVotes),
      spectrum: getSpectrumForParty(c.party),
    };
  });

  const governorByState = {};
  const ufs = new Set([...Object.keys(state.governorVoteCounts), 'CE']);
  ufs.forEach((uf) => {
    const candidates = getGovernorCandidates(uf, true);
    const counts = state.governorVoteCounts[uf] || {};
    const totalGovVotes = Object.values(counts).reduce((s, v) => s + v, 0);
    governorByState[uf] = candidates.map((c) => {
      const votes = counts[c.id] || 0;
      return {
        id: c.id,
        name: c.name,
        party: c.party,
        number: c.number,
        votes,
        percent: calcPercent(votes, totalGovVotes),
        spectrum: getSpectrumForParty(c.party),
      };
    });
  });

  // Média das áreas (0 se ninguém respondeu)
  const sectorScores = {};
  SECTOR_KEYS.forEach((key) => {
    const count = state.sectorCount[key];
    sectorScores[key] = count > 0 ? Math.round(state.sectorSum[key] / count) : 0;
  });

  const knowledgeIndex =
    state.totalParticipants > 0
      ? Math.round(state.knowledgeSum / state.totalParticipants)
      : 0;

  return {
    totalParticipants: state.totalParticipants,
    president,
    governor: governorByState,
    sectorEvaluation: sectorScores,
    politicalKnowledgeIndex: knowledgeIndex,
    recentSurveys: state.completedSurveys.slice(-20).reverse(),
  };
}

export function hasUserVoted(userId) {
  if (!userId) return false;
  return state.completedSurveys.some((s) => s.userId === userId);
}

/** Zera tudo — útil em testes */
export function resetResults() {
  state.totalParticipants = 0;
  state.presidentVoteCounts = {};
  state.governorVoteCounts = {};
  state.sectorSum = Object.fromEntries(SECTOR_KEYS.map((k) => [k, 0]));
  state.sectorCount = Object.fromEntries(SECTOR_KEYS.map((k) => [k, 0]));
  state.knowledgeSum = 0;
  state.completedSurveys = [];
  return { ok: true };
}
