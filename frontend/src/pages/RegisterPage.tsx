import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function RegisterPage() {
  const { register, error, clearError } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch {
      /* error in context */
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-brand-500/10 bg-surface-card p-8"
      >
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15">
          <UserPlus className="h-6 w-6 text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">{t('register.title')}</h1>
        <p className="mt-2 text-sm text-gray-400">{t('register.subtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-400 mb-1.5">{t('register.firstName')}</label>
              <input
                id="first_name"
                value={form.first_name}
                onChange={(e) => update('first_name', e.target.value)}
                required
                autoComplete="given-name"
                className="w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-2.5 text-white outline-none focus:border-brand-500/40"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-400 mb-1.5">{t('register.lastName')}</label>
              <input
                id="last_name"
                value={form.last_name}
                onChange={(e) => update('last_name', e.target.value)}
                required
                autoComplete="family-name"
                className="w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-2.5 text-white outline-none focus:border-brand-500/40"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">{t('login.email')}</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-2.5 text-white outline-none focus:border-brand-500/40"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-400 mb-1.5">{t('register.phone')}</label>
            <input
              id="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={(e) => update('phone_number', e.target.value)}
              required
              autoComplete="tel"
              placeholder="+48 123 456 789"
              className="w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-2.5 text-white outline-none focus:border-brand-500/40"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">{t('login.password')}</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-2.5 text-white outline-none focus:border-brand-500/40"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            {t('register.submit')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t('register.haveAccount')}{' '}
          <Link to="/logowanie" className="font-medium text-brand-400 hover:text-brand-300">
            {t('register.loginLink')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
