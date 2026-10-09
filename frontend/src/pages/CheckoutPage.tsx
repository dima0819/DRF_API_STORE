import { motion } from 'framer-motion'
import { CheckCircle, MapPin, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/orders'
import { formatPrice, getErrorMessage } from '../api/client'
import Button from '../components/Button'
import Input from '../components/Input'
import Skeleton from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { translate } from '../i18n/translations'

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

export function formatPostalCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 5)
  return digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits
}

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
  if (!form.recipient.trim()) return translate('checkout.errRecipient')
  if (!form.street.trim()) return translate('checkout.errStreet')
  if (!form.houseNumber.trim()) return translate('checkout.errHouse')
  if (!POSTAL_CODE_RE.test(form.postalCode.trim())) return translate('checkout.errPostal')
  if (!form.city.trim()) return translate('checkout.errCity')
  return null
}

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth()
  const { cart, isLoading: cartLoading, refreshCart } = useCart()
  const { t } = useLanguage()
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
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <Skeleton className="h-72" rounded="xl" />
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
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="rounded-xl border border-line bg-surface p-9"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.08, ease: [0.34, 1.26, 0.64, 1] }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-400/12"
          >
            <CheckCircle className="h-8 w-8 text-accent-400" strokeWidth={1.75} />
          </motion.span>
          <h1 className="mt-6 text-xl font-bold tracking-tight">{t('checkout.successTitle')}</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-content-muted">
            {t('checkout.successText', { id: orderId ?? '' })}
          </p>
          <div className="mt-7 flex flex-col gap-2.5">
            <Button onClick={() => navigate('/zamowienia')}>{t('checkout.myOrders')}</Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              {t('checkout.continueShopping')}
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t('checkout.title')}
      </h1>
      <p className="mt-1.5 text-sm text-content-muted">{t('checkout.subtitle')}</p>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-accent-400" strokeWidth={1.75} />
              {t('checkout.addressHeader')}
            </h2>

            <div className="mt-5 space-y-4">
              <Input
                label={t('checkout.recipient')}
                value={form.recipient}
                onChange={(event) => update('recipient', event.target.value)}
                autoComplete="name"
                placeholder="Jan Kowalski"
                required
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input
                  className="sm:col-span-2"
                  label={t('checkout.street')}
                  value={form.street}
                  onChange={(event) => update('street', event.target.value)}
                  autoComplete="address-line1"
                  placeholder="Sportowa"
                  required
                />
                <Input
                  label={t('checkout.houseNumber')}
                  value={form.houseNumber}
                  onChange={(event) => update('houseNumber', event.target.value)}
                  autoComplete="address-line2"
                  placeholder="12/3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input
                  label={t('checkout.postalCode')}
                  value={form.postalCode}
                  onChange={(event) =>
                    update('postalCode', formatPostalCode(event.target.value))
                  }
                  autoComplete="postal-code"
                  placeholder="00-000"
                  inputMode="numeric"
                  maxLength={6}
                  required
                />
                <Input
                  className="sm:col-span-2"
                  label={t('checkout.city')}
                  value={form.city}
                  onChange={(event) => update('city', event.target.value)}
                  autoComplete="address-level2"
                  placeholder="Warszawa"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-notes"
                  className="mb-1.5 block text-xs font-medium text-content-muted"
                >
                  {t('checkout.notes')}{' '}
                  <span className="text-content-subtle">{t('checkout.optional')}</span>
                </label>
                <textarea
                  id="checkout-notes"
                  value={form.notes}
                  onChange={(event) => update('notes', event.target.value)}
                  placeholder={t('checkout.notesPlaceholder')}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-line bg-raised px-3.5 py-2.5 text-sm text-content outline-none transition-colors placeholder:text-content-subtle hover:border-line-strong focus:border-accent-400"
                />
              </div>
            </div>
          </section>

          <div className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-4 py-3">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-accent-400"
              strokeWidth={1.75}
            />
            <p className="text-xs leading-relaxed text-content-muted">
              {t('checkout.info')}
            </p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              role="alert"
              className="rounded-lg border border-danger/25 bg-danger/12 px-3.5 py-2.5 text-sm text-danger"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full sm:w-auto"
          >
            {t('checkout.submit')}
          </Button>
        </form>

        <aside className="rounded-xl border border-line bg-surface p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">{t('checkout.summary')}</h2>
          <ul className="mt-4 space-y-2.5">
            {cart?.items.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="min-w-0 text-content-muted">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="shrink-0 tabular-nums text-content">
                  {formatPrice(item.total_price)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm text-content-muted">{t('cart.total')}</span>
            <span className="text-xl font-bold tabular-nums tracking-tight">
              {formatPrice(cart?.total_cart_price ?? '0')}
            </span>
          </div>
          <Link
            to="/koszyk"
            className="mt-4 block text-center text-xs text-content-subtle transition-colors hover:text-content-muted"
          >
            {t('checkout.backToCart')}
          </Link>
        </aside>
      </div>
    </div>
  )
}
