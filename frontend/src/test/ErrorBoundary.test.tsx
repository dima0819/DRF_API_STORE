import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ErrorBoundary from '../components/ErrorBoundary'
import { setStoredLang } from '../i18n/translations'

function Exploding(): never {
  throw new Error('boom from child')
}

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>safe content</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })

  it('shows a Polish fallback instead of an empty screen when a child throws', () => {
    setStoredLang('pl')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Coś poszło nie tak')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Odśwież stronę' })).toBeInTheDocument()
  })

  it('shows an English fallback when the English locale is active', () => {
    setStoredLang('en')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument()
    setStoredLang('pl')
  })

  it('logs diagnostics so the underlying crash is traceable', () => {
    setStoredLang('pl')
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )
    const logged = spy.mock.calls.find((call) => call[0] === '[ErrorBoundary]')
    expect(logged).toBeDefined()
    expect(logged?.[1]).toMatchObject({ message: 'boom from child' })
  })
})
