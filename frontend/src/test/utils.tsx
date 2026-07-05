import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import { LanguageProvider } from '../context/LanguageContext'
import { ToastProvider } from '../context/ToastContext'

interface ProvidersProps {
  children: ReactNode
  route?: string
}

/** App-level providers plus a MemoryRouter, mirroring App.tsx. */
export function Providers({ children, route = '/' }: ProvidersProps) {
  return (
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </MemoryRouter>
  )
}
