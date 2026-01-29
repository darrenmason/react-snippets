import { useEffect, useId, useRef, useState } from 'react'

export default function RefDemo() {
  const inputId = useId()
  const inputRef = useRef(null)
  const renderCount = useRef(0)
  const [value, setValue] = useState('')

  useEffect(() => {
    renderCount.current += 1
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="stack">
      <label htmlFor={inputId}>Auto-focus input</label>
      <input
        id={inputId}
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Focus on mount"
      />
      <div className="row">
        <button onClick={() => inputRef.current?.focus()}>Focus</button>
        <span className="muted">Renders: {renderCount.current}</span>
      </div>
    </div>
  )
}

