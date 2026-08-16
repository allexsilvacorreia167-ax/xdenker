import { Router } from 'express';
import { startQuestionnaire, submitStage, getQuestionnaireStatus, calculateCoherence } from '../controllers/research.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Todas as rotas de pesquisa exigem autenticação
router.use(authMiddleware);

// Iniciar questionário
router.post('/start', startQuestionnaire);

// Enviar respostas de uma etapa (1, 2 ou 3)
router.post('/stage/:stageNumber', submitStage);

// Status do questionário do usuário
router.get('/status', getQuestionnaireStatus);

// Calcular índice de coerência (após etapa 3)
router.post('/calculate', calculateCoherence);

export default router;
