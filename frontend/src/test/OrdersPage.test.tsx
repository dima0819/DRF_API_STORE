import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OrdersPage from '../pages/OrdersPage'
import { Providers } from './utils'
import { authenticate, makeOrder } from './fixtures'
import { fetchOrders } from '../api/orders'
import { setStoredLang } from '../i18n/translations'

vi.mock('../api/orders', () => ({
  createOrder: vi.fn(),
  fetchOrders: vi.fn(),
  fetchOrder: vi.fn(),
}))

vi.mock('../api/cart', () => ({
  fetchCart: vi.fn().mockResolvedValue({ id: 1, items: [], total_cart_price: '0' }),
  ensureCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}))

function renderOrders() {
  return render(
    <Providers route="/zamowienia">
      <OrdersPage />
    </Providers>,
  )
}

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.mocked(fetchOrders).mockReset()
  })

  it('renders the order history with items, total and status', async () => {
    authenticate()
    vi.mocked(fetchOrders).mockResolvedValue([makeOrder({ id: 5 })])

    renderOrders()

    expect(await screen.findByText('Zamówienie #5')).toBeInTheDocument()
    expect(screen.getByText(/Piłka do piłki nożnej Pro × 2/)).toBeInTheDocument()
    expect(screen.getAllByText(/179,98/).length).toBeGreaterThan(0)
    expect(screen.getByText('Oczekuje na płatność')).toBeInTheDocument()
    expect(screen.getByText(/ul\. Sportowa 1/)).toBeInTheDocument()
  })

  it('shows the paid badge for paid orders', async () => {
    authenticate()
    vi.mocked(fetchOrders).mockResolvedValue([makeOrder({ is_paid: true })])

    renderOrders()

    expect(await screen.findByText('Opłacone')).toBeInTheDocument()
  })

  it('shows the empty state when there are no orders', async () => {
    authenticate()
    vi.mocked(fetchOrders).mockResolvedValue([])

    renderOrders()

    expect(await screen.findByText('Brak zamówień')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Rozpocznij zakupy' }),
    ).toBeInTheDocument()
  })

  it('still renders an order whose timestamp is missing', async () => {
    authenticate()
    vi.mocked(fetchOrders).mockResolvedValue([
      makeOrder({ id: 9, created_at: '' as unknown as string }),
    ])

    renderOrders()

    expect(await screen.findByText(/#9/)).toBeInTheDocument()
  })

  it('still renders an order with a malformed timestamp in English', async () => {
    setStoredLang('en')
    authenticate()
    vi.mocked(fetchOrders).mockResolvedValue([
      makeOrder({ id: 11, created_at: 'not-a-date' }),
    ])

    renderOrders()

    expect(await screen.findByText(/#11/)).toBeInTheDocument()
    setStoredLang('pl')
  })
})
