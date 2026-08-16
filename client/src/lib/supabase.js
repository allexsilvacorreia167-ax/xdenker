import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[XDENKER] Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo client/.env'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

/** Nome do bucket (igual ao painel Storage) */
export const POSTS_BUCKET = 'postagens-imagens';

const BUCKET_CANDIDATES = [
  'postagens-imagens',
  'posts-images',
  'postagens_imagens',
];

/**
 * Diagnóstico: testa URL/key e lista o que o cliente enxerga
 */
export async function diagnoseStorage() {
  const report = {
    url: supabaseUrl || null,
    keyPrefix: supabaseAnonKey ? String(supabaseAnonKey).slice(0, 20) + '…' : null,
    buckets: [],
    listError: null,
    tableOk: false,
    tableError: null,
  };

  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) report.listError = error.message;
    else report.buckets = (data || []).map((b) => b.name);
  } catch (e) {
    report.listError = e.message;
  }

  try {
    const { error } = await supabase.from('posts').select('id').limit(1);
    if (error) report.tableError = error.message;
    else report.tableOk = true;
  } catch (e) {
    report.tableError = e.message;
  }

  return report;
}

/**
 * Converte arquivo em data URL (base64) — plano B sem Storage
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 900 * 1024) {
      reject(
        new Error(
          'Imagem muito grande para o plano B (máx. ~900 KB). Comprima a foto ou use uma URL externa.'
        )
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload para o bucket. Se falhar (bucket not found etc.), usa base64 no próprio post.
 * @returns {{ url: string, mode: 'storage' | 'inline' }}
 */
export async function uploadPostImage(file) {
  if (!file) throw new Error('Arquivo não informado');

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40);
  const path = `posts/${Date.now()}-${safeName}.${ext}`;

  let lastError = null;

  for (const bucket of BUCKET_CANDIDATES) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || `image/${ext}`,
    });

    if (!error) {
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data?.path || path);
      return { url: pub.publicUrl, mode: 'storage' };
    }
    lastError = error;
  }

  // Plano B: embute a imagem no campo image_url (não usa bucket)
  console.warn('[XDENKER] Storage falhou, usando imagem inline:', lastError?.message);
  try {
    const dataUrl = await fileToDataUrl(file);
    return { url: dataUrl, mode: 'inline' };
  } catch (e) {
    throw new Error(
      `Storage: ${lastError?.message || 'erro'}. Plano B: ${e.message}. ` +
      `Confira client/.env (URL + anon key do projeto Xdenker) e policies do bucket.`
    );
  }
}
