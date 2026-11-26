import { createFileRoute } from '@tanstack/react-router'
import { Image } from '@/components/ui/image'

// Third-party: Unpic (@unpic/react) builds srcset URLs for IPX (/_ipx) served by Nitro.
// layout="fixed" keeps width/height attributes (constrained/fullWidth drop them for CSS aspect-ratio).
export const Route = createFileRoute('/feature-tests/image-pipeline')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">image-pipeline</h1>
      <Image
        data-testid="hero"
        src="/feature-tests/sample.jpg"
        width={400}
        height={250}
        layout="fixed"
        priority
        alt="Hero sample"
      />
      <div style={{ height: '3000px' }} />
      <Image
        data-testid="offscreen"
        src="/feature-tests/sample.jpg"
        width={400}
        height={250}
        layout="fixed"
        alt="Offscreen sample"
      />
    </div>
  ),
})
