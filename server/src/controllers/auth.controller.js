import { supabase, supabaseConfigured } from '../lib/supabase.js';

/**
 * Fluxo de autenticação conforme especificação:
 * 1. Usuário informa Nome Completo + E-mail
 * 2. Sistema gera/solicita Token TKN-XXXX-XXXX
 * 3. Após validação, sessão é criada
 *
 * Persistência: tabela app_users no Supabase.
 * Fallback em memória apenas se Supabase estiver offline (não recomendado em produção).
 */

const mockUsers = new Map();

function generateToken() {
  const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKN-${part1}-${part2}`;
}

export const login = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Nome completo e e-mail são obrigatórios' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (supabaseConfigured && supabase) {
      const { data: existing, error: findErr } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (findErr) {
        console.error('[auth] login lookup', findErr);
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
      }

      let user = existing;

      if (!user) {
        const token = generateToken();
        const { data: created, error: insErr } = await supabase
          .from('app_users')
          .insert([
            {
              full_name: fullName,
              email: normalizedEmail,
              token,
              token_used: false,
              has_completed_survey: false,
            },
          ])
          .select()
          .single();

        if (insErr) {
          console.error('[auth] login insert', insErr);
          return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
        user = created;
      }

      return res.json({
        message: 'Token gerado. Informe o Token de Acesso.',
        requiresToken: true,
        // Em produção real o token seria enviado por e-mail
        debugToken: user.token,
      });
    }

    // Fallback em memória
    let user = [...mockUsers.values()].find((u) => u.email === normalizedEmail);
    if (!user) {
      const token = generateToken();
      user = {
        id: crypto.randomUUID(),
        fullName,
        email: normalizedEmail,
        token,
        tokenUsed: false,
        hasCompletedSurvey: false,
        createdAt: new Date().toISOString(),
      };
      mockUsers.set(user.id, user);
    }

    res.json({
      message: 'Token gerado. Informe o Token de Acesso. (modo offline — configure Supabase)',
      requiresToken: true,
      debugToken: user.token,
    });
  } catch (error) {
    console.error('[auth] login', error);
    res.status(500).json({ error: 'Erro no login' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: 'E-mail e token são obrigatórios' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedToken = token.toUpperCase().trim();

    if (supabaseConfigured && supabase) {
      const { data: user, error: findErr } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('token', normalizedToken)
        .maybeSingle();

      if (findErr) {
        console.error('[auth] verifyToken lookup', findErr);
        return res.status(500).json({ error: 'Erro na verificação do token' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      await supabase.from('app_users').update({ token_used: true }).eq('id', user.id);

      const session = {
        userId: user.id,
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        hasCompletedSurvey: user.has_completed_survey,
      };

      return res.json({
        message: 'Login realizado com sucesso',
        user: session,
      });
    }

    // Fallback em memória
    const user = [...mockUsers.values()].find(
      (u) => u.email === normalizedEmail && u.token === normalizedToken
    );

    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    user.tokenUsed = true;

    const session = {
      userId: user.id,
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      hasCompletedSurvey: user.hasCompletedSurvey,
    };

    res.json({
      message: 'Login realizado com sucesso (modo offline — configure Supabase)',
      user: session,
    });
  } catch (error) {
    console.error('[auth] verifyToken', error);
    res.status(500).json({ error: 'Erro na verificação do token' });
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logout realizado' });
};