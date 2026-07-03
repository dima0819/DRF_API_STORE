import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import HomePage from '../pages/HomePage'
import { Providers } from './utils'
import { sampleCategories } from './fixtures'
import { fetchCategories } from '../api/products'

vi.mock('../api/products', () => ({
  fetchCategories: vi.fn(),
  fetchCategory: vi.fn(),
  fetchProducts: vi.fn(),
  fetchProduct: vi.fn(),
}))

function renderHome() {
  return render(
    <Providers>
      <HomePage />
    </Providers>,
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(fetchCategories).mockReset()
  })

  it('renders category cards linking to their pages', async () => {
    vi.mocked(fetchCategories).mockResolvedValue(sampleCategories)

    renderHome()

    const link = await screen.findByRole('link', { name: /Piłki/ })
    expect(link).toHaveAttribute('href', '/kategoria/pilki')
    expect(screen.getByRole('link', { name: /Sporty zimowe/ })).toHaveAttribute(
      'href',
      '/kategoria/sporty-zimowe',
    )
  })

  it('shows the seed hint when there are no categories', async () => {
    vi.mocked(fetchCategories).mockResolvedValue([])

    renderHome()

    expect(
      await screen.findByText(/Uruchom seed danych w backendzie/),
    ).toBeInTheDocument()
    expect(screen.getByText('python manage.py seed_sports_store')).toBeInTheDocument()
  })
})
