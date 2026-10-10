/** Generator gambar placeholder lokal (SVG data URI) — aman, offline, mudah diganti. */
const PALETTE = ['#1e293b', '#312e81', '#0f766e', '#7c2d12', '#4c1d95', '#0c4a6e', '#3f3f46', '#14532d']

export function placeholderImage(label = 'Produk', colorIndex = 0) {
  const color = PALETTE[Math.abs(colorIndex) % PALETTE.length]
  const words = String(label).toUpperCase().split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > 16) {
      if (current) lines.push(current)
      current = word
    } else {
      current = (current + ' ' + word).trim()
    }
  }
  if (current) lines.push(current)
  const shown = lines.slice(0, 3)

  const startY = 400 - ((shown.length - 1) * 44) / 2
  const text = shown
    .map(
      (line, i) =>
        `<text x="400" y="${startY + i * 44}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#ffffff" fill-opacity="0.92" text-anchor="middle">${escapeXml(
          line,
        )}</text>`,
    )
    .join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><circle cx="640" cy="160" r="180" fill="#ffffff" fill-opacity="0.06"/><circle cx="140" cy="660" r="220" fill="#ffffff" fill-opacity="0.05"/>${text}</svg>`

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c])
}

/** Banner placeholder untuk hero */
export function bannerPlaceholder(title = 'Promo Spesial', color = '#4f46e5') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="700" viewBox="0 0 1600 700"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs><rect width="1600" height="700" fill="url(#b)"/><circle cx="1320" cy="180" r="260" fill="#ffffff" fill-opacity="0.08"/><circle cx="240" cy="560" r="200" fill="#ffffff" fill-opacity="0.07"/><text x="800" y="360" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(
    title,
  )}</text></svg>`
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
