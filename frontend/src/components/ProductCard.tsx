import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatPrice } from '../api/client'
import { getProductImage, slugifyCategoryName } from '../config/categories'
import { useLanguage } from '../context/LanguageContext'

interface ProductCardProps {
  product: Product
  index?: number
  onAddToCart?: () => void
}

export default function ProductCard({ product, index = 0, onAddToCart }: ProductCardProps) {
  const { t } = useLanguage()
  const categorySlug = slugifyCategoryName(product.category)
  const image = getProductImage(product.name, categorySlug)
  const inStock = product.stock > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-surface-card border border-brand-500/10 transition-all duration-300 hover:border-brand-500/25 hover:shadow-lg hover:shadow-brand-500/5"
    >
      <Link to={`/produkt/${product.id}`} className="relative block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-surface-elevated">
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {!inStock && (
          <span className="absolute top-3 left-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
            {t('product.outOfStock')}
          </span>
        )}
        {inStock && product.stock <= 5 && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white">
            {t('product.lastFew')}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-brand-400">
          {product.category}
        </span>
        <Link to={`/produkt/${product.id}`}>
          <h3 className="mt-1 font-semibold text-white transition-colors group-hover:text-brand-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-bold text-brand-400">{formatPrice(product.price)}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault()
              onAddToCart?.()
            }}
            disabled={!inStock}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 transition-colors hover:bg-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('product.addToCart')}
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
