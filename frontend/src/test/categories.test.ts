import { describe, expect, it } from 'vitest'
import {
  getCategoryVisual,
  getProductImage,
  slugifyCategoryName,
} from '../config/categories'

const KNOWN_SLUGS = ['pilki', 'sztangi', 'fitness', 'sporty-zimowe', 'rowery', 'bieganie']

describe('slugifyCategoryName', () => {
  it('matches backend slugs for Polish names', () => {
    expect(slugifyCategoryName('Piłki')).toBe('pilki')
    expect(slugifyCategoryName('Sporty zimowe')).toBe('sporty-zimowe')
    expect(slugifyCategoryName('Bieganie')).toBe('bieganie')
  })
})

describe('getCategoryVisual', () => {
  it('every known category has a real image URL (not an HTML page)', () => {
    for (const slug of KNOWN_SLUGS) {
      const { image } = getCategoryVisual(slug)
      expect(image).toMatch(/^https:\/\/images\.unsplash\.com\//)
      expect(image).not.toContain('google.com')
    }
  })

  it('unknown slug falls back to the default visual', () => {
    expect(getCategoryVisual('nieznana').image).toMatch(
      /^https:\/\/images\.unsplash\.com\//,
    )
  })
})

describe('getProductImage', () => {
  it('matches products to photos by name, not at random', () => {
    const ski = getProductImage('Narty zjazdowe All-Mountain', 'sporty-zimowe')
    const football = getProductImage('Piłka do piłki nożnej Pro', 'pilki')
    expect(ski).not.toBe(football)
    expect(football).toContain('1575361204480')
  })

  it('distinguishes products within the same category', () => {
    const football = getProductImage('Piłka do piłki nożnej Pro', 'pilki')
    const basketball = getProductImage('Piłka do koszykówki Street', 'pilki')
    const volleyball = getProductImage('Piłka do siatkówki Beach', 'pilki')
    expect(new Set([football, basketball, volleyball]).size).toBe(3)
  })

  it('helmet gets a cycling photo, not a generic bike', () => {
    const helmet = getProductImage('Kask rowerowy Pro', 'rowery')
    const mtb = getProductImage('Rower górski Trail X', 'rowery')
    expect(helmet).not.toBe(mtb)
  })

  it('ski poles do not reuse the ski product photo', () => {
    const poles = getProductImage('Kijki narciarskie Carbon', 'sporty-zimowe')
    const ski = getProductImage('Narty zjazdowe All-Mountain', 'sporty-zimowe')
    expect(poles).not.toBe(ski)
  })

  it('unmatched product falls back to its category image', () => {
    const fallback = getProductImage('Produkt zupełnie nowy', 'pilki')
    expect(fallback).toBe(getCategoryVisual('pilki').image)
  })

  it('is deterministic for the same product', () => {
    const a = getProductImage('Zegarek sportowy GPS', 'bieganie')
    const b = getProductImage('Zegarek sportowy GPS', 'bieganie')
    expect(a).toBe(b)
  })
})
