-- Ejecuta este SQL en Supabase: SQL Editor → New query → pegar y Run

-- Tabla de respuestas RSVP
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  asiste text not null check (asiste in ('sí', 'no')),
  personas text not null default '1',
  contacto text not null,
  mensaje text,
  created_at timestamptz default now()
);

-- Habilitar RLS (seguridad por filas)
alter table public.rsvps enable row level security;

-- Solo permitir que usuarios anónimos inserten (enviar el formulario). Nadie puede leer desde la web.
create policy "Permitir insert anon"
  on public.rsvps
  for insert
  to anon
  with check (true);

-- Los datos se ven en Supabase Dashboard → Table Editor → rsvps (usa la clave de servicio, no RLS).
