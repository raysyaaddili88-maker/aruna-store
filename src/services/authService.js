import { KEYS, read, remove, write } from './storage'

/**
 * ─────────────────────────────────────────────────────────────
 *  AUTH DEMO (FRONTEND ONLY)
 *  ⚠️ JANGAN gunakan pola ini untuk produksi.
 *  Autentikasi produksi HARUS dilakukan di backend/API
 *  (password di-hash di server, token/JWT disimpan httpOnly cookie).
 *  File ini hanya contoh struktur agar mudah disambungkan ke API nanti.
 * ─────────────────────────────────────────────────────────────
 */

const DEMO_USER = 'admin'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 jam

function simpleHash(text) {
  let h = 5381
  for (let i = 0; i < text.length; i += 1) h = ((h << 5) + h + text.charCodeAt(i)) | 0
  return String(h >>> 0)
}

// Bukan "password asli": hanya hash demo sederhana untuk keperluan tampilan.
const DEMO_PASS_HASH = simpleHash('admin123')

export function login(username, password) {
  if (username === DEMO_USER && simpleHash(password) === DEMO_PASS_HASH) {
    const session = { user: DEMO_USER, exp: Date.now() + SESSION_TTL_MS }
    write(KEYS.auth, session)
    return { ok: true, user: DEMO_USER }
  }
  return { ok: false, message: 'Username atau password salah.' }
}

export function logout() {
  remove(KEYS.auth)
}

export function getSession() {
  const session = read(KEYS.auth, null)
  if (!session || !session.exp || session.exp < Date.now()) {
    remove(KEYS.auth)
    return null
  }
  return session
}

export function isAuthenticated() {
  return Boolean(getSession())
}
