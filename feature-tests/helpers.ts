import { type TestInfo } from '@playwright/test'
import { execSync } from 'node:child_process'
import path from 'node:path'

export const ROOT = path.resolve(import.meta.dirname, '..')

export function evidence(info: TestInfo, text: string) {
  info.annotations.push({ type: 'evidence', description: text })
}

export function run(cmd: string, env: Record<string, string> = {}) {
  return execSync(cmd, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: 'pipe',
    maxBuffer: 64 * 1024 * 1024,
  }).toString()
}

export function stamp(html: string) {
  return html.match(/data-testid="stamp">([^<]*)</)?.[1]
}
