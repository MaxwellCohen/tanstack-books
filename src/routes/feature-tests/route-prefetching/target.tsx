import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getTargetData = createServerFn({ method: 'GET' }).handler(async () => ({
  message: 'FT_PREFETCH_TARGET_DATA',
}))

export const Route = createFileRoute('/feature-tests/route-prefetching/target')({
  loader: () => getTargetData(),
  component: TargetPage,
})

function TargetPage() {
  const { message } = Route.useLoaderData()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold" data-testid="target-heading">
        FT_PREFETCH_TARGET_COMPONENT
      </h1>
      <p>{message}</p>
    </div>
  )
}
