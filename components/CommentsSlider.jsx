'use client'

import { useState, useEffect } from 'react'

// comments: [{ id, authorName, content, postTitle }] (latest 5, resolved on the server)
const trunc = (text, n) => (!text ? '' : text.length <= n ? text : text.slice(0, n).trimEnd() + '…')

const CommentsSlider = ({ comments = [] }) => {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (comments.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((p) => (p === comments.length - 1 ? 0 : p + 1)), 5000)
    return () => clearInterval(t)
  }, [comments.length])

  if (comments.length === 0) return null
  const c = comments[i] || comments[0]

  return (
    <section className="ticker" aria-label="Readers write">
      <p className="kicker red">Readers write</p>
      <blockquote>
        <span>&ldquo;{trunc(c.content || 'No comment', 140)}&rdquo;</span>
      </blockquote>
      <cite>
        {trunc(c.authorName || 'Anonymous', 24)} <b>on</b> {trunc(c.postTitle || 'Unknown Post', 48)}
      </cite>
      {comments.length > 1 && (
        <div className="ticker-dots">
          {comments.map((_, k) => (
            <button key={k} aria-label={`Show comment ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CommentsSlider
