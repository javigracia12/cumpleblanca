# CumpleBlanca

Web de invitación y RSVP para la celebración de los 60 años de Blanca. Las respuestas se guardan en Supabase.

## Setup

```bash
npm install
cp .env.example .env.local
# Rellena .env.local con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (Supabase → Project settings → API)
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Supabase (RSVP y fotos)

1. **RSVP**: Ejecuta `supabase-rsvps.sql` en SQL Editor. Las respuestas aparecen en **Table Editor → rsvps**.
2. **Fotos**: Ejecuta `supabase-storage-fotos.sql` en SQL Editor. Crea el bucket `photos-blanca` y la tabla `photos`. Las fotos aparecen en **Storage → photos-blanca** y el registro (quién envió) en **Table Editor → photos**.

## Variables de entorno

Opcional: crea `.env.local` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para sobreescribir en local. En producción (Cloudflare con solo static assets) el código usa los valores por defecto, así que **no hace falta configurar variables en Cloudflare**.

## Scripts

- `npm run dev` — Desarrollo
- `npm run build` — Build para producción
- `npm run preview` — Previsualizar el build
- `npm run deploy` — Build + deploy con Wrangler

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) + [Supabase](https://supabase.com/)
