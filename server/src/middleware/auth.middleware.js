/**
 * Middlewares de autenticação
 * - authMiddleware: usuário logado
 * - adminMiddleware: painel /html/adm
 */

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Não autenticado. Faça login.' });
  }

  // Em desenvolvimento: aceita qualquer Bearer e usa X-User-Id se enviado
  // Isso permite testar múltiplos votos (cada login gera id diferente no front)
  const userId = req.headers['x-user-id'] || `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const fullName = req.headers['x-user-name'] || 'Participante';

  req.user = { id: userId, fullName };
  next();
};

export const adminMiddleware = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }
    return res.status(403).json({ error: 'Acesso restrito ao administrador' });
  }

  next();
};
