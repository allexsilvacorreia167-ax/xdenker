import {
  listElections,
  listCandidates,
  searchLegislative,
  getCandidateDetail,
  CARGO_CODES,
} from '../services/tse.service.js';

export const getElections = async (req, res) => {
  try {
    const data = await listElections();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Falha ao consultar TSE', detail: e.message });
  }
};

export const getCandidates = async (req, res) => {
  try {
    const year = Number(req.query.year || req.params.year || 2026);
    const uf = (req.query.uf || req.params.uf || 'BR').toUpperCase();
    const cargoName = req.query.cargo || req.params.cargo || 'presidente';
    const cargo = CARGO_CODES[cargoName] || Number(cargoName) || 1;

    const data = await listCandidates(year, uf, cargo);
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Falha ao listar candidatos TSE', detail: e.message });
  }
};

export const searchCandidates = async (req, res) => {
  try {
    const year = Number(req.query.year || 2026);
    const uf = (req.query.uf || 'CE').toUpperCase();
    const cargoName = req.query.cargo || 'deputado_federal';
    const cargo = CARGO_CODES[cargoName] || Number(cargoName) || 6;
    const q = req.query.q || '';
    const limit = Math.min(Number(req.query.limit) || 20, 50);

    const data = await searchLegislative(year, uf, cargo, q, limit);
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Falha na busca TSE', detail: e.message });
  }
};

export const getCandidate = async (req, res) => {
  try {
    const year = Number(req.query.year || 2026);
    const { id } = req.params;
    const data = await getCandidateDetail(year, id);
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'Falha ao buscar candidato', detail: e.message });
  }
};

export const getCargoCodes = async (req, res) => {
  res.json({ cargos: CARGO_CODES });
};
