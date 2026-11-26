import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('hovering a link preloads the target route code + loader data before click', async ({ page }, info) => {
  await page.goto('/feature-tests/route-prefetching')
  await page.waitForLoadState('networkidle')

  const seen: string[] = []
  page.on('request', (r) => seen.push(new URL(r.url()).pathname))
  await page.getByTestId('target-link').hover()
  await expect
    .poll(() => seen.filter((p) => /\/assets\/target-.*\.js$/.test(p) || p.includes('/_serverFn/')).length)
    .toBeGreaterThanOrEqual(2)
  const beforeClick = [...seen]

  await page.getByTestId('target-link').click()
  await expect(page.getByTestId('target-heading')).toHaveText('FT_PREFETCH_TARGET_COMPONENT')

  const code = beforeClick.filter((p) => /\/assets\/target-.*\.js$/.test(p))
  const data = beforeClick.filter((p) => p.includes('/_serverFn/'))
  expect(code.length).toBeGreaterThan(0)
  expect(data.length).toBeGreaterThan(0)
  evidence(info, `on hover, before click: route chunk ${code[0]} + loader server fn ${data[0].slice(0, 40)}…`)
})
