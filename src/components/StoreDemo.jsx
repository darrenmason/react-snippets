import {
  AppStoreProvider,
  useStoreDispatch,
  useStoreSelector,
} from '../state/appStore'

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

export default function StoreDemo() {
  return (
    <AppStoreProvider>
      <div className="stack">
        <StoreCounters />
        <StoreProfile />
      </div>
    </AppStoreProvider>
  )
}

