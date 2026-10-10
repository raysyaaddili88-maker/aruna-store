import {
  initialCtaSettings,
  initialProducts,
  initialBanners,
  initialSettings,
  initialWhatsappSettings,
} from '../data/initialData'
import { KEYS, read, write } from './storage'

/** Naikkan angka ini untuk memaksa seed ulang data bawaan (mis. setelah ganti gambar). */
const SEED_VERSION = 4

/**
 * Seed data awal ke localStorage hanya saat belum ada data,
 * atau saat versi seed berubah (agar konten bawaan ter-refresh).
 * Pindahkan ke API/backend nantinya (mis. GET /api/bootstrap).
 */
export function seedIfNeeded() {
  if (read(KEYS.seedVersion, null) !== SEED_VERSION) {
    resetAllData()
    write(KEYS.seedVersion, SEED_VERSION)
    return
  }

  const seeds = [
    [KEYS.products, initialProducts],
    [KEYS.banners, initialBanners],
    [KEYS.settings, initialSettings],
    [KEYS.cta, initialCtaSettings],
    [KEYS.whatsapp, initialWhatsappSettings],
  ]
  for (const [key, value] of seeds) {
    if (read(key, null) === null) write(key, value)
  }
}

export function resetAllData() {
  write(KEYS.products, initialProducts)
  write(KEYS.banners, initialBanners)
  write(KEYS.settings, initialSettings)
  write(KEYS.cta, initialCtaSettings)
  write(KEYS.whatsapp, initialWhatsappSettings)
}
