import { createFileRoute } from '@tanstack/react-router'
import './css-inlining.css'

// Route-level CSS imported normally (a manifest asset). The experimental
// `server.build.inlineCss` option in vite.config.ts inlines it into a <style>.
export const Route = createFileRoute('/feature-tests/css-inlining')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">css-inlining</h1>
      <p className="ft-css-inline-marker" data-testid="marker">
        Styled by route CSS inlined via experimental server.build.inlineCss.
      </p>
    </div>
  ),
})
