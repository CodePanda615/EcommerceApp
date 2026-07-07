import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter, Routes, Route } from "react-router-dom"

import StoreHome from './store/pages/StoreHome'
import LoginPage from "./store/pages/LoginPage"
import SignupPage from "./store/pages/SignupPage"
import ForgotPasswordPage from "./store/pages/ForgotPasswordPage"
import ProductPage from './store/pages/product/[id]/ProductPage.jsx'
import CartPage from './store/pages/cart/CartPage.jsx'
import CheckoutPage from './store/pages/CheckoutPage.jsx'
import WishlistPage from './store/pages/WishlistPage.jsx'
import OrdersPage from './store/pages/orders/OrdersPage.jsx'
import ProtectedRoute from './store/components/ProtectedRoute.jsx'

import AdminLoginPage from './admin/pages/AdminLoginPage.jsx'
import AdminLayout from './admin/components/AdminLayout.jsx'
import AdminProtectedRoute from './admin/components/AdminProtectedRoute.jsx'
import DashboardPage from './admin/pages/DashboardPage.jsx'
import ProductsPage from './admin/pages/ProductsPage.jsx'
import CategoriesPage from './admin/pages/CategoriesPage.jsx'
import OrdersAdminPage from './admin/pages/OrdersPage.jsx'
import BannersPage from './admin/pages/BannersPage.jsx'
import CouponsPage from './admin/pages/CouponsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/store/login" element={<LoginPage />} />
        <Route path="/store/signup" element={<SignupPage />} />
        <Route path="/store/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/store" element={<StoreHome />} />
        <Route path="/store/product/:id" element={<ProductPage />} />
        <Route path="/store/wishlist" element={<WishlistPage />} />

        <Route path="/store/cart" element={<CartPage />} />
        <Route path="/store/checkout" element={<CheckoutPage />} />

        <Route
          path="/store/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersAdminPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="coupons" element={<CouponsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)