import { Router } from 'express';
import { adminLogin, adminLogout } from '../controllers/adminAuth.controller.js';

const router = Router();

// POST /api/admin-auth/login — e-mail + senha → JWT de admin
router.post('/login', adminLogin);

// POST /api/admin-auth/logout
router.post('/logout', adminLogout);

export default router;