'use client'

import { useUser } from '../../../hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'
import EditPost from '../../../components/EditPost'

export default function EditPage({ params }) {
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
    return <div className="pds-shell"><p className="kicker" style={{ padding: 120, textAlign: "center" }}>Loading...</p></div>
  }

  // If user is null (not authenticated), don't render anything (redirecting)
  if (user === null) {
    return null
  }

  return (
    <div className="pds-shell">
      <Navigation user={user} />
      <main id="main" className="pds-main">
        <EditPost />
      </main>
      <Footer />
    </div>
  )
}