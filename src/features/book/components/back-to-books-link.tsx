import { ArrowLeft } from 'lucide-react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const linkClass =
  'text-muted hover:bg-card dark:hover:bg-card-dark -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white'

export function BackToBooksLink({ className }: { className?: string }) {
  const navigate = useNavigate()
  const router = useRouter()

  return (
    <button
      className={cn(linkClass, className)}
      onClick={() => {
        if (router.history.canGoBack()) {
          router.history.back()
        } else {
          void navigate({ to: '/' })
        }
      }}
      type="button"
    >
      <ArrowLeft aria-hidden className="size-4" />
      Back to books
    </button>
  )
}
