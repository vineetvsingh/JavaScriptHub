const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const getToken = () => localStorage.getItem('jshub_token')

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    if (body && typeof body === 'object') {
      for (const [k, v] of Object.entries(body)) {
        if (k !== 'message' && k !== 'status') this[k] = v
      }
    }
  }
}

async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data)
  }
  return data
}

export const api = {
  register:           (email, password, username) => apiFetch('/api/auth/register',           { method: 'POST', body: { email, password, username } }),
  verifyEmail:        (email, otp)                => apiFetch('/api/auth/verify-email',        { method: 'POST', body: { email, otp } }),
  resendVerification: (email)                     => apiFetch('/api/auth/resend-verification', { method: 'POST', body: { email } }),
  login:              (email, password)           => apiFetch('/api/auth/login',               { method: 'POST', body: { email, password } }),
  forgotPassword:     (email)                     => apiFetch('/api/auth/forgot-password',     { method: 'POST', body: { email } }),
  resetPassword:      (email, otp, password)      => apiFetch('/api/auth/reset-password',      { method: 'POST', body: { email, otp, password } }),

  getTopics:     ()     => apiFetch('/api/topics'),
  getTopic:      (slug) => apiFetch(`/api/topics/${slug}`),
  getChallenges: ()     => apiFetch('/api/challenges'),
  getChallenge:  (id)   => apiFetch(`/api/challenges/${id}`),

  getProgress:           ()     => apiFetch('/api/progress'),
  markTopicComplete:     (slug) => apiFetch(`/api/progress/topic/${slug}`,   { method: 'POST' }),
  unmarkTopic:           (slug) => apiFetch(`/api/progress/topic/${slug}`,   { method: 'DELETE' }),
  markChallengeComplete: (id)   => apiFetch(`/api/progress/challenge/${id}`, { method: 'POST' }),
  unmarkChallenge:       (id)   => apiFetch(`/api/progress/challenge/${id}`, { method: 'DELETE' }),
}
