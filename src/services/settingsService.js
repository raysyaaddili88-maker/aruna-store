import { initialSettings } from '../data/initialData'
import { KEYS, read, write } from './storage'

export function getSettings() {
  return { ...initialSettings, ...read(KEYS.settings, {}) }
}

export function updateSettings(patch) {
  const merged = { ...getSettings(), ...patch }
  write(KEYS.settings, merged)
  return merged
}

export function getCtaSettings() {
  return read(KEYS.cta, {})
}

export function updateCtaSettings(patch) {
  const merged = { ...getCtaSettings(), ...patch }
  write(KEYS.cta, merged)
  return merged
}

export function getWhatsappSettings() {
  return read(KEYS.whatsapp, {})
}

export function updateWhatsappSettings(patch) {
  const merged = { ...getWhatsappSettings(), ...patch }
  write(KEYS.whatsapp, merged)
  return merged
}
