import { describe, expect, it, vi } from 'vitest'
import {
  apiFetch,
  formatPrice,
  getAccessToken,
  getErrorMessage,
  setTokens,
} from '../api/client'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('formatPrice', () => {
  it('formats string prices as PLN', () => {
    const formatted = formatPrice('89.99')
    expect(formatted).toContain('89,99')
    expect(formatted).toContain('zł')
  })

  it('formats numeric prices', () => {
    expect(formatPrice(20)).toContain('20,00')
  })
})

describe('getErrorMessage', () => {
  it('returns detail string', () => {
    expect(getErrorMessage({ detail: 'Nie znaleziono' })).toBe('Nie znaleziono')
  })

  it('returns first field error from DRF validation response', () => {
    expect(getErrorMessage({ email: ['Ten email jest zajęty'] })).toBe(
      'Ten email jest zajęty',
    )
  })

  it('falls back to generic message', () => {
    expect(getErrorMessage(null)).toBe('Wystąpił nieoczekiwany błąd')
    expect(getErrorMessage('boom')).toBe('Wystąpił nieoczekiwany błąd')
  })
})

describe('apiFetch', () => {
  it('sends JWT Authorization header for authenticated requests', async () => {
    setTokens('access-abc', 'refresh-xyz')
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    await apiFetch('/api/v1/carts/', {}, true)

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'JWT access-abc',
    )
  })

  it('does not send Authorization header for public requests', async () => {
    setTokens('access-abc', 'refresh-xyz')
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    await apiFetch('/api/v1/store/')

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined()
  })

  it('refreshes the token on 401 and retries the request', async () => {
    setTokens('stale-access', 'valid-refresh')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ detail: 'expired' }, 401))
      .mockResolvedValueOnce(jsonResponse({ access: 'fresh-access' }))
      .mockResolvedValueOnce(jsonResponse({ hello: 'world' }))
    vi.stubGlobal('fetch', fetchMock)

    const data = await apiFetch<{ hello: string }>('/api/v1/carts/', {}, true)

    expect(data.hello).toBe('world')
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(getAccessToken()).toBe('fresh-access')
    const [, retryInit] = fetchMock.mock.calls[2] as [string, RequestInit]
    expect((retryInit.headers as Record<string, string>).Authorization).toBe(
      'JWT fresh-access',
    )
  })

  it('clears tokens and throws when the refresh fails', async () => {
    setTokens('stale-access', 'bad-refresh')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ detail: 'expired' }, 401))
      .mockResolvedValueOnce(jsonResponse({ detail: 'invalid refresh' }, 401))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiFetch('/api/v1/carts/', {}, true)).rejects.toMatchObject({
      detail: 'expired',
    })
    expect(getAccessToken()).toBeNull()
  })

  it('throws the parsed error body for non-2xx responses', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ detail: 'Cart is empty' }, 400))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiFetch('/api/v1/orders/order_create/')).rejects.toMatchObject({
      detail: 'Cart is empty',
    })
  })
})
