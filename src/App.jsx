
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { useEffect, useState } from 'react'

import { supabase } from './lib/supabase'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Products from './components/Products'
import CompareBar from './components/CompareBar'

import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import ProductDetails from './pages/ProductDetails'
import ProductComparison from './pages/ProductComparison'

import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import AdminHealthReports from './pages/AdminHealthReports'
import AdminInventory from './pages/AdminInventory'

// Supabase Admin User ID
const ADMIN_UID = '2b1c868a-2af0-4b4a-a5b5-c22794195215'

// Homepage
function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Products />
    </>
  )
}

// Protected Admin Route
function ProtectedAdminRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (!mounted) return

        if (session?.user?.id === ADMIN_UID) {
          setUser(session.user)
        } else {
          setUser(null)

          if (session) {
            await supabase.auth.signOut()
          }
        }

      } catch (error) {
        console.error('Admin session error:', error)

        if (mounted) {
          setUser(null)
        }

      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return

        if (session?.user?.id === ADMIN_UID) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

// Main App
function App() {
  return (
    <BrowserRouter>

      <Navbar />

      {/* Floating comparison bar */}
      <CompareBar />

      <Routes>

        {/* Homepage */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Shop */}
        <Route
          path="/shop"
          element={<Products />}
        />

        {/* Product Details */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* Product Comparison */}
        <Route
          path="/compare"
          element={<ProductComparison />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Customer Order Tracking */}
        <Route
          path="/track-order"
          element={<TrackOrder />}
        />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }
        />

        {/* Protected Device Health Reports */}
        <Route
          path="/admin/health-reports"
          element={
            <ProtectedAdminRoute>
              <AdminHealthReports />
            </ProtectedAdminRoute>
          }
        />

        {/* Protected Inventory Management */}
        <Route
          path="/admin/inventory"
          element={
            <ProtectedAdminRoute>
              <AdminInventory />
            </ProtectedAdminRoute>
          }
        />

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App
