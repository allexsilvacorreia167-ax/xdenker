import { v4 as uuidv4 } from 'uuid';

/**
 * Fluxo de autenticação conforme especificação:
 * 1. Usuário informa Nome Completo + E-mail
 * 2. Sistema gera/solicita Token TKN-XXXX-XXXX
 * 3. Após validação, sessão é criada
 */

// Em produção: usar tabela users + tokens no PostgreSQL
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

    // Verifica se usuário já existe
    let user = [...mockUsers.values()].find(u => u.email === email.toLowerCase());

    if (!user) {
      const token = generateToken();
      user = {
        id: uuidv4(),
        fullName,
        email: email.toLowerCase(),
        token,
        tokenUsed: false,
        hasCompletedSurvey: false,
        createdAt: new Date().toISOString()
      };
      mockUsers.set(user.id, user);
    }

    // Retorna solicitação de token (caixa flutuante no front)
    res.json({
      message: 'Token gerado. Informe o Token de Acesso.',
      requiresToken: true,
      // Em produção real o token seria enviado por e-mail
      // Por enquanto retornamos para facilitar testes locais
      debugToken: user.token
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: 'E-mail e token são obrigatórios' });
    }

    const user = [...mockUsers.values()].find(
      u => u.email === email.toLowerCase() && u.token === token.toUpperCase()
    );

    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    user.tokenUsed = true;

    // Em produção: gerar JWT
    const session = {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      hasCompletedSurvey: user.hasCompletedSurvey
    };

    res.json({
      message: 'Login realizado com sucesso',
      user: session
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro na verificação do token' });
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logout realizado' });
};
