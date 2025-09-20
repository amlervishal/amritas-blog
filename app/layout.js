import './globals.css'

export const metadata = {
  title: 'Pin Drop Silence...',
  description: 'Insightful blogs and thoughts by Dr. Amrita Vohra. Explore life, relationships, and personal growth through thoughtful writing.',
  openGraph: {
    title: 'Pin Drop Silence',
    description: 'Insightful blogs and thoughts by Dr. Amrita Vohra. Explore life, relationships, and personal growth through thoughtful writing.',
    type: 'website',
    siteName: 'Pin Drop Silence',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pin Drop Silence',
    description: 'Insightful blogs and thoughts by Dr. Amrita Vohra. Explore life, relationships, and personal growth through thoughtful writing.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+CU:wght@100..400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}