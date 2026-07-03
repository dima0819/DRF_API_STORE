import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-500/10 bg-surface-light">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-brand-500" />
          <span className="font-semibold text-gray-300">
            Sport<span className="text-brand-400">Store</span>
          </span>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} SportStore — Twój sklep ze sprzętem sportowym
        </p>
        <div className="flex gap-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-brand-400 transition-colors">Kategorie</Link>
          <Link to="/koszyk" className="hover:text-brand-400 transition-colors">Koszyk</Link>
        </div>
      </div>
    </footer>
  )
}
