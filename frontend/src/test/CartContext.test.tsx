import { renderHook, waitFor, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCart } from '../context/CartContext'
import { Providers } from './utils'
import { authenticate, emptyCart, makeCart, makeCartItem } from './fixtures'
import {
  addToCart as apiAddToCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../api/cart'

vi.mock('../api/cart', () => ({
  fetchCart: vi.fn(),
  ensureCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}))

describe('CartContext', () => {
  beforeEach(() => {
    vi.mocked(fetchCart).mockReset()
    vi.mocked(apiAddToCart).mockReset()
    vi.mocked(updateCartItem).mockReset()
    vi.mocked(removeCartItem).mockReset()
  })

  it('does not fetch the cart for anonymous users', async () => {
    const { result } = renderHook(() => useCart(), { wrapper: Providers })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.cart).toBeNull()
    expect(fetchCart).not.toHaveBeenCalled()
  })

  it('loads the cart and computes itemCount for logged-in users', async () => {
    authenticate()
    const cart = makeCart({
      items: [
        makeCartItem({ id: 11, quantity: 2 }),
        makeCartItem({ id: 12, quantity: 1 }),
      ],
    })
    vi.mocked(fetchCart).mockResolvedValue(cart)

    const { result } = renderHook(() => useCart(), { wrapper: Providers })

    await waitFor(() => expect(result.current.itemCount).toBe(3))
    expect(result.current.cart?.items).toHaveLength(2)
  })

  it('addToCart posts the item and refreshes the cart', async () => {
    authenticate()
    vi.mocked(fetchCart).mockResolvedValue(emptyCart)
    vi.mocked(apiAddToCart).mockResolvedValue(makeCartItem())

    const { result } = renderHook(() => useCart(), { wrapper: Providers })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const callsBefore = vi.mocked(fetchCart).mock.calls.length
    await act(async () => {
      await result.current.addToCart(1, 2)
    })

    expect(apiAddToCart).toHaveBeenCalledWith(1, 2)
    expect(vi.mocked(fetchCart).mock.calls.length).toBe(callsBefore + 1)
  })

  it('updateQuantity with 0 removes the item instead of patching', async () => {
    authenticate()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())
    vi.mocked(removeCartItem).mockResolvedValue(undefined)

    const { result } = renderHook(() => useCart(), { wrapper: Providers })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.updateQuantity(11, 0)
    })

    expect(removeCartItem).toHaveBeenCalledWith(11)
    expect(updateCartItem).not.toHaveBeenCalled()
  })

  it('updateQuantity with a positive value patches the item', async () => {
    authenticate()
    vi.mocked(fetchCart).mockResolvedValue(makeCart())
    vi.mocked(updateCartItem).mockResolvedValue(makeCartItem({ quantity: 5 }))

    const { result } = renderHook(() => useCart(), { wrapper: Providers })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.updateQuantity(11, 5)
    })

    expect(updateCartItem).toHaveBeenCalledWith(11, 5)
    expect(removeCartItem).not.toHaveBeenCalled()
  })
})
