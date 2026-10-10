import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'
import CTAButton from './CTAButton'

/**
 * Card produk reusable — grid 2 kolom di mobile, hover effect di desktop.
 */
export default function ProductCard({ product }) {
  const hasSale = product.salePrice > 0 && product.discount > 0

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_12px_32px_-18px_rgba(79,70,229,0.55)]">
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-100" aria-label={`Lihat detail ${product.name}`}>
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {hasSale && (
          <span className="absolute left-2 top-2 rounded-lg bg-rose-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
            -{product.discount}%
          </span>
        )}
        {!product.status && (
          <span className="absolute right-2 top-2 rounded-lg bg-slate-800/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Nonaktif
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={`/product/${product.slug}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-900 hover:text-indigo-600">
          {product.name}
        </Link>

        <div className="mt-auto">
          {hasSale ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[11px] text-slate-400 line-through">{formatPrice(product.normalPrice)}</span>
              <span className="text-base font-extrabold text-slate-900">{formatPrice(product.salePrice)}</span>
            </div>
          ) : (
            <span className="text-base font-extrabold text-slate-900">{formatPrice(product.normalPrice)}</span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <CTAButton product={product} size="sm" className="flex-1 min-w-0" />
          <Link
            to={`/product/${product.slug}`}
            className="btn-ghost h-9 shrink-0 px-2.5"
            aria-label={`Lihat detail ${product.name}`}
            title="Lihat detail"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden xl:inline">Detail</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
