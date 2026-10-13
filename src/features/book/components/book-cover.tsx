'use client'

import { useState } from 'react'
import { createPngDataUri } from 'unlazy/thumbhash'
import { Image } from '@/components/ui/image'
import { Skeleton } from '@/components/ui/skeleton'
import {
  COVER_IMAGE_HEIGHT,
  COVER_IMAGE_WIDTH,
  EMPTY_IMAGE_URL,
  getLargeBookImageUrl,
} from '@/features/book/book-constants'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  priority?: boolean
  sizes: string
  src: string | null
  thumbhash: string | null
  title: string
}

export function BookCover({ className, priority, sizes, src, thumbhash, title }: Props) {
  const resolved = getLargeBookImageUrl(src ?? EMPTY_IMAGE_URL)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const unavailable = failedSrc === resolved

  return (
    <div
      className={cn(
        'bg-card dark:bg-card-dark relative aspect-[2/3] w-full overflow-hidden rounded-md',
        className,
      )}
      style={
        thumbhash
          ? {
              backgroundImage: `url("${createPngDataUri(thumbhash)}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {unavailable ? (
        <div
          aria-label={`Cover unavailable for ${title}`}
          className="text-muted absolute inset-0 flex items-center justify-center p-3 text-center text-sm"
          role="img"
        >
          Cover unavailable
        </div>
      ) : (
        <Image
          alt={title}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          height={COVER_IMAGE_HEIGHT}
          layout="constrained"
          objectFit="cover"
          onError={() => setFailedSrc(resolved)}
          priority={priority}
          sizes={sizes}
          src={resolved}
          unstyled
          width={COVER_IMAGE_WIDTH}
        />
      )}
    </div>
  )
}

export function BookCoverSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('skeleton-subtle aspect-[2/3] w-full rounded-md', className)} />
}
