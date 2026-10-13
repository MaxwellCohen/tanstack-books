import { EMPTY_IMAGE_URL, getLargeBookImageUrl, PRIORITY_COVER_COUNT } from '@/features/book/book-constants';

type Cover = string | null;
const covers = new Map<string, Cover | Promise<Cover>>();
const MAX_CACHED_COVERS = 128;
export const COVER_REVEAL_TIMEOUT_MS = 500;

let coverGatingEnabled = false;

export function enableCoverGating() {
  coverGatingEnabled = true;
}

export function isCoverGatingEnabled() {
  return coverGatingEnabled;
}

export function loadBookCover(imageUrl: string | null, priority = false): Cover | Promise<Cover> {
  const src = getLargeBookImageUrl(imageUrl ?? EMPTY_IMAGE_URL);
  if (typeof window === 'undefined' || !coverGatingEnabled) return src;

  const cached = covers.get(src);
  if (cached !== undefined) return cached;

  const image = new window.Image();
  image.decoding = 'async';
  image.fetchPriority = priority ? 'high' : 'auto';
  image.src = src;
  if (image.complete) return image.naturalWidth > 0 ? src : null;

  let timeout: ReturnType<typeof setTimeout>;
  const pending = Promise.race([
    image.decode().then(
      () => src,
      () => null,
    ),
    new Promise<Cover>(resolve => {
      timeout = setTimeout(() => resolve(src), COVER_REVEAL_TIMEOUT_MS);
    }),
  ]).then(result => {
    clearTimeout(timeout);
    if (covers.get(src) === pending) covers.set(src, result);
    return result;
  });
  covers.set(src, pending);
  if (covers.size > MAX_CACHED_COVERS) {
    covers.delete(covers.keys().next().value!);
  }
  return pending;
}

export function preloadBookCovers<T extends { image_url: string | null }>(books: T[]) {
  for (const book of books.slice(0, PRIORITY_COVER_COUNT)) {
    void loadBookCover(book.image_url, true);
  }
}
