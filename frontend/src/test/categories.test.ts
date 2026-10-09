import { describe, expect, it } from 'vitest'
import { getCategoryVisual, slugifyCategoryName } from '../config/categories'
import { getProductPhoto } from '../config/productImages'

const KNOWN_SLUGS = ['pilki', 'sztangi', 'fitness', 'sporty-zimowe', 'rowery', 'bieganie']

describe('slugifyCategoryName', () => {
  it('matches backend slugs for Polish names', () => {
    expect(slugifyCategoryName('Piłki')).toBe('pilki')
    expect(slugifyCategoryName('Sporty zimowe')).toBe('sporty-zimowe')
    expect(slugifyCategoryName('Bieganie')).toBe('bieganie')
  })
})

describe('getCategoryVisual', () => {
  it('every known category has its own icon', () => {
    const icons = KNOWN_SLUGS.map((slug) => getCategoryVisual(slug).icon)
    icons.forEach((icon) => expect(icon).toBeTruthy())
    expect(new Set(icons).size).toBe(KNOWN_SLUGS.length)
  })

  it('unknown slug falls back to the default visual', () => {
    const fallback = getCategoryVisual('nieznana')
    expect(fallback.icon).toBeTruthy()
    expect(fallback.slug).toBe('nieznana')
  })
})

describe('getProductPhoto', () => {
  it('matches products to local photos by name, not at random', () => {
    expect(getProductPhoto('Narty zjazdowe All-Mountain')).toBe('/products/narty.jpg')
    expect(getProductPhoto('Piłka do piłki nożnej Pro')).toBe('/products/pilka-nozna.jpg')
  })

  it('gives each ball type its own photo', () => {
    const football = getProductPhoto('Piłka do piłki nożnej Pro')
    const basketball = getProductPhoto('Piłka do koszykówki Street')
    const volleyball = getProductPhoto('Piłka do siatkówki Beach')
    expect(new Set([football, basketball, volleyball]).size).toBe(3)
  })

  it('does not give skis to ski poles', () => {
    expect(getProductPhoto('Kijki narciarskie Carbon')).toBe(
      '/products/kijki-narciarskie.jpg',
    )
    expect(getProductPhoto('Narty zjazdowe All-Mountain')).toBe('/products/narty.jpg')
  })

  it('returns null for products without a photo so artwork can take over', () => {
    expect(getProductPhoto('Produkt zupełnie nowy')).toBeNull()
    expect(getProductPhoto('Zestaw taśm oporowych')).toBeNull()
  })

  it('does not give a bike photo to the helmet', () => {
    expect(getProductPhoto('Kask rowerowy Pro')).toBe('/products/kask-rowerowy.jpg')
    expect(getProductPhoto('Rower szosowy Aero')).toBe('/products/rower-szosowy.jpg')
  })

  it('is stable across calls', () => {
    expect(getProductPhoto('Zegarek sportowy GPS')).toBe(
      getProductPhoto('Zegarek sportowy GPS'),
    )
  })
})
