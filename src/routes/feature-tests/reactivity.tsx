import { createFileRoute } from '@tanstack/react-router'
import { signal } from '@preact/signals-react'
import { useState } from 'react'

declare global {
  interface Window {
    __ftSignalRenders?: number
    __ftStateRenders?: number
  }
}

// Third-party: @preact/signals-react. Passing the signal itself into JSX binds it
// to a DOM Text node, so updates skip re-rendering SignalCounter.
const count = signal(0)

function SignalCounter() {
  if (typeof window !== 'undefined') window.__ftSignalRenders = (window.__ftSignalRenders ?? 0) + 1
  return (
    <div className="my-2">
      <button type="button" data-testid="signal-inc" className="rounded border px-3 py-1" onClick={() => count.value++}>
        Increment signal
      </button>{' '}
      <span data-testid="signal-value">
        <>{count}</>
      </span>
    </div>
  )
}

// Baseline: plain React state re-runs the component on every update.
function StateCounter() {
  const [value, setValue] = useState(0)
  if (typeof window !== 'undefined') window.__ftStateRenders = (window.__ftStateRenders ?? 0) + 1
  return (
    <div className="my-2">
      <button type="button" data-testid="state-inc" className="rounded border px-3 py-1" onClick={() => setValue((v) => v + 1)}>
        Increment useState
      </button>{' '}
      <span data-testid="state-value">{value}</span>
    </div>
  )
}

export const Route = createFileRoute('/feature-tests/reactivity')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">reactivity</h1>
      <SignalCounter />
      <StateCounter />
    </div>
  ),
})
