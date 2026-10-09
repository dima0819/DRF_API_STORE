import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from '../components/ProductCard'
import { LanguageProvider } from '../context/LanguageContext'
import { makeProduct } from './fixtures'

function renderCard(...props: Parameters<typeof ProductCard>) {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <ProductCard {...props[0]} />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('renders name, category and formatted price', () => {
    const product = makeProduct()
    renderCard({ product })

    expect(screen.getByText('Piłka do piłki nożnej Pro')).toBeInTheDocument()
    expect(screen.getByText('Piłki')).toBeInTheDocument()
    expect(screen.getByText(/89,99/)).toBeInTheDocument()
  })

  it('links to the product detail page', () => {
    renderCard({ product: makeProduct({ id: 42 }) })

    const links = screen.getAllByRole('link', { name: /Piłka do piłki nożnej Pro/ })
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/produkt/42'))
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
