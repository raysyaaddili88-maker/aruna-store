import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, SlidersHorizontal, X, PackageSearch } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { EmptyState } from '../components/States'
import { queryProducts } from '../services/productService'
import { useSeo } from '../utils/seo'

const PRICE_OPTIONS = [
  { value: '', label: 'Semua harga' },
  { value: '0-100000', label: 'Di bawah Rp100.000' },
  { value: '100000-500000', label: 'Rp100.000 – Rp500.000' },
  { value: '500000-1000000', label: 'Rp500.000 – Rp1.000.000' },
  { value: '1000000-9999999999', label: 'Di atas Rp1.000.000' },
]

const DISCOUNT_OPTIONS = [
  { value: 0, label: 'Semua diskon' },
  { value: 10, label: 'Diskon ≥ 10%' },
  { value: 20, label: 'Diskon ≥ 20%' },
  { value: 30, label: 'Diskon ≥ 30%' },
]

const CTA_OPTIONS = [
  { value: '', label: 'Semua CTA' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'custom', label: 'Custom URL' },
  { value: 'none', label: 'Tanpa CTA' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price_asc', label: 'Harga terendah' },
  { value: 'price_desc', label: 'Harga tertinggi' },
  { value: 'discount', label: 'Diskon terbesar' },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [openFilter, setOpenFilter] = useState(false)
  const [search, setSearch] = useState(() => params.get('q') || '')

  const query = params.get('q') || ''

  useEffect(() => {
    setSearch(query)
  }, [query])

  useEffect(() => {
    if (search === query) return undefined
    const timer = setTimeout(() => setFilter('q', search.trim()), 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, query])

  useSeo({
    title: params.get('q') ? `Hasil pencarian “${params.get('q')}”` : 'Katalog Produk',
    description: 'Jelajahi katalog produk elektronik & fashion. Filter berdasarkan harga, diskon, dan jenis CTA.',
  })

  const filters = {
    q: params.get('q') || '',
    cta: params.get('cta') || '',
    price: params.get('price') || '',
    discount: params.get('discount') || '',
    sort: params.get('sort') || 'newest',
  }

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (value === '' || value === null) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const [minStr, maxStr] = filters.price ? filters.price.split('-') : ['', '']
    return queryProducts({
      q: filters.q,
      ctaType: filters.cta,
      minPrice: minStr ? Number(minStr) : undefined,
      maxPrice: maxStr ? Number(maxStr) : undefined,
      minDiscount: Number(filters.discount) || 0,
      sort: filters.sort,
    })
  }, [filters.q, filters.cta, filters.price, filters.discount, filters.sort])

  const activeCount = [filters.cta, filters.price, filters.discount].filter(Boolean).length

  const selectCls = 'input h-11 appearance-none bg-white pr-8 font-medium'

  const filterForm = (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor="f-price">
          Harga
        </label>
        <select id="f-price" className={selectCls} value={filters.price} onChange={(e) => setFilter('price', e.target.value)}>
          {PRICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="f-discount">
          Diskon
        </label>
        <select id="f-discount" className={selectCls} value={filters.discount} onChange={(e) => setFilter('discount', e.target.value)}>
          {DISCOUNT_OPTIONS.map((o) => (
            <option key={o.value} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="f-cta">
          Jenis CTA
        </label>
        <select id="f-cta" className={selectCls} value={filters.cta} onChange={(e) => setFilter('cta', e.target.value)}>
          {CTA_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => setParams(filters.q ? new URLSearchParams({ q: filters.q }) : new URLSearchParams())}
          className="btn-ghost w-full"
        >
          <X className="h-4 w-4" /> Reset filter
        </button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <div className="mb-4">
        <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {filters.q ? `Hasil untuk “${filters.q}”` : 'Semua Produk'}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">{results.length} produk ditemukan</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau deskripsi..."
            aria-label="Cari produk"
            className="input h-11 pl-10"
          />
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setOpenFilter(true)} className="btn-ghost h-11 flex-1 sm:hidden">
            <Filter className="h-4 w-4" /> Filter {activeCount > 0 && <span className="rounded-full bg-indigo-600 px-1.5 text-[10px] text-white">{activeCount}</span>}
          </button>
          <div className="relative flex-1 sm:w-52 sm:flex-none">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              aria-label="Urutkan"
              className={`${selectCls} pl-10`}
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="card sticky top-40 p-4">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Filter className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-bold text-slate-900">Filter Produk</span>
            </div>
            {filterForm}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {results.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="Produk tidak ditemukan"
              description="Coba ubah kata kunci atau reset filter pencarianmu."
              action={
                <Link to="/products" className="btn-primary">
                  Lihat semua produk
                </Link>
              }
            />
          )}
        </div>
      </div>

      {/* Bottom sheet filter mobile */}
      {openFilter && (
        <div className="fixed inset-0 z-[75] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpenFilter(false)} aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl safe-bottom">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Filter Produk</h2>
              <button type="button" onClick={() => setOpenFilter(false)} aria-label="Tutup filter" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterForm}
            <button type="button" onClick={() => setOpenFilter(false)} className="btn-primary mt-5 h-12 w-full">
              Terapkan ({results.length} produk)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
