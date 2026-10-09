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
}

const CATEGORY_MAP: Record<string, Omit<CategoryVisual, 'slug'>> = {
  pilki: {
    icon: CircleDot,
    gradient: 'from-emerald-500 to-teal-600',
  },
  sztangi: {
    icon: Dumbbell,
    gradient: 'from-orange-500 to-red-600',
  },
  fitness: {
    icon: HeartPulse,
    gradient: 'from-violet-500 to-purple-600',
  },
  'sporty-zimowe': {
    icon: Snowflake,
    gradient: 'from-sky-400 to-blue-600',
  },
  rowery: {
    icon: Bike,
    gradient: 'from-lime-500 to-green-600',
  },
  bieganie: {
    icon: Footprints,
    gradient: 'from-amber-400 to-orange-500',
  },
}

const DEFAULT_VISUAL: Omit<CategoryVisual, 'slug'> = {
  icon: CircleDot,
  gradient: 'from-accent-400 to-accent-600',
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

export function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
