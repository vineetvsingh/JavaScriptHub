import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { api } from '../lib/api'
import styles from './Auth.module.css'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email

  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!email) return <Navigate to="/forgot-password" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.resetPassword(email, otp, password)
      navigate('/login', { state: { message: 'Password reset successfully. Please log in.' } })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.tag}>// enter code</div>
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.sub}>
          We sent a 6-digit code to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="otp">Reset code</label>
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
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">New password</label>
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
          <button type="submit" className={styles.submit} disabled={loading || otp.length !== 6}>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
        <div className={styles.footer}>
          Didn't get it? <Link to="/forgot-password">Resend code →</Link>
        </div>
      </div>
    </main>
  )
}
