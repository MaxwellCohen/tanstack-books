import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('Unpic + IPX: srcset, dimensions, lazy offscreen, modern format', async ({ page, request }, info) => {
  await page.goto('/feature-tests/image-pipeline')
  const hero = page.getByTestId('hero')
  const off = page.getByTestId('offscreen')

  const srcset = (await hero.getAttribute('srcset')) ?? ''
  const widths = [...srcset.matchAll(/\s(\d+)w/g)].map((m) => Number(m[1]))
  expect(new Set(widths).size).toBeGreaterThanOrEqual(2)
  expect(await hero.getAttribute('width')).toBeTruthy()
  expect(await hero.getAttribute('height')).toBeTruthy()
  expect(await off.getAttribute('loading')).toBe('lazy')

  // srcset entries are "<url> <n>w"; IPX URLs themselves contain commas.
  const firstUrl = [...srcset.matchAll(/(\S+)\s+\d+w/g)][0][1]
  const res = await request.get(firstUrl, {
    headers: { Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' },
  })
  expect(res.status()).toBe(200)
  const type = res.headers()['content-type']
  expect(type).toMatch(/image\/(avif|webp)/)
  const bytes = (await res.body()).length

  evidence(
    info,
    `srcset widths [${widths.join(',')}], width=${await hero.getAttribute('width')} height=${await hero.getAttribute('height')}, offscreen loading=lazy; ${firstUrl} -> ${type} (${bytes} B, source jpeg 20203 B); layout="fixed" (constrained layout omits width/height attrs, uses CSS aspect-ratio)`,
  )
})
