'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

// Called from CreatePost / EditPost after a write so the cached pages update immediately.
// Only purges caches (no data is read or written here), so it is safe to expose.
export async function revalidateSite(postId) {
  const id = typeof postId === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(postId) ? postId : null
  revalidateTag('posts')
  revalidateTag('comments')
  if (id) revalidateTag(`post-${id}`)
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')
  if (id) revalidatePath(`/post/${id}`)
}
