-- Ejecuta SOLO este archivo en Supabase: SQL Editor → New query → pegar y Run
-- (No ejecutes supabase-rsvps.sql a la vez, ya lo hiciste antes)

-- 1. Crear el bucket de fotos (privado: solo vosotros las veis en el dashboard)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos-blanca',
  'photos-blanca',
  false,
  5242880,  -- 5 MB por foto
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- 2. Permitir que cualquiera (anon) suba fotos al bucket
drop policy if exists "Permitir subir fotos anon" on storage.objects;
create policy "Permitir subir fotos anon"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'photos-blanca');

-- 3. Tabla para registrar quién envía cada foto (opcional)
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  nombre text,
  created_at timestamptz default now()
);

alter table public.photos enable row level security;

drop policy if exists "Permitir insert anon photos" on public.photos;
create policy "Permitir insert anon photos"
  on public.photos
  for insert
  to anon
  with check (true);
