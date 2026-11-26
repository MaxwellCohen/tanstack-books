// Server-only content inside <Hydrate when={never()}>. The marker string below
// must not appear in any JS the browser downloads.
export function StaticCard() {
  return (
    <section data-testid="static-card" className="my-4 rounded border p-4">
      <h2 className="font-semibold">Static card</h2>
      <p>{'FT_STATIC_ISLAND_MARKER_9b1c'}</p>
    </section>
  )
}
