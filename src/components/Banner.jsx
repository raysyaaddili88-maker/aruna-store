import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/** Hero banner carousel — dikelola penuh dari dashboard admin. */
export default function BannerCarousel({ banners = [] }) {
  const [index, setIndex] = useState(0)
  const timer = useRef(null)
  const total = banners.length
  const currentIndex = Math.min(index, total - 1)

  useEffect(() => {
    if (total <= 1) return undefined
    timer.current = setInterval(() => setIndex((i) => (i + 1) % total), 6000)
    return () => clearInterval(timer.current)
  }, [total, index])

  if (total === 0) return null

  const go = (i) => setIndex((i + total) % total)
  const current = banners[currentIndex]

  return (
    <section aria-label="Banner promo" className="relative overflow-hidden rounded-3xl bg-slate-900">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            aria-hidden={i !== currentIndex}
            className={`absolute inset-0 transition-opacity duration-700 ${i === currentIndex ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-12">
              <div className="max-w-xl">
                <h2 className="text-xl font-extrabold leading-tight text-white drop-shadow sm:text-3xl lg:text-4xl">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">{banner.subtitle}</p>
                )}
                {banner.buttonText && (
                  <Link
                    to={banner.buttonUrl || '/products'}
                    className="btn mt-4 bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(currentIndex - 1)}
            aria-label="Banner sebelumnya"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-800 shadow transition hover:bg-white sm:block"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(currentIndex + 1)}
            aria-label="Banner berikutnya"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-800 shadow transition hover:bg-white sm:block"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ke banner ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
      <span className="sr-only">{current?.title}</span>
    </section>
  )
}
