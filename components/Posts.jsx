import Link from 'next/link'
import ShareButton from './ShareButton'
import OwnerLink from './OwnerLink'
import { optimizeImage, imageSrcSet } from '../lib/images'

const SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'

// Server component: renders lean post summaries (id, title, date, image, excerpt).
const Posts = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, i) => {
        const src = post.imageUrl || '/default-image.png'
        return (
          <div key={post.id} className="rounded-lg bg-gray-300/30 relative overflow-hidden shadow-lg">
            <img
              src={optimizeImage(src, { w: 800 })}
              srcSet={imageSrcSet(src, [480, 800, 1200])}
              sizes={SIZES}
              width={800}
              height={600}
              alt={post.title}
              loading={i < 3 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              decoding="async"
              className="w-full h-96 object-cover brightness-75 scale-110 transition-all duration-300 hover:scale-100"
            />

            <div className="absolute top-0 right-0 p-8 text-right">
              <Link href={`/post/${post.id}`} className="text-white drop-shadow font-Primary text-2xl font-medium hover:underline">
                {post.title}
              </Link>
              <p className="text-gray-200 font-Primary py-1 text-sm">{post.date}</p>
              <div className="pt-1">
                <ShareButton postId={post.id} title={post.title} />
              </div>
              <OwnerLink href={`/edit/${post.id}`} className="text-rose-600 hover:underline">
                Edit
              </OwnerLink>
            </div>

            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-gray-50 font-Primary drop-shadow text-sm">{post.excerpt}</p>
              <Link href={`/post/${post.id}`} className="text-white/60 drop-shadow font-Primary text-sm hover:text-rose-600 mt-2 inline-block">
                Read more
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Posts
