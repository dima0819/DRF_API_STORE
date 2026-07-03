import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CartPage from '../pages/CartPage'
import { Providers } from './utils'
import { authenticate, emptyCart, makeCart, makeCartItem, makeProduct } from './fixtures'
import { fetchCart, removeCartItem, updateCartItem } from '../api/cart'

vi.mock('../api/cart', () => ({
  fetchCart: vi.fn(),
  ensureCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}))

function renderCartPage() {
  return render(
    <Providers route="/koszyk">
      <CartPage />
    </Providers>,
  )
}

describe('CartPage', () => {
  beforeEach(() => {
    vi.mocked(fetchCart).mockReset()
    vi.mocked(updateCartItem).mockReset()
    vi.mocked(removeCartItem).mockReset()
  })

  it('asks anonymous users to log in', () => {
    renderCartPage()
    expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zaloguj się' })).toBeInTheDocument()
  })

  it('shows the empty state when the cart has no items', async () => {
    authenticate()
    vi.mocked(fetchCart).mockResolvedValue(emptyCart)

    renderCartPage()

    expect(await screen.findByText('Koszyk jest pusty')).toBeInTheDocument()
  })

  it('renders cart items with quantities and the total', async () => {
    authenticate()
    vi.mocked(fetchCart).mockResolvedValue(
      makeCart({
        items: [
          makeCartItem({
            id: 11,
            quantity: 2,
            total_price: '179.98',
            product: makeProduct({ name: 'Piłka do piłki nożnej Pro', stock: 25 }),
          }),
        ],
        total_cart_price: '179.98',
      }),
    )

    renderCartPage()

    expect(
      await screen.findByText('Piłka do piłki nożnej Pro'),
    ).toBeInTheDocument()
    expect(screen.getByText('Razem')).toBeInTheDocument()
    expect(screen.getAllByText(/179,98/).length).toBeGreaterThan(0)
  })

  it('increases quantity via the API when clicking plus', async () => {
    authenticate()
    const user = userEvent.setup()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())
    vi.mocked(updateCartItem).mockResolvedValue(makeCartItem({ quantity: 3 }))

    renderCartPage()
    await screen.findByText('Piłka do piłki nożnej Pro')

    await user.click(screen.getByLabelText('Zwiększ ilość'))

    await waitFor(() => expect(updateCartItem).toHaveBeenCalledWith(11, 3))
  })

  it('removes the item when quantity drops to zero', async () => {
    authenticate()
    const user = userEvent.setup()
    vi.mocked(fetchCart).mockResolvedValue(
      makeCart({ items: [makeCartItem({ id: 11, quantity: 1 })] }),
    )
    vi.mocked(removeCartItem).mockResolvedValue(undefined)

    renderCartPage()
    await screen.findByText('Piłka do piłki nożnej Pro')

    await user.click(screen.getByLabelText('Zmniejsz ilość'))

    await waitFor(() => expect(removeCartItem).toHaveBeenCalledWith(11))
  })

  it('removes the item via the trash button', async () => {
    authenticate()
    const user = userEvent.setup()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())
    vi.mocked(removeCartItem).mockResolvedValue(undefined)

    renderCartPage()
    await screen.findByText('Piłka do piłki nożnej Pro')

    await user.click(screen.getByLabelText('Usuń'))

    await waitFor(() => expect(removeCartItem).toHaveBeenCalledWith(11))
  })

  it('blocks increasing quantity above the available stock', async () => {
    authenticate()
    vi.mocked(fetchCart).mockResolvedValue(
      makeCart({
        items: [
          makeCartItem({ id: 11, quantity: 5, product: makeProduct({ stock: 5 }) }),
        ],
      }),
    )

    renderCartPage()
    await screen.findByText('Piłka do piłki nożnej Pro')

    expect(screen.getByLabelText('Zwiększ ilość')).toBeDisabled()
  })
})
