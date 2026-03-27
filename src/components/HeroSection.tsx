import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { useMotionValue, useReducedMotion } from 'framer-motion'
import { BackgroundParticles } from './BackgroundParticles'
import { DotMatrix } from './DotMatrix'
import { InteractiveText } from './InteractiveText'
import heroVideo from '../assets/vecteezy_radiant-purple-sphere-with-glowing-filaments-swirling-in-a_69480685.mp4'

export function HeroSection() {
  const containerRef = useRef<HTMLElement | null>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const sync = () => setIsMobile(mediaQuery.matches)

    sync()
    mediaQuery.addEventListener('change', sync)

    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!containerRef.current) {
      return
    }

    const bounds = containerRef.current.getBoundingClientRect()
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5

    pointerX.set(normalizedX)
    pointerY.set(normalizedY)
  }

  const handleMouseLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-purple-950 to-black"
    >
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-[0.85] [filter:brightness(0.60)_contrast(1.08)_saturate(1.08)]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_24%,rgba(139,92,246,0.14),transparent_56%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_78%_72%,rgba(56,189,248,0.08),transparent_48%)]" />
      <DotMatrix reducedMotion={Boolean(prefersReducedMotion)} />
      <BackgroundParticles
        isMobile={isMobile}
        reducedMotion={Boolean(prefersReducedMotion)}
      />

      <div className="pointer-events-none absolute inset-0 z-[2] opacity-[0.03] mix-blend-soft-light [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:3px_3px]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.26)_100%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <InteractiveText
          pointerX={pointerX}
          pointerY={pointerY}
          reducedMotion={Boolean(prefersReducedMotion)}
          isMobile={isMobile}
        />
      </div>
    </section>
  )
}
