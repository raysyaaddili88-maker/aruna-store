import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Menu, Search, Store, X } from 'lucide-react'
import { useStoreValue } from '../context/StoreContext'
import { getSettings } from '../services/settingsService'
import { queryProducts } from '../services/productService'
import { isAuthenticated } from '../services/authService'
import { formatPrice } from '../utils/formatPrice'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const desktopRef = useRef(null)
  const mobileRef = useRef(null)

  const settings = useStoreValue(getSettings)
  const admin = useStoreValue(isAuthenticated)

  const suggestions = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    if (keyword.length < 2) return []
    return queryProducts({ q: keyword }).slice(0, 5)
  }, [q])

  useEffect(() => {
    setOpen(false)
    setFocused(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onClick = (e) => {
      const inside = [desktopRef.current, mobileRef.current].some((ref) => ref && ref.contains(e.target))
      if (!inside) setFocused(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setFocused(false)
    navigate(`/products?q=${encodeURIComponent(q.trim())}`)
  }

  const goSuggestion = (slug) => {
    setFocused(false)
    setQ('')
    navigate(`/product/${slug}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          {settings.logo ? (
            <img src={settings.logo} alt={settings.storeName} className="h-8 w-auto max-w-[140px] object-contain" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Store className="h-5 w-5" />
            </span>
          )}
          <span className="hidden text-base font-extrabold tracking-tight text-slate-900 sm:block">
            {settings.storeName}
          </span>
        </Link>

        <div ref={desktopRef} className="relative ml-auto hidden w-full max-w-xl lg:block">
          <form onSubmit={submit}>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              type="search"
              placeholder="Cari produk atau deskripsi..."
              aria-label="Cari produk"
              className="input h-11 pl-10"
            />
          </form>
          {focused && suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goSuggestion(p.slug)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <img src={p.mainImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">{p.name}</span>
                  </span>
                  <span className="shrink-0 text-xs font-bold text-indigo-600">
                    {formatPrice(p.salePrice || p.normalPrice)}
                  </span>
                </button>
              ))}
              <Link
                to={`/products?q=${encodeURIComponent(q.trim())}`}
                className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-slate-50"
              >
                Lihat semua hasil untuk “{q.trim()}”
              </Link>
            </div>
          )}
        </div>

        <Link
          to={admin ? '/admin' : '/admin/login'}
          className="ml-auto flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 lg:ml-0"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </div>

      {/* Search mobile */}
      <div className="px-4 pb-3 lg:hidden" ref={mobileRef}>
        <form onSubmit={submit} className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            type="search"
            placeholder="Cari produk di sini..."
            aria-label="Cari produk"
            className="input h-11 bg-slate-50 pl-10"
          />
          {focused && suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goSuggestion(p.slug)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                >
                  <img src={p.mainImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">{p.name}</span>
                  </span>
                  <span className="shrink-0 text-xs font-bold text-indigo-600">
                    {formatPrice(p.salePrice || p.normalPrice)}
                  </span>
                </button>
              ))}
              <Link
                to={`/products?q=${encodeURIComponent(q.trim())}`}
                className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-indigo-600"
              >
                Lihat semua hasil
              </Link>
            </div>
          )}
        </form>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <span className="text-base font-extrabold text-slate-900">{settings.storeName}</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup menu" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Menu</p>
              <Link to="/" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Beranda
              </Link>
              <Link to="/products" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Semua Produk
              </Link>

              <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Lainnya</p>
              <Link
                to={admin ? '/admin' : '/admin/login'}
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                {admin ? 'Dashboard Admin' : 'Login Admin'}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
