import PostPageClient from './PostPageClient'

export async function generateStaticParams() {
  // Return empty array for now - this will be dynamically handled
  return []
}

export default async function PostPage({ params }) {
  const resolvedParams = await params;
  return <PostPageClient params={resolvedParams} />
}