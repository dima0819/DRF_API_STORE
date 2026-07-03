import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Trophy, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../api/products'
import CategoryCard from '../components/CategoryCard'
import type { Category } from '../types'

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-[10%] h-64 w-64 rounded-full bg-brand-500/10 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 left-[5%] h-48 w-48 rounded-full bg-teal-500/10 blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300">
              <Sparkles className="h-4 w-4" />
              Nowa kolekcja 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Osiągnij swój{' '}
            <span className="gradient-text">sportowy</span>
            <br />
            potencjał
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-400"
          >
            Odkryj profesjonalny sprzęt sportowy — piłki, sztangi, rowery i więcej.
            Wybierz kategorię i znajdź idealny sprzęt dla siebie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#kategorie"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-400 hover:shadow-brand-400/30"
            >
              Przeglądaj kategorie
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/koszyk"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-500/20 bg-surface-elevated px-6 py-3 font-semibold text-brand-300 transition-all hover:border-brand-500/40"
            >
              Koszyk
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { icon: Trophy, label: '500+ produktów' },
              { icon: Zap, label: 'Szybka dostawa' },
              { icon: Sparkles, label: 'Top marki' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section id="kategorie" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Wybierz <span className="gradient-text">kategorię</span>
            </h2>
            <p className="mt-3 text-gray-400">
              Przeglądaj sprzęt według dyscypliny sportowej
            </p>
          </motion.div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-surface-card" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl border border-brand-500/10 bg-surface-card p-12 text-center">
              <p className="text-gray-400">Brak kategorii. Uruchom seed danych w backendzie.</p>
              <code className="mt-2 block text-sm text-brand-400">
                python manage.py seed_sports_store
              </code>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
