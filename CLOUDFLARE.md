# Deploy en Cloudflare

Para que el deploy funcione, el **comando de deploy** en tu proyecto de Cloudflare debe ser:

```bash
npm run deploy
```

(Ese comando hace primero `npm run build` para generar la carpeta `dist` y luego `npx wrangler deploy`.)

Si ahora mismo tienes solo `npx wrangler deploy`, cámbialo a `npm run deploy` en la configuración del proyecto en el dashboard de Cloudflare.
