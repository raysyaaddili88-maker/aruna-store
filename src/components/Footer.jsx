import { Link } from 'react-router-dom'
import { Camera, MessageCircle, Music2, Store, ThumbsUp } from 'lucide-react'
import { useStoreValue } from '../context/StoreContext'
import { getSettings } from '../services/settingsService'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const settings = useStoreValue(getSettings)
  const year = YEAR

  const socials = [
    { href: settings.instagram, icon: Camera, label: 'Instagram' },
    { href: settings.tiktok, icon: Music2, label: 'TikTok' },
    { href: settings.facebook, icon: ThumbsUp, label: 'Facebook' },
    { href: settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : '', icon: MessageCircle, label: 'WhatsApp' },
  ].filter((s) => s.href)

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Store className="h-5 w-5" />
            </span>
            <span className="text-base font-extrabold text-slate-900">{settings.storeName}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{settings.footer || settings.description}</p>
          <div className="mt-4 flex gap-2">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">Belanja</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/products" className="text-sm text-slate-500 hover:text-indigo-600">
                Semua Produk
              </Link>
            </li>
            <li>
              <Link to="/products?sort=discount" className="text-sm text-slate-500 hover:text-indigo-600">
                Promo & Diskon
              </Link>
            </li>
            <li>
              <Link to="/products?cta=whatsapp" className="text-sm text-slate-500 hover:text-indigo-600">
                Beli via WhatsApp
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">Hubungi Kami</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              WhatsApp:{' '}
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-600 hover:underline">
                +{settings.whatsapp}
              </a>
            </li>
            <li>{settings.tagline}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-500">
          {settings.copyright || `© ${year} ${settings.storeName}. Seluruh hak cipta dilindungi.`}
        </div>
      </div>
    </footer>
  )
}
