import { motion } from 'framer-motion'
import { ArrowRight, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchCategories } from '../api/products'
import CategoryCard from '../components/CategoryCard'
import Skeleton from '../components/Skeleton'
import { useLanguage } from '../context/LanguageContext'
import type { Category } from '../types'

const FADE_UP = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
}

const EASE = [0.25, 1, 0.5, 1] as const

export default function HomePage() {
  const { t } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  const assurances = [
    { icon: Truck, label: t('home.stat.delivery') },
    { icon: ShieldCheck, label: t('home.stat.warranty') },
    { icon: PackageCheck, label: t('home.stat.returns') },
  ]

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="hero-aura pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <motion.span
              {...FADE_UP}
              transition={{ duration: 0.3, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-content-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              {t('home.badge')}
            </motion.span>

            <motion.h1
              {...FADE_UP}
              transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
              className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]"
            >
              {t('home.hero1')}{' '}
              <span className="text-gradient">{t('home.heroAccent')}</span>{' '}
              {t('home.hero2')}
            </motion.h1>

            <motion.p
              {...FADE_UP}
              transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
              className="mt-5 max-w-xl text-base leading-relaxed text-content-muted"
            >
              {t('home.heroText')}
            </motion.p>

            <motion.div
              {...FADE_UP}
              transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#kategorie"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent-400 px-6 text-sm font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-300"
              >
                {t('home.browseCategories')}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-6"
            >
              {assurances.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-xs text-content-subtle"
                >
                  <Icon className="h-4 w-4 text-accent-400" strokeWidth={1.75} />
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      <section id="kategorie" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t('home.choose')}{' '}
              <span className="text-accent-400">{t('home.chooseAccent')}</span>
            </h2>
            <p className="mt-2 text-sm text-content-muted">{t('home.chooseText')}</p>
          </div>
          {!loading && categories.length > 0 && (
            <span className="text-xs tabular-nums text-content-subtle">
              {t('home.categoryCount', { n: categories.length })}
            </span>
          )}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-44" rounded="xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-8 rounded-xl border border-line bg-surface p-10 text-center">
            <p className="text-sm text-content-muted">{t('home.noCategories')}</p>
            <code className="mt-3 inline-block rounded-md bg-raised px-3 py-1.5 text-xs text-accent-300">
              python manage.py seed_sports_store
            </code>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
