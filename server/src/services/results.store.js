/**
 * Resultados da pesquisa
 * - Prioridade: Supabase (survey_responses)
 * - Fallback: memória (se Supabase offline)
 */

import {
  getPresidentCandidates,
  getGovernorCandidates,
  getAllGovernorUFs,
  getSpectrumForParty,
} from './admin.store.js';
import { supabase, supabaseConfigured } from '../lib/supabase.js';

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

/** Fallback em memória */
const mem = {
  completedSurveys: [],
};

function calcPercent(votes, total) {
  if (!total || total <= 0) return 0;
  return Math.round((votes / total) * 100);
}

async function aggregateFromRows(rows) {
  const presidentVoteCounts = {};
  const governorVoteCounts = {};
  const sectorSum = Object.fromEntries(SECTOR_KEYS.map((k) => [k, 0]));
  const sectorCount = Object.fromEntries(SECTOR_KEYS.map((k) => [k, 0]));
  const sectorSumByUF = {};
  const sectorCountByUF = {};
  let knowledgeSum = 0;

  rows.forEach((r) => {
    if (r.president_id) {
      presidentVoteCounts[r.president_id] = (presidentVoteCounts[r.president_id] || 0) + 1;
    }
    const uf = (r.state_uf || 'CE').toString().toUpperCase().slice(0, 2);
    if (r.governor_id) {
      if (!governorVoteCounts[uf]) governorVoteCounts[uf] = {};
      governorVoteCounts[uf][r.governor_id] =
        (governorVoteCounts[uf][r.governor_id] || 0) + 1;
    }
    if (!sectorSumByUF[uf]) {
      sectorSumByUF[uf] = Object.fromEntries(SECTOR_KEYS.map((k) => [k, 0]));
      sectorCountByUF[uf] = Object.fromEntries(SECTOR_KEYS.map((k) => [k, 0]));
    }
    const sectors = r.sector_answers || {};
    Object.entries(sectors).forEach(([key, label]) => {
      if (sectorSum[key] === undefined) return;
      const val = SCALE_MAP[label] ?? 50;
      sectorSum[key] += val;
      sectorCount[key] += 1;
      sectorSumByUF[uf][key] += val;
      sectorCountByUF[uf][key] += 1;
    });
    knowledgeSum += r.knowledge_percent || 0;
  });

  const totalParticipants = rows.length;
  const presCandidates = await getPresidentCandidates(true);
  const totalPresVotes = Object.values(presidentVoteCounts).reduce((s, v) => s + v, 0);

  const president = await Promise.all(
    presCandidates.map(async (c) => {
      const votes = presidentVoteCounts[c.id] || 0;
      return {
        id: c.id,
        name: c.name,
        party: c.party,
        number: c.number,
        votes,
        percent: calcPercent(votes, totalPresVotes),
        spectrum: await getSpectrumForParty(c.party),
      };
    })
  );

  const governorByState = {};
  // Todas as UFs com candidatos no ADM + UFs que já receberam voto
  const registeredUFs = await getAllGovernorUFs();
  const ufs = new Set([...registeredUFs, ...Object.keys(governorVoteCounts)]);

  await Promise.all(
    [...ufs].map(async (uf) => {
      const candidates = await getGovernorCandidates(uf, true);
      const counts = governorVoteCounts[uf] || {};
      const totalGovVotes = Object.values(counts).reduce((s, v) => s + v, 0);
      governorByState[uf] = await Promise.all(
        candidates.map(async (c) => {
          const votes = counts[c.id] || 0;
          return {
            id: c.id,
            name: c.name,
            party: c.party,
            number: c.number,
            votes,
            percent: calcPercent(votes, totalGovVotes),
            spectrum: await getSpectrumForParty(c.party),
          };
        })
      );
    })
  );

  const sectorScores = {};
  SECTOR_KEYS.forEach((key) => {
    const count = sectorCount[key];
    sectorScores[key] = count > 0 ? Math.round(sectorSum[key] / count) : 0;
  });

  // Setores por UF (sensação estadual)
  const sectorEvaluationByState = {};
  Object.keys(sectorSumByUF).forEach((uf) => {
    sectorEvaluationByState[uf] = {};
    SECTOR_KEYS.forEach((key) => {
      const count = sectorCountByUF[uf][key];
      sectorEvaluationByState[uf][key] =
        count > 0 ? Math.round(sectorSumByUF[uf][key] / count) : 0;
    });
  });

  const knowledgeIndex =
    totalParticipants > 0 ? Math.round(knowledgeSum / totalParticipants) : 0;

  const recentSurveys = [...rows]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20)
    .map((r) => ({
      userId: r.user_id,
      fullName: r.full_name,
      presidentId: r.president_id,
      governorId: r.governor_id,
      stateUF: r.state_uf,
      coherenceScore: r.coherence_score,
      knowledgePercent: r.knowledge_percent,
      depFederal: r.dep_federal_name ? { name: r.dep_federal_name, party: r.dep_federal_party } : null,
      depEstadual: r.dep_estadual_name ? { name: r.dep_estadual_name, party: r.dep_estadual_party } : null,
      senador: r.senador_name ? { name: r.senador_name, party: r.senador_party } : null,
      at: r.created_at,
    }));

  return {
    totalParticipants,
    president,
    governor: governorByState,
    sectorEvaluation: sectorScores,
    sectorEvaluationByState,
    politicalKnowledgeIndex: knowledgeIndex,
    recentSurveys,
    source: supabaseConfigured ? 'supabase' : 'memory',
  };
}

