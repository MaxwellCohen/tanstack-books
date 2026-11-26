import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feature-tests/multi-host-deployment')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">multi-host-deployment</h1>
      <p>
        Build-time feature. vite.config.ts picks Nitro (node / <code>NITRO_PRESET=vercel</code>),{' '}
        <code>@netlify/vite-plugin-tanstack-start</code> (<code>NETLIFY=1</code>) or{' '}
        <code>@cloudflare/vite-plugin</code> (<code>CLOUDFLARE=1</code>). The test builds each target.
      </p>
    </div>
  ),
})
