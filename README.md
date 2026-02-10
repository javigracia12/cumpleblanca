# CumpleBlanca

Web de invitación y RSVP para la celebración de los 60 años de Blanca.

## Setup

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Recibir las respuestas del RSVP

El formulario guarda la respuesta en estado y muestra un mensaje de agradecimiento. Para recibir los datos por email:

1. Crea un formulario en [Formspree](https://formspree.io) (gratis).
2. En `src/App.jsx`, en `handleSubmit`, envía los datos a tu endpoint de Formspree (por ejemplo con `fetch`) o convierte el `<form>` en un form nativo con `action="https://formspree.io/f/TU_ID"` y `method="POST"`.

## Scripts

- `npm run dev` — Desarrollo
- `npm run build` — Build para producción
- `npm run preview` — Previsualizar el build

## Desplegar en GitHub Pages

En el repo: **Settings → Pages** → Source: **GitHub Actions**. Cada push a `main` despliega en **https://javigracia12.github.io/cumpleblanca/**

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
