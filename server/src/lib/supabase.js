import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.warn(
        '[XDENKER] SUPABASE_URL e SUPABASE_ANON_KEY (ou SERVICE_ROLE) não definidos — dados ficam só em memória.'
    );
}

export const supabaseConfigured = Boolean(url && key);

export const supabase = supabaseConfigured
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    : null;

export default supabase;