import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// --- ROTAS DE USUÁRIOS ---

// 1. Listar usuários
router.get('/users', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('app_users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ users: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Criar novo usuário
router.post('/users', async (req, res) => {
    try {
        const { full_name, email, token, token_used, has_completed_survey } = req.body;

        const { data, error } = await supabase
            .from('app_users')
            .insert([{ full_name, email, token, token_used, has_completed_survey }])
            .select();

        if (error) throw error;
        res.json({ message: 'Usuário criado com sucesso!', user: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Atualizar usuário existente
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, token, token_used, has_completed_survey } = req.body;

        const { data, error } = await supabase
            .from('app_users')
            .update({ full_name, email, token, token_used, has_completed_survey })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json({ message: 'Usuário atualizado com sucesso!', user: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;