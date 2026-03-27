import { motion, useMotionTemplate, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

type InteractiveTextProps = {
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  reducedMotion: boolean
  isMobile: boolean
}

export function InteractiveText({
  pointerX,
  pointerY,
  reducedMotion,
  isMobile,
}: InteractiveTextProps) {
  const rotateIntensity = reducedMotion ? 0 : isMobile ? 4 : 7
  const translateIntensity = reducedMotion ? 0 : isMobile ? 8 : 14
  const springConfig = { stiffness: 140, damping: 24, mass: 0.85 }

  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [rotateIntensity, -rotateIntensity]),
    springConfig,
  )
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-rotateIntensity, rotateIntensity]),
    springConfig,
  )
  const translateX = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-translateIntensity, translateIntensity]),
    springConfig,
  )
  const translateY = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [-translateIntensity, translateIntensity]),
    springConfig,
  )
  const glowOffsetX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-18, 18]), springConfig)
  const glowOffsetY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-14, 14]), springConfig)
  const spotlightX = useTransform(pointerX, [-0.5, 0.5], ['43%', '57%'])
  const spotlightY = useTransform(pointerY, [-0.5, 0.5], ['42%', '58%'])
  const dynamicTextShadow = useMotionTemplate`
    0 0 14px rgba(139,92,246,0.28),
    ${glowOffsetX}px ${glowOffsetY}px 32px rgba(56,189,248,0.14)
  `

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-6xl select-none text-center"
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-3xl md:h-[380px] md:w-[380px]"
        style={{
          x: spotlightX,
          y: spotlightY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          textShadow: dynamicTextShadow,
          transformPerspective: 1200,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl bg-gradient-to-r from-violet-200 via-white to-sky-200 bg-clip-text px-3 text-[clamp(2rem,9vw,6.6rem)] font-[900] uppercase leading-[0.92] tracking-[0.1em] text-transparent drop-shadow-[0_0_22px_rgba(139,92,246,0.5)] [font-family:var(--font-display)] sm:tracking-[0.12em]"
        >
          YASAR KANTARCILAR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-sm uppercase tracking-[0.38em] text-slate-300/90 sm:text-base"
        >
          Frontend Developer / Creative Technologist
        </motion.p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.65 }}
        whileHover={reducedMotion ? {} : { scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="relative z-10 mt-9 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-3 text-xs uppercase tracking-[0.26em] text-white shadow-[0_0_80px_rgba(139,92,246,0.4)] backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
      >
        View Projects
      </motion.button>
    </motion.div>
  )
}
