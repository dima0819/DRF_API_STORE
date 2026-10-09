import { motion } from 'framer-motion'
import { Calendar, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { fetchOrders } from '../api/orders'
import { formatDate, formatPrice } from '../api/client'
import Badge from '../components/Badge'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import type { Order } from '../types'

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to="/logowanie" state={{ from: '/zamowienia' }} replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t('orders.title')}
      </h1>
      <p className="mt-1.5 text-sm text-content-muted">{t('orders.subtitle')}</p>

      {loading ? (
        <div className="mt-7 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36" rounded="xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={Package}
            title={t('orders.empty')}
            description={t('orders.emptyText')}
          >
            <Button onClick={() => navigate('/')}>
              {t('orders.startShopping')}
            </Button>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-7 space-y-3">
          {orders.map((order, index) => (
            <motion.li
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(index, 6) * 0.04,
                duration: 0.22,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="rounded-xl border border-line bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold tracking-tight">
                    {t('orders.order')} #{order.id}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-content-subtle">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums tracking-tight">
                    {formatPrice(order.total_order_price)}
                  </p>
                  <span className="mt-1.5 inline-block">
                    <Badge tone={order.is_paid ? 'accent' : 'warn'}>
                      {order.is_paid ? t('orders.paid') : t('orders.pending')}
                    </Badge>
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-content-muted">
                <span className="text-content-subtle">{t('orders.address')} </span>
                {order.address}
              </p>

              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-baseline justify-between gap-4 text-sm"
                  >
                    <span className="min-w-0 text-content-muted">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="shrink-0 tabular-nums text-content">
                      {formatPrice(item.total_price)}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      )}

      <Link
        to="/"
        className="mt-8 inline-block text-xs text-content-subtle transition-colors hover:text-content-muted"
      >
        {t('cart.browseProducts')}
      </Link>
    </div>
  )
}
