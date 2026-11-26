import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getStamp = createServerFn({ method: 'GET' }).handler(async () => ({
  renderedAt: new Date().toISOString(),
}))

// Prerendered at build time: see `pages`/`prerender` in vite.config.ts.
export const Route = createFileRoute('/feature-tests/render-modes/static')({
  loader: () => getStamp(),
  component: Page,
})

function Page() {
  const { renderedAt } = Route.useLoaderData()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">render-modes: static</h1>
      <p>
        renderedAt: <span data-testid="stamp">{renderedAt}</span>
      </p>
    </div>
  )
}
