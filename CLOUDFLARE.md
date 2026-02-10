# Deploy en Cloudflare Workers

## Pasos en el dashboard

1. Entra en **Cloudflare Dashboard** → **Workers & Pages**.
2. Abre tu proyecto **cumpleblanca**.
3. Ve a **Settings** (Configuración) del proyecto.
4. Busca la sección **Build** o **Build configuration** (a veces está en "Builds" o al conectar el repo de GitHub).
5. Donde diga **Build command** o **Deploy command**, pon exactamente:
   ```bash
   npm run deploy
   ```
6. Si hay un campo **Build output directory**, puedes dejarlo en blanco o poner `dist` (el script `npm run deploy` ya se encarga de generar `dist` y desplegarla).
7. Guarda y lanza un **nuevo deploy** (botón "Deploy" o "Retry deployment").

Con eso, cada deploy ejecutará primero `npm run build` (genera la web en `dist`) y luego `npx wrangler deploy` (sube esa carpeta a Cloudflare).
