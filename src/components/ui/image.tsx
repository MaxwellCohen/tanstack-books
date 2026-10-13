import { Image as UnpicImage } from '@unpic/react'
import type { ComponentProps } from 'react'

const IPX_OPTIONS = { ipx: { baseURL: '/_ipx' } } as const

type UnpicProps = ComponentProps<typeof UnpicImage>

export type ImageProps = Omit<UnpicProps, 'cdn' | 'fallback' | 'options'> & {
  options?: UnpicProps['options']
}

/** Cover images. URLs stay on /_ipx; Cloudflare Workers resize them with the IMAGES binding. */
export function Image({ options, ...props }: ImageProps) {
  return (
    <UnpicImage
      {...(props as UnpicProps)}
      cdn="ipx"
      options={{ ...IPX_OPTIONS, ...options }}
    />
  )
}
