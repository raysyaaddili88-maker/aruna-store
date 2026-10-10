import { useState } from 'react'
import { Save, Zap } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useToast } from '../context/ToastContext'
import { useStoreValue } from '../context/StoreContext'
import { getCtaSettings, updateCtaSettings } from '../services/settingsService'
import { useSeo } from '../utils/seo'

const TYPES = [
  { value: 'affiliate', label: 'Affiliate', desc: 'Membuka link affiliate di tab baru (marketplace/merchant).' },
  { value: 'whatsapp', label: 'WhatsApp', desc: 'Membuka wa.me dengan pesan otomatis sesuai template.' },
  { value: 'custom', label: 'Custom URL', desc: 'Membuka URL bebas (toko sendiri, Shopee/Tokopedia, dsb).' },
  { value: 'none', label: 'Tanpa CTA', desc: 'Produk tampil tanpa tombol beli.' },
]

export default function AdminCtaSettings() {
  const settings = useStoreValue(getCtaSettings)
  const toast = useToast()
  const [form, setForm] = useState(null)

  useSeo({ title: 'CTA Settings' })

  const value = form || settings

  const save = (e) => {
    e.preventDefault()
    updateCtaSettings(form)
    toast.success('Pengaturan CTA default disimpan.')
    setForm(null)
  }

  return (
    <AdminLayout title="CTA Settings" subtitle="Nilai default untuk produk baru">
      <div className="grid gap-4 lg:grid-cols-3">
        <form onSubmit={save} className="card space-y-4 p-5 lg:col-span-2">
          <div>
            <label className="label" htmlFor="cta-type">Tipe CTA Default</label>
            <select
              id="cta-type"
              className="input"
              value={value.defaultType || 'whatsapp'}
              onChange={(e) => setForm({ ...value, defaultType: e.target.value })}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500">
              {TYPES.find((t) => t.value === (value.defaultType || 'whatsapp'))?.desc}
            </p>
          </div>

          <div>
            <label className="label" htmlFor="cta-text">Teks Tombol Default</label>
            <input
              id="cta-text"
              className="input"
              value={value.defaultText || ''}
              onChange={(e) => setForm({ ...value, defaultText: e.target.value })}
              placeholder="Beli Sekarang"
            />
          </div>

          <div>
            <label className="label" htmlFor="cta-url">URL Default (untuk tipe affiliate/custom)</label>
            <input
              id="cta-url"
              className="input"
              value={value.defaultUrl || ''}
              onChange={(e) => setForm({ ...value, defaultUrl: e.target.value })}
              placeholder="https://example.com/affiliate"
            />
          </div>

          <button type="submit" disabled={!form} className="btn-primary h-11">
            <Save className="h-4 w-4" /> Simpan Pengaturan
          </button>
        </form>

        <aside className="card h-fit p-5">
          <span className="inline-flex rounded-xl bg-amber-50 p-2.5 text-amber-600">
            <Zap className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-sm font-bold text-slate-900">Cara kerja CTA</h2>
          <ul className="mt-2 space-y-2 text-xs leading-relaxed text-slate-500">
            <li>1. Setiap produk punya pengaturan CTA sendiri (lihat form produk).</li>
            <li>2. Halaman ini hanya menentukan <b>default</b> untuk produk baru.</li>
            <li>
              3. <b>Affiliate</b> / <b>Custom URL</b> dibuka di tab baru dengan <code>rel="noopener"</code>.
            </li>
            <li>
              4. <b>WhatsApp</b> memakai format <code>wa.me/628xxxx?text=...</code> dengan placeholder
              {' {product_name}'}, {' {price}'}. Nomor & pesan bisa diatur per produk.
            </li>
          </ul>
        </aside>
      </div>
    </AdminLayout>
  )
}
