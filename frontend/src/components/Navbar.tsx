import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, ShoppingBag, User, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import type { Lang } from '../i18n/translations'

const LANGUAGES: Lang[] = ['pl', 'en']

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-0.5 rounded-lg bg-raised p-0.5"
    >
      {LANGUAGES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={`rounded-md px-2 py-1 text-2xs font-bold uppercase tracking-wide transition-colors duration-150 ${
            lang === option
              ? 'bg-accent-400 text-accent-ink'
              : 'text-content-subtle hover:text-content'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function CartButton({ count }: { count: number }) {
  const { t } = useLanguage()

  return (
    <Link
      to="/koszyk"
      aria-label={`${t('nav.cart')}${count > 0 ? ` (${count})` : ''}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-raised text-content-muted transition-colors duration-150 hover:bg-overlay hover:text-content"
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="count"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.34, 1.26, 0.64, 1] }}
            className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-400 px-1 text-2xs font-bold tabular-nums text-accent-ink"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors duration-150 ${
      isActive ? 'text-content' : 'text-content-muted hover:text-content'
    }`

  const mobileLink = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-raised text-content' : 'text-content-muted hover:bg-raised'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400 text-accent-ink">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </span>
          <span className="text-base font-bold tracking-tight">
            Motion<span className="text-accent-400">Gear</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={desktopLink} end>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/koszyk" className={desktopLink}>
            {t('nav.cart')}
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/zamowienia" className={desktopLink}>
              {t('nav.orders')}
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <CartButton count={itemCount} />

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-content-muted transition-colors duration-150 hover:bg-raised hover:text-danger"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              {t('nav.logout')}
            </button>
          ) : (
            <>
              <Link
                to="/logowanie"
                className="flex h-10 items-center rounded-lg px-3 text-sm font-medium text-content-muted transition-colors duration-150 hover:bg-raised hover:text-content"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/rejestracja"
                className="flex h-10 items-center rounded-lg bg-accent-400 px-4 text-sm font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-300"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <CartButton count={itemCount} />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-raised text-content-muted transition-colors hover:text-content"
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <Menu className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <NavLink
                to="/"
                className={mobileLink}
                onClick={() => setMobileOpen(false)}
                end
              >
                {t('nav.home')}
              </NavLink>
              <NavLink
                to="/koszyk"
                className={mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                {t('nav.cart')}
                {itemCount > 0 && ` (${itemCount})`}
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/zamowienia"
                    className={mobileLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t('nav.orders')}
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-raised"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/logowanie"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-content-muted transition-colors hover:bg-raised"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="h-4 w-4" strokeWidth={1.75} />
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/rejestracja"
                    className="mt-1 flex items-center justify-center rounded-lg bg-accent-400 px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
