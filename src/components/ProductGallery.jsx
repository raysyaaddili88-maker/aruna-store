import { useState } from 'react'
import { Expand, X } from 'lucide-react'

/** Galeri produk: foto utama + thumbnail, plus preview layar penuh yang nyaman di mobile. */
export default function ProductGallery({ images = [], mainImage, alt = 'Produk' }) {
  const gallery = [mainImage, ...images.filter(Boolean)].filter(Boolean)
  const [active, setActive] = useState(0)
  const [preview, setPreview] = useState(false)
  const current = gallery[active] || mainImage

  if (!current) {
    return <div className="flex aspect-square items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">Tidak ada gambar</div>
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img src={current} alt={alt} className="aspect-square w-full object-cover" />
        <button
          type="button"
          onClick={() => setPreview(true)}
          aria-label="Perbesar gambar"
          className="absolute right-3 top-3 rounded-xl bg-white/90 p-2.5 text-slate-700 shadow-md backdrop-blur transition hover:bg-white"
        >
          <Expand className="h-5 w-5" />
        </button>
        {gallery.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-lg bg-slate-900/70 px-2 py-1 text-[11px] font-semibold text-white">
            {active + 1}/{gallery.length}
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Foto ${i + 1}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === active ? 'border-indigo-600' : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={src} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[95] flex flex-col bg-slate-950/95 p-3" onClick={() => setPreview(false)}>
          <div className="flex justify-end">
            <button type="button" aria-label="Tutup pratinjau" className="rounded-full bg-white/10 p-3 text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={current} alt={alt} className="max-h-[80vh] w-auto rounded-xl object-contain" />
            {gallery.length > 1 && (
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={`dot-${i}`}
                    type="button"
                    aria-label={`Foto ${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActive(i)
                    }}
                    className={`h-2.5 rounded-full transition ${i === active ? 'w-6 bg-white' : 'w-2.5 bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
