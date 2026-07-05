import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CheckoutPage, {
  composeAddress,
  formatPostalCode,
  validateAddress,
} from '../pages/CheckoutPage'
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

async function fillAddress(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Imię i nazwisko odbiorcy'), 'Jan Kowalski')
  await user.type(screen.getByLabelText('Ulica'), 'Sportowa')
  await user.type(screen.getByLabelText('Nr domu / lokalu'), '12/3')
  await user.type(screen.getByLabelText('Kod pocztowy'), '00-001')
  await user.type(screen.getByLabelText('Miasto'), 'Warszawa')
}

describe('composeAddress', () => {
  const base = {
    recipient: 'Jan Kowalski',
    street: 'Sportowa',
    houseNumber: '12/3',
    postalCode: '00-001',
    city: 'Warszawa',
    notes: '',
  }

  it('combines the fields into a single formatted address', () => {
    expect(composeAddress(base)).toBe('Jan Kowalski, ul. Sportowa 12/3, 00-001 Warszawa')
  })

  it('appends notes when provided', () => {
    expect(composeAddress({ ...base, notes: 'kod 1234' })).toBe(
      'Jan Kowalski, ul. Sportowa 12/3, 00-001 Warszawa (uwagi: kod 1234)',
    )
  })

  it('trims surrounding whitespace from each field', () => {
    expect(composeAddress({ ...base, recipient: '  Jan Kowalski  ', city: ' Warszawa ' })).toBe(
      'Jan Kowalski, ul. Sportowa 12/3, 00-001 Warszawa',
    )
  })
})

describe('formatPostalCode', () => {
  it('inserts the dash automatically after two digits', () => {
    expect(formatPostalCode('0')).toBe('0')
    expect(formatPostalCode('00')).toBe('00')
    expect(formatPostalCode('000')).toBe('00-0')
    expect(formatPostalCode('00001')).toBe('00-001')
  })

  it('keeps an already formatted code unchanged', () => {
    expect(formatPostalCode('00-001')).toBe('00-001')
  })

  it('strips non-digit characters', () => {
    expect(formatPostalCode('00a00b1')).toBe('00-001')
    expect(formatPostalCode('00 001')).toBe('00-001')
  })

  it('caps the value at five digits', () => {
    expect(formatPostalCode('123456789')).toBe('12-345')
  })
})

describe('validateAddress', () => {
  const valid = {
    recipient: 'Jan Kowalski',
    street: 'Sportowa',
    houseNumber: '12/3',
    postalCode: '00-001',
    city: 'Warszawa',
    notes: '',
  }

  it('passes for a fully filled form', () => {
    expect(validateAddress(valid)).toBeNull()
  })

  it('requires each mandatory field', () => {
    expect(validateAddress({ ...valid, recipient: '' })).toMatch(/odbiorcy/)
    expect(validateAddress({ ...valid, street: '' })).toMatch(/ulicy/)
    expect(validateAddress({ ...valid, houseNumber: '' })).toMatch(/numer/)
    expect(validateAddress({ ...valid, city: '' })).toMatch(/miasto/)
  })

  it('rejects a malformed postal code', () => {
    expect(validateAddress({ ...valid, postalCode: '1234' })).toMatch(/kod pocztowy/)
    expect(validateAddress({ ...valid, postalCode: '00001' })).toMatch(/kod pocztowy/)
  })
})

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

  it('renders the address as separate fields', async () => {
    authenticate()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())

    renderCheckout()
    await screen.findByText('Podsumowanie')

    expect(screen.getByLabelText('Imię i nazwisko odbiorcy')).toBeInTheDocument()
    expect(screen.getByLabelText('Ulica')).toBeInTheDocument()
    expect(screen.getByLabelText('Nr domu / lokalu')).toBeInTheDocument()
    expect(screen.getByLabelText('Kod pocztowy')).toBeInTheDocument()
    expect(screen.getByLabelText('Miasto')).toBeInTheDocument()
  })

  it('creates the order with the composed address and shows success', async () => {
    authenticate()
    const user = userEvent.setup()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())
    vi.mocked(createOrder).mockResolvedValue(makeOrder({ id: 7 }))

    renderCheckout()
    await screen.findByText('Podsumowanie')

    await fillAddress(user)
    await user.click(screen.getByRole('button', { name: 'Złóż zamówienie' }))

    expect(await screen.findByText('Zamówienie złożone!')).toBeInTheDocument()
    expect(createOrder).toHaveBeenCalledWith(
      'Jan Kowalski, ul. Sportowa 12/3, 00-001 Warszawa',
    )
    expect(screen.getByText(/#7/)).toBeInTheDocument()
  })

  it('accepts a postal code typed without a dash (numeric mobile keyboard)', async () => {
    authenticate()
    const user = userEvent.setup()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())
    vi.mocked(createOrder).mockResolvedValue(makeOrder({ id: 8 }))

    renderCheckout()
    await screen.findByText('Podsumowanie')

    await user.type(screen.getByLabelText('Imię i nazwisko odbiorcy'), 'Jan Kowalski')
    await user.type(screen.getByLabelText('Ulica'), 'Sportowa')
    await user.type(screen.getByLabelText('Nr domu / lokalu'), '12/3')
    await user.type(screen.getByLabelText('Kod pocztowy'), '00001')
    expect(screen.getByLabelText('Kod pocztowy')).toHaveValue('00-001')
    await user.type(screen.getByLabelText('Miasto'), 'Warszawa')
    await user.click(screen.getByRole('button', { name: 'Złóż zamówienie' }))

    expect(await screen.findByText('Zamówienie złożone!')).toBeInTheDocument()
    expect(createOrder).toHaveBeenCalledWith(
      'Jan Kowalski, ul. Sportowa 12/3, 00-001 Warszawa',
    )
  })

  it('blocks submission and shows an error for an invalid postal code', async () => {
    authenticate()
    const user = userEvent.setup()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())

    renderCheckout()
    await screen.findByText('Podsumowanie')

    await user.type(screen.getByLabelText('Imię i nazwisko odbiorcy'), 'Jan Kowalski')
    await user.type(screen.getByLabelText('Ulica'), 'Sportowa')
    await user.type(screen.getByLabelText('Nr domu / lokalu'), '12/3')
    await user.type(screen.getByLabelText('Kod pocztowy'), '1234')
    await user.type(screen.getByLabelText('Miasto'), 'Warszawa')
    await user.click(screen.getByRole('button', { name: 'Złóż zamówienie' }))

    expect(await screen.findByText(/kod pocztowy w formacie 00-000/)).toBeInTheDocument()
    expect(createOrder).not.toHaveBeenCalled()
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

    await fillAddress(user)
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
