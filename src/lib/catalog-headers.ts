/** Match next-books HTML Cache-Control per host (Vercel vs Netlify/Cloudflare/local). */
export const VERCEL_DOCUMENT_CACHE_CONTROL = 'public, max-age=0, must-revalidate';
export const PRIVATE_DOCUMENT_CACHE_CONTROL =
  'private, no-cache, no-store, max-age=0, must-revalidate';

function isVercel() {
  return typeof process !== 'undefined' && Boolean(process.env.VERCEL) && !process.env.CLOUDFLARE;
}

/**
 * Document headers for the root route's `headers()` option. Kept free of the
 * data-cache module so the client bundle never pulls in host SDKs.
 */
export function catalogDocumentHeaders(): Record<string, string> {
  return {
    'Cache-Control': isVercel() ? VERCEL_DOCUMENT_CACHE_CONTROL : PRIVATE_DOCUMENT_CACHE_CONTROL,
  };
}
