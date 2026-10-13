import { useOptimistic, useTransition } from 'react'
import { Range } from '@/components/ui/range'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import {
  API_DELAY_VALUES,
  formatApiDelay,
  getApiDelayMs,
} from '@/lib/url-state'

export function ApiDelay({ idPrefix }: { idPrefix: string }) {
  const { current, replace } = useCatalogParams()
  const committed = getApiDelayMs(current)
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useOptimistic(committed)

  function commit(next: number) {
    startTransition(() => {
      setValue(next)
      const params = { ...current, delay: next === 0 ? undefined : String(next) }
      if (!params.delay) delete params.delay
      replace(params)
    })
  }

  return (
    <div data-filtering={isPending ? '' : undefined}>
      <Range
        hint={
          <>
            <span>Off</span>
            <span>3s</span>
          </>
        }
        id={`${idPrefix}-api-delay`}
        label="API delay"
        onValueChange={commit}
        readout={formatApiDelay(value)}
        value={value}
        values={API_DELAY_VALUES}
      />
    </div>
  )
}

export function ApiDelayFallback({ idPrefix }: { idPrefix: string }) {
  return (
    <Range
      hint={
        <>
          <span>Off</span>
          <span>3s</span>
        </>
      }
      id={`${idPrefix}-api-delay`}
      label="API delay"
      onValueChange={() => undefined}
      readout="Off"
      value={0}
      values={API_DELAY_VALUES}
    />
  )
}
