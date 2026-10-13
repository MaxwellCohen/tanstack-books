import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { toBookFilters, toBookQuery } from '@/features/book/book-utils'
import type { SearchParams } from '@/lib/url-state'
import { getApiDelayMs } from '@/lib/url-state'

const searchParamsSchema = z.object({
  delay: z.string().optional(),
  language: z.string().optional(),
  list: z.string().optional(),
  page: z.string().optional(),
  pages: z.string().optional(),
  rating: z.string().optional(),
  search: z.string().optional(),
  year: z.string().optional(),
})

const bookIdSchema = z.object({
  delay: z.string().optional(),
  id: z.string(),
})

async function withDelay<T>(searchParams: SearchParams, work: () => Promise<T>): Promise<T> {
  const { waitForApiDelay } = await import('@/lib/api-delay')
  await waitForApiDelay(getApiDelayMs(searchParams))
  return work()
}

export const getBooksPageFn = createServerFn({ method: 'GET' })
  .validator(searchParamsSchema)
  .handler(async ({ data }) => {
    const { getBooksPage } = await import('@/features/book/book-queries.server')
    return withDelay(data, () => getBooksPage(toBookQuery(data)))
  })

export const getBooksCountFn = createServerFn({ method: 'GET' })
  .validator(searchParamsSchema)
  .handler(async ({ data }) => {
    const { getBooksCount } = await import('@/features/book/book-queries.server')
    return withDelay(data, () => getBooksCount(toBookFilters(toBookQuery(data))))
  })

export const getBookByIdFn = createServerFn({ method: 'GET' })
  .validator(bookIdSchema)
  .handler(async ({ data }) => {
    const { getBookById } = await import('@/features/book/book-queries.server')
    return withDelay({ delay: data.delay }, () => getBookById(data.id))
  })
