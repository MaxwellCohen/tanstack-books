import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, evidence, run } from './helpers'

test('rollup-plugin-visualizer writes an HTML + JSON report', async ({}, info) => {
  test.setTimeout(300_000)
  const out = path.join(ROOT, 'feature-tests/.artifacts/analyze')
  fs.rmSync(out, { recursive: true, force: true })
  run('npx vite build', { ANALYZE: '1', ANALYZE_OUT: out })
  const html = path.join(out, 'bundle-stats.html')
  const json = path.join(out, 'bundle-stats.json')
  expect(fs.existsSync(html)).toBe(true)
  expect(fs.existsSync(json)).toBe(true)
  const data = JSON.parse(fs.readFileSync(json, 'utf8'))
  const ids = Object.values(data.nodeMetas ?? {}).map((m: any) => m.id as string)
  expect(ids.some((id) => id.includes('react-dom'))).toBe(true)
  evidence(
    info,
    `ANALYZE=1 vite build -> bundle-stats.html (${fs.statSync(html).size} B) + bundle-stats.json (${ids.length} modules)`,
  )
})
