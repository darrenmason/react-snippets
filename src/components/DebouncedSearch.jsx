import { useId, useMemo, useState } from 'react'
import useDebouncedValue from '../hooks/useDebouncedValue'

export default function DebouncedSearch() {
  const inputId = useId()
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 300)

  const data = useMemo(
    () => ['Ada Lovelace', 'Grace Hopper', 'Linus Torvalds', 'Alan Turing'],
    []
  )

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return data
    return data.filter((item) => item.toLowerCase().includes(q))
  }, [data, debounced])

  return (
    <div className="stack">
      <label htmlFor={inputId}>Debounced search</label>
      <input
        id={inputId}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a name..."
      />
      <ul className="list">
        {results.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}

