import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Save, Trash2, Zap, MessageCircle, Link2, Ban } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageInput from '../components/ImageInput'
import { useToast } from '../context/ToastContext'
import { useStoreValue } from '../context/StoreContext'
import { createProduct, getProductById, updateProduct } from '../services/productService'
import { getCtaSettings } from '../services/settingsService'
import { formatPrice } from '../utils/formatPrice'
import { slugify } from '../utils/slugify'
import { useSeo } from '../utils/seo'

const CTA_TYPES = [
  { value: 'affiliate', label: 'Affiliate', icon: Zap, desc: 'Arahkan ke link affiliate marketplace' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, desc: 'Chat otomatis dengan pesan siap kirim' },
  { value: 'custom', label: 'Custom URL', icon: Link2, desc: 'Arahkan ke URL toko/mitra mana pun' },
  { value: 'none', label: 'Tanpa CTA', icon: Ban, desc: 'Produk hanya ditampilkan tanpa tombol beli' },
]

const emptySpec = { name: '', value: '' }

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const ctaDefaults = useStoreValue(getCtaSettings)

  useSeo({ title: id ? 'Edit Produk' : 'Tambah Produk' })

  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const existing = id ? getProductById(id) : null
    if (id && !existing) {
      toast.error('Produk tidak ditemukan.')
      navigate('/admin/products')
      return
    }
    setForm(
      existing || {
        name: '',
        mainImage: '',
        images: [],
        normalPrice: '',
        salePrice: '',
        description: '',
        specifications: [{ ...emptySpec }],
        status: true,
        featured: false,
        cta: {
          type: ctaDefaults.defaultType || 'whatsapp',
          text: ctaDefaults.defaultText || 'Beli Sekarang',
          url: ctaDefaults.defaultUrl || '',
          phone: '',
          message: '',
        },
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const setCta = (key, value) => setForm((f) => ({ ...f, cta: { ...f.cta, [key]: value } }))

  const discount = useMemo(() => {
    const n = Number(form?.normalPrice) || 0
    const s = Number(form?.salePrice) || 0
    return n > 0 && s > 0 && s < n ? Math.round((1 - s / n) * 100) : 0
  }, [form?.normalPrice, form?.salePrice])

  if (!form) return null

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Nama produk wajib diisi.'
    if (!(Number(form.normalPrice) > 0)) next.normalPrice = 'Harga normal wajib diisi.'
    if (form.salePrice && Number(form.salePrice) >= Number(form.normalPrice)) next.salePrice = 'Harga promo harus lebih kecil dari harga normal.'
    if (['affiliate', 'custom'].includes(form.cta.type) && !form.cta.url.trim()) next.url = 'URL CTA wajib diisi untuk tipe ini.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Periksa kembali isian yang belum benar.')
      return
    }
    const payload = {
      ...form,
      name: form.name.trim(),
      normalPrice: Number(form.normalPrice),
      salePrice: Number(form.salePrice) || 0,
      images: form.images.filter(Boolean),
      specifications: form.specifications.filter((s) => s.name.trim()),
      cta: {
        ...form.cta,
        url: form.cta.url.trim(),
        text: form.cta.text?.trim() || '',
      },
    }
    if (id) {
      updateProduct(id, payload)
      toast.success('Produk berhasil diperbarui.')
    } else {
      createProduct(payload)
      toast.success('Produk berhasil ditambahkan.')
    }
    navigate('/admin/products')
  }

  const addSpec = () => set('specifications', [...form.specifications, { ...emptySpec }])
  const setSpec = (i, key, value) =>
    set(
      'specifications',
      form.specifications.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    )
  const removeSpec = (i) => set('specifications', form.specifications.filter((_, idx) => idx !== i))

  const addImage = () => set('images', [...form.images, ''])
  const setImage = (i, value) => set('images', form.images.map((src, idx) => (idx === i ? value : src)))
  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i))

  return (
    <AdminLayout
      title={id ? 'Edit Produk' : 'Tambah Produk'}
      subtitle={id ? `Mengubah "${form.name}"` : 'Lengkapi data produk baru'}
      actions={
        <button type="button" onClick={() => navigate('/admin/products')} className="btn-ghost h-10 shrink-0">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
      }
    >
      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-3">
        {/* Kolom utama */}
        <div className="space-y-4 lg:col-span-2">
          <section className="card space-y-4 p-5">
            <h2 className="text-sm font-bold text-slate-900">Informasi Produk</h2>

            <div>
              <label className="label" htmlFor="p-name">Nama Produk *</label>
              <input
                id="p-name"
                className="input"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Contoh: Smartphone Nova X5 5G"
              />
              {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>}
              <p className="mt-1 text-xs text-slate-400">
                Slug: <code className="rounded bg-slate-100 px-1.5 py-0.5">/product/{slugify(form.name) || 'nama-produk'}</code>
              </p>
            </div>

            <div>
              <label className="label" htmlFor="p-status">Status Produk</label>
              <select id="p-status" className="input" value={form.status ? 'active' : 'inactive'} onChange={(e) => set('status', e.target.value === 'active')}>
                <option value="active">Aktif (tampil di toko)</option>
                <option value="inactive">Nonaktif (sembunyikan)</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="p-desc">Deskripsi Lengkap</label>
              <textarea
                id="p-desc"
                className="input min-h-36 resize-y"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Jelaskan produk: keunggulan, bahan, garansi, dll."
              />
            </div>
          </section>

          <section className="card space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Galeri Produk</h2>
              <button type="button" onClick={addImage} className="btn-ghost h-9 text-xs">
                <Plus className="h-3.5 w-3.5" /> Tambah Foto
              </button>
            </div>

            <ImageInput label="Foto Utama *" value={form.mainImage} onChange={(v) => set('mainImage', v)} hint="Rasio 1:1, format JPG/PNG, atau tempel URL." />

            {form.images.map((src, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <ImageInput label={`Foto Tambahan ${i + 1}`} value={src} onChange={(v) => setImage(i, v)} />
                </div>
                <button type="button" onClick={() => removeImage(i)} aria-label="Hapus foto" className="mt-7 rounded-xl p-2.5 text-rose-600 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </section>

          <section className="card space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Spesifikasi</h2>
              <button type="button" onClick={addSpec} className="btn-ghost h-9 text-xs">
                <Plus className="h-3.5 w-3.5" /> Baris
              </button>
            </div>
            {form.specifications.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <input className="input" placeholder="Nama (mis. Warna)" value={spec.name} onChange={(e) => setSpec(i, 'name', e.target.value)} />
                <input className="input" placeholder="Nilai (mis. Hitam)" value={spec.value} onChange={(e) => setSpec(i, 'value', e.target.value)} />
                <button type="button" onClick={() => removeSpec(i)} aria-label="Hapus baris" className="rounded-xl px-3 text-rose-600 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {form.specifications.length === 0 && <p className="text-sm text-slate-400">Belum ada spesifikasi.</p>}
          </section>
        </div>

        {/* Kolom samping */}
        <div className="space-y-4">
          <section className="card space-y-4 p-5">
            <h2 className="text-sm font-bold text-slate-900">Harga</h2>
            <div>
              <label className="label" htmlFor="p-price">Harga Normal (Rp) *</label>
              <input
                id="p-price"
                type="number"
                min="0"
                className="input"
                value={form.normalPrice}
                onChange={(e) => set('normalPrice', e.target.value)}
                placeholder="500000"
              />
              {errors.normalPrice && <p className="mt-1 text-xs font-medium text-rose-600">{errors.normalPrice}</p>}
              {form.normalPrice && <p className="mt-1 text-xs text-slate-500">{formatPrice(Number(form.normalPrice))}</p>}
            </div>
            <div>
              <label className="label" htmlFor="p-sale">Harga Promo (Rp)</label>
              <input
                id="p-sale"
                type="number"
                min="0"
                className="input"
                value={form.salePrice}
                onChange={(e) => set('salePrice', e.target.value)}
                placeholder="399000"
              />
              {errors.salePrice && <p className="mt-1 text-xs font-medium text-rose-600">{errors.salePrice}</p>}
              {form.salePrice && <p className="mt-1 text-xs text-slate-500">{formatPrice(Number(form.salePrice))}</p>}
            </div>
            <div className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${discount ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-500'}`}>
              Diskon otomatis: {discount ? `${discount}%` : '—'}
            </div>
          </section>

          <section className="card space-y-4 p-5">
            <h2 className="text-sm font-bold text-slate-900">Pengaturan CTA</h2>
            <div>
              <label className="label" htmlFor="p-cta-type">Tipe CTA</label>
              <select id="p-cta-type" className="input" value={form.cta.type} onChange={(e) => setCta('type', e.target.value)}>
                {CTA_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
              {CTA_TYPES.find((t) => t.value === form.cta.type)?.desc}
            </div>

            {form.cta.type !== 'none' && (
              <div>
                <label className="label" htmlFor="p-cta-text">Teks Tombol</label>
                <input
                  id="p-cta-text"
                  className="input"
                  value={form.cta.text}
                  onChange={(e) => setCta('text', e.target.value)}
                  placeholder="Beli Sekarang"
                />
              </div>
            )}

            {(form.cta.type === 'affiliate' || form.cta.type === 'custom') && (
              <div>
                <label className="label" htmlFor="p-cta-url">URL Tujuan *</label>
                <input
                  id="p-cta-url"
                  className="input"
                  value={form.cta.url}
                  onChange={(e) => setCta('url', e.target.value)}
                  placeholder="https://example.com/affiliate-product"
                />
                {errors.url && <p className="mt-1 text-xs font-medium text-rose-600">{errors.url}</p>}
              </div>
            )}

            {form.cta.type === 'whatsapp' && (
              <>
                <div>
                  <label className="label" htmlFor="p-cta-phone">Nomor WhatsApp Produk (opsional)</label>
                  <input
                    id="p-cta-phone"
                    className="input"
                    value={form.cta.phone || ''}
                    onChange={(e) => setCta('phone', e.target.value)}
                    placeholder="Kosongkan untuk memakai nomor global"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="p-cta-msg">Template Pesan (opsional)</label>
                  <textarea
                    id="p-cta-msg"
                    className="input min-h-24 resize-y text-xs"
                    value={form.cta.message || ''}
                    onChange={(e) => setCta('message', e.target.value)}
                    placeholder="Halo kak, saya tertarik dengan produk {product_name}..."
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Placeholder: {'{product_name}'} · {'{price}'}
                  </p>
                </div>
              </>
            )}
          </section>

          <section className="card space-y-3 p-5">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">Tampilkan di Produk Pilihan</span>
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-5 w-5 rounded accent-indigo-600"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">Status aktif</span>
              <input
                type="checkbox"
                checked={Boolean(form.status)}
                onChange={(e) => set('status', e.target.checked)}
                className="h-5 w-5 rounded accent-indigo-600"
              />
            </label>
          </section>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/admin/products')} className="btn-ghost h-12 flex-1">
              Batal
            </button>
            <button type="submit" className="btn-primary h-12 flex-1">
              <Save className="h-4 w-4" /> {id ? 'Simpan' : 'Tambah Produk'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
