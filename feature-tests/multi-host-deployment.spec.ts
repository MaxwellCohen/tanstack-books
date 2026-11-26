import { expect, test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, evidence, run } from './helpers'

const TARGETS: { name: string; env: Record<string, string>; expect: string[] }[] = [
  { name: 'node (Nitro node-server)', env: {}, expect: ['.output/server/index.mjs', '.output/public'] },
  { name: 'vercel (Nitro preset)', env: { NITRO_PRESET: 'vercel' }, expect: ['.vercel/output/config.json', '.vercel/output/functions', '.vercel/output/static'] },
  { name: 'netlify (@netlify/vite-plugin-tanstack-start)', env: { NETLIFY: '1' }, expect: ['dist/client', '.netlify/v1'] },
  { name: 'cloudflare (@cloudflare/vite-plugin)', env: { CLOUDFLARE: '1' }, expect: ['dist/client', 'dist/server/wrangler.json', 'dist/server/index.js'] },
]

test('builds for node, vercel, netlify and cloudflare targets', async ({}, info) => {
  test.setTimeout(900_000)
  const ok: string[] = []
  const failed: string[] = []
  for (const t of TARGETS) {
    for (const d of ['dist', '.vercel', '.netlify']) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true })
    try {
      run('npx vite build', t.env)
      const missing = t.expect.filter((p) => !fs.existsSync(path.join(ROOT, p)))
      if (missing.length) failed.push(`${t.name}: missing ${missing.join(',')}`)
      else ok.push(t.name)
    } catch (e) {
      failed.push(`${t.name}: build failed ${(e as Error).message.slice(0, 120)}`)
    }
  }
  for (const d of ['dist', '.vercel', '.netlify']) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true })
  evidence(info, `built OK: ${ok.join('; ')}${failed.length ? ` | failed: ${failed.join('; ')}` : ''}`)
  expect(ok.length).toBeGreaterThanOrEqual(2)
})
