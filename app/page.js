import PageShell from '../components/PageShell'
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

  return (
    <PageShell>
      <JsonLd data={jsonLd} />
      <div>
        <CommentsSlider comments={comments} />
        <h1 className="text-xl text-center drop-shadow mb-4 mt-8 font-Logo">Recent Posts</h1>
        <OwnerLink
          href="/create"
          wrapperClassName="my-8 text-center"
          className="bg-rose-600 text-white font-Primary text-sm px-5 py-2 rounded-full"
        >
          Create New Post
        </OwnerLink>
        <Posts posts={posts} />
      </div>
    </PageShell>
  )
}
