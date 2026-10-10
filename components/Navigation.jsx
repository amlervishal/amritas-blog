'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '../hooks/useUser'
import { isAllowedToEdit } from '../lib/site'
import Seal from './Seal'

// transparent: true on the home hero (nav gains a paper backdrop once scrolled). Never hides.
const Navigation = ({ latestId, transparent = false }) => {
  const user = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!transparent) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [transparent])

  const handleSignOut = async () => {
    try {
      const [{ signOut }, { auth }] = await Promise.all([import('firebase/auth'), import('../utils/firebaseAuth')])
      await signOut(auth)
      router.push('/')
      setIsMenuOpen(false)
    } catch (error) {
      // ignore
    }
  }

  const readHref = latestId ? `/post/${latestId}` : '/blog'
  const close = () => setIsMenuOpen(false)
  const canEdit = user && isAllowedToEdit(user.email)
  const cur = (href) => (pathname === href ? 'page' : undefined)
  const solid = !transparent || scrolled || isMenuOpen

  return (
    <header className="nav" data-solid={solid} data-open={isMenuOpen}>
      <div className="nav-inner">
        <Link href="/" className="nav-brand" aria-label="Pin Drop Silence home">
          <Seal />
          <span className="word">Pin Drop Silence</span>
        </Link>

        <nav aria-label="Primary">
          <ul className="nav-links">
            <li><Link href="/" aria-current={cur('/')}>Home</Link></li>
            <li><Link href="/blog" aria-current={cur('/blog')}>Writings</Link></li>
            <li><Link href="/about" aria-current={cur('/about')}>About</Link></li>
          </ul>
        </nav>

        <div className="nav-right">
          {canEdit && <Link href="/create" className="nav-quiet">Create post</Link>}
          {user ? (
            <button type="button" onClick={handleSignOut} className="nav-quiet" title={user.displayName || user.email}>Sign out</button>
          ) : (
            <Link href="/signin" className="nav-quiet">Sign in</Link>
          )}
          <Link href={readHref} className="pill">Read</Link>
        </div>

        <button
          type="button"
          className="nav-burger"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="nav-panel"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className="nav-panel" id="nav-panel">
        <Link href="/" onClick={close}>Home</Link>
        <Link href="/blog" onClick={close}>Writings</Link>
        <Link href="/about" onClick={close}>About</Link>
        {canEdit && <Link href="/create" onClick={close}>Create post</Link>}
        {user ? (
          <button type="button" onClick={handleSignOut} className="nav-quiet">Sign out</button>
        ) : (
          <Link href="/signin" onClick={close}>Sign in</Link>
        )}
        <Link href={readHref} onClick={close} className="pill">Read the latest</Link>
      </div>
    </header>
  )
}

export default Navigation
