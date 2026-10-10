import Link from 'next/link'

export default function AboutStrip() {
  return (
    <section className="about-strip" aria-labelledby="about-strip-title">
      <div className="about-strip-in">
        <div className="portrait">
          <img
            src="/amrita.jpg"
            width={640}
            height={853}
            alt="Portrait of Dr. Amrita Vohra, educator and author of Pin Drop Silence"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div>
          <p className="kicker red">The writer</p>
          <h2 id="about-strip-title" className="display">Dr. Amrita Vohra</h2>
          <p>
            Almost thirty years in education: teacher, principal, researcher and author, now COO and Director
            Education at GEMS Education, India. A PhD in English Literature, a Bharatanatyam dancer and a theatre
            professional, she writes here about classrooms, children, and the quiet moments in between.
          </p>
          <Link href="/about" className="pill red" style={{ marginTop: 14 }}>More about her</Link>
        </div>
      </div>
    </section>
  )
}
