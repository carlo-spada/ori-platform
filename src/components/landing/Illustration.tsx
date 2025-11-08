import { useEffect, useRef } from 'react'

/**
 * Abstract animated illustration
 * Renders a subtle animated background with particles/nodes
 * Respects prefers-reduced-motion
 */
export function Illustration() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    updateSize()

    // Particle system
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }

    const particles: Particle[] = []
    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Draw and update particles
      particles.forEach((p, i) => {
        // Update position
        if (!prefersReducedMotion) {
          p.x += p.vx
          p.y += p.vy

          // Bounce off edges
          if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
          if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'hsl(203 100% 74% / 0.3)'
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p2.x - p.x
          const dy = p2.y - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `hsl(203 100% 74% / ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      updateSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
