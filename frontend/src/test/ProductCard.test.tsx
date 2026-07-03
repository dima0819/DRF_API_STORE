import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from '../components/ProductCard'
import { getProductImage } from '../config/categories'
import { makeProduct } from './fixtures'

function renderCard(...props: Parameters<typeof ProductCard>) {
  return render(
    <MemoryRouter>
      <ProductCard {...props[0]} />
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('renders name, category, formatted price and a matching photo', () => {
    const product = makeProduct()
    renderCard({ product })

    expect(screen.getByText('Piłka do piłki nożnej Pro')).toBeInTheDocument()
    expect(screen.getByText('Piłki')).toBeInTheDocument()
    expect(screen.getByText(/89,99/)).toBeInTheDocument()

    const img = screen.getByRole('img', { name: 'Piłka do piłki nożnej Pro' })
    expect(img).toHaveAttribute(
      'src',
      getProductImage('Piłka do piłki nożnej Pro', 'pilki'),
    )
  })

  it('marks out-of-stock products and disables adding to cart', () => {
    renderCard({ product: makeProduct({ stock: 0 }) })

    expect(screen.getByText('Brak na stanie')).toBeInTheDocument()
    expect(screen.getByLabelText('Dodaj do koszyka')).toBeDisabled()
  })

  it('shows the low-stock badge', () => {
    renderCard({ product: makeProduct({ stock: 3 }) })
    expect(screen.getByText('Ostatnie sztuki')).toBeInTheDocument()
  })

  it('fires onAddToCart when the cart button is clicked', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    renderCard({ product: makeProduct(), onAddToCart })

    await user.click(screen.getByLabelText('Dodaj do koszyka'))

    expect(onAddToCart).toHaveBeenCalledTimes(1)
  })
})
