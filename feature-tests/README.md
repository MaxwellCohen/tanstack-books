# Feature tests

These tests check the labels Framework Compare gives TanStack Start (React) by running the
features on a production build of this app. The routes live under `/feature-tests/*`
(`src/routes/feature-tests/`).

## Run

```sh
pnpm install
pnpm test:features   # node feature-tests/run.mjs
```

`run.mjs` does four things in order:

1. Runs the build-time specs (`bundle-analysis`, `multi-host-deployment`). These rebuild the app.
2. Runs `vite build` (Nitro node) and starts `vite preview --port 4109`. The preview server serves
   prerendered HTML ahead of SSR; a bare `node .output/server/index.mjs` does not, because the
   prerender runs after Nitro writes its asset manifest.
3. Runs the runtime specs against that server, using the system Chrome at
   `/home/maxc/.local/bin/google-chrome`.
4. Writes `feature-tests/results.json`. The raw Playwright reports go to `feature-tests/.artifacts/`.

Set `FT_PORT` to use a different port.

## What each spec checks

| Spec | Label | Implementation | Assertion |
| --- | --- | --- | --- |
| css-inlining | Experimental | `tanstackStart({ server: { build: { inlineCss: true } } })` with a route-level `.css` import | The HTML has a `<style>` with the route CSS. There is no `<link rel=stylesheet>` and no stylesheet request, and the computed color is applied. |
| font-optimization | Third-party | `@fontsource-variable/geist`, plus a preload `<link>` added by hand in `head()` | No Google Fonts requests and every woff2 is same-origin. The `@font-face` rule has `font-display: swap`. The preload href matches the `@font-face` src and the font is used. |
| image-pipeline | Third-party | `@unpic/react` with IPX at `/_ipx` (`layout="fixed"`) | The srcset has at least 2 widths. The image has `width`/`height` attributes. The offscreen image has `loading=lazy`. A srcset URL returns `image/avif` or `image/webp`. |
| caching | 1st-party | The route's `headers()` sets Cache-Control | The `Cache-Control`/`s-maxage`/`stale-while-revalidate` header is present. A second browser fetch reuses the response (same timestamp). A `no-cache` fetch gets a fresh timestamp. |
| route-prefetching | 1st-party | `defaultPreload: 'intent'` / `<Link preload="intent">` | Hovering requests the target route chunk and the loader server function before the click. |
| islands | Experimental | `<Hydrate when={never()}>` for the static card, `<Hydrate when={visible()}>` for the counter | The static marker is in the HTML but in none of the downloaded JS. The island counter works after hydration. |
| render-modes | 1st-party | `pages[].prerender`, default SSR, `ssr: false` | The prerendered file's timestamp stays the same across requests. The SSR timestamp changes per request. The client-only content is missing from the HTML and renders in the browser. |
| reactivity | Third-party | `@preact/signals-react`, with the signal passed directly into JSX | After 3 updates the text changes and the component's render count stays at 1. A `useState` baseline re-renders 3 times. |
| bundle-analysis | Third-party | `rollup-plugin-visualizer` (enabled with `ANALYZE=1`) | The build writes `bundle-stats.html` and `bundle-stats.json`. |
| third-party-scripts | Manual | `useEffect` + `requestIdleCallback` injects an async `<script>` | The script isn't in the SSR HTML. It's injected async after DCL/FCP, and it sets its global. |
| multi-host-deployment | Third-party | Nitro (node, vercel), Netlify and Cloudflare Vite plugins | node, vercel, netlify and cloudflare all build, and their expected output dirs exist. |
