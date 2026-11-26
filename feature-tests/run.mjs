// Orchestrates the feature tests:
//  1. build-time specs (bundle-analysis, multi-host-deployment) — they rebuild the app;
//  2. production build (Nitro node) + `vite preview` on PORT;
//  3. runtime specs against that server;
//  4. writes feature-tests/results.json from the Playwright JSON reports.
import { execSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const PORT = process.env.FT_PORT ?? '4109'
const ART = path.join(ROOT, 'feature-tests/.artifacts')
fs.mkdirSync(ART, { recursive: true })

const BUILD_SPECS = ['bundle-analysis', 'multi-host-deployment']
const RUNTIME_SPECS = [
  'css-inlining', 'font-optimization', 'image-pipeline', 'caching', 'route-prefetching',
  'islands', 'render-modes', 'reactivity', 'third-party-scripts',
]

const META = {
  'css-inlining': ['experimental', 'Experimental tanstackStart({ server: { build: { inlineCss: true } } }) inlines the route-level `import "./css-inlining.css"`'],
  'font-optimization': ['third-party', '@fontsource-variable/geist imported in global CSS (self-hosted); preload <link> added by hand via route head() with a ?url import'],
  'image-pipeline': ['third-party', '@unpic/react <Image cdn="ipx"> + IPX handler route (/_ipx) on Nitro'],
  caching: ['first-party', 'Route `headers()` sets Cache-Control (max-age/s-maxage/stale-while-revalidate); reuse is done by the HTTP cache/CDN'],
  'route-prefetching': ['first-party', "Router defaultPreload: 'intent' / <Link preload=\"intent\">"],
  islands: ['experimental', '<Hydrate when={never()}> around a static card and <Hydrate when={visible()}> around a counter (@tanstack/react-start)'],
  'render-modes': ['first-party', 'tanstackStart pages[].prerender (static), default SSR, and route `ssr: false` (client-only)'],
  reactivity: ['third-party', '@preact/signals-react signal passed directly into JSX (text-node binding)'],
  'bundle-analysis': ['third-party', 'rollup-plugin-visualizer added to vite.config.ts behind ANALYZE=1'],
  'third-party-scripts': ['manual', 'Hand-rolled: useEffect + requestIdleCallback injects an async <script> after hydration (no loading-strategy API)'],
  'multi-host-deployment': ['third-party', 'Nitro presets (node, vercel) + @netlify/vite-plugin-tanstack-start + @cloudflare/vite-plugin selected by env in vite.config.ts'],
}

function sh(cmd, env = {}) {
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env } })
}

function playwright(specs, report) {
  try {
    sh(`npx playwright test -c feature-tests/playwright.config.ts ${specs.map((s) => `feature-tests/${s}.spec.ts`).join(' ')}`, {
      FT_REPORT: report,
      FT_PORT: PORT,
    })
  } catch {
    // failures are recorded in the JSON report
  }
  return fs.existsSync(report) ? JSON.parse(fs.readFileSync(report, 'utf8')) : null
}

async function waitFor(url, ms = 60_000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try {
      const r = await fetch(url)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`server did not start at ${url}`)
}

const reports = []
reports.push(playwright(BUILD_SPECS, path.join(ART, 'report-build.json')))

sh('npx vite build')
const server = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort'], {
  cwd: ROOT,
  stdio: 'inherit',
  detached: true,
})
try {
  await waitFor(`http://localhost:${PORT}/feature-tests`)
  reports.push(playwright(RUNTIME_SPECS, path.join(ART, 'report-runtime.json')))
} finally {
  try {
    process.kill(-server.pid, 'SIGTERM')
  } catch {}
}

const found = {}
function walk(suite, file) {
  for (const s of suite.suites ?? []) walk(s, s.file ?? file)
  for (const spec of suite.specs ?? []) {
    const id = path.basename(spec.file ?? file, '.spec.ts')
    const res = spec.tests?.[0]?.results?.at(-1)
    const ev = (spec.tests?.[0]?.annotations ?? res?.annotations ?? []).find((a) => a.type === 'evidence')
    const err = res?.error?.message?.replace(/\u001b\[[0-9;]*m/g, '').split('\n').filter(Boolean).slice(0, 2).join(' ')
    found[id] = { status: res?.status === 'passed' ? 'pass' : 'fail', evidence: ev?.description ?? err ?? 'no result' }
    if (res?.status !== 'passed' && err) found[id].evidence = `${ev?.description ? ev.description + ' | ' : ''}${err}`.slice(0, 400)
  }
}
for (const r of reports) if (r) for (const s of r.suites) walk(s, s.file)

const results = {}
for (const id of Object.keys(META)) {
  const [claimedLabel, method] = META[id]
  const f = found[id] ?? { status: 'fail', evidence: 'test did not run' }
  results[id] = { claimedLabel, status: f.status, method, evidence: f.evidence, test: `feature-tests/${id}.spec.ts` }
}
const overrides = path.join(ROOT, 'feature-tests/suggested-labels.json')
if (fs.existsSync(overrides)) {
  for (const [id, label] of Object.entries(JSON.parse(fs.readFileSync(overrides, 'utf8'))))
    if (results[id]) results[id].suggestedLabel = label
}

const out = {
  framework: 'tanstack-start-react',
  repo: 'tanstack-books',
  commit: execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(),
  ranAt: new Date().toISOString(),
  results,
}
fs.writeFileSync(path.join(ROOT, 'feature-tests/results.json'), JSON.stringify(out, null, 2) + '\n')
console.log(Object.entries(results).map(([k, v]) => `${v.status.padEnd(5)} ${k}`).join('\n'))
