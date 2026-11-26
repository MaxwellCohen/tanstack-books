import { expect, test } from '@playwright/test'
import { evidence, stamp } from './helpers'

test('route headers() set Cache-Control and the HTTP cache reuses the response', async ({ page, request }, info) => {
  const res = await request.get('/feature-tests/caching')
  const cc = res.headers()['cache-control']
  expect(cc).toContain('max-age=30')
  expect(cc).toContain('s-maxage=60')
  expect(cc).toContain('stale-while-revalidate=300')

  await page.goto('/feature-tests')
  const result = await page.evaluate(async () => {
    const pick = (html: string) => html.match(/data-testid="stamp">([^<]*)</)?.[1]
    const a = pick(await (await fetch('/feature-tests/caching')).text())
    await new Promise((r) => setTimeout(r, 1100))
    const b = pick(await (await fetch('/feature-tests/caching')).text())
    const c = pick(await (await fetch('/feature-tests/caching', { cache: 'no-cache' })).text())
    return { a, b, c }
  })
  expect(result.a).toBeTruthy()
  expect(result.b).toBe(result.a)
  expect(result.c).not.toBe(result.a)
  const direct = stamp(await (await request.get('/feature-tests/caching')).text())

  evidence(
    info,
    `Cache-Control "${cc}"; browser fetch #2 reused cached HTML (stamp ${result.a} == ${result.b}); revalidation (no-cache) got fresh ${result.c}; no server-side cache (direct GET -> ${direct})`,
  )
})
