'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const UserContext = createContext(null)

const AUTH_ROUTES = /^\/(signin|create|edit)(\/|$)/

// True if a previous visit left a Firebase auth session behind (so we must load the SDK to restore it).
async function hasPersistedAuth() {
  try {
    if (typeof indexedDB === 'undefined' || !indexedDB.databases) return true
    const dbs = await indexedDB.databases()
    return dbs.some((d) => d.name === 'firebaseLocalStorageDb')
  } catch {
    return true
  }
}

// Loads the Firebase auth SDK lazily: anonymous visitors on public pages never download it.
export function AuthProvider({ children }) {
  const pathname = usePathname()
  const [user, setUser] = useState(undefined) // undefined = loading, null = signed out
  const [wantAuth, setWantAuth] = useState(false)

  useEffect(() => {
    if (wantAuth) return
    if (AUTH_ROUTES.test(pathname || '')) {
      setWantAuth(true)
      return
    }
    let cancelled = false
    hasPersistedAuth().then((yes) => {
      if (cancelled) return
      if (yes) setWantAuth(true)
      else setUser(null)
    })
    return () => { cancelled = true }
  }, [pathname, wantAuth])

  useEffect(() => {
    if (!wantAuth) return
    let unsub = () => {}
    let cancelled = false
    Promise.all([import('firebase/auth'), import('../utils/firebaseAuth')]).then(([{ onAuthStateChanged }, { auth }]) => {
      if (cancelled) return
      unsub = onAuthStateChanged(auth, (u) => setUser(u))
    })
    return () => { cancelled = true; unsub() }
  }, [wantAuth])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
