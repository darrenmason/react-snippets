import { useState } from 'react'

export default function OptimisticTodos() {
  const [items, setItems] = useState([
    { id: 1, title: 'Draft proposal' },
    { id: 2, title: 'Review PR' },
  ])
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fakeApi = (payload) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.25) {
          reject(new Error('Server rejected update'))
        } else {
          resolve({ id: Date.now(), title: payload.title })
        }
      }, 700)
    })

  const handleAdd = async () => {
    if (!title.trim()) return
    const optimistic = { id: `temp-${Date.now()}`, title }
    setItems((prev) => [optimistic, ...prev])
    setTitle('')
    setStatus('')
    setIsSaving(true)

    try {
      const saved = await fakeApi(optimistic)
      setItems((prev) =>
        prev.map((item) => (item.id === optimistic.id ? saved : item))
      )
      setStatus('Saved successfully')
    } catch (err) {
      setItems((prev) => prev.filter((item) => item.id !== optimistic.id))
      setStatus(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="stack">
      <div className="row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button onClick={handleAdd} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Add'}
        </button>
      </div>
      {status && <div className="muted">{status}</div>}
      <ul className="list">
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}

