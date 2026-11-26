import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

// First-party selective SSR: `ssr: false` renders this route only in the browser.
export const Route = createFileRoute('/feature-tests/render-modes/client')({
  ssr: false,
  component: Page,
})

function Page() {
  const [renderedAt] = useState(() => `client:${new Date().toISOString()}`)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">render-modes: client</h1>
      <p>
        FT_CLIENT_ONLY_CONTENT renderedAt: <span data-testid="stamp">{renderedAt}</span>
      </p>
    </div>
  )
}
