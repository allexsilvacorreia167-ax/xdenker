/**
 * Store administrativo — fonte única de verdade
 * Agora persistido no Supabase (tabelas: candidates, institutional_questions, party_spectrum)
 * Alterações no ADM refletem imediatamente na área do usuário
 */

import { ALL_PARTIES, DEFAULT_SPECTRUM, SPECTRUM_OPTIONS } from '../data/parties.js';
import { supabase, supabaseConfigured } from '../lib/supabase.js';

// ---------- Fallback em memória (só usado se Supabase estiver offline) ----------
const mem = {
  presidentCandidates: [
    { id: 'lula', name: 'Lula da Silva', party: 'PT', number: '13', active: true, photo: null },
    { id: 'flavio', name: 'Flávio Bolsonaro', party: 'PL', number: '22', active: true, photo: null },
  ],
  governorCandidates: {
    CE: [
      { id: 'elmano', name: 'Elmano de Freitas', party: 'PT', number: '13', active: true, photo: null },
      { id: 'ciro', name: 'Ciro Gomes', party: 'PDT', number: '12', active: true, photo: null },
    ],
  },
  institutionalQuestions: [
    { id: 1, text: 'O Presidente pode vetar leis aprovadas pelo Congresso?', correctAnswer: true, active: true },
    { id: 2, text: 'O Governador pode nomear secretários sem aprovação?', correctAnswer: false, active: true },
    { id: 3, text: 'A União pode interferir na organização dos municípios?', correctAnswer: false, active: true },
    { id: 4, text: 'O Senado pode julgar o Presidente por crimes de responsabilidade?', correctAnswer: true, active: true },
    { id: 5, text: 'O STF pode declarar inconstitucionalidade de leis federais?', correctAnswer: true, active: true },
  ],
  spectrum: { ...DEFAULT_SPECTRUM },
};

function rowToCandidate(row) {
  return {
    id: row.id,
    name: row.name,
    party: row.party,
    number: row.number || '',
    active: row.active,
    photo: row.photo || null,
  };
}

function slugify(name = '') {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 30);
}

// ---------- LEITURA ----------

export async function getPresidentCandidates(onlyActive = true) {
  if (!supabaseConfigured || !supabase) {
    return onlyActive ? mem.presidentCandidates.filter((c) => c.active) : [...mem.presidentCandidates];
  }
  let query = supabase.from('candidates').select('*').eq('position', 'presidente');
  if (onlyActive) query = query.eq('active', true);
  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) {
    console.error('[admin.store] getPresidentCandidates', error);
    return [];
  }
  return (data || []).map(rowToCandidate);
}

export async function getGovernorCandidates(uf = 'CE', onlyActive = true) {
  if (!supabaseConfigured || !supabase) {
    const list = mem.governorCandidates[uf] || [];
    return onlyActive ? list.filter((c) => c.active) : [...list];
  }
  let query = supabase
    .from('candidates')
    .select('*')
    .eq('position', 'governador')
    .eq('uf', uf);
  if (onlyActive) query = query.eq('active', true);
  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) {
    console.error('[admin.store] getGovernorCandidates', error);
    return [];
  }
  return (data || []).map(rowToCandidate);
}

export async function getAllGovernorUFs() {
  if (!supabaseConfigured || !supabase) {
    return Object.keys(mem.governorCandidates);
  }
  const { data, error } = await supabase
    .from('candidates')
    .select('uf')
    .eq('position', 'governador');
  if (error) {
    console.error('[admin.store] getAllGovernorUFs', error);
    return [];
  }
  return [...new Set((data || []).map((r) => r.uf).filter(Boolean))];
}

export async function getInstitutionalQuestions(onlyActive = true) {
  if (!supabaseConfigured || !supabase) {
    return onlyActive
      ? mem.institutionalQuestions.filter((q) => q.active)
      : [...mem.institutionalQuestions];
  }
  let query = supabase.from('institutional_questions').select('*');
  if (onlyActive) query = query.eq('active', true);
  const { data, error } = await query.order('id', { ascending: true });
  if (error) {
    console.error('[admin.store] getInstitutionalQuestions', error);
    return [];
  }
  return (data || []).map((q) => ({
    id: q.id,
    text: q.text,
    correctAnswer: q.correct_answer,
    active: q.active,
  }));
}

export async function getSpectrum() {
  if (!supabaseConfigured || !supabase) {
    return { ...mem.spectrum };
  }
  const { data, error } = await supabase.from('party_spectrum').select('*');
  if (error) {
    console.error('[admin.store] getSpectrum', error);
    return { ...DEFAULT_SPECTRUM };
  }
  const map = {};
  (data || []).forEach((row) => {
    map[row.sigla] = row.spectrum;
  });
  return map;
}

export async function getSpectrumForParty(sigla) {
  const spectrum = await getSpectrum();
  return spectrum[sigla] || 'Centro';
}

export async function getAllParties() {
  const spectrum = await getSpectrum();
  return ALL_PARTIES.map((p) => ({
    ...p,
    spectrum: spectrum[p.sigla] || 'Centro',
  }));
}

export function getSpectrumOptions() {
  return [...SPECTRUM_OPTIONS];
}

// ---------- ESCRITA (ADM) ----------

