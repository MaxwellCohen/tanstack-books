import { Link, createFileRoute } from '@tanstack/react-router'

// First-party: router `defaultPreload: 'intent'` (src/router.tsx); explicit here too.
export const Route = createFileRoute('/feature-tests/route-prefetching/')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">route-prefetching</h1>
      <Link to="/feature-tests/route-prefetching/target" preload="intent" data-testid="target-link">
        Go to target
      </Link>
    </div>
  ),
})
