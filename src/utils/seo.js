import { useEffect } from 'react'

/**
 * Update <title> + meta description/keywords + Open Graph + canonical secara dinamis.
 * (SEO dasar sisi client; untuk crawler tanpa JS gunakan prerender/SSR di backend)
 */
export function useSeo({ title, description, keywords, image, url, type = 'website', siteName = 'Aruna Store' } = {}) {
  useEffect(() => {
    const fullTitle = title
      ? title.toLowerCase().includes(siteName.toLowerCase())
        ? title
        : `${title} | ${siteName}`
      : siteName
    document.title = fullTitle

    setMeta('name', 'description', description)
    setMeta('name', 'keywords', keywords)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)

    setLink('canonical', url || window.location.href)
  }, [title, description, keywords, image, url, type, siteName])
}

function setMeta(attr, key, value) {
  if (!value) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
