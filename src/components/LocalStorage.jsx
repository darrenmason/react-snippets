import { useId } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import usePrevious from '../hooks/usePrevious'

export default function LocalStorage() {
  const inputId = useId()
  const [note, setNote] = useLocalStorage('snippet.note', '')
  const previous = usePrevious(note)

  return (
    <div className="stack">
      <label htmlFor={inputId}>Persistent note</label>
      <textarea
        id={inputId}
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="muted">Previous value: {String(previous || '')}</div>
    </div>
  )
}

