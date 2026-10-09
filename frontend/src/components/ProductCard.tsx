import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatPrice } from '../api/client'
import { slugifyCategoryName } from '../config/categories'
import { useLanguage } from '../context/LanguageContext'
import Badge from './Badge'
import ProductImage from './ProductImage'

interface ProductCardProps {
  product: Product
  index?: number
  onAddToCart?: () => void
}

const LOW_STOCK_THRESHOLD = 5

export default function ProductCard({
  product,
  index = 0,
  onAddToCart,
}: ProductCardProps) {
  const { t } = useLanguage()
  const categorySlug = slugifyCategoryName(product.category)
  const inStock = product.stock > 0
  const lowStock = inStock && product.stock <= LOW_STOCK_THRESHOLD

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index, 7) * 0.04,
        duration: 0.25,
        ease: [0.25, 1, 0.5, 1],
      }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-200 hover:border-line-strong"
    >
      <Link
        to={`/produkt/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage
          name={product.name}
          categorySlug={categorySlug}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {!inStock && (
          <span aria-hidden="true" className="absolute left-3 top-3">
            <Badge tone="danger" solid>
              {t('product.outOfStock')}
            </Badge>
          </span>
        )}
        {lowStock && (
          <span aria-hidden="true" className="absolute left-3 top-3">
            <Badge tone="warn" solid>
              {t('product.lastFew')}
            </Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-2xs font-semibold uppercase tracking-[0.1em] text-content-subtle">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold leading-snug text-content">
          <Link
            to={`/produkt/${product.id}`}
            className="transition-colors hover:text-accent-300"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="text-lg font-bold tabular-nums tracking-tight text-content">
            {formatPrice(product.price)}
          </span>
          <motion.button
            type="button"
            whileTap={inStock ? { scale: 0.92 } : undefined}
            onClick={(event) => {
              event.preventDefault()
              onAddToCart?.()
            }}
            disabled={!inStock}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-raised text-content-muted transition-colors hover:bg-accent-400 hover:text-accent-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-raised disabled:hover:text-content-muted"
            aria-label={t('product.addToCart')}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
