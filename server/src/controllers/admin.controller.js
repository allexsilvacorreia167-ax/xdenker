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
    res.json(getAdminSnapshot());
  } catch (e) {
    res.status(500).json({ error: 'Erro ao carregar painel' });
  }
};

// --- Candidatos Presidente ---
export const getCandidates = async (req, res) => {
  try {
    res.json({
      president: getPresidentCandidates(false),
      governor: Object.fromEntries(
        getAllGovernorUFs().map((uf) => [uf, getGovernorCandidates(uf, false)])
      ),
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar candidatos' });
  }
};

export const createCandidate = async (req, res) => {
  try {
    const { position, stateUF, ...data } = req.body;
    if (position === 'governador') {
      const list = upsertGovernorCandidate(stateUF || 'CE', data);
      return res.status(201).json({ message: 'Governador criado', candidates: list });
    }
    const list = upsertPresidentCandidate(data);
    res.status(201).json({ message: 'Presidente criado', candidates: list });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar candidato' });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, stateUF, ...data } = req.body;
    data.id = id;
    if (position === 'governador') {
      const list = upsertGovernorCandidate(stateUF || 'CE', data);
      return res.json({ message: 'Atualizado', candidates: list });
    }
    const list = upsertPresidentCandidate(data);
    res.json({ message: 'Atualizado', candidates: list });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, stateUF } = req.query;
    if (position === 'governador') {
      const list = deleteGovernorCandidate(stateUF || 'CE', id);
      return res.json({ message: 'Removido', candidates: list });
    }
    const list = deletePresidentCandidate(id);
    res.json({ message: 'Removido', candidates: list });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao remover' });
  }
};

// --- Perguntas ---
export const getQuestions = async (req, res) => {
  try {
    res.json({ questions: getInstitutionalQuestions(false) });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar perguntas' });
  }
};

export const updateQuestionsHandler = async (req, res) => {
  try {
    const { questions } = req.body;
    const updated = updateQuestions(questions || []);
    res.json({ message: 'Perguntas atualizadas', questions: updated });
  } catch (e) {
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
    res.json({
      spectrum: getSpectrum(),
      parties: getAllParties(),
      options: getSpectrumOptions(),
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar espectro' });
  }
};

export const updatePoliticalSpectrum = async (req, res) => {
  try {
    const { spectrum } = req.body;
    const updated = updateSpectrum(spectrum || {});
    res.json({ message: 'Espectro atualizado', spectrum: updated, parties: getAllParties() });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar espectro' });
  }
};
