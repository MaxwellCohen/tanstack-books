import { createFileRoute } from '@tanstack/react-router'
import { Suspense, use } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { getBooksCountFn, getBooksPageFn } from '@/features/book/book.functions'
import { BookGrid, BookGridSkeleton } from '@/features/book/components/book-grid'
import {
  BookPagination,
  BookPaginationSkeleton,
} from '@/features/book/components/book-pagination'
import { catalogSearchSchema, cleanSearch } from '@/lib/search-schema'
import type { SearchParams } from '@/lib/url-state'

export const Route = createFileRoute('/')({
  ssr: true,
  validateSearch: catalogSearchSchema,
  loaderDeps: ({ search }) => cleanSearch(search),
  loader: ({ deps }) => ({
    books: getBooksPageFn({ data: deps }),
    searchParams: deps as SearchParams,
    totalResults: getBooksCountFn({ data: deps }),
  }),
  head: () => ({
    meta: [{ title: 'Books · TanStack Books' }],
  }),
  component: HomePage,
  errorComponent: HomeError,
})

function HomeBooks() {
  const { books, searchParams } = Route.useLoaderData()
  return <BookGrid books={use(books)} searchParams={searchParams} />
}

function HomePagination() {
  const { searchParams, totalResults } = Route.useLoaderData()
  return (
    <BookPagination searchParams={searchParams} totalResults={use(totalResults)} />
  )
}

function HomePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6">
        <Suspense fallback={<BookGridSkeleton />}>
          <HomeBooks />
        </Suspense>
      </div>
      <footer className="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6">
        <Suspense fallback={<BookPaginationSkeleton />}>
          <HomePagination />
        </Suspense>
      </footer>
    </div>
  )
}

function HomeError({ error }: { error: Error }) {
  return (
    <ErrorState body={error.message} title="Can't load books">
      <Button className="mt-1" onClick={() => window.location.reload()} size="sm" variant="secondary">
        Try again
      </Button>
    </ErrorState>
  )
}
