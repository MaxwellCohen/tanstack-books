import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

// Manual: TanStack Start has no script loading-strategy API, so the tag is
// injected by hand after hydration, during browser idle time, with async.
function loadWhenIdle(src: string) {
  const inject = () => {
    if (document.querySelector(`script[src="${src}"]`)) return
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.dataset.strategy = 'idle-after-hydration'
    document.body.appendChild(s)
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(inject, { timeout: 2000 })
  else setTimeout(inject, 1)
}

export const Route = createFileRoute('/feature-tests/third-party-scripts')({
  component: Page,
})

function Page() {
  useEffect(() => loadWhenIdle('/feature-tests/fake-third-party.js'), [])
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">third-party-scripts</h1>
      <p data-testid="content">Content renders before the third-party script runs.</p>
    </div>
  )
}
