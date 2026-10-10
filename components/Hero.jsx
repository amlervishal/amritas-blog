import Link from 'next/link'
import Petals from './Petals'

// Server component. The painting is the LCP image (preloaded; AVIF with WebP/JPEG fallbacks).
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="site-title">
      <link rel="preload" as="image" href="/art/hero-m.avif" type="image/avif" media="(max-width: 767px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/art/hero.avif" type="image/avif" media="(min-width: 768px)" fetchPriority="high" />
      <div className="hero-art" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet="/art/hero-m.avif" type="image/avif" />
          <source media="(max-width: 767px)" srcSet="/art/hero-m.webp" type="image/webp" />
          <source media="(max-width: 767px)" srcSet="/art/hero-m.jpg" />
          <source srcSet="/art/hero.avif" type="image/avif" />
          <source srcSet="/art/hero.webp" type="image/webp" />
          <img src="/art/hero.jpg" width={1792} height={1024} alt="" fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="hero-glow" />
      <Petals />

      <div className="hero-content">
        <p className="kicker">Quiet reflections &middot; Dr. Amrita Vohra</p>
        <h1 id="site-title">
          Pin Drop <span className="l2">Silence</span>
        </h1>
        <p className="hero-tag">Between classrooms and life.</p>
        <div className="hero-cta">
          <Link href="/blog" className="seal hero-seal" aria-label="Read the writings">PDS</Link>
          <a href="#latest" className="hero-enter">
            Enter the quiet
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1.5l5 5 5-5" /></svg>
          </a>
        </div>
      </div>
      <a href="#latest" className="hero-flow" aria-hidden="true" tabIndex={-1}>
        Scroll<i />
      </a>
    </section>
  )
}
