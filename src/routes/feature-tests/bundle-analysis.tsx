import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feature-tests/bundle-analysis')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">bundle-analysis</h1>
      <p>
        Build-time feature. <code>ANALYZE=1 vite build</code> adds the third-party{' '}
        <code>rollup-plugin-visualizer</code> (vite.config.ts) and writes{' '}
        <code>feature-tests/.artifacts/bundle-stats.html</code> and <code>.json</code>.
      </p>
    </div>
  ),
})
