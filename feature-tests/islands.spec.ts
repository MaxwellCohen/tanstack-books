import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, evidence } from './helpers'

const MARKER = 'FT_STATIC_ISLAND_MARKER_9b1c'

test('<Hydrate never> static card ships no JS; <Hydrate visible> island works', async ({ page, request }, info) => {
  const html = await (await request.get('/feature-tests/islands')).text()
  expect(html).toContain(MARKER)

  const js: { url: string; body: string }[] = []
  page.on('response', async (r) => {
    if (r.request().resourceType() === 'script' || r.url().endsWith('.js')) {
      try {
        js.push({ url: r.url(), body: await r.text() })
      } catch {}
    }
  })
  await page.goto('/feature-tests/islands')
  await page.waitForLoadState('networkidle')
  const button = page.getByTestId('island-button')
  await button.scrollIntoViewIfNeeded()
  await expect(async () => {
    await button.click()
    await expect(page.getByTestId('island-count')).not.toHaveText('0', { timeout: 500 })
  }).toPass({ timeout: 15_000 })
  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('static-card')).toContainText(MARKER)

  const leaking = js.filter((j) => j.body.includes(MARKER)).map((j) => j.url)
  expect(leaking).toEqual([])

  const assetsDir = path.join(ROOT, '.output/public/assets')
  const splitChunks = fs
    .readdirSync(assetsDir)
    .filter((f) => f.endsWith('.js') && fs.readFileSync(path.join(assetsDir, f), 'utf8').includes(MARKER))

  evidence(
    info,
    `${js.length} JS files downloaded, none contain the static marker; island clicked after visible() hydration; static child split into unrequested chunk(s) ${splitChunks.join(',') || 'none'}`,
  )
})
