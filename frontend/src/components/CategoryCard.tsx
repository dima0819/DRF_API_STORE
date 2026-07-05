import { motion } from 'framer-motion'
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        to={`/kategoria/${category.slug}`}
        className="group block"
      >
        <div className="card-shine relative overflow-hidden rounded-2xl bg-surface-card border border-brand-500/10 transition-all duration-300 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/10">
          <div className="relative h-44 overflow-hidden">
            <img
              src={visual.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${visual.gradient} opacity-60 mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
              {category.name}
            </h3>
            {category.description && (
              <p className="mt-1.5 text-sm text-gray-400 line-clamp-2">{category.description}</p>
            )}
            <span className="mt-3 inline-flex items-center text-sm font-medium text-brand-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
              {t('card.browse')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
