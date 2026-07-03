import type { LucideIcon } from 'lucide-react'
import {
  Bike,
  CircleDot,
  Dumbbell,
  Footprints,
  HeartPulse,
  Snowflake,
} from 'lucide-react'

export interface CategoryVisual {
  slug: string
  icon: LucideIcon
  gradient: string
  image: string
}

const CATEGORY_MAP: Record<string, Omit<CategoryVisual, 'slug'>> = {
  pilki: {
    icon: CircleDot,
    gradient: 'from-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80',
  },
  sztangi: {
    icon: Dumbbell,
    gradient: 'from-orange-500 to-red-600',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  },
  fitness: {
    icon: HeartPulse,
    gradient: 'from-violet-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  },
  'sporty-zimowe': {
    icon: Snowflake,
    gradient: 'from-sky-400 to-blue-600',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80',
  },
  rowery: {
    icon: Bike,
    gradient: 'from-lime-500 to-green-600',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&q=80',
  },
  bieganie: {
    icon: Footprints,
    gradient: 'from-amber-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80',
  },
}

const DEFAULT_VISUAL: Omit<CategoryVisual, 'slug'> = {
  icon: CircleDot,
  gradient: 'from-brand-400 to-brand-600',
  image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
}

export function getCategoryVisual(slug: string): CategoryVisual {
  const visual = CATEGORY_MAP[slug] ?? DEFAULT_VISUAL
  return { slug, ...visual }
}

// Mirrors backend slug generation: NFD strips Polish diacritics
// (ą→a, ś→s, …) except ł, which does not decompose and is mapped manually.
export function slugifyCategoryName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

export function getCategoryVisualByName(name: string): CategoryVisual {
  return getCategoryVisual(slugifyCategoryName(name))
}

/**
 * Product photos matched by keywords in the (normalized) product name,
 * so skis never get a football photo. First matching rule wins;
 * unmatched products fall back to their category image.
 */
const PRODUCT_IMAGE_RULES: Array<{ keywords: string[]; image: string }> = [
  // Piłki
  { keywords: ['nozn'], image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80' },
  { keywords: ['koszyk'], image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80' },
  { keywords: ['siatk', 'beach'], image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80' },
  // Sztangi / trening siłowy
  { keywords: ['sztang', 'olimpijsk'], image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80' },
  { keywords: ['hantl'], image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  { keywords: ['gryf', 'lawk'], image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80' },
  // Fitness
  { keywords: ['mata', 'jog'], image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80' },
  { keywords: ['tasm', 'oporow'], image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80' },
  { keywords: ['kettlebell'], image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=600&q=80' },
  // Sporty zimowe (kijki przed nartami — "kijki narciarskie")
  { keywords: ['kijk'], image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=600&q=80' },
  { keywords: ['nart'], image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80' },
  { keywords: ['snowboard', 'desk'], image: 'https://images.unsplash.com/photo-1522056615691-da7b8106c665?w=600&q=80' },
  // Rowery (kask przed rowerami — "kask rowerowy")
  { keywords: ['kask'], image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80' },
  { keywords: ['szosow'], image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&q=80' },
  { keywords: ['rower', 'gorsk'], image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&q=80' },
  // Bieganie
  { keywords: ['but'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { keywords: ['opask', 'bidon'], image: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&q=80' },
  { keywords: ['zegarek', 'gps'], image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
]

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function getProductImage(productName: string, categorySlug: string): string {
  const normalized = normalizeName(productName)
  const rule = PRODUCT_IMAGE_RULES.find(({ keywords }) =>
    keywords.some((kw) => normalized.includes(kw)),
  )
  return rule?.image ?? getCategoryVisual(categorySlug).image
}
