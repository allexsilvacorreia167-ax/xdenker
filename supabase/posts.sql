-- ============================================================
-- XDENKER — Tabela de posts do Blog + políticas
-- Execute no SQL Editor do Supabase
-- Bucket de imagens: postagens-imagens (já criado, público)
-- ============================================================

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  link_url text,
  link_label text,
  image_url text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_at_idx
  on public.posts (published_at desc)
  where published = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read"
  on public.posts for select
  using (published = true);

drop policy if exists "posts_anon_insert" on public.posts;
create policy "posts_anon_insert"
  on public.posts for insert
  with check (true);

drop policy if exists "posts_anon_update" on public.posts;
create policy "posts_anon_update"
  on public.posts for update
  using (true)
  with check (true);

drop policy if exists "posts_anon_delete" on public.posts;
create policy "posts_anon_delete"
  on public.posts for delete
  using (true);

-- ADM precisa ler todos (incluindo rascunhos)
drop policy if exists "posts_admin_read_all" on public.posts;
create policy "posts_admin_read_all"
  on public.posts for select
  using (true);

-- ============================================================
-- Storage policies para o bucket postagens-imagens
-- (rode no SQL Editor; se já existirem, ignore o erro)
-- ============================================================

-- Leitura pública
drop policy if exists "postagens_imagens_public_read" on storage.objects;
create policy "postagens_imagens_public_read"
  on storage.objects for select
  using (bucket_id = 'postagens-imagens');

-- Upload com anon key (dev) — restrinja em produção
drop policy if exists "postagens_imagens_anon_upload" on storage.objects;
create policy "postagens_imagens_anon_upload"
  on storage.objects for insert
  with check (bucket_id = 'postagens-imagens');

drop policy if exists "postagens_imagens_anon_update" on storage.objects;
create policy "postagens_imagens_anon_update"
  on storage.objects for update
  using (bucket_id = 'postagens-imagens');

drop policy if exists "postagens_imagens_anon_delete" on storage.objects;
create policy "postagens_imagens_anon_delete"
  on storage.objects for delete
  using (bucket_id = 'postagens-imagens');
