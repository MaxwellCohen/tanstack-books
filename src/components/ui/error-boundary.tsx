import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import type { ComponentProps, ReactNode } from 'react'

type Props = {
  body?: string
  children: ReactNode
  compact?: boolean
  title?: string
  fallbackRender?: ComponentProps<typeof ReactErrorBoundary>['fallbackRender']
}

export function ErrorBoundary({ body, children, compact, title, fallbackRender }: Props) {
  return (
    <ReactErrorBoundary
      fallbackRender={
        fallbackRender ??
        (({ resetErrorBoundary }) => (
          <ErrorState body={body} compact={compact} title={title}>
            <Button onClick={() => resetErrorBoundary()} size="sm" variant="secondary">
              Try again
            </Button>
          </ErrorState>
        ))
      }
    >
      {children}
    </ReactErrorBoundary>
  )
}

export default ErrorBoundary
