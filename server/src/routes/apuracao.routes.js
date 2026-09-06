import { Router } from 'express';
import {
  presidente,
  governador,
  mapaGovernador,
  mapaPresidente,
  legislativo,
  preferencias,
} from '../controllers/apuracao.controller.js';

const router = Router();

// GET /api/apuracao/presidente
router.get('/presidente', presidente);

// GET /api/apuracao/governador?uf=CE
router.get('/governador', governador);

// GET /api/apuracao/mapa-governador  (todas as UFs — usado pelo mapa)
router.get('/mapa-governador', mapaGovernador);

// GET /api/apuracao/mapa-presidente  (todas as UFs, cor por candidato líder)
router.get('/mapa-presidente', mapaPresidente);

// GET /api/apuracao/legislativo/:cargo?uf=CE
// cargo: senador | deputado_federal | deputado_estadual
router.get('/legislativo/:cargo', legislativo);

// GET /api/apuracao/preferencias
// Retorna hasCompleted:false se o usuário não fez a pesquisa (não requer login)
router.get('/preferencias', preferencias);

export default router;
