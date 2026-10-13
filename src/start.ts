import { createMiddleware, createStart } from '@tanstack/react-start'
import { hostDocumentCacheControl } from '@/lib/catalog-cache'

const catalogHeadersMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next }) => {
    const result = await next()
    const { response } = result
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) return result

    const headers = new Headers(response.headers)
    headers.set('Cache-Control', hostDocumentCacheControl())
    headers.delete('CDN-Cache-Control')
    headers.delete('Vercel-CDN-Cache-Control')
    headers.delete('Netlify-CDN-Cache-Control')

    return {
      ...result,
      response: new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      }),
    }
  },
)

export const startInstance = createStart(() => ({
  requestMiddleware: [catalogHeadersMiddleware],
}))
