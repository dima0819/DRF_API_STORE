import { apiFetch } from './client'
import type { Category, PaginatedResponse, Product } from '../types'

export async function fetchCategories(): Promise<Category[]> {
  const data = await apiFetch<PaginatedResponse<Category> | Category[]>(
    '/api/v1/store/categories/?page_size=50',
  )
  return Array.isArray(data) ? data : data.results
}

export async function fetchCategory(slug: string): Promise<Category | undefined> {
  const categories = await fetchCategories()
  return categories.find((c) => c.slug === slug)
}

export async function fetchProducts(params?: {
  category?: string
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams()
  if (params?.category) query.set('category', params.category)
  if (params?.search) query.set('search', params.search)
  if (params?.ordering) query.set('ordering', params.ordering)
  if (params?.page) query.set('page', String(params.page))
  query.set('page_size', String(params?.page_size ?? 50))

  return apiFetch<PaginatedResponse<Product>>(`/api/v1/store/?${query}`)
}

export async function fetchProduct(id: number): Promise<Product> {
  return apiFetch<Product>(`/api/v1/store/${id}/`)
}
