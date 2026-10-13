import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useTransition } from 'react'
import { cleanSearch, type CatalogSearch } from '@/lib/search-schema'
import { parseSearchParams, type SearchParams } from '@/lib/url-state'

export function useCatalogParams() {
  const locationSearch = useRouterState({ select: (state) => state.location.search })
  const navigate = useNavigate()
  const [pending, startTransition] = useTransition()
  const current = cleanSearch(
    parseSearchParams(
      typeof locationSearch === 'string'
        ? Object.fromEntries(new URLSearchParams(locationSearch))
        : (locationSearch as Record<string, string | undefined>),
    ),
  )

  function replace(next: SearchParams) {
    startTransition(() => {
      void navigate({
        to: '/',
        search: cleanSearch(next) as CatalogSearch,
        replace: true,
        resetScroll: false,
      })
    })
  }

  return { current, pending, replace }
}
