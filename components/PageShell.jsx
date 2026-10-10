import Navigation from './Navigation'
import Footer from './Footer'

// Shared page chrome (server component; Navigation is a small client island).
export default function PageShell({ children, mainClassName = 'pt-24 pb-24' }) {
  return (
    <div className="flex flex-col min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Navigation />
      <main className={`flex-grow container mx-auto px-4 ${mainClassName}`}>{children}</main>
      <Footer />
    </div>
  )
}
