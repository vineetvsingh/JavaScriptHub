import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import styles from './Auth.module.css'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { saveAuth } = useAuth()
  const email = location.state?.email

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  if (!email) return <Navigate to="/register" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.verifyEmail(email, otp)
      if (data.error) { setError(data.error); return }
      saveAuth(data.token, data.email, data.username)
      navigate('/', { replace: true })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResent(false)
    setError('')
    try {
      const data = await api.resendVerification(email)
      if (data.error) { setError(data.error); return }
      setResent(true)
    } catch {
      setError('Could not resend. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.tag}>// verify email</div>
        <h1 className={styles.title}>Check your inbox</h1>
        <p className={styles.sub}>
          We sent a 6-digit code to <strong style={{ color: 'var(--text)' }}>{email}</strong>. Enter it below to activate your account.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="otp">Verification code</label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className={`${styles.input} ${styles.otpInput}`}
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
            />
          </div>
          {resent && <div className={styles.success}>Code resent — check your inbox.</div>}
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submit} disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying...' : 'Verify account'}
          </button>
        </form>
        <div className={styles.footer}>
          Didn't get it?{' '}
          <button
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </div>
      </div>
    </main>
  )
}
