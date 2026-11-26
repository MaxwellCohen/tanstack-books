import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('route CSS is inlined in <style>, no render-blocking stylesheet', async ({ page, request }, info) => {
  const html = await (await request.get('/feature-tests/css-inlining')).text()
  const styles = [...html.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)]
  const routeStyle = styles.find((m) => m[2].includes('.ft-css-inline-marker'))
  expect(routeStyle, 'inline <style> containing route CSS').toBeTruthy()
  const stylesheetLinks = html.match(/<link[^>]*rel="stylesheet"[^>]*>/g) ?? []
  expect(stylesheetLinks).toEqual([])

  const cssRequests: string[] = []
  page.on('request', (r) => r.resourceType() === 'stylesheet' && cssRequests.push(r.url()))
  await page.goto('/feature-tests/css-inlining')
  await expect(page.getByTestId('marker')).toHaveCSS('color', 'rgb(12, 34, 56)')
  expect(cssRequests).toEqual([])
  evidence(
    info,
    `<style${routeStyle![1]}> holds .ft-css-inline-marker; 0 <link rel=stylesheet>, 0 stylesheet requests; computed color applied`,
  )
})
