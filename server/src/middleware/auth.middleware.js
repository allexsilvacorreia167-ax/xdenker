/**
 * Middlewares de autenticação
 * - authMiddleware: usuário logado (valida contra app_users no Supabase)
 * - adminMiddleware: painel /html/adm
 */

import { supabase, supabaseConfigured } from '../lib/supabase.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado. Faça login.' });
    }

    if (supabaseConfigured && supabase) {
      const { data: user, error } = await supabase
        .from('app_users')
        .select('id, full_name, email, token_used, has_completed_survey')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[authMiddleware] lookup', error);
        return res.status(500).json({ error: 'Erro ao validar sessão' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Sessão inválida. Faça login novamente.' });
      }

      if (!user.token_used) {
        return res.status(401).json({ error: 'Token ainda não verificado. Complete o login.' });
      }

      req.user = {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        hasCompletedSurvey: user.has_completed_survey,
      };
      return next();
    }

    // Fallback (Supabase offline) — aceita o header, mas avisa no log
    console.warn('[authMiddleware] Supabase offline — validação de sessão desabilitada');
    req.user = {
      id: userId,
      fullName: req.headers['x-user-name'] || 'Participante',
    };
    next();
  } catch (err) {
    console.error('[authMiddleware]', err);
    res.status(500).json({ error: 'Erro na autenticação' });
  }
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