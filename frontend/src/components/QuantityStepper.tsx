import { Minus, Plus } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface QuantityStepperProps {
  quantity: number
  max: number
  onChange: (quantity: number) => void
}

const STEP_BUTTON =
  'flex h-9 w-9 items-center justify-center text-content-muted transition-colors ' +
  'hover:text-content disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-content-muted'

export default function QuantityStepper({
  quantity,
  max,
  onChange,
}: QuantityStepperProps) {
  const { t } = useLanguage()

  return (
    <div className="flex items-center rounded-lg border border-line bg-raised">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        className={STEP_BUTTON}
        aria-label={t('product.decrease')}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        className={STEP_BUTTON}
        aria-label={t('product.increase')}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  )
}
