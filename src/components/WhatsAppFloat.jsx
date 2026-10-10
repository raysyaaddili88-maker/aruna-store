import { MessageCircle } from 'lucide-react'
import { useStoreValue } from '../context/StoreContext'
import { getSettings } from '../services/settingsService'
import { buildWhatsAppUrl } from '../utils/whatsapp'

/** Tombol mengambang agar pengunjung bisa langsung bertanya via WhatsApp dari halaman mana pun. */
export default function WhatsAppFloat() {
  const settings = useStoreValue(getSettings)
  const href = buildWhatsAppUrl(settings.whatsapp, 'Halo kak, saya ingin bertanya.')
  if (!settings.whatsapp) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tanya via WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Tanya via WhatsApp</span>
    </a>
  )
}
