import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { LanguageProvider } from '../context/LanguageContext'
import { CartProvider } from '../context/CartContext'
import { ToastProvider } from '../context/ToastContext'
import LoginPage from '../pages/LoginPage'
import { login as apiLogin } from '../api/auth'

vi.mock('../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  loginAfterRegister: vi.fn(),
}))

vi.mock('../api/cart', () => ({
  fetchCart: vi.fn().mockResolvedValue({ id: 1, items: [], total_cart_price: '0' }),
  ensureCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}))

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/logowanie']}>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<div>STRONA GŁÓWNA</div>} />
                <Route path="/logowanie" element={<LoginPage />} />
              </Routes>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(apiLogin).mockReset()
  })

  it('logs in and redirects to the home page', async () => {
    const user = userEvent.setup()
    vi.mocked(apiLogin).mockResolvedValue({ access: 'a', refresh: 'r' })

    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'jan@example.com')
    await user.type(screen.getByLabelText('Hasło'), 'SuperTajne123!')
    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(await screen.findByText('STRONA GŁÓWNA')).toBeInTheDocument()
    expect(apiLogin).toHaveBeenCalledWith({
      email: 'jan@example.com',
      password: 'SuperTajne123!',
    })
  })

  it('shows the backend error message on failed login', async () => {
    const user = userEvent.setup()
    vi.mocked(apiLogin).mockRejectedValue({
      detail: 'Nie znaleziono aktywnego konta',
    })

    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'jan@example.com')
    await user.type(screen.getByLabelText('Hasło'), 'zle-haslo')
    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(
      await screen.findByText('Nie znaleziono aktywnego konta'),
    ).toBeInTheDocument()
    expect(screen.queryByText('STRONA GŁÓWNA')).not.toBeInTheDocument()
  })
})
