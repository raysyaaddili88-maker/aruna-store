import { buildWhatsAppUrl, fillMessageTemplate } from './whatsapp'

/**
 * Bangun URL CTA final untuk sebuah produk.
 * Mengembalikan { kind, href, label, external, disabled }
 *  - kind: affiliate | whatsapp | custom | none
 */
export function resolveProductCta(product, settings) {
  const cta = product?.cta || {}
  const type = cta.type || 'none'
  const label = cta.text?.trim() || 'Beli Sekarang'

  if (type === 'affiliate' || type === 'custom') {
    const href = String(cta.url || '').trim()
    if (!href) return { kind: 'none', href: '#', label, external: false, disabled: true }
    return { kind: type, href, label, external: true, disabled: false }
  }

  if (type === 'whatsapp') {
    const phone = cta.phone || settings?.whatsappNumber || ''
    const template =
      cta.message || settings?.whatsappTemplate || 'Halo kak, saya tertarik dengan produk {product_name}.'
    const href = buildWhatsAppUrl(phone, fillMessageTemplate(template, product))
    return { kind: 'whatsapp', href, label, external: true, disabled: !phone }
  }

  return {
    kind: 'none',
    href: product ? `/product/${product.slug}` : '/',
    label: 'Lihat Detail',
    external: false,
    disabled: false,
  }
}
