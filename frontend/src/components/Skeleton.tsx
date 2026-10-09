interface SkeletonProps {
  className?: string
  rounded?: 'md' | 'lg' | 'xl' | 'full'
}

const radii = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const

export default function Skeleton({
  className = '',
  rounded = 'lg',
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-raised ${radii[rounded]} ${className}`}
    />
  )
}
