import { motion } from 'framer-motion'
import { CheckCircle, MapPin, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orders'
import { formatPrice, getErrorMessage } from '../api/client'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

interface AddressForm {
  recipient: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  notes: string
}

const EMPTY_FORM: AddressForm = {
  recipient: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  notes: '',
}

// Polish postal code: NN-NNN
const POSTAL_CODE_RE = /^\d{2}-\d{3}$/

/**
 * Combine the individual address fields into the single `address` string the
 * API expects, e.g. "Jan Kowalski, ul. Sportowa 1/2, 00-001 Warszawa".
 * Optional notes are appended so they show up in the order history.
 */
export function composeAddress(form: AddressForm): string {
  const line = `${form.recipient.trim()}, ul. ${form.street.trim()} ${form.houseNumber.trim()}, ${form.postalCode.trim()} ${form.city.trim()}`
  const notes = form.notes.trim()
  return notes ? `${line} (uwagi: ${notes})` : line
}

/** Returns a validation error message, or null when the form is valid. */
export function validateAddress(form: AddressForm): string | null {
  if (!form.recipient.trim()) return 'Podaj imię i nazwisko odbiorcy'
  if (!form.street.trim()) return 'Podaj nazwę ulicy'
  if (!form.houseNumber.trim()) return 'Podaj numer domu / lokalu'
  if (!POSTAL_CODE_RE.test(form.postalCode.trim()))
    return 'Podaj kod pocztowy w formacie 00-000'
  if (!form.city.trim()) return 'Podaj miasto'
  return null
}

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth()
  const { cart, isLoading: cartLoading, refreshCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)

  const update = (field: keyof AddressForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

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
    const validationError = validateAddress(form)
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const order = await createOrder(composeAddress(form))
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

  const inputClass =
    'w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-500/40'

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Finalizacja zamówienia</h1>
      <p className="mt-2 text-gray-400">Uzupełnij dane dostawy i potwierdź zamówienie</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-brand-500/10 bg-surface-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-brand-400" />
              <h2 className="font-semibold text-white">Adres dostawy</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-400 mb-1.5">
                  Imię i nazwisko odbiorcy
                </label>
                <input
                  id="recipient"
                  value={form.recipient}
                  onChange={(e) => update('recipient', e.target.value)}
                  autoComplete="name"
                  placeholder="Jan Kowalski"
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-400 mb-1.5">
                    Ulica
                  </label>
                  <input
                    id="street"
                    value={form.street}
                    onChange={(e) => update('street', e.target.value)}
                    autoComplete="address-line1"
                    placeholder="Sportowa"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-400 mb-1.5">
                    Nr domu / lokalu
                  </label>
                  <input
                    id="houseNumber"
                    value={form.houseNumber}
                    onChange={(e) => update('houseNumber', e.target.value)}
                    autoComplete="address-line2"
                    placeholder="12/3"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-400 mb-1.5">
                    Kod pocztowy
                  </label>
                  <input
                    id="postalCode"
                    value={form.postalCode}
                    onChange={(e) => update('postalCode', e.target.value)}
                    autoComplete="postal-code"
                    placeholder="00-000"
                    inputMode="numeric"
                    className={inputClass}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-1.5">
                    Miasto
                  </label>
                  <input
                    id="city"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    autoComplete="address-level2"
                    placeholder="Warszawa"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1.5">
                  Uwagi do zamówienia <span className="text-gray-600">(opcjonalnie)</span>
                </label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Np. kod do domofonu, godziny odbioru..."
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
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
