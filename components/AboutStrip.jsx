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
          <p>{"Dr. Amrita Vohra, Chief Learning Officer, GEMS Education, leads education for all GEMS initiatives in India. She brings over three decades of transformative educational leadership to K–12 schools. A PhD in English Literature, certified Cambridge and IB school leader, Program Leader for Cambridge Professional Development Qualifications, an artist, an author, and a passionate educator, she moves seamlessly between the worlds of scholarship, leadership, and the arts. A theatre professional and Bharatanatyam dancer, she views learning as choreography, an intricate interplay of intellect, empathy, and creative imagination."}</p>
          <Link href="/about" className="pill red" style={{ marginTop: 14 }}>More about her</Link>
        </div>
      </div>
    </section>
  )
}
