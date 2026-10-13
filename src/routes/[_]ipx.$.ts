import { createFileRoute } from '@tanstack/react-router'
import { imagesBinding, optimizeWithCloudflare } from '@/lib/images/cloudflare'

export const Route = createFileRoute('/_ipx/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const images = imagesBinding(request)
        if (images) return optimizeWithCloudflare(request, images)
        const { handleWithIpx } = await import('@/lib/images/ipx')
        return handleWithIpx(request)
      },
      HEAD: async ({ request }) => {
        const images = imagesBinding(request)
        if (images) return optimizeWithCloudflare(request, images)
        const { handleWithIpx } = await import('@/lib/images/ipx')
        return handleWithIpx(request)
      },
    },
  },
})
