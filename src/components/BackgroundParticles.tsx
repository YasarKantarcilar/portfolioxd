import { useMemo } from 'react'
import { motion } from 'framer-motion'

type BackgroundParticlesProps = {
  isMobile: boolean
  reducedMotion: boolean
}

type ParticleConfig = {
  id: number
  size: number
  opacity: number
  duration: number
  delay: number
  trailLag: number
  x: string[]
  y: string[]
  hue: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const seededRandom = (seed: number) => {
  const value = Math.sin(seed * 9999.913 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

export function BackgroundParticles({
  isMobile,
  reducedMotion,
}: BackgroundParticlesProps) {
  const particleConfigs = useMemo<ParticleConfig[]>(() => {
    const count = reducedMotion ? (isMobile ? 10 : 14) : isMobile ? 16 : 30

    return Array.from({ length: count }, (_, index) => {
      const baseSeed = index * 17.13 + count * 3.71 + (isMobile ? 11 : 5)
      const r1 = seededRandom(baseSeed + 1)
      const r2 = seededRandom(baseSeed + 2)
      const r3 = seededRandom(baseSeed + 3)
      const r4 = seededRandom(baseSeed + 4)
      const r5 = seededRandom(baseSeed + 5)
      const r6 = seededRandom(baseSeed + 6)
      const r7 = seededRandom(baseSeed + 7)
      const r8 = seededRandom(baseSeed + 8)
      const r9 = seededRandom(baseSeed + 9)
      const r10 = seededRandom(baseSeed + 10)
      const r11 = seededRandom(baseSeed + 11)
      const r12 = seededRandom(baseSeed + 12)

      const startX = r1 * 100
      const startY = r2 * 100
      const drift = isMobile ? 14 : 24
      const x1 = clamp(startX + (r3 - 0.5) * drift * 1.4, -10, 110)
      const x2 = clamp(startX + (r4 - 0.5) * drift * 2.2, -12, 112)
      const y1 = clamp(startY + (r5 - 0.5) * drift * 1.2, -10, 110)
      const y2 = clamp(startY + (r6 - 0.5) * drift * 2.1, -12, 112)

      return {
        id: index,
        size: 2 + r7 * 4.8,
        opacity: 0.2 + r8 * 0.42,
        duration: 14 + r9 * 24,
        delay: -r10 * 32,
        trailLag: 0.4 + r11 * 0.55,
        x: [`${startX}vw`, `${x1}vw`, `${x2}vw`, `${startX}vw`],
        y: [`${startY}vh`, `${y1}vh`, `${y2}vh`, `${startY}vh`],
        hue: 250 + r12 * 70,
      }
    })
  }, [isMobile, reducedMotion])

  const trailIndices = [0, 1, 2, 3]

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {particleConfigs.map((particle) => (
        <div key={particle.id} className="absolute inset-0">
          {trailIndices.map((segment) => {
            const isHead = segment === 0
            const size = Math.max(0.8, particle.size * (1 - segment * 0.18))
            const opacity = isHead
              ? particle.opacity
              : particle.opacity * Math.max(0.12, 0.55 - segment * 0.13)
            const blur = isHead ? 0 : segment * 1.8

            return (
              <motion.span
                key={`${particle.id}-${segment}`}
                className="absolute left-0 top-0 rounded-full mix-blend-screen"
                style={{
                  width: size,
                  height: size,
                  opacity,
                  filter: `blur(${blur}px)`,
                  backgroundColor: `hsla(${particle.hue}, 95%, 76%, 0.95)`,
                  boxShadow: `0 0 ${10 + segment * 8}px hsla(${particle.hue}, 95%, 68%, ${
                    isHead ? 0.48 : 0.22
                  })`,
                }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  scale: [1, isHead ? 1.08 : 1.02, 0.95, 1],
                }}
                transition={{
                  duration: reducedMotion ? particle.duration * 1.45 : particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                  times: [0, 0.33, 0.66, 1],
                  delay: particle.delay - segment * particle.trailLag,
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
