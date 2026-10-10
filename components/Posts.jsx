import Link from 'next/link'
import ShareButton from './ShareButton'
import OwnerLink from './OwnerLink'
import { optimizeImage, imageSrcSet } from '../lib/images'

const SIZES = '(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw'

// Server component: renders lean post summaries (id, title, date, image, excerpt) as essay cards.
const Posts = ({ posts }) => {
  return (
    <ul className="cards">
      {posts.map((post, i) => {
        const src = post.imageUrl || '/default-image.png'
        return (
          <li key={post.id} className="card">
            <Link href={`/post/${post.id}`} className="card-img" tabIndex={-1} aria-hidden="true">
              <img
                src={optimizeImage(src, { w: 800 })}
                srcSet={imageSrcSet(src, [480, 800, 1200])}
                sizes={SIZES}
                width={800}
                height={600}
                alt=""
                loading={i < 3 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding="async"
              />
            </Link>
            <div className="card-meta">
              <span className="kicker red">{post.date}</span>
              <span className="card-actions">
                <OwnerLink href={`/edit/${post.id}`} className="card-edit">Edit</OwnerLink>
                <ShareButton postId={post.id} title={post.title} />
              </span>
            </div>
            <h3><Link href={`/post/${post.id}`}>{post.title}</Link></h3>
            <hr className="rule" />
            <p className="excerpt">{post.excerpt}</p>
            <Link href={`/post/${post.id}`} className="more" aria-label={`Read ${post.title}`}>Read the essay</Link>
          </li>
        )
      })}
    </ul>
  )
}

export default Posts
