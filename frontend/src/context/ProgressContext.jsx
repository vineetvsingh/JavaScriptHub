import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { useAuth } from './AuthContext'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [completedTopics, setCompletedTopics] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setCompletedTopics([])
      setCompletedChallenges([])
      return
    }
    setLoading(true)
    api.getProgress()
      .then(data => {
        setCompletedTopics(data.completedTopics || [])
        setCompletedChallenges(data.completedChallenges || [])
      })
      .catch(err => console.error('Failed to load progress:', err))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const markTopicComplete = useCallback(async (slug) => {
    if (!isAuthenticated) return
    setCompletedTopics(prev => prev.includes(slug) ? prev : [...prev, slug])
    try {
      await api.markTopicComplete(slug)
    } catch (err) {
      console.error('Failed to mark topic:', err)
      setCompletedTopics(prev => prev.filter(s => s !== slug))
    }
  }, [isAuthenticated])

  const unmarkTopic = useCallback(async (slug) => {
    if (!isAuthenticated) return
    setCompletedTopics(prev => prev.filter(s => s !== slug))
    try {
      await api.unmarkTopic(slug)
    } catch (err) {
      console.error('Failed to unmark topic:', err)
      setCompletedTopics(prev => prev.includes(slug) ? prev : [...prev, slug])
    }
  }, [isAuthenticated])

  const markChallengeComplete = useCallback(async (id) => {
    if (!isAuthenticated) return
    setCompletedChallenges(prev => prev.includes(id) ? prev : [...prev, id])
    try {
      await api.markChallengeComplete(id)
    } catch (err) {
      console.error('Failed to mark challenge:', err)
      setCompletedChallenges(prev => prev.filter(n => n !== id))
    }
  }, [isAuthenticated])

  const unmarkChallenge = useCallback(async (id) => {
    if (!isAuthenticated) return
    setCompletedChallenges(prev => prev.filter(n => n !== id))
    try {
      await api.unmarkChallenge(id)
    } catch (err) {
      console.error('Failed to unmark challenge:', err)
      setCompletedChallenges(prev => prev.includes(id) ? prev : [...prev, id])
    }
  }, [isAuthenticated])

  return (
    <ProgressContext.Provider value={{
      completedTopics,
      completedChallenges,
      markTopicComplete,
      unmarkTopic,
      markChallengeComplete,
      unmarkChallenge,
      loading,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  return useContext(ProgressContext)
}
