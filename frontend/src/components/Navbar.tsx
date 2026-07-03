import { motion } from 'framer-motion'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, ShoppingBag, User, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-400' : 'text-gray-400 hover:text-white'}`

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-500/30">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            Sport<span className="gradient-text">Store</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Strona główna
          </NavLink>
          <NavLink to="/koszyk" className={navLinkClass}>
            Koszyk
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/zamowienia" className={navLinkClass}>
              Zamówienia
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/koszyk"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated text-gray-300 transition-colors hover:text-brand-400"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Wyloguj
            </button>
          ) : (
            <>
              <Link
                to="/logowanie"
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Zaloguj
              </Link>
              <Link
                to="/rejestracja"
                className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-400"
              >
                Rejestracja
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gray-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-brand-500/10 px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)} end>
              Strona główna
            </NavLink>
            <NavLink to="/koszyk" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Koszyk {itemCount > 0 && `(${itemCount})`}
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/zamowienia" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Zamówienia
                </NavLink>
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                    navigate('/')
                  }}
                  className="flex items-center gap-2 text-sm text-red-400"
                >
                  <LogOut className="h-4 w-4" /> Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link to="/logowanie" className="flex items-center gap-2 text-sm text-gray-300" onClick={() => setMobileOpen(false)}>
                  <User className="h-4 w-4" /> Zaloguj
                </Link>
                <Link to="/rejestracja" className="text-sm font-semibold text-brand-400" onClick={() => setMobileOpen(false)}>
                  Rejestracja
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}
