// Small vermilion seal (square) holding the site's initials.
export default function Seal({ className = '', size, children = 'PDS' }) {
  const style = size ? { width: size, height: size } : undefined
  return (
    <span className={`seal ${className}`} style={style} aria-hidden="true">
      {children}
    </span>
  )
}
