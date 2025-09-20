'use client'

import { useUser } from '../../hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import CreatePost from '../../components/CreatePost'

export default function CreatePage() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      // User is not signed in, redirect to signin
      router.push('/signin')
    }
  }, [user, router])

  // Show loading while authentication state is being determined
  if (user === undefined) {
    return <div>Loading...</div>
  }

  // If user is null (not authenticated), don't render anything (redirecting)
  if (user === null) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Navigation user={user} />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
        <CreatePost />
      </main>
      <Footer />
    </div>
  )
}