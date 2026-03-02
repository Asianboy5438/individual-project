import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      setLoading(false)
      return
    }

    // AbortController: cancels fetch if component unmounts (best practice from slides)
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const fetchData = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Cleanup: abort on unmount (prevents memory leaks — per slides)
    return () => controller.abort()
  }, [url]) // re-runs only when url changes

  return { data, loading, error }
}
