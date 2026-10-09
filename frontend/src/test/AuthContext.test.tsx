import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import { LanguageProvider } from '../context/LanguageContext'
import { ToastProvider } from '../context/ToastContext'
import OrdersPage from '../pages/OrdersPage'
import { authenticate } from './fixtures'

vi.mock('../api/orders', () => ({
  createOrder: vi.fn(),
  fetchOrders: vi.fn().mockResolvedValue([]),
  fetchOrder: vi.fn(),
}))

vi.mock('../api/cart', () => ({
  fetchCart: vi.fn().mockResolvedValue({ id: 1, items: [], total_cart_price: '0' }),
  ensureCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}))

function renderOrdersRoute() {
  return render(
    <MemoryRouter initialEntries={['/zamowienia']}>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Routes>
                <Route path="/logowanie" element={<div>EKRAN LOGOWANIA</div>} />
                <Route path="/zamowienia" element={<OrdersPage />} />
              </Routes>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('AuthProvider session restore', () => {
  it('keeps a guarded route when a stored token already exists', () => {
    authenticate()

    renderOrdersRoute()

    expect(screen.queryByText('EKRAN LOGOWANIA')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Moje zamówienia' })).toBeInTheDocument()
  })

  it('redirects to login when no token is stored', () => {
    renderOrdersRoute()

    expect(screen.getByText('EKRAN LOGOWANIA')).toBeInTheDocument()
  })
})
