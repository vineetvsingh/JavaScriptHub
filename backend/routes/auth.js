import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { sendVerificationEmail, sendOtpEmail } from '../lib/mailer.js'

const router = Router()

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,20}$/

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' })

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// Separate stores for verification and password-reset OTPs
const verifyStore = new Map() // email → { otp, expiresAt }
const resetStore  = new Map() // email → { otp, expiresAt }

// ── Register ────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, username } = req.body
    if (!email || !password || !username) return res.status(400).json({ error: 'Email, username and password required' })
    if (!USERNAME_RE.test(username)) return res.status(400).json({ error: 'Username must be 3–20 characters (letters, numbers, _ -)' })
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const key = email.toLowerCase().trim()

    // If email exists but is unverified, resend OTP instead of blocking
    const existing = await User.findOne({ email: key })
    if (existing) {
      if (existing.isVerified) return res.status(409).json({ error: 'Email already registered' })
      const otp = generateOtp()
      verifyStore.set(key, { otp, expiresAt: Date.now() + 10 * 60 * 1000 })
      await sendVerificationEmail(existing.email, otp)
      return res.json({ pendingVerification: true, email: existing.email })
    }

    const usernameTaken = await User.exists({ username: username.toLowerCase().trim() })
    if (usernameTaken) return res.status(409).json({ error: 'Username already taken' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, username, passwordHash, isVerified: false })

    const otp = generateOtp()
    verifyStore.set(key, { otp, expiresAt: Date.now() + 10 * 60 * 1000 })
    await sendVerificationEmail(user.email, otp)

    res.status(201).json({ pendingVerification: true, email: user.email })
  } catch (err) {
    if (err.message === 'SMTP not configured') {
      return res.status(503).json({ error: 'Email service not configured. Add SMTP credentials to .env' })
    }
    next(err)
  }
})

// ── Verify email ─────────────────────────────────────────────
router.post('/verify-email', async (req, res, next) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ error: 'Email and code required' })

    const key = email.toLowerCase().trim()
    const stored = verifyStore.get(key)
    if (!stored) return res.status(400).json({ error: 'No verification code found — request a new one' })
    if (Date.now() > stored.expiresAt) {
      verifyStore.delete(key)
      return res.status(400).json({ error: 'Verification code expired — request a new one' })
    }
    if (stored.otp !== otp) return res.status(400).json({ error: 'Invalid verification code' })

    const user = await User.findOneAndUpdate({ email: key }, { isVerified: true }, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })

    verifyStore.delete(key)
    res.json({ token: signToken(user), email: user.email, username: user.username })
  } catch (err) {
    next(err)
  }
})

// ── Resend verification ───────────────────────────────────────
router.post('/resend-verification', async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    const key = email.toLowerCase().trim()
    const user = await User.findOne({ email: key })
    if (!user) return res.json({ ok: true }) // don't reveal
    if (user.isVerified) return res.status(400).json({ error: 'Account already verified' })

    const otp = generateOtp()
    verifyStore.set(key, { otp, expiresAt: Date.now() + 10 * 60 * 1000 })
    await sendVerificationEmail(user.email, otp)
    res.json({ ok: true })
  } catch (err) {
    if (err.message === 'SMTP not configured') {
      return res.status(503).json({ error: 'Email service not configured' })
    }
    next(err)
  }
})

// ── Login ─────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.', pendingVerification: true, email: user.email })
    }

    res.json({ token: signToken(user), email: user.email, username: user.username })
  } catch (err) {
    next(err)
  }
})

// ── Forgot password ───────────────────────────────────────────
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.json({ ok: true })

    const otp = generateOtp()
    resetStore.set(email.toLowerCase().trim(), { otp, expiresAt: Date.now() + 10 * 60 * 1000 })
    await sendOtpEmail(user.email, otp)
    res.json({ ok: true })
  } catch (err) {
    if (err.message === 'SMTP not configured') {
      return res.status(503).json({ error: 'Email service not configured. Add SMTP credentials to .env' })
    }
    next(err)
  }
})

// ── Reset password ────────────────────────────────────────────
router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, otp, password } = req.body
    if (!email || !otp || !password) return res.status(400).json({ error: 'Email, code and new password required' })
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const key = email.toLowerCase().trim()
    const stored = resetStore.get(key)
    if (!stored) return res.status(400).json({ error: 'No reset code found — request a new one' })
    if (Date.now() > stored.expiresAt) {
      resetStore.delete(key)
      return res.status(400).json({ error: 'Reset code expired — request a new one' })
    }
    if (stored.otp !== otp) return res.status(400).json({ error: 'Invalid reset code' })

    const user = await User.findOne({ email: key })
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.passwordHash = await bcrypt.hash(password, 12)
    await user.save()
    resetStore.delete(key)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
