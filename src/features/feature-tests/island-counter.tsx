import { useState } from 'react'

export function IslandCounter() {
  const [count, setCount] = useState(0)
  return (
    <button
      type="button"
      data-testid="island-button"
      className="rounded border px-3 py-1"
      onClick={() => setCount((c) => c + 1)}
    >
      Island clicks: <span data-testid="island-count">{count}</span>
    </button>
  )
}
