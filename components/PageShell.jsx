import Navigation from './Navigation'
import Footer from './Footer'
import { getPostSummaries } from '../lib/firestore'

// Shared page chrome (server component; Navigation is a small client island).
// `wide` removes the page gutter (full-bleed sections), `transparent` lets the nav sit over a hero.
export default async function PageShell({ children, wide = false, transparent = false, posts }) {
  let latestId
  try {
    const list = posts || (await getPostSummaries())
    latestId = list[0]?.id
  } catch {
    latestId = undefined
  }
  return (
    <div className="pds-shell">
      <Navigation latestId={latestId} transparent={transparent} />
      <main id="main" className={`pds-main${wide ? ' wide' : ''}`}>{children}</main>
      <Footer />
    </div>
  )
}
