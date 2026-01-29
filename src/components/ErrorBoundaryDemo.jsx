import { useState } from 'react'
import ErrorBoundary from './ErrorBoundary'

function Exploder({ blowUp }) {
  if (blowUp) {
    throw new Error('Boom')
  }
  return <div className="muted">All good until you click explode.</div>
}

export default function ErrorBoundaryDemo() {
  const [blowUp, setBlowUp] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => setBlowUp(true)}>Explode</button>
        <button
          onClick={() => {
            setBlowUp(false)
            setResetKey((k) => k + 1)
          }}
        >
          Reset
        </button>
      </div>
      <ErrorBoundary
        key={resetKey}
        fallback={<div className="muted">Recovered from an error.</div>}
      >
        <Exploder blowUp={blowUp} />
      </ErrorBoundary>
    </div>
  )
}

