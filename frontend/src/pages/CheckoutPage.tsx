import { motion } from 'framer-motion'
import { CheckCircle, MapPin, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orders'
import { formatPrice, getErrorMessage } from '../api/client'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth()
  const { cart, isLoading: cartLoading, refreshCart } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)

  if (!isAuthenticated) {
    return <Navigate to="/logowanie" state={{ from: '/checkout' }} replace />
  }

  // Cart is still being fetched — don't redirect away prematurely
  if (!success && (cartLoading || cart === null)) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="h-64 animate-pulse rounded-2xl bg-surface-card" />
      </div>
    )
  }

  if (!cart?.items.length && !success) {
    return <Navigate to="/koszyk" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) {
      setError('Podaj adres dostawy')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const order = await createOrder(address.trim())
      setOrderId(order.id)
      setSuccess(true)
      await refreshCart()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-brand-500/20 bg-surface-card p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <CheckCircle className="mx-auto h-20 w-20 text-brand-400" />
          </motion.div>
          <h1 className="mt-6 text-2xl font-bold text-white">Zamówienie złożone!</h1>
          <p className="mt-3 text-gray-400">
            Twoje zamówienie #{orderId} zostało przyjęte. Potwierdzenie wysłaliśmy na email.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={() => navigate('/zamowienia')}>Moje zamówienia</Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Kontynuuj zakupy
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Finalizacja zamówienia</h1>
      <p className="mt-2 text-gray-400">Uzupełnij adres dostawy i potwierdź zamówienie</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-brand-500/10 bg-surface-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-brand-400" />
              <h2 className="font-semibold text-white">Adres dostawy</h2>
            </div>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ulica, numer, kod pocztowy, miasto..."
              rows={4}
              className="w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-500/40 resize-none"
              required
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-brand-500/10 bg-brand-500/5 p-4">
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-400 mt-0.5" />
            <p className="text-sm text-gray-400">
              Po złożeniu zamówienia otrzymasz potwierdzenie na email. Płatność realizowana jest
              przy odbiorze (demo).
            </p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            Złóż zamówienie
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-brand-500/10 bg-surface-card p-6">
            <h2 className="font-semibold text-white">Podsumowanie</h2>
            <ul className="mt-4 space-y-3">
              {cart?.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-gray-300">{formatPrice(item.total_price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-brand-500/10 pt-4 flex justify-between">
              <span className="font-semibold text-white">Razem</span>
              <span className="text-xl font-bold text-brand-400">
                {formatPrice(cart?.total_cart_price ?? '0')}
              </span>
            </div>
            <Link
              to="/koszyk"
              className="mt-4 block text-center text-sm text-brand-400 hover:text-brand-300"
            >
              ← Wróć do koszyka
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
