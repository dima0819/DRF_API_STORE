import type { ApiError } from '../types'
import { getLang, translate } from '../i18n/translations'

const TOKEN_KEY = 'motiongear_access'
const REFRESH_KEY = 'motiongear_refresh'

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(TOKEN_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null

  const res = await fetch('/api/v1/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!res.ok) {
    clearTokens()
    return null
  }

  const data = await res.json()
  localStorage.setItem(TOKEN_KEY, data.access)
  return data.access
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (auth) {
    let token = getAccessToken()
    if (token) {
      headers['Authorization'] = `JWT ${token}`
    }
  }

  let res = await fetch(path, { ...options, headers })

  if (res.status === 401 && auth) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null
      })
    }
    const newToken = await refreshPromise
    if (newToken) {
      headers['Authorization'] = `JWT ${newToken}`
      res = await fetch(path, { ...options, headers })
    }
  }

  if (!res.ok) {
    let error: ApiError = { detail: translate('errors.generic') }
    try {
      error = await res.json()
    } catch {
      /* empty */
    }
    throw error
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

function locale(): string {
  return getLang() === 'en' ? 'en-GB' : 'pl-PL'
}

export function formatPrice(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat(locale(), {
    style: 'currency',
    currency: 'PLN',
  }).format(num)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(locale(), {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return translate('errors.unexpected')
  const e = error as ApiError
  if (typeof e.detail === 'string') return e.detail
  if (Array.isArray(e.detail)) return e.detail.join(', ')
  const firstKey = Object.keys(e)[0]
  if (firstKey) {
    const val = e[firstKey]
    if (Array.isArray(val)) return val.join(', ')
    if (typeof val === 'string') return val
  }
  if (typeof e.non_field_errors === 'object' && Array.isArray(e.non_field_errors)) {
    return e.non_field_errors.join(', ')
  }
  return translate('errors.unexpected')
}
