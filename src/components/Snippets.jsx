import {
  Suspense,
  lazy,
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
} from 'react'
import ErrorBoundary from './ErrorBoundary'
import useLocalStorage from '../hooks/useLocalStorage'
import useDebouncedValue from '../hooks/useDebouncedValue'
import usePrevious from '../hooks/usePrevious'
import useAbortableFetch from '../hooks/useAbortableFetch'
import useQuery, { invalidateQuery } from '../hooks/useQuery'
import {
  AppStoreProvider,
  useStoreDispatch,
  useStoreSelector,
} from '../state/appStore'
import {
  Link,
  Outlet,
  RouterProvider,
  createMemoryRouter,
  useLoaderData,
} from 'react-router-dom'

const LazyWidget = lazy(() => import('./LazyWidget'))

const catalog = [
  { id: 'coffee', name: 'Coffee', price: 4 },
  { id: 'tea', name: 'Tea', price: 3 },
  { id: 'cookie', name: 'Cookie', price: 2 },
]

const initialCartState = {
  items: [],
  coupon: '',
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((item) => item.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.item.id ? { ...item, qty: item.qty + 1 } : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, qty: 1 }],
      }
    }
    case 'remove':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      }
    case 'setQty':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, qty: Math.max(1, Number(action.qty) || 1) }
            : item
        ),
      }
    case 'clear':
      return initialCartState
    case 'applyCoupon':
      return { ...state, coupon: action.code.trim().toUpperCase() }
    default:
      return state
  }
}

function CartSnippet() {
  const selectId = useId()
  const [selectedId, setSelectedId] = useState(catalog[0].id)
  const selectedItem = useMemo(
    () => catalog.find((item) => item.id === selectedId),
    [selectedId]
  )
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  const pricing = useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    )
    const discountRate = state.coupon === 'SAVE10' ? 0.1 : 0
    const discount = subtotal * discountRate
    return {
      subtotal,
      discount,
      total: subtotal - discount,
    }
  }, [state.items, state.coupon])

  const addItem = useCallback(() => {
    if (selectedItem) {
      dispatch({ type: 'add', item: selectedItem })
    }
  }, [selectedItem])

  const applyCoupon = useCallback(
    (e) => dispatch({ type: 'applyCoupon', code: e.target.value }),
    []
  )

  return (
    <div className="stack">
      <div className="row">
        <label htmlFor={selectId}>Add item</label>
        <select
          id={selectId}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {catalog.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} (${item.price})
            </option>
          ))}
        </select>
        <button onClick={addItem}>Add</button>
        <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      </div>
      <div className="row">
        <label>Coupon</label>
        <input
          placeholder="SAVE10"
          value={state.coupon}
          onChange={applyCoupon}
        />
      </div>
      <ul className="list">
        {state.items.map((item) => (
          <li key={item.id} className="row">
            <span>
              {item.name} (${item.price})
            </span>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) =>
                dispatch({
                  type: 'setQty',
                  id: item.id,
                  qty: e.target.value,
                })
              }
            />
            <button onClick={() => dispatch({ type: 'remove', id: item.id })}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="muted">
        Subtotal: ${pricing.subtotal.toFixed(2)} | Discount: $
        {pricing.discount.toFixed(2)} | Total: ${pricing.total.toFixed(2)}
      </div>
    </div>
  )
}

