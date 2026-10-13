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

  plugins.push(tailwindcss(), tanstackStart(), viteReact())

  return {
    resolve: { tsconfigPaths: true },
    plugins,
  }
})
