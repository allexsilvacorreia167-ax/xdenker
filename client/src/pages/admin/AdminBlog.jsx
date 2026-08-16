import { useEffect, useState } from 'react';
import { supabase, uploadPostImage, diagnoseStorage } from '../../lib/supabase';
import { Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';

const emptyForm = {
  id: null,
  title: '',
  content: '',
  link_url: '',
  link_label: '',
  image_url: '',
  published: true,
};

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (err) {
      setError(err.message);
      setPosts([]);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setMsg('');
    try {
      const result = await uploadPostImage(file);
      onChange('image_url', result.url);
      if (result.mode === 'storage') {
        setMsg('Imagem enviada para o Storage (nuvem).');
      } else {
        setMsg(
          'Storage indisponível — imagem embutida no post (plano B). Ainda assim aparece no blog. Corrija o .env/policies para usar a nuvem.'
        );
      }
    } catch (err) {
      setError(err.message || 'Falha no upload da imagem');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const runDiagnose = async () => {
    setMsg('Diagnosticando conexão Supabase...');
    setError('');
    try {
      const r = await diagnoseStorage();
      setMsg(
        `URL: ${r.url || '—'} | Key: ${r.keyPrefix || '—'} | ` +
        `Buckets visíveis: ${r.buckets.length ? r.buckets.join(', ') : '(nenhum)'} | ` +
        `Lista buckets: ${r.listError || 'ok'} | ` +
        `Tabela posts: ${r.tableOk ? 'ok' : r.tableError || 'erro'}`
      );
    } catch (e) {
      setError(e.message);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMsg('');
    setError('');
  };

  const editPost = (post) => {
    setForm({
      id: post.id,
      title: post.title || '',
      content: post.content || '',
      link_url: post.link_url || '',
      link_label: post.link_label || '',
      image_url: post.image_url || '',
      published: post.published !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Título e conteúdo são obrigatórios');
      return;
    }
    setSaving(true);
    setError('');
    setMsg('');

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      link_url: form.link_url.trim() || null,
      link_label: form.link_label.trim() || null,
      image_url: form.image_url.trim() || null,
      published: form.published,
      published_at: form.id ? undefined : new Date().toISOString(),
    };

    let err;
    if (form.id) {
      const res = await supabase.from('posts').update(payload).eq('id', form.id);
      err = res.error;
    } else {
      const res = await supabase.from('posts').insert([payload]);
      err = res.error;
    }

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMsg(form.id ? 'Post atualizado' : 'Post criado');
    resetForm();
    load();
  };

  const remove = async (id) => {
    if (!confirm('Excluir este post?')) return;
    const { error: err } = await supabase.from('posts').delete().eq('id', id);
    if (err) setError(err.message);
    else {
      setMsg('Post excluído');
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Blog — Posts</h2>
        <p className="text-sm text-slate-500">
          Crie e edite posts com imagem (bucket <code className="text-xs bg-slate-100 px-1 rounded">postagens-imagens</code>) e links.
          Alterações aparecem na página pública /blog.
        </p>
      </div>

      {msg && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-2">
          {msg}
        </div>
      )}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Formulário */}
      <form
        onSubmit={save}
        className="bg-white rounded-xl border border-slate-200 p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            {form.id ? <Pencil size={16} /> : <Plus size={16} />}
            {form.id ? 'Editar post' : 'Novo post'}
          </h3>
          <button
            type="button"
            onClick={runDiagnose}
            className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            Testar conexão Supabase
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo *</label>
          <textarea
            rows={6}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={form.content}
            onChange={(e) => onChange('content', e.target.value)}
            required
            placeholder="Texto do post..."
          />
        </div>

        {/* Imagem */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Imagem do post
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              {uploading ? 'Enviando...' : 'Upload de imagem'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageFile}
                disabled={uploading}
              />
            </label>
            <input
              className="flex-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Ou cole a URL da imagem"
              value={form.image_url}
              onChange={(e) => onChange('image_url', e.target.value)}
            />
          </div>
          {form.image_url && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-100 max-w-md">
              <img
                src={form.image_url}
                alt="Prévia"
                className="w-full max-w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        {/* Links */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL do link externo
            </label>
            <input
              type="url"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="https://..."
              value={form.link_url}
              onChange={(e) => onChange('link_url', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Texto do link
            </label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Saiba mais"
              value={form.link_label}
              onChange={(e) => onChange('link_label', e.target.value)}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => onChange('published', e.target.checked)}
          />
          Publicado (visível em /blog)
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
          >
            {saving ? 'Salvando...' : form.id ? 'Atualizar post' : 'Publicar post'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-slate-200 text-slate-600 text-sm px-4 py-2.5 rounded-lg"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      {/* Lista */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 font-semibold text-slate-800 text-sm">
          Posts cadastrados ({posts.length})
        </div>
        {loading ? (
          <p className="p-5 text-sm text-slate-400">Carregando...</p>
        ) : posts.length === 0 ? (
          <p className="p-5 text-sm text-slate-400">Nenhum post ainda.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {posts.map((p) => (
              <li key={p.id} className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt=""
                    className="w-full sm:w-24 h-32 sm:h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400">
                    {p.published ? 'Publicado' : 'Rascunho'} ·{' '}
                    {p.published_at
                      ? new Date(p.published_at).toLocaleString('pt-BR')
                      : '—'}
                  </p>
                  {p.link_url && (
                    <a
                      href={p.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 inline-flex items-center gap-1 mt-1"
                    >
                      <ExternalLink size={12} />
                      {p.link_label || p.link_url}
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editPost(p)}
                    className="text-blue-600 text-xs font-medium px-2 py-1"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="text-red-600 text-xs font-medium px-2 py-1 inline-flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
