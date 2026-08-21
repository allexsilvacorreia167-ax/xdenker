import { supabase, supabaseConfigured } from '../lib/supabase.js';
import { sendTokenEmail } from '../lib/email.js';
import { signUserToken } from '../lib/jwt.js';

/**
 * Fluxo de autenticação:
 * 1. Usuário informa Nome Completo + E-mail
 * 2. Sistema gera token TKN-XXXX-XXXX e envia por e-mail (Resend)
 * 3. Usuário informa o token recebido → sistema valida e emite um JWT de sessão
 *
 * O token NUNCA é exibido na tela — só chega por e-mail.
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
      } else {
        // Já existe: gera um novo token a cada tentativa de login (mais seguro que reusar)
        const newToken = generateToken();
        const { data: updated, error: updErr } = await supabase
          .from('app_users')
          .update({ token: newToken, token_used: false })
          .eq('id', user.id)
          .select()
          .single();

        if (updErr) {
          console.error('[auth] login refresh token', updErr);
          return res.status(500).json({ error: 'Erro ao gerar novo token' });
        }
        user = updated;
      }

      const emailResult = await sendTokenEmail({
        to: user.email,
        fullName: user.full_name,
        token: user.token,
      });

      if (!emailResult.ok) {
        console.error('[auth] falha ao enviar e-mail de token', emailResult.error);
        return res.status(502).json({
          error: 'Não foi possível enviar o e-mail com o token. Tente novamente em instantes.',
        });
      }

      return res.json({
        message: 'Token gerado e enviado por e-mail.',
        requiresToken: true,
      });
    }

    // Fallback em memória (sem Supabase) — token ainda vai só por e-mail
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
    } else {
      user.token = generateToken();
      user.tokenUsed = false;
    }

    const emailResult = await sendTokenEmail({
      to: user.email,
      fullName: user.fullName,
      token: user.token,
    });

    if (!emailResult.ok) {
      console.error('[auth] falha ao enviar e-mail (modo offline)', emailResult.error);
      return res.status(502).json({
        error: 'Não foi possível enviar o e-mail com o token. Tente novamente em instantes.',
      });
    }

    res.json({
      message: 'Token gerado e enviado por e-mail.',
      requiresToken: true,
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

      const jwtToken = signUserToken({
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      });

      return res.json({
        message: 'Login realizado com sucesso',
        token: jwtToken,
        user: {
          userId: user.id,
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          hasCompletedSurvey: user.has_completed_survey,
        },
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
    const jwtToken = signUserToken({ id: user.id, email: user.email, fullName: user.fullName });

    res.json({
      message: 'Login realizado com sucesso (modo offline)',
      token: jwtToken,
      user: {
        userId: user.id,
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        hasCompletedSurvey: user.hasCompletedSurvey,
      },
    });
  } catch (error) {
    console.error('[auth] verifyToken', error);
    res.status(500).json({ error: 'Erro na verificação do token' });
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logout realizado' });
};
