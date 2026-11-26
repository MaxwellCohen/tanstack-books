import { defineConfig, type PluginOption } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const isCloudflare = Boolean(
  process.env.CLOUDFLARE || process.env.WORKERS_CI || process.env.CF_PAGES,
)
const isNetlify = Boolean(process.env.NETLIFY)
const isVercel = Boolean(
  process.env.VERCEL || process.env.NITRO_PRESET === 'vercel' || process.env.NITRO_PRESET === 'vercel_edge',
)

/** Host image CDN for Unpic — set at build time. */
const imageCdn = isCloudflare ? 'ipx' : isNetlify ? 'netlify' : isVercel ? 'vercel' : 'ipx'

export default defineConfig(async () => {
  const plugins: PluginOption[] = [devtools()]

  if (isCloudflare) {
    const { cloudflare } = await import('@cloudflare/vite-plugin')
    plugins.push(cloudflare({ viteEnvironment: { name: 'ssr' } }))
  } else if (isNetlify) {
    const netlify = (await import('@netlify/vite-plugin-tanstack-start')).default
    plugins.push(netlify())
  } else {
    plugins.push(nitro({ rollupConfig: { external: [/^@sentry\//] } }))
  }

  plugins.push(
    tailwindcss(),
    tanstackStart({
      // Experimental: inline manifest CSS (route-level imports) into <style> tags.
      // Used by /feature-tests/css-inlining; app CSS is already `?inline` in __root.
      server: { build: { inlineCss: true } },
      // Prerender only the feature-test static render-mode route.
      prerender: { enabled: true, autoStaticPathsDiscovery: false, crawlLinks: false },
      pages: [{ path: '/feature-tests/render-modes/static', prerender: { enabled: true } }],
    }),
    viteReact(),
  )

  if (process.env.ANALYZE) {
    // Third-party bundle analyzer (no first-party one in TanStack Start).
    const { visualizer } = await import('rollup-plugin-visualizer')
    const outDir = process.env.ANALYZE_OUT ?? 'feature-tests/.artifacts'
    plugins.push(
      {
        ...visualizer({ filename: `${outDir}/bundle-stats.html`, template: 'treemap', gzipSize: true }),
        applyToEnvironment: (env: { name: string }) => env.name === 'client',
      } as PluginOption,
      {
        ...visualizer({ filename: `${outDir}/bundle-stats.json`, template: 'raw-data' }),
        applyToEnvironment: (env: { name: string }) => env.name === 'client',
      } as PluginOption,
    )
  }

  return {
    resolve: { tsconfigPaths: true },
    define: {
      'import.meta.env.PUBLIC_IMAGE_CDN': JSON.stringify(imageCdn),
    },
    plugins,
  }
})

