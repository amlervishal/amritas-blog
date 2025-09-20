import PostPageClient from './PostPageClient'
import { getPost } from '../../../services/api'

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  try {
    // Fetch the actual post data
    const post = await getPost(resolvedParams.id);

    // Create a clean description from content
    const cleanDescription = post.content
      ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
      : 'Blog post by Dr. Amrita Vohra';

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
          }
        ] : [],
        publishedTime: post.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: cleanDescription,
        images: post.imageUrl ? [post.imageUrl] : [],
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