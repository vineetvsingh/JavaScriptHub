const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const getToken = () => localStorage.getItem('jshub_token')

const authHeaders = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

async function mutate(path, method) {
  const res = await fetch(`${BASE}${path}`, { method, headers: authHeaders() })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  register: (email, password, username) =>
    fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    }).then(r => r.json()),

  login: (email, password) =>
    fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()),

  verifyEmail: (email, otp) =>
    fetch(`${BASE}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    }).then(r => r.json()),

  resendVerification: (email) =>
    fetch(`${BASE}/api/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(r => r.json()),

  forgotPassword: (email) =>
    fetch(`${BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(r => r.json()),

  resetPassword: (email, otp, password) =>
    fetch(`${BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password }),
    }).then(r => r.json()),

  getTopics:     ()     => request('/api/topics'),
  getTopic:      (slug) => request(`/api/topics/${slug}`),
  getChallenges: ()     => request('/api/challenges'),
  getChallenge:  (id)   => request(`/api/challenges/${id}`),

  getProgress:           ()     => request('/api/progress'),
  markTopicComplete:     (slug) => mutate(`/api/progress/topic/${slug}`, 'POST'),
  unmarkTopic:           (slug) => mutate(`/api/progress/topic/${slug}`, 'DELETE'),
  markChallengeComplete: (id)   => mutate(`/api/progress/challenge/${id}`, 'POST'),
  unmarkChallenge:       (id)   => mutate(`/api/progress/challenge/${id}`, 'DELETE'),
}
