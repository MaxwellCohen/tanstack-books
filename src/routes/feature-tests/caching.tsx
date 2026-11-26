import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

let renders = 0
const getStamp = createServerFn({ method: 'GET' }).handler(async () => ({
  renderedAt: new Date().toISOString(),
  serverCount: ++renders,
}))

// First-party: per-route `headers()` (ISR guide pattern). The CDN/browser does the reuse.
export const Route = createFileRoute('/feature-tests/caching')({
  headers: () => ({
    'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
  }),
  loader: () => getStamp(),
  component: CachingPage,
})

function CachingPage() {
  const { renderedAt, serverCount } = Route.useLoaderData()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">caching</h1>
      <p>
        renderedAt: <span data-testid="stamp">{renderedAt}</span> · server count:{' '}
        <span data-testid="count">{serverCount}</span>
      </p>
    </div>
  )
}
