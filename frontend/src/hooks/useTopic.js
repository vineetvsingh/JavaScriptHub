import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useTopic(slug) {
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setTopic(null)
    setError(null)
    api.getTopic(slug)
      .then(data => setTopic(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  return { topic, loading, error }
}