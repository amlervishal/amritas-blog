import PageShell from '../components/PageShell'
import Hero from '../components/Hero'
import Feature from '../components/Feature'
import AboutStrip from '../components/AboutStrip'
import Link from 'next/link'
import Posts from '../components/Posts'
import CommentsSlider from '../components/CommentsSlider'
import OwnerLink from '../components/OwnerLink'
import JsonLd from '../components/JsonLd'
import { getPostSummaries, getLatestComments } from '../lib/firestore'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME } from '../lib/site'

export const revalidate = 300 // seconds (must be a literal)

export const metadata = {
  title: { absolute: `${SITE_NAME} | Blogs by ${AUTHOR_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const [posts, latest] = await Promise.all([
    getPostSummaries(),
    getLatestComments(5).catch(() => []),
  ])
  const titles = new Map(posts.map((p) => [p.id, p.title]))
  const comments = latest.map((c) => ({
    id: c.id,
    authorName: c.authorName,
    content: c.content,
    postTitle: titles.get(c.postId) || 'Unknown Post',
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        url: `${SITE_URL}/about`,
        jobTitle: 'COO & Director Education, GEMS Education, India',
        sameAs: [
          'https://in.linkedin.com/in/dr-amrita-vohra-a4625b91',
          'https://www.instagram.com/amrita.aneja/',
          'https://www.facebook.com/dramrita5/',
        ],
      },
    ],
  }

  const [featured, ...rest] = posts

  return (
    <PageShell wide transparent posts={posts}>
      <JsonLd data={jsonLd} />
      <Hero />
      <Feature post={featured} />

      <section className="section" id="writings" aria-labelledby="writings-title">
        <div className="section-head">
          <div>
            <p className="kicker red">Writings</p>
            <h2 id="writings-title" className="display">Recent reflections</h2>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <OwnerLink href="/create" className="pill red">Create new post</OwnerLink>
            <Link href="/blog" className="pill">All writings</Link>
          </div>
        </div>
        <Posts posts={rest} />
      </section>

      <AboutStrip />
      <CommentsSlider comments={comments} />
    </PageShell>
  )
}
