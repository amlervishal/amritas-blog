import { getPostSummaries } from '../lib/firestore'
import { SITE_URL } from '../lib/site'

export const revalidate = 300 // seconds (must be a literal)

export default async function sitemap() {
  const posts = await getPostSummaries().catch(() => [])
  const newest = posts[0]?.updatedAt ? new Date(posts[0].updatedAt) : new Date()
  return [
    { url: SITE_URL, lastModified: newest, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: newest, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'yearly', priority: 0.5 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/post/${p.id}`,
      lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ]
}