function LocalStorageSnippet() {
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

function DebouncedSearchSnippet() {
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

function RefSnippet() {
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

function AsyncSnippet() {
  const { data, isLoading, error, reload } = useAbortableFetch(
    'https://jsonplaceholder.typicode.com/users'
  )

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => reload()}>Reload</button>
        {isLoading && <span className="muted">Loading...</span>}
      </div>
      {error && <div className="muted">Error: {error.message}</div>}
      {data && (
        <ul className="list">
          {data.slice(0, 5).map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Exploder({ blowUp }) {
  if (blowUp) {
    throw new Error('Boom')
  }
  return <div className="muted">All good until you click explode.</div>
}

function ErrorBoundarySnippet() {
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

function LazySnippet() {
  return (
    <Suspense fallback={<div className="muted">Loading widget...</div>}>
      <LazyWidget />
    </Suspense>
  )
}

function QuerySnippet() {
  const { data, error, isLoading, isStale, refetch } = useQuery(
    'users',
    async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      )
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return response.json()
    },
    { staleTime: 5000, retry: 1 }
  )

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => refetch()}>Refetch</button>
        <button onClick={() => invalidateQuery('users')}>
          Invalidate cache
        </button>
        <span className="muted">{isStale ? 'stale' : 'fresh'}</span>
        {isLoading && <span className="muted">Loading...</span>}
      </div>
      {error && <div className="muted">Error: {error.message}</div>}
      {data && (
        <ul className="list">
          {data.slice(0, 5).map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function OptimisticTodosSnippet() {
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

function StoreCounters() {
  const count = useStoreSelector((state) => state.count)
  const dispatch = useStoreDispatch()

  return (
    <div className="row">
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>Count: {count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  )
}

function StoreProfile() {
  const user = useStoreSelector((state) => state.user)
  const theme = useStoreSelector((state) => state.theme)
  const dispatch = useStoreDispatch()

  return (
    <div className="stack">
      <div className="row">
        <span>
          {user.name} ({user.role})
        </span>
        <button onClick={() => dispatch({ type: 'toggleTheme' })}>
          Theme: {theme}
        </button>
      </div>
      <button
        onClick={() =>
          dispatch({
            type: 'setUser',
            user: { name: 'Grace', role: 'Staff Engineer' },
          })
        }
      >
        Switch User
      </button>
    </div>
  )
}

function StoreSnippet() {
  return (
    <AppStoreProvider>
      <div className="stack">
        <StoreCounters />
        <StoreProfile />
      </div>
    </AppStoreProvider>
  )
}

function FormValidationSnippet() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    teamSize: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const validate = (nextValues) => {
    const nextErrors = {}
    if (!nextValues.name.trim()) {
      nextErrors.name = 'Name is required'
    }
    if (!nextValues.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!nextValues.email.includes('@')) {
      nextErrors.email = 'Email must be valid'
    }
    if (!nextValues.teamSize) {
      nextErrors.teamSize = 'Select a team size'
    }
    return nextErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate(values)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      setStatus('Fix the highlighted fields')
      return
    }

    setIsSubmitting(true)
    setStatus('')
    await new Promise((resolve) => setTimeout(resolve, 900))
    setIsSubmitting(false)
    setStatus('Submitted successfully')
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="stack">
        <label>
          Name
          <input name="name" value={values.name} onChange={handleChange} />
        </label>
        {errors.name && <div className="muted">{errors.name}</div>}
      </div>
      <div className="stack">
        <label>
          Email
          <input name="email" value={values.email} onChange={handleChange} />
        </label>
        {errors.email && <div className="muted">{errors.email}</div>}
      </div>
      <div className="stack">
        <label>
          Team size
          <select
            name="teamSize"
            value={values.teamSize}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="1-5">1-5</option>
            <option value="6-20">6-20</option>
            <option value="20+">20+</option>
          </select>
        </label>
        {errors.teamSize && <div className="muted">{errors.teamSize}</div>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {status && <div className="muted">{status}</div>}
    </form>
  )
}

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

function PerformanceSnippet() {
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

function AccessibilitySnippet() {
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

function Layout() {
  return (
    <div className="stack">
      <nav className="row">
        <Link to="/">Overview</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  )
}

function OverviewRoute() {
  return <div className="muted">Route with a simple layout.</div>
}

async function profileLoader() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    name: 'Ada Lovelace',
    title: 'Lead Engineer',
  }
}

function ProfileRoute() {
  const data = useLoaderData()
  return (
    <div className="stack">
      <strong>{data.name}</strong>
      <div className="muted">{data.title}</div>
    </div>
  )
}

const router = createMemoryRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <OverviewRoute /> },
      { path: 'profile', element: <ProfileRoute />, loader: profileLoader },
    ],
  },
])

function RoutingSnippet() {
  return <RouterProvider router={router} />
}

export default function Snippets() {
  return (
    <main className="snippets">
      <section className="snippet">
        <h2>useReducer + useMemo + useCallback</h2>
        <CartSnippet />
      </section>
      <section className="snippet">
        <h2>useLocalStorage + usePrevious</h2>
        <LocalStorageSnippet />
      </section>
      <section className="snippet">
        <h2>useDebouncedValue</h2>
        <DebouncedSearchSnippet />
      </section>
      <section className="snippet">
        <h2>useRef + useId</h2>
        <RefSnippet />
      </section>
      <section className="snippet">
        <h2>Abortable fetch</h2>
        <AsyncSnippet />
      </section>
      <section className="snippet">
        <h2>Error boundary</h2>
        <ErrorBoundarySnippet />
      </section>
      <section className="snippet">
        <h2>Suspense + lazy</h2>
        <LazySnippet />
      </section>
      <section className="snippet">
        <h2>Query state (cache + stale + retry)</h2>
        <QuerySnippet />
      </section>
      <section className="snippet">
        <h2>Optimistic updates</h2>
        <OptimisticTodosSnippet />
      </section>
      <section className="snippet">
        <h2>Context + reducer + selector</h2>
        <StoreSnippet />
      </section>
      <section className="snippet">
        <h2>Form validation + async submit</h2>
        <FormValidationSnippet />
      </section>
      <section className="snippet">
        <h2>Performance (memo + transition + deferred)</h2>
        <PerformanceSnippet />
      </section>
      <section className="snippet">
        <h2>Accessibility (focus trap + keyboard nav)</h2>
        <AccessibilitySnippet />
      </section>
      <section className="snippet">
        <h2>Routing + data loader</h2>
        <RoutingSnippet />
      </section>
    </main>
  )
}

