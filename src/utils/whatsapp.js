import { formatPrice } from './formatPrice'

/**
 * Ganti placeholder pada template pesan WhatsApp.
 * Placeholder yang didukung: {product_name} {price}
 */
export function fillMessageTemplate(template = '', product = {}) {
  const mapping = {
    '{product_name}': product.name || '-',
    '{price}': formatPrice(product.salePrice || product.normalPrice || 0),
  }
  return Object.entries(mapping).reduce(
    (text, [key, value]) => text.split(key).join(value),
    String(template || ''),
  )
}

/** Normalisasi nomor Indonesia: 0831... -> 62831... */
export function normalizePhone(phone = '') {
  let digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('0')) digits = '62' + digits.slice(1)
  return digits
}

/** Bangun URL wa.me yang valid (format resmi WhatsApp) */
export function buildWhatsAppUrl(phone, message) {
  const target = normalizePhone(phone)
  const text = encodeURIComponent(String(message || '').trim())
  return `https://wa.me/${target}${text ? `?text=${text}` : ''}`
}
