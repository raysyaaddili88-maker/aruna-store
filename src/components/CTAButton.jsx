import { MessageCircle, ExternalLink, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStoreValue } from '../context/StoreContext'
import { getWhatsappSettings } from '../services/settingsService'
import { resolveProductCta } from '../utils/cta'

/**
 * Tombol CTA dinamis per produk: affiliate | whatsapp | custom | none.
 */
export default function CTAButton({ product, className = '', size = 'md', children, full = false }) {
  const navigate = useNavigate()
  const waSettings = useStoreValue(getWhatsappSettings)
  const cta = resolveProductCta(product, {
    whatsappNumber: waSettings.number,
    whatsappTemplate: waSettings.template,
  })

  const height = size === 'sm' ? 'h-9 px-3 text-xs' : size === 'lg' ? 'h-13 px-6 text-base' : 'h-11 px-4 text-sm'
  const Icon = cta.kind === 'whatsapp' ? MessageCircle : cta.kind === 'none' ? ArrowRight : ExternalLink

  const handleClick = () => {
    if (cta.disabled) return
    if (cta.external) {
      window.open(cta.href, '_blank', 'noopener,noreferrer')
    } else {
      navigate(cta.href)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={cta.disabled}
      className={`btn ${height} ${cta.kind === 'whatsapp' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'} ${
        full ? 'w-full' : ''
      } ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{children || cta.label}</span>
    </button>
  )
}
