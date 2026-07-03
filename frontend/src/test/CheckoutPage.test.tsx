import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CheckoutPage from '../pages/CheckoutPage'
import { Providers } from './utils'
import { authenticate, makeCart, makeOrder } from './fixtures'
import { fetchCart } from '../api/cart'
import { createOrder } from '../api/orders'
import type { Cart } from '../types'

vi.mock('../api/cart', () => ({
  fetchCart: vi.fn(),
  ensureCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}))

vi.mock('../api/orders', () => ({
  createOrder: vi.fn(),
  fetchOrders: vi.fn(),
  fetchOrder: vi.fn(),
}))

function renderCheckout() {
  return render(
    <Providers route="/checkout">
      <CheckoutPage />
    </Providers>,
  )
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.mocked(fetchCart).mockReset()
    vi.mocked(createOrder).mockReset()
  })

  it('shows the order summary from the cart', async () => {
    authenticate()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())

    renderCheckout()

    expect(await screen.findByText('Podsumowanie')).toBeInTheDocument()
    expect(
      screen.getByText(/Piłka do piłki nożnej Pro × 2/),
    ).toBeInTheDocument()
  })

  it('creates the order and shows the success screen', async () => {
    authenticate()
    const user = userEvent.setup()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())
    vi.mocked(createOrder).mockResolvedValue(makeOrder({ id: 7 }))

    renderCheckout()
    await screen.findByText('Podsumowanie')

    await user.type(
      screen.getByPlaceholderText(/Ulica, numer/),
      'ul. Sportowa 1, Warszawa',
    )
    await user.click(screen.getByRole('button', { name: 'Złóż zamówienie' }))

    expect(await screen.findByText('Zamówienie złożone!')).toBeInTheDocument()
    expect(createOrder).toHaveBeenCalledWith('ul. Sportowa 1, Warszawa')
    expect(screen.getByText(/#7/)).toBeInTheDocument()
  })

  it('shows the API error when order creation fails', async () => {
    authenticate()
    const user = userEvent.setup()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())
    vi.mocked(createOrder).mockRejectedValue({
      detail: 'Product Piłka stock is not enough',
    })

    renderCheckout()
    await screen.findByText('Podsumowanie')

    await user.type(screen.getByPlaceholderText(/Ulica, numer/), 'Adres 1')
    await user.click(screen.getByRole('button', { name: 'Złóż zamówienie' }))

    expect(
      await screen.findByText('Product Piłka stock is not enough'),
    ).toBeInTheDocument()
  })

  it('waits for the cart to load instead of redirecting away', () => {
    authenticate()
    vi.mocked(fetchCart).mockReturnValue(new Promise<Cart>(() => {}))

    renderCheckout()

    // While loading there is no redirect and no summary yet
    expect(screen.queryByText('Podsumowanie')).not.toBeInTheDocument()
  })
})
