import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, evidence, stamp } from './helpers'

test('prerendered, per-request SSR and client-only routes', async ({ page, request }, info) => {
  const file = path.join(ROOT, '.output/public/feature-tests/render-modes/static/index.html')
  expect(fs.existsSync(file)).toBe(true)
  const built = stamp(fs.readFileSync(file, 'utf8'))

  const s1 = stamp(await (await request.get('/feature-tests/render-modes/static')).text())
  await new Promise((r) => setTimeout(r, 50))
  const s2 = stamp(await (await request.get('/feature-tests/render-modes/static')).text())
  expect(s1).toBe(built)
  expect(s2).toBe(built)

  const d1 = stamp(await (await request.get('/feature-tests/render-modes/ssr')).text())
  await new Promise((r) => setTimeout(r, 50))
  const d2 = stamp(await (await request.get('/feature-tests/render-modes/ssr')).text())
  expect(d1).toBeTruthy()
  expect(d1).not.toBe(d2)

  const clientHtml = await (await request.get('/feature-tests/render-modes/client')).text()
  expect(clientHtml).not.toContain('FT_CLIENT_ONLY_CONTENT')
  await page.goto('/feature-tests/render-modes/client')
  await expect(page.getByText('FT_CLIENT_ONLY_CONTENT')).toBeVisible()

  evidence(
    info,
    `prerendered file stamp ${built} served unchanged twice; SSR ${d1} != ${d2}; ssr:false HTML lacks content, browser renders it`,
  )
})
