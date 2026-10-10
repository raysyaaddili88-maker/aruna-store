import { useState } from 'react'
import { ImagePlus, Link2, Trash2, Upload } from 'lucide-react'
import { useToast } from '../context/ToastContext'

/**
 * Input gambar: bisa tempel URL atau upload file (dikonversi ke data URL).
 * ⚠️ Untuk produksi, simpan file ke object storage/server, bukan localStorage.
 */
export default function ImageInput({ label = 'Gambar', value = '', onChange, hint, ratio = 'aspect-square' }) {
  const [error, setError] = useState('')
  const toast = useToast()

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    if (file.size > 400 * 1024) {
      setError('Ukuran file maksimal 400KB untuk penyimpanan lokal. Gunakan URL gambar untuk file lebih besar.')
      toast.error('File terlalu besar (maks. 400KB).')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange?.(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div>
      {label && <span className="label">{label}</span>}
      <div className="flex gap-3">
        <div className={`relative w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${ratio}`}>
          {value ? (
            <img src={value} alt="Pratinjau" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-slate-300">
              <ImagePlus className="h-7 w-7" />
            </span>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange?.('')}
              aria-label="Hapus gambar"
              className="absolute right-1 top-1 rounded-lg bg-white/90 p-1.5 text-rose-600 shadow"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="https://contoh.com/gambar.jpg"
              value={value?.startsWith('data:') ? '' : value || ''}
              onChange={(e) => onChange?.(e.target.value)}
            />
          </div>
          <label className="btn-ghost mt-2 h-9 cursor-pointer text-xs">
            <Upload className="h-3.5 w-3.5" /> Upload file
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          {value?.startsWith('data:') && <p className="mt-1 text-[11px] text-amber-600">Gambar dari file upload.</p>}
          {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
          {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
        </div>
      </div>
    </div>
  )
}
