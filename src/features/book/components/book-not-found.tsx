import { Link } from '@tanstack/react-router'
import { buttonClasses } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export function BookNotFound() {
  return (
    <EmptyState body="We couldn't find a book with that id." title="Book not found">
      <Link className={buttonClasses({ className: 'mt-1', variant: 'secondary' })} to="/">
        Back to the shelf
      </Link>
    </EmptyState>
  )
}
