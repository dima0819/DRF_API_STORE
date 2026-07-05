import { motion } from 'framer-motion'
import { ArrowLeft, Check, Minus, Package, Plus, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/products'
import { formatPrice } from '../api/client'
import Button from '../components/Button'
import {
  getCategoryVisualByName,
  getProductImage,
  slugifyCategoryName,
} from '../config/categories'
import { useCartAction } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import type { Product } from '../types'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { handleAddToCart } = useCartAction()
  const { t } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchProduct(Number(id))
      .then(setProduct)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-surface-card" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-surface-card" />
            <div className="h-4 w-full animate-pulse rounded bg-surface-card" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface-card" />
          </div>
        </div>
      </div>
    )
  }

  const categorySlug = slugifyCategoryName(product.category)
  const visual = getCategoryVisualByName(product.category)
  const image = getProductImage(product.name, categorySlug)
  const inStock = product.stock > 0
  const stockLabel =
    product.stock === 0
      ? t('product.outOfStock')
      : product.stock <= 5
        ? t('product.lastN', { n: product.stock })
        : t('product.availableN', { n: product.stock })

  const handleAdd = async () => {
    setAdding(true)
    const ok = await handleAddToCart(product.id, quantity, () =>
      navigate('/logowanie', { state: { from: `/produkt/${product.id}` } }),
    )
    setAdding(false)
    if (ok) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/kategoria/${categorySlug}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {product.category}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-surface-card border border-brand-500/10"
        >
          <img src={image} alt={product.name} className="aspect-square w-full object-cover" />
          <div className={`absolute top-4 left-4 rounded-full bg-gradient-to-r ${visual.gradient} px-3 py-1 text-xs font-semibold text-white`}>
            {product.category}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-brand-400">{formatPrice(product.price)}</p>

          <div className="mt-6 flex items-center gap-2">
            <Package className="h-5 w-5 text-brand-400" />
            <span className={`text-sm font-medium ${inStock ? 'text-brand-300' : 'text-red-400'}`}>
              {stockLabel}
            </span>
          </div>

          <div className="mt-8 rounded-xl bg-surface-elevated p-5 border border-brand-500/10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-400">
              {t('product.description')}
            </h2>
            <p className="mt-3 leading-relaxed text-gray-300">{product.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-brand-500/20 bg-surface-card">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label={t('product.decrease')}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="flex h-11 w-11 items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                aria-label={t('product.increase')}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAdd}
              loading={adding}
              disabled={!inStock}
              className="flex-1 min-w-[200px]"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> {t('product.added')}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" /> {t('product.addToCart')}
                </>
              )}
            </Button>
          </div>

          {!inStock && (
            <p className="mt-4 text-sm text-red-400">{t('product.unavailable')}</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
