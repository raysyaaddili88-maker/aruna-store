import { Link, useLocation } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useSeo } from '../utils/seo'

export default function NotFound() {
  const location = useLocation()
  useSeo({ title: 'Halaman tidak ditemukan' })

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <span className="rounded-3xl bg-slate-100 p-5 text-slate-400">
        <Compass className="h-10 w-10" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-slate-900">404 — Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-slate-500">
        Tautan <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{location.pathname}</code> tidak tersedia.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn-primary">
          Ke Beranda
        </Link>
        <Link to="/products" className="btn-ghost">
          Katalog Produk
        </Link>
      </div>
    </div>
  )
}
