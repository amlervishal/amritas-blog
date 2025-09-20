'use client'

import BlogPreview from '../../../components/BlogPreview'
import { useUser } from '../../../hooks/useUser'

export default function PostPageClient({ params }) {
  const user = useUser()

  if (!params?.id) {
    return <div>Loading...</div>
  }

  return <BlogPreview user={user} id={params.id} />
}