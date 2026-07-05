import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getErrorMessage } from '../api/client'
import { translate } from '../i18n/translations'
import { useToast } from './ToastContext'
import {
  addToCart as apiAddToCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../api/cart'
import type { Cart } from '../types'
import { useAuth } from './AuthContext'

interface CartContextValue {
  cart: Cart | null
  itemCount: number
  isLoading: boolean
  refreshCart: () => Promise<void>
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

const emptyCart: Cart = { id: 0, items: [], total_cart_price: '0' }

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }
    setIsLoading(true)
    try {
      const data = await fetchCart()
      setCart(data)
    } catch {
      setCart(emptyCart)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      await apiAddToCart(productId, quantity)
      await refreshCart()
    },
    [refreshCart],
  )

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      if (quantity <= 0) {
        await removeCartItem(itemId)
      } else {
        await updateCartItem(itemId, quantity)
      }
      await refreshCart()
    },
    [refreshCart],
  )

  const removeItem = useCallback(
    async (itemId: number) => {
      await removeCartItem(itemId)
      await refreshCart()
    },
    [refreshCart],
  )

  const itemCount = useMemo(
    () => (cart?.items || []).reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )
  

  const value = useMemo(
    () => ({
      cart,
      itemCount,
      isLoading,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
    }),
    [cart, itemCount, isLoading, refreshCart, addToCart, updateQuantity, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function useCartAction() {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const handleAddToCart = useCallback(
    async (productId: number, quantity = 1, onNeedAuth?: () => void) => {
      if (!isAuthenticated) {
        onNeedAuth?.()
        return false
      }
      try {
        await addToCart(productId, quantity)
        showToast(translate('cart.addedToast'))
        return true
      } catch (err) {
        showToast(getErrorMessage(err))
        return false
      }
    },
    [addToCart, isAuthenticated, showToast],
  )

  return { handleAddToCart, isAuthenticated }
}
