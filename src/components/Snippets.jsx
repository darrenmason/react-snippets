import Cart from './Cart'
import LocalStorage from './LocalStorage'
import DebouncedSearch from './DebouncedSearch'
import RefDemo from './RefDemo'
import AsyncFetch from './AsyncFetch'
import ErrorBoundaryDemo from './ErrorBoundaryDemo'
import Lazy from './Lazy'
import QueryState from './QueryState'
import OptimisticTodos from './OptimisticTodos'
import StoreDemo from './StoreDemo'
import FormValidation from './FormValidation'
import Performance from './Performance'
import Accessibility from './Accessibility'
import Routing from './Routing'

export default function Snippets() {
  return (
    <main className="snippets">
      <section className="snippet">
        <h2>useReducer + useMemo + useCallback</h2>
        <Cart />
      </section>
      <section className="snippet">
        <h2>useLocalStorage + usePrevious</h2>
        <LocalStorage />
      </section>
      <section className="snippet">
        <h2>useDebouncedValue</h2>
        <DebouncedSearch />
      </section>
      <section className="snippet">
        <h2>useRef + useId</h2>
        <RefDemo />
      </section>
      <section className="snippet">
        <h2>Abortable fetch</h2>
        <AsyncFetch />
      </section>
      <section className="snippet">
        <h2>Error boundary</h2>
        <ErrorBoundaryDemo />
      </section>
      <section className="snippet">
        <h2>Suspense + lazy</h2>
        <Lazy />
      </section>
      <section className="snippet">
        <h2>Query state (cache + stale + retry)</h2>
        <QueryState />
      </section>
      <section className="snippet">
        <h2>Optimistic updates</h2>
        <OptimisticTodos />
      </section>
      <section className="snippet">
        <h2>Context + reducer + selector</h2>
        <StoreDemo />
      </section>
      <section className="snippet">
        <h2>Form validation + async submit</h2>
        <FormValidation />
      </section>
      <section className="snippet">
        <h2>Performance (memo + transition + deferred)</h2>
        <Performance />
      </section>
      <section className="snippet">
        <h2>Accessibility (focus trap + keyboard nav)</h2>
        <Accessibility />
      </section>
      <section className="snippet">
        <h2>Routing + data loader</h2>
        <Routing />
      </section>
    </main>
  )
}

