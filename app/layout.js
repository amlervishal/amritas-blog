import './globals.css'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import { AuthProvider } from '../hooks/useUser'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, AUTHOR_NAME } from '../lib/site'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-playfair',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f3eadb',
}

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Blogs by ${AUTHOR_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: '/',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <body>
        <a href="#main" className="sr-skip">Skip to content</a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
