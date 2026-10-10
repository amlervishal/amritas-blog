import PageShell from '../../components/PageShell'
import About from '../../components/About'
import JsonLd from '../../components/JsonLd'
import { SITE_URL, AUTHOR_NAME } from '../../lib/site'

export const metadata = {
  title: `About ${AUTHOR_NAME}`,
  description:
    'Dr. Amrita Vohra is an educator, researcher and author with almost 30 years in education, currently COO & Director Education at GEMS Education, India.',
  alternates: { canonical: '/about' },
  openGraph: { type: 'profile', url: '/about', images: [{ url: `${SITE_URL}/amrita.jpg`, width: 640, height: 853, alt: AUTHOR_NAME }] },
}

export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: AUTHOR_NAME,
            image: `${SITE_URL}/amrita.jpg`,
            jobTitle: 'COO & Director Education, GEMS Education, India',
            url: `${SITE_URL}/about`,
          },
        }}
      />
      <About />
    </PageShell>
  )
}
