import { createContext, useContext, useState, useCallback } from 'react'

const TOKEN_KEY    = 'jshub_token'
const EMAIL_KEY    = 'jshub_email'
const USERNAME_KEY = 'jshub_username'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token,    setToken]    = useState(() => localStorage.getItem(TOKEN_KEY))
  const [email,    setEmail]    = useState(() => localStorage.getItem(EMAIL_KEY))
  const [username, setUsername] = useState(() => localStorage.getItem(USERNAME_KEY))

  const saveAuth = useCallback((newToken, newEmail, newUsername) => {
    localStorage.setItem(TOKEN_KEY,    newToken)
    localStorage.setItem(EMAIL_KEY,    newEmail)
    localStorage.setItem(USERNAME_KEY, newUsername)
    setToken(newToken)
    setEmail(newEmail)
    setUsername(newUsername)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
    localStorage.removeItem(USERNAME_KEY)
    setToken(null)
    setEmail(null)
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, email, username, isAuthenticated: !!token, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
