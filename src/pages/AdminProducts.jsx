import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Package, Pencil, PlusCircle, Search, Trash2, Eye, EyeOff } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { ConfirmDialog } from '../components/Modal'
import { EmptyState } from '../components/States'
import { useToast } from '../context/ToastContext'
import { useStoreValue } from '../context/StoreContext'
import { deleteProduct, effectivePrice, listProducts, toggleProductStatus } from '../services/productService'
import { formatPrice } from '../utils/formatPrice'
import { useSeo } from '../utils/seo'

const STATUS_LABEL = { affiliate: 'Affiliate', whatsapp: 'WhatsApp', custom: 'Custom', none: 'Tanpa CTA' }

export default function AdminProducts() {
  const products = useStoreValue(listProducts)
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [confirm, setConfirm] = useState(null)

  useSeo({ title: 'Kelola Produk' })

  const filters = {
    status: params.get('status') || '',
    cta: params.get('cta') || '',
  }

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const rows = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    return products.filter((p) => {
      if (keyword && !`${p.name} ${p.description}`.toLowerCase().includes(keyword)) return false
      if (filters.status === 'active' && !p.status) return false
      if (filters.status === 'inactive' && p.status) return false
      if (filters.cta && p.cta?.type !== filters.cta) return false
      return true
    })
  }, [products, q, filters.status, filters.cta])

  const handleDelete = () => {
    deleteProduct(confirm.id)
    setConfirm(null)
    toast.success(`Produk "${confirm.name}" dihapus.`)
  }

  const handleToggle = (p) => {
    toggleProductStatus(p.id)
    toast.info(`Produk "${p.name}" ${p.status ? 'dinonaktifkan' : 'diaktifkan'}.`)
  }

  const selectCls = 'input h-10 py-2 text-xs sm:text-sm'

  return (
    <AdminLayout
      title="Kelola Produk"
      subtitle={`${rows.length} dari ${products.length} produk`}
      actions={
        <Link to="/admin/products/new" className="btn-primary h-10 shrink-0">
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah</span>
        </Link>
      }
    >
      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="input h-10 pl-10"
              placeholder="Cari nama / deskripsi produk..."
              aria-label="Cari produk"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto">
            <select className={selectCls} value={filters.status} onChange={(e) => setFilter('status', e.target.value)} aria-label="Filter status">
              <option value="">Semua status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
            <select className={selectCls} value={filters.cta} onChange={(e) => setFilter('cta', e.target.value)} aria-label="Filter CTA">
              <option value="">Semua CTA</option>
              <option value="affiliate">Affiliate</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="custom">Custom URL</option>
              <option value="none">Tanpa CTA</option>
            </select>
            <button type="button" className="btn-ghost h-10 text-xs" onClick={() => { setParams(new URLSearchParams()); setQ('') }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Kartu mobile */}
      <div className="mt-4 space-y-3 lg:hidden">
        {rows.map((p) => (
          <div key={p.id} className="card p-3.5">
            <div className="flex gap-3">
              <img src={p.mainImage} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-slate-900">{p.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{formatPrice(effectivePrice(p))}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className={`chip ${p.status ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                    {p.status ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <span className="chip border-indigo-200 bg-indigo-50 text-indigo-700">{STATUS_LABEL[p.cta?.type] || 'Tanpa CTA'}</span>
                  {p.discount > 0 && <span className="chip border-rose-200 bg-rose-50 text-rose-700">-{p.discount}%</span>}
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Link to={`/admin/products/${p.id}/edit`} className="btn-ghost h-9 text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <button type="button" onClick={() => handleToggle(p)} className="btn-ghost h-9 text-xs">
                {p.status ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {p.status ? 'Nonaktif' : 'Aktif'}
              </button>
              <button type="button" onClick={() => setConfirm(p)} className="btn-danger h-9 text-xs">
                <Trash2 className="h-3.5 w-3.5" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel desktop */}
      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Produk</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">CTA</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.mainImage} alt="" className="h-11 w-11 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <Link to={`/product/${p.slug}`} className="block max-w-xs truncate font-semibold text-slate-800 hover:text-indigo-600">
                        {p.name}
                      </Link>
                      <span className="text-xs text-slate-400">/{p.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="block font-bold text-slate-900">{formatPrice(effectivePrice(p))}</span>
                  {p.discount > 0 && <span className="text-xs text-slate-400 line-through">{formatPrice(p.normalPrice)}</span>}
                </td>
                <td className="px-4 py-3 text-slate-600">{STATUS_LABEL[p.cta?.type] || 'Tanpa CTA'}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(p)}
                    className={`chip ${p.status ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}
                  >
                    {p.status ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/products/${p.id}/edit`} className="btn-ghost h-9 px-3" aria-label="Edit produk">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button type="button" onClick={() => setConfirm(p)} className="btn-danger h-9 px-3" aria-label="Hapus produk">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="p-6">
            <EmptyState
              icon={Package}
              title="Tidak ada produk"
              description="Ubah filter pencarian atau tambah produk baru."
              action={
                <Link to="/admin/products/new" className="btn-primary">
                  <PlusCircle className="h-4 w-4" /> Tambah Produk
                </Link>
              }
            />
          </div>
        )}
      </div>

      {rows.length === 0 && (
        <div className="mt-4 lg:hidden">
          <EmptyState
            icon={Package}
            title="Tidak ada produk"
            description="Ubah filter pencarian atau tambah produk baru."
            action={
              <Link to="/admin/products/new" className="btn-primary">
                <PlusCircle className="h-4 w-4" /> Tambah Produk
              </Link>
            }
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Hapus produk?"
        message={`Produk "${confirm?.name}" akan dihapus permanen dari toko. Tindakan ini tidak bisa dibatalkan.`}
        onCancel={() => setConfirm(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  )
}
