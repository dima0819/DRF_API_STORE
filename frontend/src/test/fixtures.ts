import type { Cart, CartItem, Category, Order, Product } from '../types'

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Piłka do piłki nożnej Pro',
    description: 'Profesjonalna piłka meczowa, rozmiar 5.',
    price: '89.99',
    stock: 25,
    created_at: '2026-01-01T10:00:00Z',
    category: 'Piłki',
    ...overrides,
  }
}

export function makeCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: 11,
    product: makeProduct(),
    quantity: 2,
    total_price: '179.98',
    ...overrides,
  }
}

export function makeCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 1,
    items: [makeCartItem()],
    total_cart_price: '179.98',
    ...overrides,
  }
}

export const emptyCart: Cart = { id: 1, items: [], total_cart_price: '0' }

export function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 5,
    created_at: '2026-02-10T12:30:00Z',
    is_paid: false,
    address: 'ul. Sportowa 1, 00-001 Warszawa',
    user_phone_number: '+48123456789',
    items: [
      {
        id: 21,
        product_name: 'Piłka do piłki nożnej Pro',
        quantity: 2,
        price: '89.99',
        total_price: '179.98',
      },
    ],
    total_order_price: '179.98',
    ...overrides,
  }
}

export const sampleCategories: Category[] = [
  { id: 1, name: 'Piłki', slug: 'pilki', description: 'Piłki do gier zespołowych' },
  { id: 2, name: 'Sporty zimowe', slug: 'sporty-zimowe', description: 'Sprzęt na stok' },
]

export function authenticate(): void {
  localStorage.setItem('sportstore_access', 'test-access-token')
  localStorage.setItem('sportstore_refresh', 'test-refresh-token')
}
