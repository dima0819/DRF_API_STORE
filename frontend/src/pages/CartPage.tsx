import { motion } from 'framer-motion'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../api/client'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ProductImage from '../components/ProductImage'
import QuantityStepper from '../components/QuantityStepper'
import Skeleton from '../components/Skeleton'
import { slugifyCategoryName } from '../config/categories'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export default function CartPage() {
  const { isAuthenticated } = useAuth()
  const { cart, isLoading, updateQuantity, removeItem } = useCart()
  const { t } = useLanguage()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title={t('cart.guestTitle')}
          description={t('cart.guestText')}
        >
          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              onClick={() => navigate('/logowanie', { state: { from: '/koszyk' } })}
            >
              {t('cart.login')}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/rejestracja')}>
              {t('cart.createAccount')}
            </Button>
          </div>
          <Link
            to="/"
            className="mt-5 inline-block text-xs text-content-subtle transition-colors hover:text-content-muted"
          >
            {t('cart.continueGuest')}
          </Link>
        </EmptyState>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-10 sm:px-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28" rounded="xl" />
        ))}
      </div>
    )
  }

  const items = cart?.items ?? []

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title={t('cart.emptyTitle')}
          description={t('cart.emptyText')}
        >
          <Button onClick={() => navigate('/')}>{t('cart.browseProducts')}</Button>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t('cart.title')}{' '}
        <span className="text-content-subtle tabular-nums">({items.length})</span>
      </h1>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <ul className="space-y-3">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(index, 6) * 0.04,
                duration: 0.22,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="flex gap-4 rounded-xl border border-line bg-surface p-3 sm:p-4"
            >
              <Link
                to={`/produkt/${item.product.id}`}
                className="shrink-0"
                aria-label={item.product.name}
              >
                <ProductImage
                  name={item.product.name}
                  categorySlug={slugifyCategoryName(item.product.category)}
                  className="h-20 w-20 rounded-lg sm:h-24 sm:w-24"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <Link
                    to={`/produkt/${item.product.id}`}
                    className="text-sm font-semibold text-content transition-colors hover:text-accent-300"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-0.5 text-2xs uppercase tracking-wide text-content-subtle">
                    {item.product.category}
                  </p>
                  <p className="mt-2 text-base font-bold tabular-nums sm:hidden">
                    {formatPrice(item.total_price)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <QuantityStepper
                    quantity={item.quantity}
                    max={item.product.stock}
                    onChange={(quantity) => updateQuantity(item.id, quantity)}
                  />

                  <span className="hidden min-w-[5.5rem] text-right text-base font-bold tabular-nums sm:block">
                    {formatPrice(item.total_price)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-content-subtle transition-colors hover:bg-danger/12 hover:text-danger"
                    aria-label={t('product.remove')}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <aside className="rounded-xl border border-line bg-surface p-5 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-content-muted">{t('cart.total')}</span>
            <span className="text-2xl font-bold tabular-nums tracking-tight">
              {formatPrice(cart?.total_cart_price ?? '0')}
            </span>
          </div>
          <Button
            size="lg"
            className="mt-5 w-full"
            onClick={() => navigate('/checkout')}
          >
            {t('cart.checkout')}
          </Button>
          <Link
            to="/"
            className="mt-4 block text-center text-xs text-content-subtle transition-colors hover:text-content-muted"
          >
            {t('cart.browseProducts')}
          </Link>
        </aside>
      </div>
    </div>
  )
}
