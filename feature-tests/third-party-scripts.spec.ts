import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('third-party script loads after hydration at idle, not parser-blocking', async ({ page, request }, info) => {
  const html = await (await request.get('/feature-tests/third-party-scripts')).text()
  expect(html).not.toContain('fake-third-party.js')

  await page.goto('/feature-tests/third-party-scripts')
  await expect(page.getByTestId('content')).toBeVisible()
  await page.waitForFunction(() => (window as any).__ftThirdParty)

  const t = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime
    const res = performance
      .getEntriesByType('resource')
      .find((e) => e.name.includes('fake-third-party.js')) as PerformanceResourceTiming
    const el = document.querySelector('script[src*="fake-third-party.js"]') as HTMLScriptElement
    return {
      fcp,
      dcl: nav.domContentLoadedEventEnd,
      start: res.startTime,
      async: el.async,
      inHead: el.parentElement === document.head,
      strategy: el.dataset.strategy,
      ran: (window as any).__ftThirdParty,
    }
  })
  expect(t.async).toBe(true)
  expect(t.inHead).toBe(false)
  expect(t.start).toBeGreaterThan(t.dcl)
  if (t.fcp != null) expect(t.start).toBeGreaterThan(t.fcp)

  evidence(
    info,
    `not in SSR HTML; injected async (${t.strategy}) at ${t.start.toFixed(0)}ms after DCL ${t.dcl.toFixed(0)}ms / FCP ${t.fcp?.toFixed(0)}ms; global set (readyState ${t.ran.readyState})`,
  )
})
