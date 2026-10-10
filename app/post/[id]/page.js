import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '../../../components/PageShell'
import Comments from '../../../components/Comments'
import ShareButton from '../../../components/ShareButton'
import JsonLd from '../../../components/JsonLd'
import { getPostById, getPostSummaries, getCommentsForPost } from '../../../lib/firestore'
import { cleanMsoContent, unwrapHeadingParagraphs } from '../../../lib/content'
import { sanitizePostHtml } from '../../../lib/sanitize'
import { optimizeImage, imageSrcSet, ogImage } from '../../../lib/images'
import { SITE_URL, SITE_NAME, AUTHOR_NAME, DEFAULT_OG_IMAGE } from '../../../lib/site'

export const revalidate = 300 // seconds (must be a literal)
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const posts = await getPostSummaries()
    return posts.map((p) => ({ id: p.id }))
  } catch {
    return []
  }
}

const cleanMeta = (m) => (m && m.length > 30 && !/<!--|\{|\}|<[a-z]/i.test(m) ? m : '')

export async function generateMetadata({ params }) {
  const { id } = await params
  const post = await getPostById(id).catch(() => null)
  if (!post) return { title: 'Post not found', robots: { index: false, follow: false } }

  const description = post.description || cleanMeta(post.metaDescriptionRaw) || 'A blog post by Dr. Amrita Vohra on Pin Drop Silence.'
  const image = post.imageUrl ? ogImage(post.imageUrl) : DEFAULT_OG_IMAGE
  const url = `/post/${id}`
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      authors: [AUTHOR_NAME],
      publishedTime: post.createdAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [image] },
  }
}

export default async function PostPage({ params }) {
  const { id } = await params
  const [post, comments] = await Promise.all([
    getPostById(id),
    getCommentsForPost(id).catch(() => []),
  ])
  if (!post) notFound()

  const content = sanitizePostHtml(unwrapHeadingParagraphs(cleanMsoContent(post.content)))
  const dropCap = /^[A-Za-z]/.test(content.replace(/<[^>]*>|&nbsp;|\s+/g, ' ').trim())
  const heroSrc = post.imageUrl || '/default-image.png'
  const url = `${SITE_URL}/post/${id}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title.slice(0, 110),
    description: post.description,
    image: [post.imageUrl ? ogImage(post.imageUrl) : DEFAULT_OG_IMAGE],
    datePublished: post.createdAt || undefined,
    dateModified: post.updatedAt || post.createdAt || undefined,
    author: { '@type': 'Person', name: AUTHOR_NAME, url: `${SITE_URL}/about` },
    publisher: { '@type': 'Person', name: AUTHOR_NAME, url: SITE_URL },
    inLanguage: 'en',
    url,
  }

  return (
    <PageShell wide>
      <JsonLd data={jsonLd} />
      <article>
        <div className="post-cover">
          <img
            src={optimizeImage(heroSrc, { w: 1600 })}
            srcSet={imageSrcSet(heroSrc, [640, 1000, 1600])}
            sizes="100vw"
            width={1600}
            height={686}
            alt={post.title}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <header className="post-head">
          <p className="kicker red">An essay</p>
          <h1 className="display">{post.title}</h1>
          <div className="post-meta kicker">
            <time dateTime={post.createdAt || undefined}>{post.date}</time>
            <span className="dot" aria-hidden="true" />
            <span>{AUTHOR_NAME}</span>
            <ShareButton postId={id} title={post.title} />
          </div>
        </header>

        <div className={`essay${dropCap ? ' dropcap' : ''}`} dangerouslySetInnerHTML={{ __html: content }} />

        <div className="blossom-divider" aria-hidden="true">
          <picture>
            <source srcSet="/art/sprig.avif" type="image/avif" />
            <source srcSet="/art/sprig.webp" type="image/webp" />
            <img src="/art/sprig.png" width={900} height={258} alt="" loading="lazy" decoding="async" />
          </picture>
        </div>

        <Comments postId={id} initialComments={comments} />
        <div className="post-end">
          <Link href="/blog" className="pill red">All writings</Link>
        </div>
      </article>
    </PageShell>
  )
}