async function fetchAllResponses() {
  if (!supabaseConfigured || !supabase) {
    return mem.completedSurveys.map((s) => ({
      user_id: s.userId,
      full_name: s.fullName,
      president_id: s.presidentId,
      governor_id: s.governorId,
      state_uf: s.stateUF || 'CE',
      sector_answers: s.sectorAnswers || {},
      coherence_score: s.coherenceScore || 0,
      knowledge_percent: s.knowledgePercent || 0,
      dep_federal_name: s.depFederalName || null,
      dep_federal_party: s.depFederalParty || null,
      dep_estadual_name: s.depEstadualName || null,
      dep_estadual_party: s.depEstadualParty || null,
      senador_name: s.senadorName || null,
      senador_party: s.senadorParty || null,
      created_at: s.at,
    }));
  }

  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[results] fetch survey_responses', error);
    throw error;
  }
  return data || [];
}

export async function registerSurveyResult(payload) {
  const {
    userId,
    fullName,
    institutionalAnswers = [],
    sectorAnswers = {},
    presidentId,
    governorId,
    stateUF = 'CE',
    coherenceScore = 0,
    depFederalName = null,
    depFederalParty = null,
    depEstadualName = null,
    depEstadualParty = null,
    senadorName = null,
    senadorParty = null,
  } = payload;

  if (!userId) {
    return { ok: false, error: 'userId obrigatório' };
  }

  const correctCount = institutionalAnswers.filter((a) => a.isCorrect).length;
  const knowledgePercent = institutionalAnswers.length
    ? Math.round((correctCount / institutionalAnswers.length) * 100)
    : 0;

  if (supabaseConfigured && supabase) {
    // Já participou?
    const { data: existing } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      return { ok: false, error: 'Usuário já participou' };
    }

    const { error: insErr } = await supabase.from('survey_responses').insert([
      {
        user_id: userId,
        full_name: fullName || 'Participante',
        president_id: presidentId || null,
        governor_id: governorId || null,
        state_uf: stateUF,
        institutional_answers: institutionalAnswers,
        sector_answers: sectorAnswers,
        coherence_score: coherenceScore,
        knowledge_percent: knowledgePercent,
        dep_federal_name: depFederalName,
        dep_federal_party: depFederalParty,
        dep_estadual_name: depEstadualName,
        dep_estadual_party: depEstadualParty,
        senador_name: senadorName,
        senador_party: senadorParty,
      },
    ]);

    if (insErr) {
      console.error('[results] insert', insErr);
      return { ok: false, error: insErr.message };
    }

    await supabase
      .from('app_users')
      .update({ has_completed_survey: true })
      .eq('id', userId);

    const rows = await fetchAllResponses();
    return { ok: true, totalParticipants: rows.length };
  }

  // Memória
  if (mem.completedSurveys.some((s) => s.userId === userId)) {
    return { ok: false, error: 'Usuário já participou' };
  }

  mem.completedSurveys.push({
    userId,
    fullName,
    presidentId,
    governorId,
    stateUF,
    coherenceScore,
    knowledgePercent,
    sectorAnswers,
    institutionalAnswers,
    depFederalName,
    depFederalParty,
    depEstadualName,
    depEstadualParty,
    senadorName,
    senadorParty,
    at: new Date().toISOString(),
  });

  return {
    ok: true,
    totalParticipants: mem.completedSurveys.length,
    warning: 'Salvo só em memória — configure Supabase no Render',
  };
}

export async function getAggregatedResults() {
  try {
    const rows = await fetchAllResponses();
    return await aggregateFromRows(rows);
  } catch (e) {
    console.error('[results] aggregate', e);
    return await aggregateFromRows([]);
  }
}

export async function hasUserVoted(userId) {
  if (!userId) return false;

  if (supabaseConfigured && supabase) {
    const { data } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    return Boolean(data);
  }

  return mem.completedSurveys.some((s) => s.userId === userId);
}

export async function resetResults() {
  if (supabaseConfigured && supabase) {
    await supabase.from('survey_responses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
  mem.completedSurveys = [];
  return { ok: true };
}

/**
 * Retorna a resposta de pesquisa de um usuário específico, ou null se ele
 * ainda não participou. Usado pelo módulo de Apuração para decidir o
 * painel padrão (UF + candidatos escolhidos na pesquisa).
 */
export async function getUserSurveyResponse(userId) {
  if (!userId) return null;

  if (supabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('survey_responses')
      .select(
        'user_id, president_id, governor_id, state_uf, dep_federal_name, dep_federal_party, dep_estadual_name, dep_estadual_party, senador_name, senador_party'
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[results] getUserSurveyResponse', error);
      return null;
    }
    if (!data) return null;

    return {
      userId: data.user_id,
      presidentId: data.president_id,
      governorId: data.governor_id,
      stateUF: data.state_uf,
      depFederal: data.dep_federal_name
        ? { name: data.dep_federal_name, party: data.dep_federal_party }
        : null,
      depEstadual: data.dep_estadual_name
        ? { name: data.dep_estadual_name, party: data.dep_estadual_party }
        : null,
      senador: data.senador_name
        ? { name: data.senador_name, party: data.senador_party }
        : null,
    };
  }

  // Fallback em memória (mesmo formato do array `mem.completedSurveys`)
  const found = mem.completedSurveys.find((s) => s.userId === userId);
  if (!found) return null;

  return {
    userId: found.userId,
    presidentId: found.presidentId,
    governorId: found.governorId,
    stateUF: found.stateUF,
    depFederal: found.depFederalName
      ? { name: found.depFederalName, party: found.depFederalParty }
      : null,
    depEstadual: found.depEstadualName
      ? { name: found.depEstadualName, party: found.depEstadualParty }
      : null,
    senador: found.senadorName
      ? { name: found.senadorName, party: found.senadorParty }
      : null,
  };
}