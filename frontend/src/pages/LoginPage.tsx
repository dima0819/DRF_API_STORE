import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch {
      /* error set in context */
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
          <LogIn className="h-6 w-6 text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Zaloguj się</h1>
        <p className="mt-2 text-sm text-gray-400">
          Zaloguj się, aby korzystać z koszyka i składać zamówienia
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-2.5 text-white outline-none focus:border-brand-500/40"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-brand-500/15 bg-surface-elevated px-4 py-2.5 text-white outline-none focus:border-brand-500/40"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Zaloguj się
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Nie masz konta?{' '}
          <Link to="/rejestracja" className="font-medium text-brand-400 hover:text-brand-300">
            Zarejestruj się
          </Link>
        </p>
        <Link
          to="/"
          className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-400"
        >
          ← Kontynuuj bez logowania
        </Link>
      </motion.div>
    </div>
  )
}
