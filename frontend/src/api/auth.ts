import { apiFetch, setTokens, clearTokens } from './client'
import type { AuthTokens, LoginCredentials, RegisterData, User } from '../types'

export async function login(credentials: LoginCredentials): Promise<AuthTokens> {
  const tokens = await apiFetch<AuthTokens>('/api/v1/token/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  setTokens(tokens.access, tokens.refresh)
  return tokens
}

export async function register(data: RegisterData): Promise<User> {
  return apiFetch<User>('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function logout(): void {
  clearTokens()
}

export async function loginAfterRegister(
  data: RegisterData,
): Promise<{ user: User; tokens: AuthTokens }> {
  const user = await register(data)
  const tokens = await login({ email: data.email, password: data.password })
  return { user, tokens }
}
