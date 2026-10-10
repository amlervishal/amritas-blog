import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '../../../components/PageShell'
import Comments from '../../../components/Comments'
import ShareButton from '../../../components/ShareButton'
import JsonLd from '../../../components/JsonLd'
import { getPostById, getPostSummaries, getCommentsForPost } from '../../../lib/firestore'
import { cleanMsoContent } from '../../../lib/content'
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

  const content = cleanMsoContent(post.content)
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
    <PageShell>
      <JsonLd data={jsonLd} />
      <article className="container flex flex-col content-center items-center px-4">
        <div className="md:mx-0 lg:mx-60">
          <img
            src={optimizeImage(heroSrc, { w: 1600 })}
            srcSet={imageSrcSet(heroSrc, [640, 1000, 1600])}
            sizes="(min-width: 1024px) 60vw, 100vw"
            width={1600}
            height={900}
            alt={post.title}
            fetchPriority="high"
            decoding="async"
            className="w-full aspect-[16/9] lg:aspect-auto lg:h-96 object-cover mb-4 rounded-lg brightness-90"
          />
          <div className="flex flex-col md:px-0 lg:px-5">
            <h1 className="font-Logo text-3xl font-light leading-relaxed mb-3">{post.title}</h1>
            <div className="flex items-center justify-between mb-3">
              <time dateTime={post.createdAt || undefined} className="font-Primary text-xs">{post.date}</time>
              <ShareButton postId={id} title={post.title} />
            </div>
          </div>
        </div>

        <div className="md:mx-0 lg:mx-60 md:px-0 lg:px-5">
          <div
            className="mb-8 font-Primary prose max-w-none [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:text-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <Comments postId={id} initialComments={comments} />
          <div className="flex flex-col justify-between items-center gap-2">
            <Link href="/" className="text-slate-700 text-xs font-Primary border-solid border rounded-full border-slate-600 hover:border-rose-500 tracking-widest hover:text-rose-500 md:text-base px-5 py-0">
              Back to Home
            </Link>
          </div>
        </div>
      </article>
    </PageShell>
  )
}
