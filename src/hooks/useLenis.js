import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis({ enabled, locked }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (locked) lenis.stop()
    else lenis.start()
  }, [locked])

  return lenisRef
}
