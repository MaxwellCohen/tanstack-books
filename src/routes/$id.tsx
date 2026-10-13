import { createFileRoute } from '@tanstack/react-router'
import { Suspense, use } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { getBookByIdFn } from '@/features/book/book.functions'
import { BackToBooksLink } from '@/features/book/components/back-to-books-link'
import { BookDetail, BookDetailSkeleton } from '@/features/book/components/book-detail'
import { catalogSearchSchema, cleanSearch } from '@/lib/search-schema'

export const Route = createFileRoute('/$id')({
  ssr: true,
  validateSearch: catalogSearchSchema,
  loaderDeps: ({ search }) => cleanSearch(search),
  loader: ({ deps, params }) => ({
    book: getBookByIdFn({ data: { ...deps, id: params.id } }),
  }),
  head: () => ({
    meta: [{ title: 'Book · TanStack Books' }],
  }),
  component: BookPage,
  errorComponent: BookError,
})

function BookDetailBody() {
  const { book } = Route.useLoaderData()
  return <BookDetail book={use(book)} />
}

function BookPage() {
  return (
    <div className="flex flex-1 flex-col px-4 py-5 sm:px-6">
      <BackToBooksLink className="mb-6" />
      <Suspense fallback={<BookDetailSkeleton />}>
        <BookDetailBody />
      </Suspense>
    </div>
  )
}

function BookError({ error }: { error: Error }) {
  return (
    <ErrorState body={error.message} title="Can't load this book">
      <Button className="mt-1" onClick={() => window.location.reload()} size="sm" variant="secondary">
        Try again
      </Button>
    </ErrorState>
  )
}
