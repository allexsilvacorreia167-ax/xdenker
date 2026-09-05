import { Router } from 'express';
import {
  presidente,
  governador,
  mapaGovernador,
  legislativo,
} from '../controllers/apuracao.controller.js';

const router = Router();

// GET /api/apuracao/presidente
router.get('/presidente', presidente);

// GET /api/apuracao/governador?uf=CE
router.get('/governador', governador);

// GET /api/apuracao/mapa-governador  (todas as UFs — usado pelo mapa no desktop)
router.get('/mapa-governador', mapaGovernador);

// GET /api/apuracao/legislativo/:cargo?uf=CE
// cargo: senador | deputado_federal | deputado_estadual
router.get('/legislativo/:cargo', legislativo);

export default router;
