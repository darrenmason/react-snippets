import useAbortableFetch from '../hooks/useAbortableFetch'

export default function AsyncFetch() {
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

