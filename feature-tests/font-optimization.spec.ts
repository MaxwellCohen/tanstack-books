import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('font is self-hosted, has font-display and a preload', async ({ page, baseURL }, info) => {
  const requests: string[] = []
  page.on('request', (r) => requests.push(r.url()))
  await page.goto('/feature-tests/font-optimization')
  await page.evaluate(() => document.fonts.ready)

  const google = requests.filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u))
  expect(google).toEqual([])
  const fontReqs = requests.filter((u) => /\.woff2?(\?|$)/.test(u))
  expect(fontReqs.length).toBeGreaterThan(0)
  for (const u of fontReqs) expect(u.startsWith(baseURL!)).toBe(true)

  const faces = await page.evaluate(() => {
    const out: { family: string; display: string; src: string }[] = []
    for (const sheet of Array.from(document.styleSheets)) {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSFontFaceRule)
          out.push({
            family: rule.style.getPropertyValue('font-family'),
            display: rule.style.getPropertyValue('font-display'),
            src: rule.style.getPropertyValue('src'),
          })
      }
    }
    return out
  })
  const geist = faces.filter((f) => f.family.includes('Geist Variable'))
  expect(geist.length).toBeGreaterThan(0)
  for (const f of geist) expect(f.display).toBe('swap')

  const preload = await page.locator('link[rel="preload"][as="font"]').getAttribute('href')
  expect(preload).toMatch(/geist-latin-wght-normal.*\.woff2$/)
  expect(fontReqs.some((u) => u.endsWith(preload!))).toBe(true)
  expect(geist.some((f) => f.src.includes(preload!))).toBe(true)
  expect(await page.evaluate(() => document.fonts.check('16px "Geist Variable"'))).toBe(true)

  evidence(
    info,
    `${fontReqs.length} same-origin woff2 requests, 0 Google Fonts; ${geist.length} @font-face font-display:swap; preload ${preload} (hand-added, matches @font-face src)`,
  )
})
