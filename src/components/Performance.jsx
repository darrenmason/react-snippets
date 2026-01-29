import { memo, useDeferredValue, useMemo, useState, useTransition } from 'react'

const SlowList = memo(function SlowList({ items }) {
  const start = performance.now()
  while (performance.now() - start < 8) {
    // simulate a costly render
  }

  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
})

export default function Performance() {
  const [items, setItems] = useState(
    Array.from({ length: 2000 }, (_, i) => `Item ${i + 1}`)
  )
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    if (!deferredQuery) return items.slice(0, 200)
    return items
      .filter((item) =>
        item.toLowerCase().includes(deferredQuery.toLowerCase())
      )
      .slice(0, 200)
  }, [deferredQuery, items])

  return (
    <div className="stack">
      <div className="row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter items"
        />
        <button
          onClick={() =>
            startTransition(() =>
              setItems((prev) => [
                `Item ${prev.length + 1}`,
                ...prev,
              ])
            )
          }
        >
          Add item
        </button>
        {isPending && <span className="muted">Updating...</span>}
      </div>
      <SlowList items={filtered} />
    </div>
  )
}

