import PostPageClient from './PostPageClient'

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  return {
    title: `Post ${resolvedParams.id} | Pin Drop Silence`,
    description: 'Blog post by Dr. Amrita Vohra',
    openGraph: {
      title: `Post ${resolvedParams.id} | Pin Drop Silence`,
      description: 'Blog post by Dr. Amrita Vohra',
      type: 'article',
      siteName: 'Pin Drop Silence',
      authors: ['Dr. Amrita Vohra'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Post ${resolvedParams.id} | Pin Drop Silence`,
      description: 'Blog post by Dr. Amrita Vohra',
    },
  }
}

export default async function PostPage({ params }) {
  const resolvedParams = await params;
  return <PostPageClient params={resolvedParams} />
}