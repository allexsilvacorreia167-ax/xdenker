/**
 * Painel Administrativo — gestão que reflete na área do usuário
 */

import {
  getAdminSnapshot,
  getPresidentCandidates,
  upsertPresidentCandidate,
  deletePresidentCandidate,
  getGovernorCandidates,
  upsertGovernorCandidate,
  deleteGovernorCandidate,
  getInstitutionalQuestions,
  updateQuestions,
  getSpectrum,
  updateSpectrum,
  getAllParties,
  getSpectrumOptions,
  getAllGovernorUFs,
} from '../services/admin.store.js';

export const getDashboard = async (req, res) => {
  try {
    const snapshot = await getAdminSnapshot();
    res.json(snapshot);
  } catch (e) {
    console.error('[admin.controller] getDashboard', e);
    res.status(500).json({ error: 'Erro ao carregar painel' });
  }
};

// --- Candidatos Presidente ---
export const getCandidates = async (req, res) => {
  try {
    const ufs = await getAllGovernorUFs();
    const governorEntries = await Promise.all(
      ufs.map(async (uf) => [uf, await getGovernorCandidates(uf, false)])
    );
    res.json({
      president: await getPresidentCandidates(false),
      governor: Object.fromEntries(governorEntries),
    });
  } catch (e) {
    console.error('[admin.controller] getCandidates', e);
    res.status(500).json({ error: 'Erro ao listar candidatos' });
  }
};

export const createCandidate = async (req, res) => {
  try {
    const { position, stateUF, ...data } = req.body;
    if (position === 'governador') {
      const list = await upsertGovernorCandidate(stateUF || 'CE', data);
      return res.status(201).json({ message: 'Governador criado', candidates: list });
    }
    const list = await upsertPresidentCandidate(data);
    res.status(201).json({ message: 'Presidente criado', candidates: list });
  } catch (e) {
    console.error('[admin.controller] createCandidate', e);
    res.status(500).json({ error: 'Erro ao criar candidato' });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, stateUF, ...data } = req.body;
    data.id = id;
    if (position === 'governador') {
      const list = await upsertGovernorCandidate(stateUF || 'CE', data);
      return res.json({ message: 'Atualizado', candidates: list });
    }
    const list = await upsertPresidentCandidate(data);
    res.json({ message: 'Atualizado', candidates: list });
  } catch (e) {
    console.error('[admin.controller] updateCandidate', e);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, stateUF } = req.query;
    if (position === 'governador') {
      const list = await deleteGovernorCandidate(stateUF || 'CE', id);
      return res.json({ message: 'Removido', candidates: list });
    }
    const list = await deletePresidentCandidate(id);
    res.json({ message: 'Removido', candidates: list });
  } catch (e) {
    console.error('[admin.controller] deleteCandidate', e);
    res.status(500).json({ error: 'Erro ao remover' });
  }
};

// --- Perguntas ---
export const getQuestions = async (req, res) => {
  try {
    const questions = await getInstitutionalQuestions(false);
    res.json({ questions });
  } catch (e) {
    console.error('[admin.controller] getQuestions', e);
    res.status(500).json({ error: 'Erro ao buscar perguntas' });
  }
};

export const updateQuestionsHandler = async (req, res) => {
  try {
    const { questions } = req.body;
    const updated = await updateQuestions(questions || []);
    res.json({ message: 'Perguntas atualizadas', questions: updated });
  } catch (e) {
    console.error('[admin.controller] updateQuestionsHandler', e);
    res.status(500).json({ error: 'Erro ao atualizar perguntas' });
  }
};

// --- Usuários (placeholder) ---
export const getUsers = async (req, res) => {
  try {
    res.json({ users: [] });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

// --- Espectro Político ---
export const getPoliticalSpectrum = async (req, res) => {
  try {
    const [spectrum, parties] = await Promise.all([getSpectrum(), getAllParties()]);
    res.json({
      spectrum,
      parties,
      options: getSpectrumOptions(),
    });
  } catch (e) {
    console.error('[admin.controller] getPoliticalSpectrum', e);
    res.status(500).json({ error: 'Erro ao buscar espectro' });
  }
};

export const updatePoliticalSpectrum = async (req, res) => {
  try {
    const { spectrum } = req.body;
    const updated = await updateSpectrum(spectrum || {});
    const parties = await getAllParties();
    res.json({ message: 'Espectro atualizado', spectrum: updated, parties });
  } catch (e) {
    console.error('[admin.controller] updatePoliticalSpectrum', e);
    res.status(500).json({ error: 'Erro ao atualizar espectro' });
  }
};