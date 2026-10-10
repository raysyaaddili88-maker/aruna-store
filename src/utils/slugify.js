/** Ubah teks menjadi slug SEO-friendly: "Hoodie Oversize!" -> "hoodie-oversize" */
export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Pastikan slug unik terhadap daftar slug yang sudah dipakai */
export function uniqueSlug(base, taken = []) {
  const set = new Set(taken)
  let slug = base || 'produk'
  let i = 2
  while (set.has(slug)) {
    slug = `${base}-${i}`
    i += 1
  }
  return slug
}
