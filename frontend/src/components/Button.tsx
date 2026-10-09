import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

// framer-motion's motion.button redefines these DOM handlers with its own
// signatures, so they must be excluded before spreading props into it
interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent-400 text-accent-ink hover:bg-accent-300 active:bg-accent-500 shadow-mid',
  secondary:
    'bg-raised text-content border border-line hover:border-line-strong hover:bg-overlay',
  ghost: 'bg-transparent text-content-muted hover:bg-raised hover:text-content',
  danger:
    'bg-danger/12 text-danger border border-danger/25 hover:bg-danger/20 hover:border-danger/40',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-xs gap-1.5 rounded-md',
  md: 'h-11 px-5 text-sm gap-2 rounded-lg',
  lg: 'h-13 px-7 text-base gap-2.5 rounded-xl',
}

const BASE =
  'relative inline-flex select-none items-center justify-center font-semibold ' +
  'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45'

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const inert = disabled || loading

  return (
    <motion.button
      whileHover={inert ? undefined : { y: -1 }}
      whileTap={inert ? undefined : { y: 0, scale: 0.985 }}
      transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
      className={`${BASE} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={inert}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </motion.button>
  )
}
