import PostPageClient from './PostPageClient'

export default async function PostPage({ params }) {
  const resolvedParams = await params;
  return <PostPageClient params={resolvedParams} />
}