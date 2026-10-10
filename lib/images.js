// Image URL helpers: Cloudinary transforms + Unsplash params. Plain <img> with srcset (lean, no optimizer).

const isCloudinary = (u) => /^https?:\/\/res\.cloudinary\.com\//.test(u) && u.includes('/upload/')
const isUnsplash = (u) => /^https?:\/\/images\.unsplash\.com\//.test(u)

// opts: { w, h, crop } ; returns optimized URL (or original for unknown hosts)
export function optimizeImage(url, { w, h, crop } = {}) {
  if (!url) return url
  if (isCloudinary(url)) {
    const [head, tail] = url.split('/upload/')
    // Leave alone if a transform segment is already present (e.g. w_800,c_fill)
    if (/^[a-z]{1,3}_[^/]*$/.test(tail.split('/')[0])) return url
    const t = ['f_auto', 'q_auto']
    if (crop) t.push('c_fill', 'g_auto')
    if (w) t.push(`w_${w}`)
    if (h) t.push(`h_${h}`)
    return `${head}/upload/${t.join(',')}/${tail}`
  }
  if (isUnsplash(url)) {
    const u = new URL(url)
    u.searchParams.set('auto', 'format')
    u.searchParams.set('q', '70')
    if (w) u.searchParams.set('w', String(w))
    if (h) u.searchParams.set('h', String(h))
    if (crop) u.searchParams.set('fit', 'crop')
    return u.toString()
  }
  return url
}

export function imageSrcSet(url, widths) {
  if (!url || !(isCloudinary(url) || isUnsplash(url))) return undefined
  return widths.map((w) => `${optimizeImage(url, { w })} ${w}w`).join(', ')
}

export const ogImage = (url) => optimizeImage(url, { w: 1200, h: 630, crop: true })
