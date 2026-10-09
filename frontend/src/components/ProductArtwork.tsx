import {
  Bike,
  CircleDot,
  Dumbbell,
  Footprints,
  HardHat,
  HeartPulse,
  Mountain,
  Snowflake,
  Timer,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { normalizeProductName } from '../config/categories'

interface ProductArtworkProps {
  name: string
  categorySlug: string
  className?: string
}

const ICON_RULES: Array<{ keywords: string[]; icon: LucideIcon }> = [
  { keywords: ['nozn', 'koszyk', 'siatk', 'beach', 'pilk'], icon: CircleDot },
  { keywords: ['sztang', 'hantl', 'gryf', 'lawk', 'kettlebell'], icon: Dumbbell },
  { keywords: ['mata', 'jog', 'tasm', 'oporow'], icon: HeartPulse },
  { keywords: ['kijk', 'nart'], icon: Snowflake },
  { keywords: ['snowboard', 'desk'], icon: Mountain },
  { keywords: ['kask'], icon: HardHat },
  { keywords: ['rower', 'szosow', 'gorsk'], icon: Bike },
  { keywords: ['but'], icon: Footprints },
  { keywords: ['zegarek', 'gps'], icon: Timer },
  { keywords: ['opask', 'bidon'], icon: Waves },
]

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  pilki: CircleDot,
  sztangi: Dumbbell,
  fitness: HeartPulse,
  'sporty-zimowe': Snowflake,
  rowery: Bike,
  bieganie: Footprints,
}

// Spread across the wheel so neighbouring products never look alike
const HUES = [152, 198, 262, 322, 18, 42, 96, 228]

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

function pickIcon(normalized: string, categorySlug: string): LucideIcon {
  const rule = ICON_RULES.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  )
  return rule?.icon ?? CATEGORY_ICONS[categorySlug] ?? CircleDot
}

export default function ProductArtwork({
  name,
  categorySlug,
  className = '',
}: ProductArtworkProps) {
  const normalized = normalizeProductName(name)
  const Icon = pickIcon(normalized, categorySlug)
  const hash = hashString(normalized || categorySlug)
  const hue = HUES[hash % HUES.length]
  const offset = (hash >> 3) % 24
  const blobX = 20 + ((hash >> 5) % 60)
  const blobY = 15 + ((hash >> 9) % 50)

  return (
    <div
      aria-hidden="true"
      className={`relative isolate flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(150deg, hsl(${hue} 34% 16%) 0%, hsl(${
          hue + offset
        } 30% 9%) 100%)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at ${blobX}% ${blobY}%, hsl(${hue} 85% 58% / 0.34), transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 9px)',
        }}
      />

      <div
        className="relative flex h-[44%] w-[44%] items-center justify-center rounded-2xl"
        style={{
          backgroundColor: `hsl(${hue} 70% 62% / 0.16)`,
          boxShadow: `inset 0 0 0 1px hsl(${hue} 80% 70% / 0.28)`,
        }}
      >
        <Icon
          className="h-1/2 w-1/2"
          strokeWidth={2}
          style={{ color: `hsl(${hue} 85% 76%)` }}
        />
      </div>
    </div>
  )
}
