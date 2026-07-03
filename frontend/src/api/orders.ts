import { apiFetch } from './client'
import type { Order } from '../types'

export async function fetchOrders(): Promise<Order[]> {
  const data = await apiFetch<Order[] | { results: Order[] }>(
    '/api/v1/orders/order_list/',
    {},
    true,
  )
  return Array.isArray(data) ? data : data.results ?? []
}

export async function fetchOrder(id: number): Promise<Order> {
  return apiFetch<Order>(`/api/v1/orders/order_detail/${id}/`, {}, true)
}

export async function createOrder(address: string): Promise<Order> {
  return apiFetch<Order>(
    '/api/v1/orders/order_create/',
    {
      method: 'POST',
      body: JSON.stringify({ address }),
    },
    true,
  )
}
