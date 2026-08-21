/**
 * Middlewares de autenticação
 * - authMiddleware: valida JWT de usuário comum (Authorization: Bearer <token>)
 * - adminMiddleware: valida JWT de administrador
 */

import { verifyToken } from '../lib/jwt.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Não autenticado. Faça login.' });
    }

    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
    }
    return res.status(401).json({ error: 'Sessão inválida. Faça login novamente.' });
  }
};

export const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Não autenticado como administrador.' });
    }

    const decoded = verifyToken(token);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito ao administrador' });
    }

    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sessão de administrador expirada.' });
    }
    return res.status(401).json({ error: 'Sessão de administrador inválida.' });
  }
};