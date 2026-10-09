import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthCardProps {
  icon: LucideIcon
  title: string
  subtitle: string
  error?: string | null
  children: ReactNode
  footer: ReactNode
}

export default function AuthCard({
  icon: Icon,
  title,
  subtitle,
  error,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-14 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        className="rounded-xl border border-line bg-surface p-7 shadow-mid"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-raised text-accent-300">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>

        <h1 className="mt-5 text-xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-content-muted">{subtitle}</p>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-danger/25 bg-danger/12 px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        )}

        {children}

        <div className="mt-6 border-t border-line pt-5 text-center text-sm text-content-muted">
          {footer}
        </div>
      </motion.div>
    </div>
  )
}
