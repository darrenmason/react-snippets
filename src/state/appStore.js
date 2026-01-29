import { createContext, useContext, useRef, useSyncExternalStore } from 'react'

function createStore(reducer, initialState) {
  let state = initialState
  const listeners = new Set()

  return {
    getState: () => state,
    dispatch: (action) => {
      const nextState = reducer(state, action)
      if (nextState !== state) {
        state = nextState
        listeners.forEach((listener) => listener())
      }
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const StoreContext = createContext(null)

const initialState = {
  user: { name: 'Ada', role: 'Engineer' },
  count: 0,
  theme: 'dark',
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'toggleTheme':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'setUser':
      return { ...state, user: action.user }
    default:
      return state
  }
}

export function AppStoreProvider({ children }) {
  const storeRef = useRef(null)
  if (!storeRef.current) {
    storeRef.current = createStore(reducer, initialState)
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStoreSelector(selector) {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStoreSelector must be used within AppStoreProvider')
  }
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()))
}

export function useStoreDispatch() {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStoreDispatch must be used within AppStoreProvider')
  }
  return store.dispatch
}

