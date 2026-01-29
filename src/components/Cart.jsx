import { useCallback, useId, useMemo, useReducer, useState } from 'react'

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

export default function Cart() {
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

