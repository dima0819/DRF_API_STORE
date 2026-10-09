import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  children?: ReactNode
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      className="mx-auto max-w-md rounded-xl border border-line bg-surface px-6 py-14 text-center"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-raised text-content-subtle">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <h1 className="mt-5 text-xl font-bold tracking-tight">{title}</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-content-muted">
        {description}
      </p>
      {children && <div className="mt-7">{children}</div>}
    </motion.div>
  )
}
