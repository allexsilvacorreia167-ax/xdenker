import { Router } from 'express';
import {
  getDashboard,
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getQuestions,
  updateQuestionsHandler,
  getUsers,
  getPoliticalSpectrum,
  updatePoliticalSpectrum,
} from '../controllers/admin.controller.js';
import { adminMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
router.use(adminMiddleware);

router.get('/dashboard', getDashboard);

router.get('/candidates', getCandidates);
router.post('/candidates', createCandidate);
router.put('/candidates/:id', updateCandidate);
router.delete('/candidates/:id', deleteCandidate);

router.get('/questions', getQuestions);
router.put('/questions', updateQuestionsHandler);

router.get('/users', getUsers);

router.get('/spectrum', getPoliticalSpectrum);
router.put('/spectrum', updatePoliticalSpectrum);

export default router;
