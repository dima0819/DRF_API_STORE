import { Component, type ErrorInfo, type ReactNode } from 'react'
import { getLang, translate } from '../i18n/translations'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

const INITIAL_STATE: ErrorBoundaryState = { error: null }

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = INITIAL_STATE

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const lang = getLang()
    console.error('[ErrorBoundary]', {
      message: error.message,
      lang,
      path: window.location.pathname,
      componentStack: info.componentStack,
    })
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  private handleHome = (): void => {
    window.location.assign('/')
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children

    const lang = getLang()
    const t = (key: Parameters<typeof translate>[0]) =>
      translate(key, undefined, lang)

    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-danger/25 bg-surface p-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/12">
            <svg
              className="h-7 w-7 text-danger"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-content">{t('errors.boundaryTitle')}</h1>
          <p className="mt-3 text-sm text-content-muted">{t('errors.boundaryText')}</p>

          {import.meta.env.DEV && (
            <pre className="mt-6 max-h-48 overflow-auto rounded-xl bg-raised p-4 text-left text-xs text-danger">
              {error.message}
            </pre>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-xl bg-accent-400 px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:bg-accent-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            >
              {t('errors.boundaryRetry')}
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-content-muted transition hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            >
              {t('errors.boundaryHome')}
            </button>
          </div>
        </div>
      </div>
    )
  }
}
