import { Router } from 'express';
import {
  getElections,
  getCandidates,
  searchCandidates,
  getCandidate,
  getCargoCodes,
} from '../controllers/tse.controller.js';

const router = Router();

// GET /api/tse/eleicoes
router.get('/eleicoes', getElections);

// GET /api/tse/cargos
router.get('/cargos', getCargoCodes);

// GET /api/tse/candidatos?year=2026&uf=BR&cargo=presidente
router.get('/candidatos', getCandidates);

// GET /api/tse/buscar?q=silva&uf=CE&cargo=deputado_federal&year=2026
router.get('/buscar', searchCandidates);

// GET /api/tse/candidato/:id?year=2026
router.get('/candidato/:id', getCandidate);

export default router;
