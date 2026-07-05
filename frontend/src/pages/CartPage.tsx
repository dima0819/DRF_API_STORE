import { motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../api/client'
import Button from '../components/Button'
import { getProductImage, slugifyCategoryName } from '../config/categories'
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
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-brand-500/10 bg-surface-card p-12"
        >
          <ShoppingBag className="mx-auto h-16 w-16 text-brand-500/50" />
          <h1 className="mt-6 text-2xl font-bold text-white">{t('cart.guestTitle')}</h1>
          <p className="mt-3 text-gray-400">{t('cart.guestText')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate('/logowanie', { state: { from: '/koszyk' } })}>
              {t('cart.login')}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/rejestracja')}>
              {t('cart.createAccount')}
            </Button>
          </div>
          <Link to="/" className="mt-6 inline-block text-sm text-brand-400 hover:text-brand-300">
            {t('cart.continueGuest')}
          </Link>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-card" />
          ))}
        </div>
      </div>
    )
  }

  const items = cart?.items ?? []

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-brand-500/10 bg-surface-card p-12"
        >
          <ShoppingBag className="mx-auto h-16 w-16 text-brand-500/50" />
          <h1 className="mt-6 text-2xl font-bold text-white">{t('cart.emptyTitle')}</h1>
          <p className="mt-3 text-gray-400">{t('cart.emptyText')}</p>
          <Button className="mt-8" onClick={() => navigate('/')}>
            {t('cart.browseProducts')}
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">
        {t('cart.title')} <span className="text-brand-400">({items.length})</span>
      </h1>

      <div className="mt-8 space-y-4">
        {items.map((item, i) => {
          const slug = slugifyCategoryName(item.product.category)
          const image = getProductImage(item.product.name, slug)

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-2xl border border-brand-500/10 bg-surface-card p-4 sm:gap-6 sm:p-5"
            >
              <Link to={`/produkt/${item.product.id}`} className="shrink-0">
                <img
                  src={image}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24"
                />
              </Link>

              <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to={`/produkt/${item.product.id}`}>
                    <h3 className="font-semibold text-white hover:text-brand-300 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                  <p className="mt-2 font-bold text-brand-400 sm:hidden">
                    {formatPrice(item.total_price)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 sm:mt-0">
                  <div className="flex items-center rounded-xl border border-brand-500/20 bg-surface-elevated">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-gray-400 hover:text-white"
                      aria-label={t('product.decrease')}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="flex h-9 w-9 items-center justify-center text-gray-400 hover:text-white disabled:opacity-40"
                      aria-label={t('product.increase')}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="hidden font-bold text-brand-400 sm:block">
                    {formatPrice(item.total_price)}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label={t('product.remove')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-2xl border border-brand-500/15 bg-surface-card p-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg text-gray-400">{t('cart.total')}</span>
          <span className="text-2xl font-bold text-brand-400">
            {formatPrice(cart?.total_cart_price ?? '0')}
          </span>
        </div>
        <Button className="mt-6 w-full" onClick={() => navigate('/checkout')}>
          {t('cart.checkout')}
        </Button>
      </motion.div>
    </div>
  )
}
