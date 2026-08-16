import { Router } from 'express';
import {
  getHomeData,
  getGlobalResults,
  getBlogPosts,
  getContactInfo,
  resetAllResults,
} from '../controllers/public.controller.js';

const router = Router();

router.get('/', getHomeData);
router.get('/pesquisas', getGlobalResults);
router.get('/blog', getBlogPosts);
router.get('/contato', getContactInfo);
router.post('/reset-results', resetAllResults);

export default router;
