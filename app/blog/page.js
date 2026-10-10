import PageShell from '../../components/PageShell'
import Posts from '../../components/Posts'
import { getPostSummaries } from '../../lib/firestore'

export const revalidate = 300 // seconds (must be a literal)

export const metadata = {
  title: 'All Posts',
  description: 'Browse every blog post by Dr. Amrita Vohra on education, early years, relationships and personal growth.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const posts = await getPostSummaries()
  return (
    <PageShell>
      <h1 className="sr-only">All posts</h1>
      <Posts posts={posts} />
    </PageShell>
  )
}
