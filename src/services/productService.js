import { KEYS, read, write } from './storage'
import { slugify, uniqueSlug } from '../utils/slugify'

/**
 * Service produk.
 * Sekarang memakai localStorage — nantinya tinggal ganti isi fungsi ini
 * dengan fetch('/api/products', ...) tanpa mengubah komponen UI.
 */

function autoDiscount(normalPrice, salePrice) {
  const n = Number(normalPrice) || 0
  const s = Number(salePrice) || 0
  if (n > 0 && s > 0 && s < n) return Math.round((1 - s / n) * 100)
  return 0
}

export function listProducts() {
  const items = read(KEYS.products, [])
  return [...items].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
}

export function getProductById(id) {
  return read(KEYS.products, []).find((p) => String(p.id) === String(id)) || null
}

export function getProductBySlug(slug) {
  return read(KEYS.products, []).find((p) => p.slug === slug) || null
}

export function createProduct(payload) {
  const items = read(KEYS.products, [])
  const taken = items.map((p) => p.slug)
  const name = payload.name?.trim() || 'Produk Baru'
  const product = {
    id: payload.id || `p-${Date.now().toString(36)}`,
    name,
    slug: uniqueSlug(slugify(name) || 'produk', taken),
    mainImage: payload.mainImage || '',
    images: payload.images || [],
    normalPrice: Number(payload.normalPrice) || 0,
    salePrice: Number(payload.salePrice) || 0,
    discount: autoDiscount(payload.normalPrice, payload.salePrice),
    description: payload.description || '',
    specifications: payload.specifications || [],
    cta: payload.cta || { type: 'none', text: '', url: '' },
    status: payload.status !== false,
    featured: Boolean(payload.featured),
    createdAt: payload.createdAt || Date.now(),
    updatedAt: Date.now(),
  }
  write(KEYS.products, [product, ...items])
  return product
}

export function updateProduct(id, patch) {
  const items = read(KEYS.products, [])
  const index = items.findIndex((p) => String(p.id) === String(id))
  if (index === -1) return null
  const current = items[index]
  const merged = { ...current, ...patch, updatedAt: Date.now() }

  if (patch.name && patch.name !== current.name && !patch.slug) {
    const taken = items.filter((p) => String(p.id) !== String(id)).map((p) => p.slug)
    merged.slug = uniqueSlug(slugify(patch.name), taken)
  }
  if ('normalPrice' in patch || 'salePrice' in patch) {
    merged.discount = autoDiscount(merged.normalPrice, merged.salePrice)
  }
  items[index] = merged
  write(KEYS.products, items)
  return merged
}

export function deleteProduct(id) {
  const items = read(KEYS.products, [])
  write(
    KEYS.products,
    items.filter((p) => String(p.id) !== String(id)),
  )
}

export function toggleProductStatus(id) {
  const items = read(KEYS.products, [])
  const target = items.find((p) => String(p.id) === String(id))
  if (!target) return null
  return updateProduct(id, { status: !target.status })
}

/** Filter + sorting katalog */
export function queryProducts({ q = '', ctaType = '', minPrice, maxPrice, minDiscount = 0, sort = 'newest' } = {}) {
  let items = listProducts()
  const keyword = q.trim().toLowerCase()

  if (keyword) {
    items = items.filter((p) =>
      [p.name, p.description].filter(Boolean).join(' ').toLowerCase().includes(keyword),
    )
  }
  if (ctaType) items = items.filter((p) => p.cta?.type === ctaType)
  if (minPrice) items = items.filter((p) => effectivePrice(p) >= Number(minPrice))
  if (maxPrice) items = items.filter((p) => effectivePrice(p) <= Number(maxPrice))
  if (minDiscount) items = items.filter((p) => (p.discount || 0) >= Number(minDiscount))

  switch (sort) {
    case 'price_asc':
      items.sort((a, b) => effectivePrice(a) - effectivePrice(b))
      break
    case 'price_desc':
      items.sort((a, b) => effectivePrice(b) - effectivePrice(a))
      break
    case 'discount':
      items.sort((a, b) => (b.discount || 0) - (a.discount || 0))
      break
    case 'newest':
    default:
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }
  return items
}

export function effectivePrice(product) {
  return product.salePrice > 0 ? product.salePrice : product.normalPrice
}
