import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, register as apiRegister, setToken, getToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('cv_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    setToken(token)
    if (!token) {
      localStorage.removeItem('cv_user')
    }
  }, [token])

  const auth = useMemo(
    () => ({
      token,
      user,
      isAuthed: Boolean(token),
      async login(payload) {
        const data = await apiLogin(payload)
        setTokenState(data.token)
        setUser(data.user || { email: payload.email })
        localStorage.setItem('cv_user', JSON.stringify(data.user || { email: payload.email }))
        return data
      },
      async register(payload) {
        const data = await apiRegister(payload)
        setTokenState(data.token)
        setUser(data.user || { email: payload.email })
        localStorage.setItem('cv_user', JSON.stringify(data.user || { email: payload.email }))
        return data
      },
      logout() {
        setTokenState(null)
        setUser(null)
        localStorage.removeItem('cv_user')
      },
    }),
    [token, user],
  )

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

