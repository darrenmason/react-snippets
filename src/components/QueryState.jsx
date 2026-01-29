import useQuery, { invalidateQuery } from '../hooks/useQuery'

export default function QueryState() {
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

