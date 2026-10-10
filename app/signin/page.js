'use client'

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
    <div className="pds-shell">
      <Navigation user={user} />
      <main id="main" className="pds-main">
        <SignIn />
      </main>
      <Footer />
    </div>
  )
}