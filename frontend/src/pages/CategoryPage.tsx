import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchCategory, fetchProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import { getCategoryVisual } from '../config/categories'
import { useCartAction } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { productsWord } from '../i18n/translations'
import type { Category, Product } from '../types'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { handleAddToCart } = useCartAction()
  const { lang, t } = useLanguage()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([
      fetchCategory(slug),
      fetchProducts({ category: slug, page_size: 50 }),
    ])
      .then(([cat, prodData]) => {
        setCategory(cat ?? null)
        setProducts(prodData.results)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const visual = slug ? getCategoryVisual(slug) : null
  const Icon = visual?.icon

  const filtered = search
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  return (
    <div>
      {visual && (
        <div className="relative h-48 overflow-hidden sm:h-56">
          <img src={visual.image} alt="" className="h-full w-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${visual.gradient} opacity-50 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
              <Link
                to="/"
                className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> {t('category.back')}
              </Link>
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white">{category?.name ?? slug}</h1>
                  {category?.description && (
                    <p className="mt-1 text-gray-300">{category.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-400">
            {filtered.length} {productsWord(filtered.length, lang)}
          </p>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={t('category.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-brand-500/15 bg-surface-card py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-500/40"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-surface-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-brand-500/10 bg-surface-card p-12 text-center"
          >
            <p className="text-gray-400">{t('category.empty')}</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onAddToCart={() =>
                  handleAddToCart(product.id, 1, () =>
                    navigate('/logowanie', { state: { from: `/kategoria/${slug}` } }),
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
