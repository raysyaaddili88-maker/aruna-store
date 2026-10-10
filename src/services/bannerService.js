import { KEYS, read, write } from './storage'

export function listBanners({ activeOnly = false } = {}) {
  const items = read(KEYS.banners, [])
  const sorted = [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
  return activeOnly ? sorted.filter((b) => b.status) : sorted
}

export function createBanner(payload) {
  const items = read(KEYS.banners, [])
  const banner = {
    id: `b-${Date.now().toString(36)}`,
    title: payload.title || 'Banner Baru',
    subtitle: payload.subtitle || '',
    buttonText: payload.buttonText || '',
    buttonUrl: payload.buttonUrl || '/products',
    image: payload.image || '',
    order: Number(payload.order) || items.length + 1,
    status: payload.status !== false,
  }
  write(KEYS.banners, [...items, banner])
  return banner
}

export function updateBanner(id, patch) {
  const items = read(KEYS.banners, [])
  const index = items.findIndex((b) => String(b.id) === String(id))
  if (index === -1) return null
  items[index] = { ...items[index], ...patch, order: Number(patch.order ?? items[index].order) }
  write(KEYS.banners, items)
  return items[index]
}

export function deleteBanner(id) {
  write(
    KEYS.banners,
    read(KEYS.banners, []).filter((b) => String(b.id) !== String(id)),
  )
}

export function toggleBannerStatus(id) {
  const target = read(KEYS.banners, []).find((b) => String(b.id) === String(id))
  if (!target) return null
  return updateBanner(id, { status: !target.status })
}
