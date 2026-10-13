import { FastLink } from '@/components/ui/fast-link'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<typeof FastLink>, 'prefetch'> & {
  eager: boolean
}

export function HoverPrefetchLink({ eager, ...props }: Props) {
  return <FastLink {...props} prefetch={eager ? true : 'intent'} />
}
