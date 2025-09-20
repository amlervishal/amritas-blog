'use client'

import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import About from '../../components/About'
import { useUser } from '../../hooks/useUser'

export default function AboutPage() {
  const user = useUser()

  return (
    <div className="flex flex-col min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Navigation user={user} />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <About />
      </main>
      <Footer />
    </div>
  )
}