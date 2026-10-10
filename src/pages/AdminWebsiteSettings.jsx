import { useState } from 'react'
import { Save, Globe } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageInput from '../components/ImageInput'
import { useToast } from '../context/ToastContext'
import { useStoreValue } from '../context/StoreContext'
import { getSettings, updateSettings } from '../services/settingsService'
import { resetAllData } from '../services/seedService'
import { ConfirmDialog } from '../components/Modal'
import { useSeo } from '../utils/seo'

const FIELDS = [
  { group: 'Identitas Toko', items: [
    { key: 'storeName', label: 'Nama Toko', placeholder: 'Aruna Store' },
    { key: 'tagline', label: 'Tagline', placeholder: 'Affiliate & Dropship Store' },
    { key: 'description', label: 'Deskripsi Toko', type: 'textarea', placeholder: 'Deskripsi singkat toko...' },
  ]},
  { group: 'Media & Sosial', items: [
    { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/akun' },
    { key: 'tiktok', label: 'TikTok URL', placeholder: 'https://tiktok.com/@akun' },
    { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/akun' },
    { key: 'whatsapp', label: 'WhatsApp (Footer/Umum)', placeholder: '6283166857537' },
  ]},
  { group: 'Footer', items: [
    { key: 'footer', label: 'Teks Footer', type: 'textarea' },
    { key: 'copyright', label: 'Copyright', placeholder: '© 2026 Nama Toko' },
  ]},
  { group: 'SEO', items: [
    { key: 'seoTitle', label: 'SEO Title', placeholder: 'Toko Online Terbaik — Elektronik & Fashion' },
    { key: 'seoDescription', label: 'SEO Description', type: 'textarea' },
    { key: 'seoKeywords', label: 'SEO Keywords', placeholder: 'elektronik, fashion, dropship' },
    { key: 'siteUrl', label: 'Canonical URL (domain)', placeholder: 'https://tokokamu.com' },
  ]},
]

export default function AdminWebsiteSettings() {
  const settings = useStoreValue(getSettings)
  const toast = useToast()
  const [form, setForm] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useSeo({ title: 'Pengaturan Website' })

  const value = form || settings
  const set = (key, v) => setForm({ ...value, [key]: v })

  const save = (e) => {
    e.preventDefault()
    updateSettings(form)
    toast.success('Pengaturan website disimpan.')
    setForm(null)
  }

  return (
    <AdminLayout title="Pengaturan Website" subtitle="Identitas toko, media sosial, footer, dan SEO">
      <form onSubmit={save} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card space-y-4 p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <Globe className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">Logo & Favicon</h2>
            </div>
            <ImageInput label="Logo Toko" value={value.logo} onChange={(v) => set('logo', v)} ratio="aspect-[3/1]" hint="Disarankan transparan, tinggi ± 100px." />
            <ImageInput label="Favicon" value={value.favicon} onChange={(v) => set('favicon', v)} ratio="aspect-square" hint="Gambar kotak 64×64 px." />
            <ImageInput label="Gambar SEO (Open Graph)" value={value.seoImage} onChange={(v) => set('seoImage', v)} ratio="aspect-[16/9]" hint="Disarankan 1200×630 px." />
          </div>

          <div className="space-y-4 lg:col-span-2">
            {FIELDS.map((section) => (
              <section key={section.group} className="card p-5">
                <h2 className="mb-4 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">{section.group}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.items.map((field) => (
                    <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                      <label className="label" htmlFor={`s-${field.key}`}>
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={`s-${field.key}`}
                          className="input min-h-24 resize-y"
                          value={value[field.key] || ''}
                          placeholder={field.placeholder}
                          onChange={(e) => set(field.key, e.target.value)}
                        />
                      ) : (
                        <input
                          id={`s-${field.key}`}
                          className="input"
                          value={value[field.key] || ''}
                          placeholder={field.placeholder}
                          onChange={(e) => set(field.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={!form} className="btn-primary h-12 flex-1">
            <Save className="h-4 w-4" /> Simpan Semua Pengaturan
          </button>
          <button type="button" onClick={() => setConfirmReset(true)} className="btn-ghost h-12 text-rose-600">
            Reset ke Data Demo
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmReset}
        title="Reset data demo?"
        message="Semua produk, banner, dan pengaturan akan dikembalikan ke data contoh awal. Data yang sudah kamu ubah akan hilang."
        confirmLabel="Reset Sekarang"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetAllData()
          setConfirmReset(false)
          window.location.reload()
        }}
      />
    </AdminLayout>
  )
}
