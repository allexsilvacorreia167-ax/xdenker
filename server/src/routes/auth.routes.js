import { Router } from 'express';
import { login, verifyToken, logout } from '../controllers/auth.controller.js';

const router = Router();

// POST /api/auth/login — nome + email → gera/solicita token
router.post('/login', login);

// POST /api/auth/verify — valida o token TKN-XXXX-XXXX
router.post('/verify', verifyToken);

// POST /api/auth/logout
router.post('/logout', logout);

export default router;
