import { useCallback, useEffect, useRef, useState } from 'react'

const cache = new Map()

export function invalidateQuery(key) {
  if (cache.has(key)) {
    cache.delete(key)
  }
}

function getEntry(key) {
  if (!cache.has(key)) {
    cache.set(key, { data: null, error: null, updatedAt: 0, promise: null })
  }
  return cache.get(key)
}

export default function useQuery(key, fetcher, options = {}) {
  const { staleTime = 0, retry = 0 } = options
  const [data, setData] = useState(() => getEntry(key).data)
  const [error, setError] = useState(() => getEntry(key).error)
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef(null)

  const isStale = Date.now() - getEntry(key).updatedAt > staleTime

  const execute = useCallback(async () => {
    const entry = getEntry(key)
    if (!isStale && entry.data) {
      setData(entry.data)
      setError(entry.error)
      return entry.data
    }

    if (entry.promise) {
      setIsLoading(true)
      const result = await entry.promise
      setIsLoading(false)
      setData(getEntry(key).data)
      setError(getEntry(key).error)
      return result
    }

    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    const run = async () => {
      let attempt = 0
      while (true) {
        try {
          const result = await fetcher({ signal: controller.signal })
          entry.data = result
          entry.error = null
          entry.updatedAt = Date.now()
          return result
        } catch (err) {
          if (err.name === 'AbortError') {
            throw err
          }
          attempt += 1
          if (attempt > retry) {
            entry.error = err
            throw err
          }
        }
      }
    }

    entry.promise = run()
      .then((result) => {
        entry.promise = null
        return result
      })
      .catch((err) => {
        entry.promise = null
        throw err
      })

    setIsLoading(true)
    try {
      const result = await entry.promise
      setData(result)
      setError(null)
      return result
    } catch (err) {
      setError(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [fetcher, isStale, key, retry])

  useEffect(() => {
    execute()
    return () => abortRef.current?.abort()
  }, [execute])

  return {
    data,
    error,
    isLoading,
    isStale,
    refetch: execute,
  }
}

