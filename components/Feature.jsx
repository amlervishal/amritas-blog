import Link from 'next/link'

// Full-bleed misty scene with the newest essay, right-aligned.
export default function Feature({ post }) {
  if (!post) return null
  return (
    <section className="feature" id="latest" aria-labelledby="feature-title">
      <div className="feature-art" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet="/art/scene-m.avif" type="image/avif" />
          <source media="(max-width: 767px)" srcSet="/art/scene-m.webp" type="image/webp" />
          <source media="(max-width: 767px)" srcSet="/art/scene-m.jpg" />
          <source srcSet="/art/scene.avif" type="image/avif" />
          <source srcSet="/art/scene.webp" type="image/webp" />
          <img src="/art/scene.jpg" width={1792} height={1024} alt="" loading="lazy" decoding="async" />
        </picture>
      </div>
      <div className="feature-body">
        <p className="kicker">Latest essay{post.date ? ` · ${post.date}` : ''}</p>
        <h2 id="feature-title" className="display">
          <Link href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>{post.title}</Link>
        </h2>
        <p className="lede">{post.excerpt}</p>
        <Link href={`/post/${post.id}`} className="pill">Read the essay</Link>
      </div>
    </section>
  )
}
