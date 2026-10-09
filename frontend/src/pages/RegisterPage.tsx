import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import type { RegisterData } from '../types'

const EMPTY_FORM: RegisterData = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  password: '',
}

const MIN_PASSWORD_LENGTH = 8

export default function RegisterPage() {
  const { register, error, clearError } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState<RegisterData>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const update = (field: keyof RegisterData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    clearError()
    setLoading(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch {
      /* error set in context */
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      icon={UserPlus}
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      error={error}
      footer={
        <p>
          {t('register.haveAccount')}{' '}
          <Link
            to="/logowanie"
            className="font-semibold text-accent-300 transition-colors hover:text-accent-200"
          >
            {t('register.loginLink')}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('register.firstName')}
            value={form.first_name}
            onChange={(event) => update('first_name', event.target.value)}
            required
            autoComplete="given-name"
          />
          <Input
            label={t('register.lastName')}
            value={form.last_name}
            onChange={(event) => update('last_name', event.target.value)}
            required
            autoComplete="family-name"
          />
        </div>
        <Input
          label={t('login.email')}
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label={t('register.phone')}
          type="tel"
          value={form.phone_number}
          onChange={(event) => update('phone_number', event.target.value)}
          required
          autoComplete="tel"
          placeholder="+48 123 456 789"
        />
        <Input
          label={t('login.password')}
          type="password"
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          required
          minLength={MIN_PASSWORD_LENGTH}
          autoComplete="new-password"
          hint={t('register.passwordHint', { n: MIN_PASSWORD_LENGTH })}
        />
        <Button type="submit" loading={loading} className="w-full">
          {t('register.submit')}
        </Button>
      </form>
    </AuthCard>
  )
}
