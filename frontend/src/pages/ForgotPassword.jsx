import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import styles from './Auth.module.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.forgotPassword(email)
      if (data.error) { setError(data.error); return }
      navigate('/reset-password', { state: { email } })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.tag}>// password reset</div>
        <h1 className={styles.title}>Forgot password?</h1>
        <p className={styles.sub}>Enter your account email and we'll send you a 6-digit reset code.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
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
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Sending code...' : 'Send reset code'}
          </button>
        </form>
        <div className={styles.footer}>
          <Link to="/login">← Back to login</Link>
        </div>
      </div>
    </main>
  )
}
