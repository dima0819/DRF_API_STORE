import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import { LanguageProvider } from '../context/LanguageContext'
import { CartProvider } from '../context/CartContext'
import { ToastProvider } from '../context/ToastContext'
import RegisterPage from '../pages/RegisterPage'
import { loginAfterRegister } from '../api/auth'

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

function renderRegister() {
  return render(
    <MemoryRouter initialEntries={['/rejestracja']}>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<div>STRONA GŁÓWNA</div>} />
                <Route path="/rejestracja" element={<RegisterPage />} />
              </Routes>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.mocked(loginAfterRegister).mockReset()
  })

  it('registers, logs in and redirects home', async () => {
    const user = userEvent.setup()
    vi.mocked(loginAfterRegister).mockResolvedValue({
      user: {
        id: 1,
        username: 'jan@example.com',
        first_name: 'Jan',
        last_name: 'Kowalski',
        email: 'jan@example.com',
        phone_number: '+48123456789',
      },
      tokens: { access: 'a', refresh: 'r' },
    })

    renderRegister()

    await user.type(screen.getByLabelText('Imię'), 'Jan')
    await user.type(screen.getByLabelText('Nazwisko'), 'Kowalski')
    await user.type(screen.getByLabelText('Email'), 'jan@example.com')
    await user.type(screen.getByLabelText('Telefon'), '+48123456789')
    await user.type(screen.getByLabelText('Hasło'), 'SuperTajne123!')
    await user.click(screen.getByRole('button', { name: 'Zarejestruj się' }))

    expect(await screen.findByText('STRONA GŁÓWNA')).toBeInTheDocument()
    expect(loginAfterRegister).toHaveBeenCalledWith({
      first_name: 'Jan',
      last_name: 'Kowalski',
      email: 'jan@example.com',
      phone_number: '+48123456789',
      password: 'SuperTajne123!',
    })
  })

  it('shows the backend validation error', async () => {
    const user = userEvent.setup()
    vi.mocked(loginAfterRegister).mockRejectedValue({
      email: ['Użytkownik z tym adresem email już istnieje.'],
    })

    renderRegister()

    await user.type(screen.getByLabelText('Imię'), 'Jan')
    await user.type(screen.getByLabelText('Nazwisko'), 'Kowalski')
    await user.type(screen.getByLabelText('Email'), 'zajety@example.com')
    await user.type(screen.getByLabelText('Telefon'), '+48123456789')
    await user.type(screen.getByLabelText('Hasło'), 'SuperTajne123!')
    await user.click(screen.getByRole('button', { name: 'Zarejestruj się' }))

    expect(
      await screen.findByText('Użytkownik z tym adresem email już istnieje.'),
    ).toBeInTheDocument()
  })
})
