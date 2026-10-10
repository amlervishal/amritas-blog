'use client'

import { useEffect, useRef } from 'react'

// Lightweight falling blossom petals on a canvas. Drawn shapes only (no downloads).
// Starts after first paint (idle), pauses when the tab or hero is off-screen, off under reduced motion.
const COUNT = 20
const COLORS = ['#f2b6bb', '#eb98a1', '#f7cdcb', '#e17f8b', '#f4c3c4']

function makeSprite(color, size) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const s = size / 2
  g.translate(s, s)
  g.beginPath()
  g.moveTo(0, -s * 0.8)
  g.bezierCurveTo(s * 0.9, -s * 0.9, s * 0.8, s * 0.5, 0, s * 0.85)
  g.bezierCurveTo(-s * 0.8, s * 0.5, -s * 0.9, -s * 0.9, 0, -s * 0.8)
  g.closePath()
  const grad = g.createRadialGradient(0, s * 0.6, 1, 0, 0, s)
  grad.addColorStop(0, '#fff3f1')
  grad.addColorStop(0.35, color)
  grad.addColorStop(1, color)
  g.fillStyle = grad
  g.globalAlpha = 0.92
  g.fill()
  // notch at the tip, like a real petal
  g.globalCompositeOperation = 'destination-out'
  g.beginPath()
  g.moveTo(0, -s * 0.82)
  g.lineTo(-s * 0.07, -s * 0.62)
  g.lineTo(s * 0.07, -s * 0.62)
  g.fill()
  return c
}

export default function Petals() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let stop = false
    let visible = true
    let tabVisible = !document.hidden
    let cleanup = () => {}

    const start = () => {
      if (stop) return
      const ctx = canvas.getContext('2d')
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      let W = 0, H = 0
      const resize = () => {
        const r = canvas.getBoundingClientRect()
        W = r.width; H = r.height
        canvas.width = Math.round(W * dpr)
        canvas.height = Math.round(H * dpr)
      }
      resize()
      const sprites = COLORS.map((c) => makeSprite(c, 48))
      const mobile = W < 768
      const n = mobile ? 14 : COUNT
      const petals = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        s: 9 + Math.random() * 14,
        vy: 14 + Math.random() * 22,
        vx: -6 - Math.random() * 10,
        r: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 1.4,
        ph: Math.random() * Math.PI * 2,
        sw: 18 + Math.random() * 28,
        spr: sprites[i % sprites.length],
        a: 0.55 + Math.random() * 0.4,
      }))
      let last = performance.now()
      const frame = (now) => {
        raf = 0
        if (stop) return
        if (!visible || !tabVisible) return // resumed by the observers
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, W, H)
        for (const p of petals) {
          p.ph += dt * 1.1
          p.y += p.vy * dt
          p.x += (p.vx + Math.sin(p.ph) * p.sw * 0.5) * dt
          p.r += p.vr * dt
          if (p.y > H + 30) { p.y = -30; p.x = Math.random() * (W + 200); }
          if (p.x < -40) p.x = W + 20
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.r)
          ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(p.ph * 0.8)))
          ctx.globalAlpha = p.a
          ctx.drawImage(p.spr, -p.s / 2, -p.s / 2, p.s, p.s)
          ctx.restore()
        }
        raf = requestAnimationFrame(frame)
      }
      const kick = () => {
        if (!raf && visible && tabVisible && !stop) { last = performance.now(); raf = requestAnimationFrame(frame) }
      }
      const onVis = () => { tabVisible = !document.hidden; kick() }
      document.addEventListener('visibilitychange', onVis)
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick() })
      io.observe(canvas)
      const onResize = () => resize()
      window.addEventListener('resize', onResize)
      kick()
      cleanup = () => {
        document.removeEventListener('visibilitychange', onVis)
        window.removeEventListener('resize', onResize)
        io.disconnect()
        if (raf) cancelAnimationFrame(raf)
      }
    }

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 600)
    return () => {
      stop = true
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
      cleanup()
    }
  }, [])

  return <canvas ref={ref} className="petals" aria-hidden="true" />
}
