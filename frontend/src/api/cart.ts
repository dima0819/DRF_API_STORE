import { apiFetch } from './client'
import type { Cart, CartItem } from '../types'

export async function fetchCart(): Promise<Cart> {
  return apiFetch<Cart>('/api/v1/carts/', {}, true)
}

export async function ensureCart(): Promise<Cart> {
  return apiFetch<Cart>('/api/v1/carts/', { method: 'POST' }, true)
}

export async function addToCart(
  productId: number,
  quantity = 1,
): Promise<CartItem> {
  return apiFetch<CartItem>(
    '/api/v1/carts/add_item/',
    {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    },
    true,
  )
}

export async function updateCartItem(
  itemId: number,
  quantity: number,
): Promise<CartItem> {
  return apiFetch<CartItem>(
    `/api/v1/carts/items/${itemId}/`,
    {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    },
    true,
  )
}

export async function removeCartItem(itemId: number): Promise<void> {
  await apiFetch<void>(`/api/v1/carts/items/${itemId}/`, { method: 'DELETE' }, true)
}
