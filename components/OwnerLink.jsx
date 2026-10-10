'use client'
import Link from 'next/link'
import { useUser } from '../hooks/useUser'
import { isAllowedToEdit } from '../lib/site'

// Renders a link only for allowed editors (client island; nothing for anonymous visitors)
export default function OwnerLink({ href, className, wrapperClassName, children }) {
  const user = useUser()
  if (!user || !isAllowedToEdit(user.email)) return null
  const link = <Link href={href} className={className}>{children}</Link>
  return wrapperClassName ? <div className={wrapperClassName}>{link}</div> : link
}
