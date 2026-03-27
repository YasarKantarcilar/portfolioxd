import { useEffect, useRef } from 'react'

type DotMatrixProps = {
  reducedMotion: boolean
}

type Dot = {
  x: number
  y: number
}

export function DotMatrix({ reducedMotion }: DotMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    let animationFrame = 0
    let width = 0
    let height = 0
    let dots: Dot[] = []
    const mouseTarget = { x: -9999, y: -9999, active: false }
    const mouse = { x: -9999, y: -9999 }

    const setup = () => {
      const ratio = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const spacing = width < 768 ? 26 : 30
      const margin = spacing * 0.5
      dots = []

        for (let y = margin; y <= height - margin; y += spacing) {
          for (let x = margin; x <= width - margin; x += spacing) {
            dots.push({ x, y })
          }
        }
      }

    const handleMouseMove = (event: MouseEvent) => {
      mouseTarget.x = event.clientX
      mouseTarget.y = event.clientY
      mouseTarget.active = true
    }

    const handleMouseLeave = () => {
      mouseTarget.x = -9999
      mouseTarget.y = -9999
      mouseTarget.active = false
    }

    const render = () => {
      const influenceRadius = width < 768 ? 90 : 130
      const baseRadius = width < 768 ? 0.9 : 1.05
      const waveAmplitude = width < 768 ? 2.4 : 4
      const waveTiltX = 0.94
      const waveTiltY = -0.34
      const time = performance.now() * 0.001

      mouse.x += (mouseTarget.x - mouse.x) * 0.16
      mouse.y += (mouseTarget.y - mouse.y) * 0.16

      context.clearRect(0, 0, width, height)

      dots.forEach((dot) => {
        const phaseA = time * 1.6 - (dot.x * 0.033 + dot.y * 0.018)
        const phaseB = time * 1.15 - (dot.x * 0.012 - dot.y * 0.027)
        const fieldWave = reducedMotion
          ? 0
          : (Math.sin(phaseA) * 0.78 + Math.sin(phaseB) * 0.22) * waveAmplitude

        const drawX = dot.x + fieldWave * waveTiltX
        const drawY = dot.y + fieldWave * waveTiltY

        const dx = drawX - mouse.x
        const dy = drawY - mouse.y
        const distance = Math.hypot(dx, dy)
        const normalized = Math.max(0, 1 - distance / influenceRadius)

        const growthFactor = reducedMotion ? 1 : 1 + normalized
        const scale = Math.min(2, growthFactor)

        const dotRadius = baseRadius * scale
        const glowAlpha = mouseTarget.active ? normalized * 0.45 : 0

        if (glowAlpha > 0.01) {
          const glowRadius = dotRadius * 4.5
          const glowGradient = context.createRadialGradient(
            drawX,
            drawY,
            dotRadius * 0.4,
            drawX,
            drawY,
            glowRadius,
          )
          glowGradient.addColorStop(0, `rgba(167, 139, 250, ${glowAlpha})`)
          glowGradient.addColorStop(1, 'rgba(167, 139, 250, 0)')

          context.beginPath()
          context.fillStyle = glowGradient
          context.arc(drawX, drawY, glowRadius, 0, Math.PI * 2)
          context.fill()
        }

        context.beginPath()
        context.fillStyle = `rgba(226, 232, 240, ${0.14 + normalized * 0.38})`
        context.arc(drawX, drawY, dotRadius, 0, Math.PI * 2)
        context.fill()
      })

      animationFrame = window.requestAnimationFrame(render)
    }

    setup()
    animationFrame = window.requestAnimationFrame(render)

    window.addEventListener('resize', setup)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', setup)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] opacity-95"
    />
  )
}
