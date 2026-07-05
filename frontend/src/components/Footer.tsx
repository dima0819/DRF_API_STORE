import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-brand-500/10 bg-surface-light">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-brand-500" />
          <span className="font-semibold text-gray-300">
            Motion<span className="text-brand-400">Gear</span>
          </span>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} MotionGear — {t('footer.tagline')}
        </p>
        <div className="flex gap-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-brand-400 transition-colors">{t('footer.categories')}</Link>
          <Link to="/koszyk" className="hover:text-brand-400 transition-colors">{t('nav.cart')}</Link>
        </div>
      </div>
    </footer>
  )
}
