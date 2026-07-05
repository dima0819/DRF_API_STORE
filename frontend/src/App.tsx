import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './context/ToastContext'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OrdersPage from './pages/OrdersPage'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="kategoria/:slug" element={<CategoryPage />} />
                <Route path="produkt/:id" element={<ProductDetailPage />} />
                <Route path="koszyk" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="logowanie" element={<LoginPage />} />
                <Route path="rejestracja" element={<RegisterPage />} />
                <Route path="zamowienia" element={<OrdersPage />} />
              </Route>
            </Routes>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
