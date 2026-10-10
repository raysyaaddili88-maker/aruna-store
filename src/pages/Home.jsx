import { Link } from 'react-router-dom'
import { BadgePercent, PackageCheck, ShieldCheck, Truck, ArrowRight } from 'lucide-react'
import BannerCarousel from '../components/Banner'
import ProductCard from '../components/ProductCard'
import { EmptyState, SectionHeading } from '../components/States'
import { useStoreValue } from '../context/StoreContext'
import { listBanners } from '../services/bannerService'
import { effectivePrice, listProducts } from '../services/productService'
import { getSettings } from '../services/settingsService'
import { useSeo } from '../utils/seo'
import { formatPrice } from '../utils/formatPrice'

export default function Home() {
  const settings = useStoreValue(getSettings)
  const banners = useStoreValue(() => listBanners({ activeOnly: true }))
  const products = useStoreValue(listProducts)

  useSeo({
    title: settings.seoTitle || settings.storeName,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    image: settings.seoImage,
    url: settings.siteUrl || undefined,
    siteName: settings.storeName,
  })

  const active = products.filter((p) => p.status)
  const featured = active.filter((p) => p.featured).slice(0, 8)
  const list = featured.length ? featured : active.slice(0, 8)
  const promos = active
    .filter((p) => p.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4)

  const benefits = [
    { icon: Truck, title: 'Kirim Cepat', desc: 'Produk dikirim cepat & terlacak' },
    { icon: ShieldCheck, title: 'Produk Terjamin', desc: 'Kurasi kualitas sebelum dijual' },
    { icon: PackageCheck, title: 'Dropship Ready', desc: 'Siap kirim atas nama pelanggan' },
    { icon: BadgePercent, title: 'Harga Promo', desc: 'Diskon rutin tiap minggu' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <BannerCarousel banners={banners} />

      {/* Produk pilihan */}
      <section className="mt-9" aria-labelledby="pilihan-title">
        <SectionHeading
          title="Produk Pilihan"
          subtitle="Pilihan terbaik minggu ini"
          action={
            <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Lihat semua <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div id="pilihan-title" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.length ? (
            list.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="Belum ada produk"
                description="Tambahkan produk pertama melalui dashboard admin."
                action={
                  <Link to="/admin/products/new" className="btn-primary">
                    Tambah Produk
                  </Link>
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* Promo terbesar */}
      {promos.length > 0 && (
        <section className="mt-9" aria-labelledby="promo-title">
          <SectionHeading
            title="Sedang Diskon"
            subtitle="Harga promo terbatas"
            action={
              <Link to="/products?sort=discount" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Semua promo <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div id="promo-title" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {promos.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Benefit */}
      <section className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card flex items-start gap-3 p-4">
            <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-900">{title}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{desc}</span>
            </span>
          </div>
        ))}
      </section>

      {/* CTA katalog */}
      <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-center sm:py-10">
        <h2 className="text-xl font-extrabold text-white sm:text-2xl">Temukan {active.length}+ produk pilihanmu</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-indigo-100">
          Elektronik, smartphone, outfit, sepatu, hingga tas — beli via affiliate atau WhatsApp.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/products" className="btn bg-white px-5 py-3 font-bold text-indigo-700 hover:bg-indigo-50">
            Belanja Sekarang
          </Link>
          {active.length > 0 && (
            <span className="btn border border-white/40 px-5 py-3 text-white">
              Mulai dari {formatPrice(Math.min(...active.map(effectivePrice)))}
            </span>
          )}
        </div>
      </section>
    </div>
  )
}
