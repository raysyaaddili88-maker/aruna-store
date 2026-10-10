import { useState } from 'react'
import { ArrowDown, ArrowUp, Image as ImageIcon, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import Modal, { ConfirmDialog } from '../components/Modal'
import ImageInput from '../components/ImageInput'
import { EmptyState } from '../components/States'
import { useToast } from '../context/ToastContext'
import { useStoreValue } from '../context/StoreContext'
import { bannerPlaceholder } from '../utils/placeholder'
import { createBanner, deleteBanner, listBanners, toggleBannerStatus, updateBanner } from '../services/bannerService'
import { useSeo } from '../utils/seo'

const emptyForm = {
  title: '',
  subtitle: '',
  buttonText: 'Belanja Sekarang',
  buttonUrl: '/products',
  image: '',
  order: 1,
  status: true,
}

export default function AdminBanners() {
  const banners = useStoreValue(listBanners)
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirm, setConfirm] = useState(null)

  useSeo({ title: 'Kelola Banner' })

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, image: bannerPlaceholder('BANNER BARU'), order: banners.length + 1 })
    setOpen(true)
  }

  const openEdit = (b) => {
    setEditing(b)
    setForm({ ...b })
    setOpen(true)
  }

  const move = (b, step) => {
    const sorted = [...banners]
    const idx = sorted.findIndex((x) => x.id === b.id)
    const target = idx + step
    if (target < 0 || target >= sorted.length) return
    ;[sorted[idx], sorted[target]] = [sorted[target], sorted[idx]]
    sorted.forEach((item, i) => updateBanner(item.id, { order: i + 1 }))
    toast.info('Urutan banner diperbarui.')
  }

  const save = (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Judul banner wajib diisi.')
      return
    }
    if (editing) {
      updateBanner(editing.id, form)
      toast.success('Banner diperbarui.')
    } else {
      createBanner(form)
      toast.success('Banner ditambahkan.')
    }
    setOpen(false)
  }

  const handleDelete = () => {
    deleteBanner(confirm.id)
    setConfirm(null)
    toast.success('Banner dihapus.')
  }

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <AdminLayout
      title="Kelola Banner"
      subtitle={`${banners.length} banner · ${banners.filter((b) => b.status).length} aktif`}
      actions={
        <button type="button" onClick={openCreate} className="btn-primary h-10 shrink-0">
          <PlusCircle className="h-4 w-4" /> <span className="hidden sm:inline">Tambah</span>
        </button>
      }
    >
      {banners.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Belum ada banner"
          description="Tambahkan hero banner untuk menampilkan promo di halaman utama."
          action={
            <button type="button" onClick={openCreate} className="btn-primary">
              <PlusCircle className="h-4 w-4" /> Tambah Banner
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {banners.map((b, i) => (
            <div key={b.id} className={`card overflow-hidden ${b.status ? '' : 'opacity-65'}`}>
              <div className="relative aspect-[16/7] w-full bg-slate-100 sm:aspect-[21/6]">
                <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="line-clamp-1 text-sm font-extrabold text-white sm:text-lg">{b.title}</p>
                  <p className="line-clamp-1 text-xs text-slate-200">{b.subtitle}</p>
                </div>
                <span className={`chip absolute right-3 top-3 ${b.status ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                  {b.status ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 p-3.5">
                <span className="mr-auto text-xs font-semibold text-slate-500">
                  Urutan #{b.order} · {b.buttonText || 'Tanpa tombol'} → {b.buttonUrl}
                </span>
                <button type="button" onClick={() => move(b, -1)} disabled={i === 0} className="btn-ghost h-9 px-3" aria-label="Naikkan urutan">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => move(b, 1)} disabled={i === banners.length - 1} className="btn-ghost h-9 px-3" aria-label="Turunkan urutan">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleBannerStatus(b.id)
                    toast.info(`Banner ${b.status ? 'dinonaktifkan' : 'diaktifkan'}.`)
                  }}
                  className="btn-ghost h-9 px-3 text-xs"
                >
                  {b.status ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button type="button" onClick={() => openEdit(b)} className="btn-ghost h-9 px-3">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setConfirm(b)} className="btn-danger h-9 px-3">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title={editing ? 'Edit Banner' : 'Tambah Banner'} onClose={() => setOpen(false)} size="lg">
        <form onSubmit={save} className="space-y-4">
          <ImageInput label="Gambar Banner" value={form.image} onChange={(v) => set('image', v)} ratio="aspect-[16/7]" hint="Disarankan 1600×700 px agar tajam di mobile." />

          <div>
            <label className="label" htmlFor="b-title">Judul *</label>
            <input id="b-title" className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Promo Gajian Diskon Hingga 50%" />
          </div>

          <div>
            <label className="label" htmlFor="b-sub">Subtitle</label>
            <input id="b-sub" className="input" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Keterangan singkat banner" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="b-btn">Teks Tombol CTA</label>
              <input id="b-btn" className="input" value={form.buttonText} onChange={(e) => set('buttonText', e.target.value)} placeholder="Belanja Sekarang" />
            </div>
            <div>
              <label className="label" htmlFor="b-url">URL Tombol CTA</label>
              <input id="b-url" className="input" value={form.buttonUrl} onChange={(e) => set('buttonUrl', e.target.value)} placeholder="/products atau https://..." />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="b-order">Urutan</label>
              <input id="b-order" type="number" min="1" className="input" value={form.order} onChange={(e) => set('order', e.target.value)} />
            </div>
            <label className="flex items-end gap-2 pb-3">
              <input type="checkbox" checked={form.status} onChange={(e) => set('status', e.target.checked)} className="h-5 w-5 accent-indigo-600" />
              <span className="text-sm font-semibold text-slate-700">Banner aktif</span>
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost h-11 flex-1">
              Batal
            </button>
            <button type="submit" className="btn-primary h-11 flex-1">
              Simpan Banner
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Hapus banner?"
        message={`Banner "${confirm?.title}" akan dihapus permanen.`}
        onCancel={() => setConfirm(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  )
}
