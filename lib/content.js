// Shared (server + client safe) helpers for cleaning pasted MS Word HTML and deriving text.

// Clean MSO/Word styles and comments from pasted content
export function cleanMsoContent(html) {
  let cleaned = html || ''
  cleaned = cleaned.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '')
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '')
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '')
  cleaned = cleaned.replace(/<meta[^>]*>/gi, '')
  cleaned = cleaned.replace(/<link[^>]*>/gi, '')
  cleaned = cleaned.replace(/<\/?xml[^>]*>/gi, '')
  cleaned = cleaned.replace(/<\/?\w+:[^>]*>/gi, '')
  cleaned = cleaned.replace(/mso-[^;:"']+:[^;:"']+;?/gi, '')
  cleaned = cleaned.replace(/font-family:[^;:"']+;?/gi, '')
  cleaned = cleaned.replace(/font-size:[^;:"']+;?/gi, '')
  cleaned = cleaned.replace(/\s*class="Mso[^"]*"/gi, '')
  cleaned = cleaned.replace(/\s*style="\s*"/gi, '')
  cleaned = cleaned.replace(/\s*lang="[^"]*"/gi, '')
  cleaned = cleaned.replace(/<span\s*>([\s\S]*?)<\/span>/gi, '$1')
  cleaned = cleaned.replace(/(<br\s*\/?\s*>){2,}/gi, '</p><p>')
  cleaned = cleaned.replace(/&nbsp;/gi, ' ')
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '')
  return cleaned
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…' }

// HTML -> plain text, no DOM needed (works on the server)
export function htmlToText(html) {
  const text = cleanMsoContent(html)
    .replace(/<\/(p|div|h[1-6]|li|br)>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
  return text.replace(/\s+/g, ' ').trim()
}

export function truncateWords(text, wordLimit = 15) {
  const words = text.split(/\s+/)
  return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text
}

export function truncateChars(text, max = 155) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const i = cut.lastIndexOf(' ')
  return (i > 60 ? cut.slice(0, i) : cut).replace(/[\s,.;:-]+$/, '') + '...'
}


// Posts authored with the editor's "H1" button often wrap whole <p> blocks in headings (invalid HTML that
// renders as giant text). Unwrap those for display; stored content is untouched.
export function unwrapHeadingParagraphs(html) {
  return (html || '')
    .replace(/<h[1-6][^>]*>\s*(<p[\s>])/gi, '$1')
    .replace(/(<\/p>)\s*<\/h[1-6]>/gi, '$1')
}
