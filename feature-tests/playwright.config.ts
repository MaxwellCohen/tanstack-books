import { defineConfig } from '@playwright/test'

const PORT = Number(process.env.FT_PORT ?? 4109)

export default defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.ts$/,
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  reporter: [['list'], ['json', { outputFile: process.env.FT_REPORT ?? '.artifacts/report.json' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: { executablePath: '/home/maxc/.local/bin/google-chrome' },
  },
})
