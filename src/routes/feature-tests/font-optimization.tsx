import { createFileRoute } from '@tanstack/react-router'
// @fontsource is imported in src/styles/global.css (self-hosted Geist).
// Fontsource has no preload, so the preload link is added by hand via head().
import geistWoff2 from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'

export const Route = createFileRoute('/feature-tests/font-optimization')({
  head: () => ({
    links: [
      { rel: 'preload', href: geistWoff2, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    ],
  }),
  component: () => (
    <div className="p-6" style={{ fontFamily: "'Geist Variable', sans-serif" }}>
      <h1 className="text-2xl font-semibold">font-optimization</h1>
      <p data-testid="font-text">Self-hosted Geist Variable via @fontsource-variable/geist.</p>
    </div>
  ),
})
