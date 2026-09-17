import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { fest } from '../content'
import Cloth from './boot/Cloth'

const CUT_A = { x: 0.96, y: -0.08 } // screen fractions, y down (uCutA with y flipped)
const CUT_B = { x: 0.04, y: 1.08 }
const COUNT_DURATION = 1.7
const SLASH_AT = COUNT_DURATION
const DONE_AT = 3.5
const END_AT = 3.9

function Blade() {
  return (
    <svg className="boot__blade" viewBox="0 0 520 44" aria-hidden="true">
      <defs>
        <linearGradient id="blade-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dcd6ff" />
          <stop offset="0.75" stopColor="#f6f3ff" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <path d="M0 22 C120 6 300 4 420 14 L520 22 L420 30 C300 40 120 38 0 22 Z" fill="url(#blade-fill)" />
      <path d="M0 22 C120 6 300 4 420 14 L520 22" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.9" />
      <rect x="392" y="8" width="8" height="28" rx="1" fill="#f5b942" />
      <rect x="400" y="14" width="120" height="16" rx="2" fill="#2a2438" />
    </svg>
  )
}

function addSlash(timeline, root, materials) {
  const blade = root.querySelector('.boot__blade')
  const streak = root.querySelector('.boot__streak')
  const flash = root.querySelector('.boot__flash')
  const W = root.clientWidth
  const H = root.clientHeight
  const ax = CUT_A.x * W
  const ay = CUT_A.y * H
  const bx = CUT_B.x * W
  const by = CUT_B.y * H
  const angle = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI
  const length = Math.hypot(bx - ax, by - ay)

  gsap.set(blade, { x: ax, y: ay, rotation: angle, xPercent: -50, yPercent: -50, opacity: 0 })
  gsap.set(streak, { x: ax, y: ay, rotation: angle, width: length, scaleX: 0, transformOrigin: '0 50%' })

  timeline
    .set(blade, { opacity: 1 }, SLASH_AT)
    .to(blade, { x: bx, y: by, duration: 0.28, ease: 'power2.in' }, SLASH_AT)
    .to(materials, { uSlash: 1, duration: 0.28, ease: 'power2.in' }, SLASH_AT)
    .to(streak, { scaleX: 1, duration: 0.28, ease: 'power2.in' }, SLASH_AT)
    .to(blade, { opacity: 0, duration: 0.12 }, SLASH_AT + 0.26)
    .fromTo(flash, { opacity: 0 }, { opacity: 0.9, duration: 0.05, ease: 'none' }, SLASH_AT + 0.22)
    .to(flash, { opacity: 0, duration: 0.35, ease: 'expo.out' }, SLASH_AT + 0.27)
    .to(streak, { opacity: 0, duration: 0.6, ease: 'expo.out' }, SLASH_AT + 0.3)
    .to(materials, { uSway: 1, duration: 1.0, ease: 'expo.out' }, SLASH_AT + 0.2)
    .to(materials, { uGlow: 0, duration: 1.2, ease: 'power2.out' }, SLASH_AT + 0.4)
    .to(materials[1], { uGust: 1, duration: 1.0, ease: 'power3.in' }, SLASH_AT + 1.2)
    .to(materials[0], { uGust: 1, duration: 1.0, ease: 'power3.in' }, SLASH_AT + 1.35)
}

export default function Boot({ onDone, onExit }) {
  const [pct, setPct] = useState(0)
  const root = useRef()
  const tl = useRef(null)
  const mats = useRef(null)
  const built = useRef(false)

  // Cloth's effect may run before or after the timeline effect; whichever is
  // second wires the slash tweens.
  const build = useCallback(() => {
    if (built.current || !tl.current || !mats.current) return
    built.current = true
    addSlash(tl.current, root.current, mats.current)
  }, [])

  useEffect(() => {
    const counter = { v: 0 }
    const timeline = gsap.timeline({ onComplete: onExit })
    timeline.to(counter, {
      v: 100,
      duration: COUNT_DURATION,
      ease: 'power3.out',
      onUpdate: () => setPct(Math.round(counter.v)),
    })
    timeline.call(onDone, [], DONE_AT)
    timeline.to({}, { duration: END_AT - DONE_AT }, DONE_AT)
    tl.current = timeline
    build()

    const skip = (e) => {
      if (e.type === 'keydown' && e.key === 'Tab') return
      timeline.progress(1)
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      timeline.kill()
      tl.current = null
      built.current = false
    }
  }, [onDone, onExit, build])

  const [live, setLive] = useState(false)
  const onReady = useCallback(
    (materials) => {
      mats.current = materials
      build()
      // one frame later the cloth has drawn; drop the fallback backdrop
      requestAnimationFrame(() => setLive(true))
    },
    [build],
  )

  return (
    <div className={`boot${live ? ' boot--live' : ''}`} ref={root} role="status" aria-live="polite">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Cloth pct={pct} onReady={onReady} />
      </Canvas>
      <div className="boot__streak" aria-hidden="true" />
      <Blade />
      <div className="boot__flash" aria-hidden="true" />
      <span className="sr-only">
        Loading {fest.name}, {pct} percent
      </span>
      <button type="button" className="boot__skip" onClick={() => tl.current?.progress(1)}>
        Skip
      </button>
    </div>
  )
}
