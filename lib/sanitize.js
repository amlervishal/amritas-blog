import 'server-only'
import sanitizeHtml from 'sanitize-html'

// Server-only allowlist sanitiser for post HTML (runs at render time; stored content is untouched).
const OPTIONS = {
  allowedTags: [
    'p', 'br', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
    'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'span', 'div', 'hr',
    'figure', 'figcaption', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'rel', 'target'],
    img: ['src', 'alt', 'width', 'height'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
  },
  allowedSchemes: ['http', 'https'],
  allowedSchemesByTag: { a: ['http', 'https', 'mailto'], img: ['http', 'https'] },
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
  // script/style contents are dropped entirely; iframe/object/embed are not allowed tags
  nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript'],
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || ''
      if (/^https?:\/\//i.test(href)) {
        return { tagName, attribs: { ...attribs, rel: 'noopener noreferrer', target: '_blank' } }
      }
      const { target, rel, ...rest } = attribs
      return { tagName, attribs: rest }
    },
  },
}

export function sanitizePostHtml(html) {
  return sanitizeHtml(html || '', OPTIONS)
}
