import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useTopics() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getTopics()
      .then(data => setTopics(data.topics))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { topics, loading, error }
}