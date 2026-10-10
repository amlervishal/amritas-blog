// Small vermilion seal (square) holding Amrita Vohra's initials.
export default function Seal({ className = '', size, children = 'AV' }) {
  const style = size ? { width: size, height: size } : undefined
  return (
    <span className={`seal ${className}`} style={style} aria-hidden="true">
      {children}
    </span>
  )
}
