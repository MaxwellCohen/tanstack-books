import { useCatalogParams } from '@/hooks/use-catalog-params'

export function useSearchParamsRecord(): Record<string, string> {
  const { current } = useCatalogParams()
  return Object.fromEntries(
    Object.entries(current).filter((entry): entry is [string, string] => Boolean(entry[1])),
  )
}
