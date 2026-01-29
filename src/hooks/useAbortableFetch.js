import { useCallback, useEffect, useRef, useState } from 'react'

export default function useAbortableFetch(url, options = undefined) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const execute = useCallback(
    async (overrideOptions = undefined) => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
      const controller = new AbortController()
      abortRef.current = controller

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(url, {
          ...(options || {}),
          ...(overrideOptions || {}),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [url, options]
  )

  useEffect(() => {
    execute()
    return () => abortRef.current?.abort()
  }, [execute])

  return { data, isLoading, error, reload: execute }
}

