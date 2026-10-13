import { Image as UnpicImage } from '@unpic/react'
import type { ComponentProps } from 'react'
import { imageCdn } from '@/lib/image-config'

const IPX_OPTIONS = { ipx: { baseURL: '/_ipx' } } as const

type UnpicProps = ComponentProps<typeof UnpicImage>

export type ImageProps = Omit<UnpicProps, 'cdn' | 'fallback' | 'options'> & {
  options?: UnpicProps['options']
}

/** Cover images — host CDN in production; `/_ipx` locally and on Cloudflare Workers. */
export function Image({ options, ...props }: ImageProps) {
  return (
    <UnpicImage
      {...(props as UnpicProps)}
      cdn={imageCdn}
      options={imageCdn === 'ipx' ? { ...IPX_OPTIONS, ...options } : options}
    />
  )
}
