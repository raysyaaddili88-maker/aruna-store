/** Format angka menjadi Rupiah, contoh: 399000 -> "Rp399.000" */
export function formatPrice(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 'Rp0'
  return 'Rp' + Math.round(amount).toLocaleString('id-ID')
}
