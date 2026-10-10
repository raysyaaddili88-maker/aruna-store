import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Image as ImageIcon,
  MessageCircle,
  Package,
  PlusCircle,
  Zap,
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useStoreValue } from '../context/StoreContext'
import { listBanners } from '../services/bannerService'
import { effectivePrice, listProducts } from '../services/productService'
import { formatPrice } from '../utils/formatPrice'
import { useSeo } from '../utils/seo'

export default function AdminDashboard() {
  const products = useStoreValue(listProducts)
  const banners = useStoreValue(listBanners)

  useSeo({ title: 'Dashboard Admin' })

  const stats = [
    { label: 'Total Produk', value: products.length, icon: Package, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Produk Aktif', value: products.filter((p) => p.status).length, icon: Package, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Banner', value: banners.length, icon: ImageIcon, color: 'bg-violet-50 text-violet-600' },
    { label: 'Produk Affiliate', value: products.filter((p) => p.cta?.type === 'affiliate').length, icon: Zap, color: 'bg-amber-50 text-amber-600' },
    { label: 'Produk WhatsApp', value: products.filter((p) => p.cta?.type === 'whatsapp').length, icon: MessageCircle, color: 'bg-emerald-50 text-emerald-700' },
  ]

  const recent = [...products].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5)
  const outOfStock = products.filter((p) => !p.status)

  return (
    <AdminLayout title="Dashboard" subtitle="Ringkasan performa toko kamu">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4">
            <span className={`inline-flex rounded-xl p-2.5 ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
            <p className="text-xs font-semibold text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        {/* Aksi cepat */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-900">Aksi Cepat</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/admin/products/new" className="btn-primary h-11 w-full">
              <PlusCircle className="h-4 w-4" /> Tambah Produk
            </Link>
            <Link to="/admin/banners" className="btn-ghost h-11 w-full">
              <ImageIcon className="h-4 w-4" /> Kelola Banner
            </Link>
            <Link to="/admin/settings/whatsapp" className="btn-ghost h-11 w-full">
              <MessageCircle className="h-4 w-4" /> Pengaturan WhatsApp
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-bold text-slate-900">Produk Terbaru</h2>
            <Link to="/admin/products" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Semua produk
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <img src={p.mainImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">{formatPrice(effectivePrice(p))}</p>
                </div>
                <span
                  className={`chip ${p.status ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}
                >
                  {p.status ? 'Aktif' : 'Nonaktif'}
                </span>
                <Link to={`/admin/products/${p.id}/edit`} className="btn-ghost h-8 px-3 text-xs">
                  Edit
                </Link>
              </li>
            ))}
            {recent.length === 0 && <li className="px-5 py-6 text-sm text-slate-400">Belum ada produk.</li>}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-900">Perlu Perhatian</h2>
          <p className="mt-1 text-xs text-slate-500">Produk nonaktif tidak tampil di toko.</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{outOfStock.length}</p>
          <p className="text-xs font-semibold text-slate-500">Produk nonaktif</p>
          <Link to="/admin/products?status=inactive" className="btn-ghost mt-4 h-10 w-full">
            Tinjau produk <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
