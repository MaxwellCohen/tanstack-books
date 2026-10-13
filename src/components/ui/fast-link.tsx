import { Link } from '@tanstack/react-router'
import { startTransition, useRef, type ReactNode } from 'react'
import { cleanSearch } from '@/lib/search-schema'
import { parseSearchParams, type SearchParams } from '@/lib/url-state'

type Props = {
  children?: ReactNode
  className?: string
  href: string
  onPressNavigate?: () => void
  prefetch?: boolean | 'intent' | 'viewport' | 'render'
  'aria-label'?: string
}

function parseHref(href: string): {
  to: '/' | '/$id'
  params?: { id: string }
  search?: SearchParams
} {
  const url = new URL(href, 'http://local')
  const search = cleanSearch(parseSearchParams(Object.fromEntries(url.searchParams)))
  const path = url.pathname

  if (path === '/' || path === '') {
    return { to: '/', search }
  }

  const id = path.replace(/^\//, '').split('/')[0]
  return { to: '/$id', params: { id }, search }
}

export function FastLink({
  children = null,
  href,
  onPressNavigate,
  prefetch = 'intent',
  className,
  ...rest
}: Props) {
  const navigatedOnMouseDown = useRef(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const target = parseHref(href)

  const preload = prefetch === false ? false : prefetch === true ? 'intent' : prefetch

  return (
    <Link
      className={className}
      preload={preload}
      {...rest}
      {...(target.to === '/'
        ? { to: '/' as const, search: target.search }
        : { to: '/$id' as const, params: target.params!, search: target.search })}
      onMouseDown={(event) => {
        const interactiveTarget =
          event.target instanceof Element
            ? event.target.closest(
                'button, input, select, textarea, [contenteditable="true"], [role="button"]',
              )
            : null
        const shouldNavigate =
          !interactiveTarget &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey &&
          !event.currentTarget.hasAttribute('download') &&
          event.button === 0

        if (!shouldNavigate) return

        startTransition(() => {
          onPressNavigate?.()
          event.currentTarget.click()
          navigatedOnMouseDown.current = true
          clearTimeout(resetTimer.current)
          resetTimer.current = setTimeout(() => {
            navigatedOnMouseDown.current = false
          }, 500)
        })
        event.preventDefault()
      }}
      onClick={(event) => {
        if (navigatedOnMouseDown.current) {
          clearTimeout(resetTimer.current)
          navigatedOnMouseDown.current = false
          event.preventDefault()
        }
      }}
    >
      {children}
    </Link>
  )
}
