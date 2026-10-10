// Server-side Firestore reads over the public REST API (keeps firebase SDK out of the server + client bundle).
import { htmlToText, truncateWords, truncateChars } from './content'
import { REVALIDATE_SECONDS } from './site'

const PROJECT = 'pindropsilence-26bda'
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

const val = (f) => {
  if (!f) return undefined
  if ('stringValue' in f) return f.stringValue
  if ('timestampValue' in f) return f.timestampValue
  if ('integerValue' in f) return Number(f.integerValue)
  if ('booleanValue' in f) return f.booleanValue
  return undefined
}

const fromDoc = (d) => {
  const out = { id: d.name.split('/').pop() }
  for (const [k, v] of Object.entries(d.fields || {})) out[k] = val(v)
  return out
}

async function fsFetch(url, init = {}, tags = []) {
  const res = await fetch(url, {
    ...init,
    next: { revalidate: REVALIDATE_SECONDS, tags },
  })
  if (!res.ok) {
    const err = new Error(`Firestore ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

const dateFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata' })
export const formatDate = (iso) => (iso ? dateFmt.format(new Date(iso)) : '')

function toSummary(p) {
  const text = htmlToText(p.content || '')
  const hasGoodMeta = p.metaDescription && !/<!--|\{|\}/.test(p.metaDescription) && p.metaDescription.length > 30
  return {
    id: p.id,
    title: p.title || 'Untitled Post',
    createdAt: p.createdAt || null,
    updatedAt: p.updatedAt || p.createdAt || null,
    date: formatDate(p.createdAt),
    imageUrl: p.imageUrl || '',
    excerpt: text ? truncateWords(text, 15) : 'No content',
    description: truncateChars(text || (hasGoodMeta ? p.metaDescription : ''), 155),
  }
}

// Lean list for home/blog/sitemap: never ships post content to the client.
export async function getPostSummaries() {
  const all = []
  let pageToken = ''
  do {
    const url = `${BASE}/posts?pageSize=100${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`
    const data = await fsFetch(url, {}, ['posts'])
    for (const d of data.documents || []) all.push(toSummary(fromDoc(d)))
    pageToken = data.nextPageToken || ''
  } while (pageToken)
  return all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

// Full post (server only). Returns null when missing.
export async function getPostById(id) {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id || '')) return null
  try {
    const d = await fsFetch(`${BASE}/posts/${id}`, {}, ['posts', `post-${id}`])
    const p = fromDoc(d)
    return { ...p, ...toSummary(p), content: p.content || '', metaDescriptionRaw: p.metaDescription }
  } catch (e) {
    if (e.status === 404) return null
    throw e
  }
}

const normalizeComment = (c) => ({
  id: c.id,
  postId: c.postId,
  authorName: c.authorName || 'Anonymous',
  content: c.content || '',
  createdAt: c.createdAt || null,
  date: formatDate(c.createdAt),
})

async function runQuery(structuredQuery, tags) {
  const data = await fsFetch(
    `${BASE}:runQuery`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ structuredQuery }) },
    tags
  )
  return data.filter((r) => r.document).map((r) => normalizeComment(fromDoc(r.document)))
}

export const getLatestComments = (limit = 5) =>
  runQuery(
    { from: [{ collectionId: 'comments' }], orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }], limit },
    ['comments']
  )

export const getCommentsForPost = async (postId) => {
  const list = await runQuery(
    {
      from: [{ collectionId: 'comments' }],
      where: { fieldFilter: { field: { fieldPath: 'postId' }, op: 'EQUAL', value: { stringValue: postId } } },
    },
    ['comments', `comments-${postId}`]
  )
  return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}
