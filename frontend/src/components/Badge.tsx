import type { ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'warn' | 'danger'

interface BadgeProps {
  tone?: Tone
  /** Opaque background, for badges that sit on top of a photo. */
  solid?: boolean
  children: ReactNode
  className?: string
}

const tones: Record<Tone, string> = {
  neutral: 'bg-raised text-content-muted border-line',
  accent: 'bg-accent-400/12 text-accent-300 border-accent-400/25',
  warn: 'bg-warn/12 text-warn border-warn/25',
  danger: 'bg-danger/12 text-danger border-danger/25',
}

const solidTones: Record<Tone, string> = {
  neutral: 'bg-ink/90 text-content border-line',
  accent: 'bg-accent-400 text-accent-ink border-transparent',
  warn: 'bg-warn text-warn-ink border-transparent',
  danger: 'bg-danger text-danger-ink border-transparent',
}

export default function Badge({
  tone = 'neutral',
  solid = false,
  children,
  className = '',
}: BadgeProps) {
  const palette = solid ? solidTones[tone] : tones[tone]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-2xs font-semibold tracking-wide ${palette} ${className}`}
    >
      {children}
    </span>
  )
}
