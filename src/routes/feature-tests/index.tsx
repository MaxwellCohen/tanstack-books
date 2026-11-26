import { Link, createFileRoute } from '@tanstack/react-router'

const FEATURE_IDS = [
  'css-inlining',
  'font-optimization',
  'image-pipeline',
  'caching',
  'route-prefetching',
  'islands',
  'render-modes',
  'reactivity',
  'bundle-analysis',
  'third-party-scripts',
  'multi-host-deployment',
] as const

export const Route = createFileRoute('/feature-tests/')({
  head: () => ({ meta: [{ title: 'Feature tests · TanStack Books' }] }),
  component: FeatureTestsIndex,
})

function FeatureTestsIndex() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Feature tests</h1>
      <ul className="list-disc pl-6">
        {FEATURE_IDS.map((id) => (
          <li key={id}>
            <Link to={`/feature-tests/${id}` as string}>{id}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
