// Bio supplied by Dr. Vohra (Nov 2026). Keep word for word.
const PARAS = [
  "Dr. Amrita Vohra, Chief Learning Officer, GEMS Education, leads education for all GEMS initiatives in India. She brings over three decades of transformative educational leadership to K–12 schools. A PhD in English Literature, certified Cambridge and IB school leader, Program Leader for Cambridge Professional Development Qualifications, an artist, an author, and a passionate educator, she moves seamlessly between the worlds of scholarship, leadership, and the arts. A theatre professional and Bharatanatyam dancer, she views learning as choreography, an intricate interplay of intellect, empathy, and creative imagination.",
  "Recognized among India’s top 100 Great People Managers, Dr. Vohra is known for embedding “Cultures of Thinking” in schools and shaping dynamic learning ecosystems rooted in inquiry and belonging. She has developed extensive systems for Quality Assurance, Policy design, Curriculum Innovation, Leadership Development, and Professional Learning. She excels at implementation, turning vision into everyday practice across a vast network of school campuses. Over the years, she has led and mentored numerous greenfield and brownfield school projects across India affiliated with National, Cambridge, and IB curricula.",
  "An expert in the Teaching of English, Phonics and Reading Programs, she has contributed to academic research and national education benchmarks with ACER, OUP, and CBSE. Her work spans Early Childhood Education, Drama in Education, School Leadership, and deep dives in Inclusive education and Social-Emotional Learning, founded on the belief that mental health, sustainability, and inclusion are not peripheral; they are central to learning.",
  "Through her widely admired blog, www.pindropsilence.in, she continues to provoke reflection and inspire educators to see learning through the eyes of a learner, as an act of creation and quiet revolution.",
]

const About = () => (
  <div className="about-page">
    <header>
      <p className="kicker red">The writer</p>
      <h1 className="display">About Dr. Amrita Vohra</h1>
    </header>
    <div className="about-grid">
      <div className="portrait">
        <img
          src="/amrita.jpg"
          width={640}
          height={853}
          fetchPriority="high"
          decoding="async"
          alt="Portrait of Dr. Amrita Vohra, educator and author of Pin Drop Silence"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className="about-copy">
        {PARAS.map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </div>
  </div>
)

export default About
