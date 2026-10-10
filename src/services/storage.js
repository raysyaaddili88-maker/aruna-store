/** Layer penyimpanan lokal. Di produksi tinggal ganti implementasi ini dengan REST API. */

const PREFIX = 'aruna:'

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error('Gagal menyimpan data (localStorage penuh?):', err)
    return false
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* abaikan */
  }
}

export const KEYS = {
  products: 'products',
  banners: 'banners',
  settings: 'settings',
  cta: 'ctaSettings',
  whatsapp: 'whatsappSettings',
  auth: 'adminSession',
  seedVersion: 'seedVersion',
}
