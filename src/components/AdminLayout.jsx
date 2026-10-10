
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  PlusCircle,
  Settings,
  Store,
  X,
  Zap,
} from 'lucide-react'

import { useToast } from '../context/ToastContext'
import { useStoreValue } from '../context/StoreContext'
import { logout } from '../services/authService'
import { getSettings } from '../services/settingsService'

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Produk', icon: Package },
  { to: '/admin/products/new', label: 'Tambah Produk', icon: PlusCircle },
  { to: '/admin/banners', label: 'Banner', icon: Image },
  { to: '/admin/settings/cta', label: 'CTA Settings', icon: Zap },
  {
    to: '/admin/settings/whatsapp',
    label: 'WhatsApp Settings',
    icon: MessageCircle,
  },
  {
    to: '/admin/settings/website',
    label: 'Pengaturan Website',
    icon: Settings,
  },
]

export default function AdminLayout({
  title,
  subtitle,
  children,
  actions,
}) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()
  const settings = useStoreValue(getSettings)

  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)

    try {
      const success = await logout()

      if (success) {
        toast.info('Anda telah keluar dari dashboard.')
        navigate('/admin/login', { replace: true })
      } else {
        toast.error('Logout gagal. Silakan coba lagi.')
      }
    } catch {
      toast.error('Terjadi kesalahan saat logout.')
    } finally {
      setLoggingOut(false)
    }
  }

  const nav = (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {MENU.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <Icon className="h-4.5 w-4.5" />
          {label}
        </NavLink>
      ))}

      <div className="my-3 border-t border-slate-200" />

      <Link
        to="/"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
      >
        <Store className="h-4.5 w-4.5" />
        Lihat Toko
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
      >
        <LogOut className="h-4.5 w-4.5" />
        {loggingOut ? 'Sedang logout...' : 'Logout'}
      </button>
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-100/70">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <BarChart3 className="h-5 w-5" />
          </span>

          <span>
            <span className="block text-sm font-extrabold text-slate-900">
              Admin Panel
            </span>
            <span className="block text-xs text-slate-500">
              {settings.storeName}
            </span>
          </span>
        </div>

        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[80%] max-w-xs flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="text-sm font-extrabold text-slate-900">
                Admin Panel
              </span>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="rounded-lg p-2 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {nav}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Buka menu admin"
              className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                {title}
              </h1>

              {subtitle && (
                <p className="truncate text-xs text-slate-500">
                  {subtitle}
                </p>
              )}
            </div>

            {actions}
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}

