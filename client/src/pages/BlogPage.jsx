import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ExternalLink } from 'lucide-react';

/**
 * Blog público — dados dinâmicos do Supabase
 * Layout responsivo: imagem max-width 100%, cards empilhados no mobile
 */
export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error: err } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (!mounted) return;
      if (err) {
        setError(err.message);
        setPosts([]);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-400">
        Carregando posts...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/logo.png"
            alt="XDENKER"
            className="h-9 w-auto object-contain"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Blog</h1>
            <p className="text-sm text-slate-500">Conteúdo editorial · Eleições 2026</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            Erro ao carregar posts: {error}
          </div>
        )}

        {posts.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
            Nenhum post publicado ainda.
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {post.image_url && (
                <div className="w-full bg-slate-100">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full max-w-full h-auto object-cover max-h-[420px] md:max-h-[480px]"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-4 sm:p-6">
                <time className="text-xs text-slate-400">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </time>
                <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-800 leading-snug">
                  {post.title}
                </h2>
                <div className="mt-3 text-sm sm:text-base text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </div>

                {post.link_url && (
                  <a
                    href={post.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink size={16} />
                    {post.link_label || 'Abrir link'}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
