import bcrypt from 'bcrypt';
import { supabase, supabaseConfigured } from '../lib/supabase.js';
import { signAdminToken } from '../lib/jwt.js';

/**
 * Login do administrador — e-mail + senha (hash bcrypt no banco)
 */
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
        }

        if (!supabaseConfigured || !supabase) {
            return res.status(503).json({ error: 'Serviço indisponível' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const { data: admin, error: findErr } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', normalizedEmail)
            .eq('active', true)
            .maybeSingle();

        if (findErr) {
            console.error('[adminAuth] login lookup', findErr);
            return res.status(500).json({ error: 'Erro ao verificar credenciais' });
        }

        if (!admin) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos' });
        }

        const passwordMatches = await bcrypt.compare(password, admin.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos' });
        }

        await supabase
            .from('admin_users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', admin.id);

        const token = signAdminToken({ id: admin.id, email: admin.email });

        res.json({
            message: 'Login realizado com sucesso',
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                fullName: admin.full_name,
            },
        });
    } catch (error) {
        console.error('[adminAuth] login', error);
        res.status(500).json({ error: 'Erro no login' });
    }
};

export const adminLogout = async (req, res) => {
    res.json({ message: 'Logout realizado' });
};