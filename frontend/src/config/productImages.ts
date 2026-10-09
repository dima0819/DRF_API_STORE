import { normalizeProductName } from './categories'

/**
 * Local product photos live in /public/products. Matching is keyword-based on
 * the normalized product name, so a new product with a familiar name picks up
 * the right photo automatically. Products without a match render the generated
 * artwork instead.
 */
const PHOTO_RULES: Array<{ keywords: string[]; file: string }> = [
  { keywords: ['nozn'], file: 'pilka-nozna' },
  { keywords: ['koszyk'], file: 'pilka-koszykowka' },
  { keywords: ['siatk', 'beach'], file: 'pilka-siatkowka' },
  { keywords: ['sztanga', 'olimpijsk'], file: 'sztanga-olimpijska' },
  { keywords: ['hantl'], file: 'hantle' },
  { keywords: ['gryf'], file: 'gryf' },
  { keywords: ['mata', 'jog'], file: 'mata-jogi' },
  { keywords: ['kettlebell'], file: 'kettlebell' },
  { keywords: ['kijk'], file: 'kijki-narciarskie' },
  { keywords: ['nart'], file: 'narty' },
  { keywords: ['snowboard'], file: 'snowboard' },
  { keywords: ['but'], file: 'buty-biegowe' },
  { keywords: ['zegarek', 'gps'], file: 'zegarek-gps' },
  { keywords: ['kask'], file: 'kask-rowerowy' },
  { keywords: ['szosow'], file: 'rower-szosowy' },
  { keywords: ['gorsk', 'trail'], file: 'rower-gorski' },
]

export function getProductPhoto(productName: string): string | null {
  const normalized = normalizeProductName(productName)
  const rule = PHOTO_RULES.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  )
  return rule ? `/products/${rule.file}.jpg` : null
}
