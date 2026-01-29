import { useEffect, useRef, useState } from 'react'

function AccessibleList({ items, label }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % items.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
    }
  }

  return (
    <div role="listbox" aria-label={label} onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <button
          key={item}
          role="option"
          aria-selected={index === activeIndex}
          tabIndex={index === activeIndex ? 0 : -1}
          onFocus={() => setActiveIndex(index)}
          className="chip"
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function FocusTrapModal({ isOpen, onClose }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const root = modalRef.current
    const focusable = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
      if (event.key !== 'Tab') return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="overlay" role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
      >
        <h3 id="modal-title">Accessible modal</h3>
        <p className="muted">Tab stays inside, Esc closes.</p>
        <div className="row">
          <button onClick={onClose}>Close</button>
          <button>Secondary</button>
        </div>
      </div>
    </div>
  )
}

export default function Accessibility() {
  const [isOpen, setIsOpen] = useState(false)
  const priorities = ['P0', 'P1', 'P2', 'P3']

  return (
    <div className="stack">
      <button onClick={() => setIsOpen(true)}>Open modal</button>
      <div className="muted">Keyboard list</div>
      <AccessibleList items={priorities} label="Priority levels" />
      <FocusTrapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

