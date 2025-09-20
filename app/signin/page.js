'use client'

import { HelmetProvider } from 'react-helmet-async'
import { useUser } from '../../hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import SignIn from '../../components/SignIn'

export default function SignInPage() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (user) {
    return null
  }

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <Navigation user={user} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <SignIn />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  )
}