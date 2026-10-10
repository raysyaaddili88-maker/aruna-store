import { useState } from 'react'
import { ExternalLink, MessageCircle, Save } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useToast } from '../context/ToastContext'
import { useStoreValue } from '../context/StoreContext'
import { getSettings, getWhatsappSettings, updateWhatsappSettings } from '../services/settingsService'
import { buildWhatsAppUrl, fillMessageTemplate, normalizePhone } from '../utils/whatsapp'
import { useSeo } from '../utils/seo'

const PREVIEW_PRODUCT = {
  name: 'Smartphone Nova X5 5G',
  salePrice: 4399000,
}

const PLACEHOLDERS = [
  { key: '{product_name}', desc: 'Nama produk' },
  { key: '{price}', desc: 'Harga efektif (promo jika ada)' },
]

export default function AdminWhatsAppSettings() {
  const wa = useStoreValue(getWhatsappSettings)
  const site = useStoreValue(getSettings)
  const toast = useToast()
  const [form, setForm] = useState(null)

  useSeo({ title: 'WhatsApp Settings' })

  const value = form || wa
  const preview = fillMessageTemplate(value.template || '', PREVIEW_PRODUCT)

  const save = (e) => {
    e.preventDefault()
    if (!normalizePhone(value.number)) {
      toast.error('Nomor WhatsApp belum benar.')
      return
    }
    updateWhatsappSettings(form)
    toast.success('Pengaturan WhatsApp disimpan.')
    setForm(null)
  }

  return (
    <AdminLayout title="WhatsApp Settings" subtitle="Nomor & template pesan untuk CTA WhatsApp">
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={save} className="card space-y-4 p-5">
          <div>
            <label className="label" htmlFor="wa-number">Nomor WhatsApp</label>
            <input
              id="wa-number"
              className="input"
              value={value.number || ''}
              onChange={(e) => setForm({ ...value, number: e.target.value })}
              placeholder="6283166857537"
              inputMode="tel"
            />
            <p className="mt-1 text-xs text-slate-500">
              Gunakan format internasional tanpa <code>+</code>, contoh: <b>6283166857537</b> (nomor default). Input 08xx otomatis
              dikonversi menjadi 628xx.
            </p>
            <p className="mt-1 text-xs text-slate-400">Tampilan: +{value.number}</p>
          </div>

          <div>
            <label className="label" htmlFor="wa-template">Template Pesan</label>
            <textarea
              id="wa-template"
              className="input min-h-40 resize-y"
              value={value.template || ''}
              onChange={(e) => setForm({ ...value, template: e.target.value })}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {PLACEHOLDERS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  title={p.desc}
                  onClick={() => setForm({ ...value, template: `${value.template || ''}${value.template ? '\n' : ''}${p.key}` })}
                  className="chip border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  {p.key}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={!form} className="btn-primary h-11">
            <Save className="h-4 w-4" /> Simpan Pengaturan
          </button>
        </form>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Preview Pesan</h2>
                <p className="text-xs text-slate-500">Contoh produk: {PREVIEW_PRODUCT.name}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[#e5ddd5] p-4">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#dcf8c6] px-3.5 py-2.5 shadow-sm">
                <p className="whitespace-pre-line text-sm text-slate-800">{preview}</p>
                <p className="mt-1 text-right text-[10px] text-slate-500">09:41 ✓✓</p>
              </div>
            </div>
            <a
              href={buildWhatsAppUrl(value.number, preview)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 h-11 w-full"
            >
              <ExternalLink className="h-4 w-4" /> Uji Coba Kirim
            </a>
          </div>

          <div className="card p-5 text-xs leading-relaxed text-slate-500">
            <h2 className="text-sm font-bold text-slate-900">Catatan</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Nomor global dipakai untuk semua produk WhatsApp yang tidak menentukan nomor sendiri.</li>
              <li>Produk dengan CTA <b>Affiliate/Custom</b> tidak memakai pengaturan ini.</li>
              <li>Nomor kontak toko di footer memakai nomor dari menu Pengaturan Website (saat ini +{site.whatsapp}).</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
