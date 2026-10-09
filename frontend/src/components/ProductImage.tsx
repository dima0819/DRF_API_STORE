import { useState } from 'react'
import { getProductPhoto } from '../config/productImages'
import ProductArtwork from './ProductArtwork'

// Every file in /public/products is normalised to this size, so declaring it
// lets the browser reserve the box before the image arrives (no layout shift).
const PHOTO_WIDTH = 800
const PHOTO_HEIGHT = 600

interface ProductImageProps {
  name: string
  categorySlug: string
  className?: string
  sizes?: string
  priority?: boolean
}

export default function ProductImage({
  name,
  categorySlug,
  className = '',
  sizes,
  priority = false,
}: ProductImageProps) {
  const photo = getProductPhoto(name)
  const [failed, setFailed] = useState(false)

  if (!photo || failed) {
    return (
      <ProductArtwork
        name={name}
        categorySlug={categorySlug}
        className={className}
      />
    )
  }

  return (
    <img
      src={photo}
      alt={name}
      width={PHOTO_WIDTH}
      height={PHOTO_HEIGHT}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`bg-raised object-cover ${className}`}
    />
  )
}
