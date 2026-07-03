export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface Product {
  id: number
  name: string
  description: string
  price: string
  stock: number
  created_at: string
  category: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
  total_price: string
}

export interface Cart {
  id: number
  items: CartItem[]
  total_cart_price: string
}

export interface OrderItem {
  id: number
  product_name: string
  quantity: number
  price: string
  total_price: string
}

export interface Order {
  id: number
  created_at: string
  is_paid: boolean
  address: string
  user_phone_number: string
  items: OrderItem[]
  total_order_price: string
}

export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number: string
}

export interface ApiError {
  detail?: string | string[]
  [key: string]: unknown
}
