import { Suspense, lazy } from 'react'

const LazyWidget = lazy(() => import('./LazyWidget'))

export default function Lazy() {
  return (
    <Suspense fallback={<div className="muted">Loading widget...</div>}>
      <LazyWidget />
    </Suspense>
  )
}

