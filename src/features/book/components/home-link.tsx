import { BookMark } from '@/components/book-mark'
import { FastLink } from '@/components/ui/fast-link'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { buildHref } from '@/lib/url-state'

const linkClass = 'inline-flex items-center gap-2 text-base font-semibold tracking-tight'

export function HomeLink() {
  const { current } = useCatalogParams()
  const href = buildHref({ delay: current.delay })

  return (
    <FastLink aria-label="TanStack Books home" className={linkClass} href={href} prefetch={true}>
      <BookMark className="text-action size-5" />
      TanStack Books
    </FastLink>
  )
}

export function HomeLinkFallback() {
  return (
    <FastLink aria-label="TanStack Books home" className={linkClass} href="/" prefetch={true}>
      <BookMark className="text-action size-5" />
      TanStack Books
    </FastLink>
  )
}
