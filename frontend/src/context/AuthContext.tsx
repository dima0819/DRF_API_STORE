import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getAccessToken, getErrorMessage } from '../api/client'
import { login as apiLogin, logout as apiLogout, loginAfterRegister } from '../api/auth'
import type { LoginCredentials, RegisterData } from '../types'

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read the stored token during the first render: a guarded route renders
  // before any effect runs, so deferring this would bounce a logged-in user
  // to the login screen on a full page load.
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken())
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null)
    try {
      await apiLogin(credentials)
      setIsAuthenticated(true)
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setError(null)
    try {
      await loginAfterRegister(data)
      setIsAuthenticated(true)
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading: false,
      login,
      register,
      logout,
      error,
      clearError: () => setError(null),
    }),
    [isAuthenticated, login, register, logout, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
