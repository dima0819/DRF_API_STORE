import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function LoginPage() {
  const { login, error, clearError } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
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
    <AuthCard
      icon={LogIn}
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      error={error}
      footer={
        <>
          <p>
            {t('login.noAccount')}{' '}
            <Link
              to="/rejestracja"
              className="font-semibold text-accent-300 transition-colors hover:text-accent-200"
            >
              {t('login.registerLink')}
            </Link>
          </p>
          <Link
            to="/"
            className="mt-3 inline-block text-xs text-content-subtle transition-colors hover:text-content-muted"
          >
            {t('login.continueGuest')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label={t('login.email')}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label={t('login.password')}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" loading={loading} className="w-full">
          {t('login.title')}
        </Button>
      </form>
    </AuthCard>
  )
}
