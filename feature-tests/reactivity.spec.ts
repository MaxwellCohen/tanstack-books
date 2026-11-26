import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('signal bound in JSX updates text without re-running the component', async ({ page }, info) => {
  await page.goto('/feature-tests/reactivity')
  await page.waitForLoadState('networkidle')
  await expect.poll(() => page.evaluate(() => window.__ftSignalRenders)).toBe(1)

  for (let i = 0; i < 3; i++) await page.getByTestId('signal-inc').click()
  await expect(page.getByTestId('signal-value')).toHaveText('3')
  const signalRenders = await page.evaluate(() => window.__ftSignalRenders)
  expect(signalRenders).toBe(1)

  const before = await page.evaluate(() => window.__ftStateRenders ?? 0)
  for (let i = 0; i < 3; i++) await page.getByTestId('state-inc').click()
  await expect(page.getByTestId('state-value')).toHaveText('3')
  const after = await page.evaluate(() => window.__ftStateRenders ?? 0)
  expect(after - before).toBe(3)

  evidence(
    info,
    `@preact/signals-react: 3 updates -> text "3", SignalCounter renders stayed 1; useState baseline re-rendered ${after - before}x`,
  )
})
