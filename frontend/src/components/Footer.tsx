import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-9 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-raised text-accent-400">
            <ShoppingBag className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-sm font-semibold">
            Motion<span className="text-accent-400">Gear</span>
          </span>
        </div>

        <p className="order-3 text-xs text-content-subtle sm:order-none">
          © {new Date().getFullYear()} MotionGear — {t('footer.tagline')}
        </p>

        <nav className="flex gap-5 text-xs text-content-muted">
          <Link to="/" className="transition-colors hover:text-accent-300">
            {t('footer.categories')}
          </Link>
          <Link to="/koszyk" className="transition-colors hover:text-accent-300">
            {t('nav.cart')}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
