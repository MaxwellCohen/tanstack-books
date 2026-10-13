import { z } from 'zod'
import type { SearchParams } from '@/lib/url-state'

export const catalogSearchSchema = z.object({
  delay: z.string().optional().catch(undefined),
  language: z.string().optional().catch(undefined),
  list: z.string().optional().catch(undefined),
  page: z.string().optional().catch(undefined),
  pages: z.string().optional().catch(undefined),
  rating: z.string().optional().catch(undefined),
  search: z.string().optional().catch(undefined),
  year: z.string().optional().catch(undefined),
})

export type CatalogSearch = z.infer<typeof catalogSearchSchema>

export function cleanSearch(params: SearchParams | CatalogSearch): CatalogSearch {
  const next: CatalogSearch = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      next[key as keyof CatalogSearch] = value
    }
  }
  return next
}
