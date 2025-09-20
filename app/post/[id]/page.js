import PostPageClient from './PostPageClient'
import { getPost } from '../../../services/api'

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  try {
    // Fetch the actual post data
    const post = await getPost(resolvedParams.id);

    // Create a clean description from content
    const cleanDescription = post.content
      ? post.content.replace(/<[^>]*>/g, '').trim().substring(0, 155) + '...'
      : 'Read the latest insightful blog post by Dr. Amrita Vohra on Pin Drop Silence.';

    return {
      title: `${post.title} | Pin Drop Silence`,
      description: cleanDescription,
      openGraph: {
        title: post.title,
        description: cleanDescription,
        type: 'article',
        siteName: 'Pin Drop Silence',
        authors: ['Dr. Amrita Vohra'],
        images: post.imageUrl ? [
          {
            url: post.imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
            type: 'image/jpeg',
          }
        ] : [
          {
            url: 'https://www.pindropsilence.in/default-image.png',
            width: 1200,
            height: 630,
            alt: 'Pin Drop Silence Blog',
            type: 'image/png',
          }
        ],
        publishedTime: post.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: cleanDescription,
        images: post.imageUrl ? [post.imageUrl] : ['https://www.pindropsilence.in/default-image.png'],
        creator: '@pindropsilence',
        site: '@pindropsilence',
      },
      other: {
        'article:author': 'Dr. Amrita Vohra',
        'article:section': 'Blog',
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:locale': 'en_US',
      },
    }
  } catch (error) {
    // Fallback if post not found
    return {
      title: 'Post | Pin Drop Silence',
      description: 'Blog post by Dr. Amrita Vohra',
      openGraph: {
        title: 'Pin Drop Silence',
        description: 'Blog by Dr. Amrita Vohra',
        type: 'article',
        siteName: 'Pin Drop Silence',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Pin Drop Silence',
        description: 'Blog by Dr. Amrita Vohra',
      },
    }
  }
}

export default async function PostPage({ params }) {
  const resolvedParams = await params;
  return <PostPageClient params={resolvedParams} />
}