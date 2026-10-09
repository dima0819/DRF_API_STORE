import { motion } from 'framer-motion'
import { ArrowLeft, Check, Package, ShoppingCart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/products'
import { formatPrice } from '../api/client'
import Badge from '../components/Badge'
import Button from '../components/Button'
import ProductImage from '../components/ProductImage'
import QuantityStepper from '../components/QuantityStepper'
import Skeleton from '../components/Skeleton'
import { slugifyCategoryName } from '../config/categories'
import { useCartAction } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import type { Product } from '../types'

const LOW_STOCK_THRESHOLD = 5
const ADDED_FEEDBACK_MS = 2000

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
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!id) return
    fetchProduct(Number(id))
      .then(setProduct)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current)
    },
    [],
  )

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square" rounded="xl" />
          <div className="space-y-4 pt-2">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-24 w-full" rounded="lg" />
            <Skeleton className="h-11 w-full" rounded="lg" />
          </div>
        </div>
      </div>
    )
  }

  const categorySlug = slugifyCategoryName(product.category)
  const inStock = product.stock > 0
  const lowStock = inStock && product.stock <= LOW_STOCK_THRESHOLD
  const stockLabel = !inStock
    ? t('product.outOfStock')
    : lowStock
      ? t('product.lastN', { n: product.stock })
      : t('product.availableN', { n: product.stock })

  const handleAdd = async () => {
    setAdding(true)
    const ok = await handleAddToCart(product.id, quantity, () =>
      navigate('/logowanie', { state: { from: `/produkt/${product.id}` } }),
    )
    setAdding(false)
    if (!ok) return
    setAdded(true)
    if (addedTimer.current) clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        to={`/kategoria/${categorySlug}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        {product.category}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="relative overflow-hidden rounded-xl border border-line"
        >
          <ProductImage
            name={product.name}
            categorySlug={categorySlug}
            className="aspect-square w-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
          <span className="absolute left-4 top-4">
            <Badge tone="neutral">{product.category}</Badge>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col"
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-bold tabular-nums tracking-tight">
            {formatPrice(product.price)}
          </p>

          <p className="mt-5 flex items-center gap-2 text-sm">
            <Package
              className={`h-4 w-4 ${inStock ? 'text-accent-400' : 'text-danger'}`}
              strokeWidth={1.75}
            />
            <span
              className={
                !inStock
                  ? 'text-danger'
                  : lowStock
                    ? 'text-warn'
                    : 'text-content-muted'
              }
            >
              {stockLabel}
            </span>
          </p>

          <section className="mt-7 rounded-xl border border-line bg-surface p-5">
            <h2 className="text-2xs font-semibold uppercase tracking-[0.1em] text-content-subtle">
              {t('product.description')}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-content-muted">
              {product.description}
            </p>
          </section>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantityStepper
              quantity={quantity}
              max={product.stock}
              onChange={(next) => setQuantity(Math.max(1, next))}
            />
            <Button
              size="lg"
              onClick={handleAdd}
              loading={adding}
              disabled={!inStock}
              className="min-w-[12rem] flex-1"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  {t('product.added')}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                  {t('product.addToCart')}
                </>
              )}
            </Button>
          </div>

          {!inStock && (
            <p className="mt-3 text-sm text-danger">{t('product.unavailable')}</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
