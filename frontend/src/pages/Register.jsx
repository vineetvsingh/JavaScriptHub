import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import styles from './Auth.module.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { saveAuth } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.register(email, password, username)
      if (data.token) {
        saveAuth(data.token, data.email, data.username)
        navigate('/', { replace: true })
      } else {
        navigate('/verify-email', { state: { email: data.email }, replace: true })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.tag}>// get started</div>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Save your progress across topics and challenges.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className={styles.input}
              placeholder="3–20 chars, letters/numbers/_ -"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.passwordWrap}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`${styles.input} ${styles.passwordInput}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button type="button" className={styles.showBtn} onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className={styles.footer}>
          Already have an account? <Link to="/login">Log in →</Link>
        </div>
      </div>
    </main>
  )
}
