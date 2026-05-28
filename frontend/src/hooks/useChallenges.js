import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useChallenges() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getChallenges()
      .then(data => setChallenges(data.challenges))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { challenges, loading, error }
}