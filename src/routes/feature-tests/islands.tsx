import { createFileRoute } from '@tanstack/react-router'
import { Hydrate } from '@tanstack/react-start'
import { never, visible } from '@tanstack/react-start/hydration'
import { IslandCounter } from '@/features/feature-tests/island-counter'
import { StaticCard } from '@/features/feature-tests/static-card'

// Experimental: <Hydrate> deferred hydration. never() keeps the server HTML and
// should never load the child's chunk; visible() hydrates the island when seen.
export const Route = createFileRoute('/feature-tests/islands')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">islands</h1>
      <Hydrate when={never()}>
        <StaticCard />
      </Hydrate>
      <Hydrate when={visible()}>
        <IslandCounter />
      </Hydrate>
    </div>
  ),
})
