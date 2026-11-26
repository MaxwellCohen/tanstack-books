import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feature-tests/render-modes/')({
  component: () => (
    <div className="flex flex-col gap-2 p-6">
      <h1 className="text-2xl font-semibold">render-modes</h1>
      <Link to="/feature-tests/render-modes/static">Prerendered (build time)</Link>
      <Link to="/feature-tests/render-modes/ssr">Server-rendered per request</Link>
      <Link to="/feature-tests/render-modes/client">Client-only (ssr: false)</Link>
    </div>
  ),
})
