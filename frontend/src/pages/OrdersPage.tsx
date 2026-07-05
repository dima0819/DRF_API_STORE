import { motion } from 'framer-motion'
import { Calendar, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { fetchOrders } from '../api/orders'
import { formatDate, formatPrice } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import type { Order } from '../types'

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    fetchOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to="/logowanie" state={{ from: '/zamowienia' }} replace />
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">{t('orders.title')}</h1>
      <p className="mt-2 text-gray-400">{t('orders.subtitle')}</p>

      {loading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface-card" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 rounded-2xl border border-brand-500/10 bg-surface-card p-12 text-center"
        >
          <Package className="mx-auto h-16 w-16 text-brand-500/40" />
          <p className="mt-4 text-gray-400">{t('orders.empty')}</p>
          <Link
            to="/"
            className="mt-4 inline-block text-brand-400 hover:text-brand-300"
          >
            {t('orders.startShopping')}
          </Link>
        </motion.div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-brand-500/10 bg-surface-card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-white">{t('orders.order')} #{order.id}</h2>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-brand-400">
                    {formatPrice(order.total_order_price)}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.is_paid
                        ? 'bg-brand-500/15 text-brand-400'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    {order.is_paid ? t('orders.paid') : t('orders.pending')}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-400">
                <span className="text-gray-500">{t('orders.address')} </span>
                {order.address}
              </p>

              <ul className="mt-4 space-y-2 border-t border-brand-500/10 pt-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="text-gray-400">{formatPrice(item.total_price)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
