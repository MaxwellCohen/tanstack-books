# TanStack Books

The Goodreads catalog app, ported to [TanStack Start](https://tanstack.com/start) (React + Vite + Nitro).

Leave `POSTGRES_URL` empty to browse the generated preview catalog. Point it at the shared Neon Postgres to query the full ~2M Goodreads dataset.

## Branches

| Branch | Fonts | Caching | CSS / images |
| --- | --- | --- | --- |
| `main` | Google Fonts CDN Geist | vibe defaults | Linked stylesheet; remote cover URLs |
| `optimized` | Self-hosted `@fontsource-variable/geist` | Catalog TTL cache + host-matching HTML `Cache-Control` | Inline CSS; host image CDN (Vercel/Netlify) or `/_ipx` + Cloudflare Images |

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm typecheck`
- `pnpm preview`

## Database

- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:studio`

## Deploy

Production (`main`):

- Vercel: [tanstack-books.vercel.app](https://tanstack-books.vercel.app)
- Netlify: [tanstack-books.netlify.app](https://tanstack-books.netlify.app)
- Cloudflare: [tanstack-books.to-email-max.workers.dev](https://tanstack-books.to-email-max.workers.dev)

Optimized (`optimized`):

- Vercel: [tanstack-books-optimized.vercel.app](https://tanstack-books-optimized.vercel.app)
- Netlify: [tanstack-books-optimized.netlify.app](https://tanstack-books-optimized.netlify.app)
- Cloudflare: [tanstack-books-optimized.to-email-max.workers.dev](https://tanstack-books-optimized.to-email-max.workers.dev)

Vercel/Nitro is the default adapter (`NITRO_PRESET=vercel` for prebuilt deploys). Set `NETLIFY=1` for Netlify, or `CLOUDFLARE=1` for Cloudflare Workers:

- `pnpm deploy:vercel`
- `pnpm deploy:netlify`
- `pnpm deploy:cloudflare`
- `pnpm preview:cloudflare`

Set `POSTGRES_URL` on every host for both branches before first deploy.

## Files

- `src/routes/__root.tsx` — document shell + catalog chrome
- `src/routes/index.tsx` — catalog with validated search + streaming loaders
- `src/routes/$id.tsx` — book detail
- `src/features/book/book.functions.ts` — typed server functions
- `src/start.ts` — request middleware (optimized Cache-Control)
- `src/styles/global.css` — Tailwind CSS entry
