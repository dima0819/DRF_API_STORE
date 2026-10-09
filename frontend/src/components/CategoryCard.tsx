import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Category } from '../types'
import { getCategoryVisual } from '../config/categories'
import { useLanguage } from '../context/LanguageContext'

interface CategoryCardProps {
  category: Category
  index?: number
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const { t } = useLanguage()
  const visual = getCategoryVisual(category.slug)
  const Icon = visual.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index, 6) * 0.05,
        duration: 0.25,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      <Link
        to={`/kategoria/${category.slug}`}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent-400/35"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 70% at 15% 0%, rgb(61 220 151 / 0.09), transparent 70%)',
          }}
        />

        <div className="relative">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-raised text-accent-300 transition-colors duration-200 group-hover:bg-accent-400 group-hover:text-accent-ink">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>

          <h3 className="mt-4 text-lg font-bold text-content">
            {category.name}
          </h3>

          {category.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-content-muted">
              {category.description}
            </p>
          )}
        </div>

        <span className="relative mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-300">
          {t('card.browse')}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
            strokeWidth={2.5}
          />
        </span>
      </Link>
    </motion.div>
  )
}
