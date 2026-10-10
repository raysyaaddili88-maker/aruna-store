import { useEffect, useState } from 'react'
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import Footer from './components/Footer'
import Header from './components/Header'
import WhatsAppFloat from './components/WhatsAppFloat'

import { ToastProvider } from './context/ToastContext'
import { StoreProvider, useStoreValue } from './context/StoreContext'

import { isAdmin } from './services/authService'
import { getSettings } from './services/settingsService'

import AdminBanners from './pages/AdminBanners'
import AdminCtaSettings from './pages/AdminCtaSettings'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminProductForm from './pages/AdminProductForm'
import AdminProducts from './pages/AdminProducts'
import AdminWhatsAppSettings from './pages/AdminWhatsAppSettings'
import AdminWebsiteSettings from './pages/AdminWebsiteSettings'

import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'

function RequireAdmin() {
  const [status, setStatus] = useState('checking')
  const location = useLocation()

  useEffect(() => {
    let active = true

    isAdmin()
      .then((allowed) => {
        if (active) {
          setStatus(allowed ? 'authenticated' : 'unauthenticated')
        }
      })
      .catch(() => {
        if (active) {
          setStatus('unauthenticated')
        }
      })

    return () => {
      active = false
    }
  }, [location.pathname])

  if (status === 'checking') {
    return (
      <div className="p-8 text-center">
        Memeriksa akses admin...
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}

function FaviconSync() {
  const settings = useStoreValue(getSettings)

  useEffect(() => {
    if (!settings.favicon) return

    let link = document.querySelector("link[rel='icon']")

    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }

    link.href = settings.favicon
  }, [settings.favicon])

  return null
}

function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <ScrollToTop />
        <FaviconSync />

        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/product/:slug"
              element={<ProductDetail />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route element={<RequireAdmin />}>
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />
            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />
            <Route
              path="/admin/products/new"
              element={<AdminProductForm />}
            />
            <Route
              path="/admin/products/:id/edit"
              element={<AdminProductForm />}
            />
            <Route
              path="/admin/banners"
              element={<AdminBanners />}
            />
            <Route
              path="/admin/settings/cta"
              element={<AdminCtaSettings />}
            />
            <Route
              path="/admin/settings/whatsapp"
              element={<AdminWhatsAppSettings />}
            />
            <Route
              path="/admin/settings/website"
              element={<AdminWebsiteSettings />}
            />
            <Route
              path="/admin/*"
              element={<Navigate to="/admin" replace />}
            />
          </Route>
        </Routes>
      </ToastProvider>
    </StoreProvider>
  )
}

