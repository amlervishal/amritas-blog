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
    <PageShell posts={posts}>
      <header style={{ textAlign: 'center', marginBottom: 72 }}>
        <p className="kicker red">Writings</p>
        <h1 className="display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', margin: '14px 0 12px' }}>Every essay</h1>
        <p style={{ fontStyle: 'italic', fontSize: 24, color: 'var(--ink-soft)', margin: 0 }}>Between classrooms and life.</p>
      </header>
      <Posts posts={posts} />
    </PageShell>
  )
}
