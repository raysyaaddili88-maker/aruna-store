import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Info, Layers, PackageX, ShieldCheck, Star, Truck } from 'lucide-react'
import CTAButton from '../components/CTAButton'
import ProductCard from '../components/ProductCard'
import ProductGallery from '../components/ProductGallery'
import { EmptyState, SectionHeading } from '../components/States'
import { useStoreValue } from '../context/StoreContext'
import { getProductBySlug, listProducts } from '../services/productService'
import { formatPrice } from '../utils/formatPrice'
import { useSeo } from '../utils/seo'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = useStoreValue(() => getProductBySlug(slug), [slug])
  const products = useStoreValue(listProducts)

  useSeo({
    title: product?.name || 'Produk tidak ditemukan',
    description: product?.description?.slice(0, 155),
    keywords: product ? product.name : undefined,
    image: product?.mainImage,
    type: 'product',
  })

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={PackageX}
          title="Produk tidak ditemukan"
          description="Produk mungkin sudah dihapus atau tautannya salah."
          action={
            <Link to="/products" className="btn-primary">
              Kembali ke katalog
            </Link>
          }
        />
      </div>
    )
  }

  const hasSale = product.salePrice > 0 && product.discount > 0
  const related = products
    .filter((p) => p.status && p.id !== product.id)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductGallery images={product.images} mainImage={product.mainImage} alt={product.name} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`chip ${product.status ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-600'}`}
            >
              {product.status ? 'Tersedia' : 'Nonaktif'}
            </span>
            {hasSale && <span className="chip border-rose-200 bg-rose-50 text-rose-700">Promo -{product.discount}%</span>}
          </div>

          <h1 className="mt-3 text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1">Produk terkurasi</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            {hasSale ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-lg text-slate-400 line-through">{formatPrice(product.normalPrice)}</span>
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="rounded-lg bg-rose-600 px-2 py-1 text-xs font-bold text-white">HEMAT {product.discount}%</span>
              </div>
            ) : (
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">{formatPrice(product.normalPrice)}</span>
            )}
            <p className="mt-1 text-xs text-slate-500">Harga sudah termasuk pajak. Bisa berubah sewaktu-waktu.</p>
          </div>

          {/* CTA desktop */}
          <div className="mt-5 hidden gap-3 sm:flex">
            <CTAButton product={product} size="lg" className="flex-1" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Truck, label: 'Kirim cepat' },
              { icon: ShieldCheck, label: 'Produk terjamin' },
              { icon: CheckCircle2, label: 'Siap dropship' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-white px-2 py-3">
                <Icon className="mx-auto h-4.5 w-4.5 text-indigo-600" />
                <span className="mt-1 block text-[11px] font-semibold text-slate-500">{label}</span>
              </div>
            ))}
          </div>

          {/* Deskripsi */}
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Deskripsi Produk</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{product.description}</p>
          </section>

          {/* Spesifikasi */}
          {product.specifications?.length > 0 && (
            <section className="mt-6">
              <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-slate-400">
                <Layers className="h-4 w-4" /> Spesifikasi
              </h2>
              <dl className="mt-2 overflow-hidden rounded-2xl border border-slate-200">
                {product.specifications.map((spec, i) => (
                  <div key={`${spec.name}-${i}`} className={`flex text-sm ${i % 2 ? 'bg-white' : 'bg-slate-50'}`}>
                    <dt className="w-2/5 border-r border-slate-200 px-3.5 py-2.5 font-semibold text-slate-700">{spec.name}</dt>
                    <dd className="flex-1 px-3.5 py-2.5 text-slate-600">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Info tambahan */}
          <section className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
            <h2 className="flex items-center gap-1.5 text-sm font-bold text-sky-800">
              <Info className="h-4 w-4" /> Informasi Tambahan
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-sky-900/80">
              <li>Kode produk: #{String(product.id).toUpperCase()}</li>
              <li>Pembelian diproses melalui {product.cta?.type === 'whatsapp' ? 'WhatsApp' : product.cta?.type === 'affiliate' ? 'mitra affiliate' : product.cta?.type === 'custom' ? 'toko online mitra' : 'toko kami'}.</li>
              <li>Pastikan nomor WhatsApp aktif untuk konfirmasi pesanan.</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Terkait */}
      {related.length > 0 && (
        <section className="mt-10">
          <SectionHeading title="Produk Terkait" subtitle="Produk lain pilihan untukmu" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA sticky mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur safe-bottom sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 shrink">
            <p className="truncate text-xs text-slate-500">{product.name}</p>
            <p className="text-sm font-extrabold text-slate-900">{formatPrice(product.salePrice || product.normalPrice)}</p>
          </div>
          <CTAButton product={product} full className="h-12 flex-1" />
        </div>
      </div>
      <div className="h-20 sm:hidden" />
    </div>
  )
}
