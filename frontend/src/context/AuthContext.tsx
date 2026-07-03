import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsAuthenticated(!!getAccessToken())
    setIsLoading(false)
  }, [])

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
      isLoading,
      login,
      register,
      logout,
      error,
      clearError: () => setError(null),
    }),
    [isAuthenticated, isLoading, login, register, logout, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
