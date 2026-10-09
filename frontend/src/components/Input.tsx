import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: ReactNode
  error?: string | null
  hint?: ReactNode
}

const FIELD =
  'h-11 w-full rounded-lg border bg-raised px-3.5 text-sm text-content ' +
  'placeholder:text-content-subtle transition-colors duration-150 ' +
  'hover:border-line-strong focus:outline-none'

export default function Input({
  label,
  error,
  hint,
  className = '',
  ...props
}: InputProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const border = error
    ? 'border-danger/50 focus:border-danger'
    : 'border-line focus:border-accent-400'

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-content-muted"
      >
        {label}
      </label>
      <input
        id={id}
        className={`${FIELD} ${border}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-content-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
