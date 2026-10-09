import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchCategory, fetchProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import Skeleton from '../components/Skeleton'
import { getCategoryVisual } from '../config/categories'
import { useCartAction } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { productsWord } from '../i18n/translations'
import type { Category, Product } from '../types'

// One row on the widest grid: enough to signal loading without reserving
// space for products that may not exist, which would shift the page.
const SKELETON_COUNT = 4

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
      .catch(() => {
        setCategory(null)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [slug])

  const visual = slug ? getCategoryVisual(slug) : null
  const Icon = visual?.icon

  const query = search.trim().toLowerCase()
  const filtered = query
    ? products.filter((product) => product.name.toLowerCase().includes(query))
    : products

  return (
    <div>
      <header className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-content-muted transition-colors hover:text-content"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            {t('category.back')}
          </Link>

          <div className="mt-5 flex items-start gap-4">
            {Icon && (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-raised text-accent-300">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </span>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {category?.name ?? slug}
              </h1>
              <p className="mt-1.5 min-h-[2.625rem] max-w-xl text-sm leading-relaxed text-content-muted">
                {category?.description ?? ''}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="sr-only">{t('category.productsHeading')}</h2>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm tabular-nums text-content-muted">
            {filtered.length} {productsWord(filtered.length, lang)}
          </p>
          <div className="relative sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle"
              strokeWidth={1.75}
            />
            <input
              type="search"
              placeholder={t('category.searchPlaceholder')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={t('category.searchPlaceholder')}
              className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-content outline-none transition-colors placeholder:text-content-subtle hover:border-line-strong focus:border-accent-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <Skeleton key={index} className="h-[330px]" rounded="xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-line bg-surface p-12 text-center"
          >
            <p className="text-sm text-content-muted">{t('category.empty')}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
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