export async function upsertPresidentCandidate(data) {
  if (!supabaseConfigured || !supabase) {
    const idx = mem.presidentCandidates.findIndex((c) => c.id === data.id);
    if (idx >= 0) {
      mem.presidentCandidates[idx] = { ...mem.presidentCandidates[idx], ...data };
    } else {
      const id = data.id || slugify(data.name);
      mem.presidentCandidates.push({
        id, name: data.name, party: data.party, number: data.number || '',
        active: data.active !== false, photo: data.photo || null,
      });
    }
    return getPresidentCandidates(false);
  }

  const id = data.id || slugify(data.name);
  const { error } = await supabase.from('candidates').upsert(
    {
      id,
      position: 'presidente',
      uf: null,
      name: data.name,
      party: data.party,
      number: data.number || '',
      active: data.active !== false,
      photo: data.photo || null,
    },
    { onConflict: 'id' }
  );
  if (error) {
    console.error('[admin.store] upsertPresidentCandidate', error);
    throw error;
  }
  return getPresidentCandidates(false);
}

export async function deletePresidentCandidate(id) {
  if (!supabaseConfigured || !supabase) {
    mem.presidentCandidates = mem.presidentCandidates.filter((c) => c.id !== id);
    return getPresidentCandidates(false);
  }
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id)
    .eq('position', 'presidente');
  if (error) {
    console.error('[admin.store] deletePresidentCandidate', error);
    throw error;
  }
  return getPresidentCandidates(false);
}

export async function upsertGovernorCandidate(uf, data) {
  if (!supabaseConfigured || !supabase) {
    if (!mem.governorCandidates[uf]) mem.governorCandidates[uf] = [];
    const list = mem.governorCandidates[uf];
    const idx = list.findIndex((c) => c.id === data.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
    } else {
      const id = data.id || slugify(data.name);
      list.push({
        id, name: data.name, party: data.party, number: data.number || '',
        active: data.active !== false, photo: data.photo || null,
      });
    }
    return getGovernorCandidates(uf, false);
  }

  // id único por UF+nome, pra não colidir com governador de outro estado
  const id = data.id || `${slugify(data.name)}-${uf.toLowerCase()}`;
  const { error } = await supabase.from('candidates').upsert(
    {
      id,
      position: 'governador',
      uf,
      name: data.name,
      party: data.party,
      number: data.number || '',
      active: data.active !== false,
      photo: data.photo || null,
    },
    { onConflict: 'id' }
  );
  if (error) {
    console.error('[admin.store] upsertGovernorCandidate', error);
    throw error;
  }
  return getGovernorCandidates(uf, false);
}

export async function deleteGovernorCandidate(uf, id) {
  if (!supabaseConfigured || !supabase) {
    if (!mem.governorCandidates[uf]) return [];
    mem.governorCandidates[uf] = mem.governorCandidates[uf].filter((c) => c.id !== id);
    return getGovernorCandidates(uf, false);
  }
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id)
    .eq('position', 'governador')
    .eq('uf', uf);
  if (error) {
    console.error('[admin.store] deleteGovernorCandidate', error);
    throw error;
  }
  return getGovernorCandidates(uf, false);
}

export async function updateQuestions(questions) {
  const normalized = questions.map((q, i) => {
    // Se o id for um número muito grande (Date.now), ignora e usa índice
    const safeId = (typeof q.id === 'number' && q.id < 2147483647) ? q.id : i + 1;

    return {
      id: safeId,
      text: q.text,
      correct_answer: Boolean(q.correctAnswer),
      active: q.active !== false,
    };
  });

  if (!supabaseConfigured || !supabase) {
    mem.institutionalQuestions = normalized.map((q) => ({
      id: q.id,
      text: q.text,
      correctAnswer: q.correct_answer,
      active: q.active,
    }));
    return getInstitutionalQuestions(false);
  }

  const { error } = await supabase
    .from('institutional_questions')
    .upsert(normalized, { onConflict: 'id' });

  if (error) {
    console.error('[admin.store] updateQuestions', error);
    throw error;
  }

  return getInstitutionalQuestions(false);
}

export async function updateSpectrum(spectrumMap) {
  const entries = Object.entries(spectrumMap).filter(([, value]) =>
    SPECTRUM_OPTIONS.includes(value)
  );

  if (!supabaseConfigured || !supabase) {
    entries.forEach(([sigla, value]) => {
      mem.spectrum[sigla] = value;
    });
    return getSpectrum();
  }

  const rows = entries.map(([sigla, spectrum]) => ({ sigla, spectrum }));
  if (rows.length > 0) {
    const { error } = await supabase.from('party_spectrum').upsert(rows, { onConflict: 'sigla' });
    if (error) {
      console.error('[admin.store] updateSpectrum', error);
      throw error;
    }
  }
  return getSpectrum();
}

export async function getAdminSnapshot() {
  const [presidentCandidates, ufs, questions, spectrum, parties] = await Promise.all([
    getPresidentCandidates(false),
    getAllGovernorUFs(),
    getInstitutionalQuestions(false),
    getSpectrum(),
    getAllParties(),
  ]);

  const governorCandidates = {};
  await Promise.all(
    ufs.map(async (uf) => {
      governorCandidates[uf] = await getGovernorCandidates(uf, false);
    })
  );

  return {
    presidentCandidates,
    governorCandidates,
    questions,
    spectrum,
    parties,
    spectrumOptions: getSpectrumOptions(),
  };
}