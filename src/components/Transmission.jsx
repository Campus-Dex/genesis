import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fest } from '../content'
import { sceneState } from '../scene/state'

gsap.registerPlugin(ScrollTrigger)

const LABELS = ['TRANSMISSION 01', 'TRANSMISSION 02', 'TRANSMISSION 03']

export default function Transmission({ reducedMotion }) {
  const root = useRef()

  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.transmission__panel')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            sceneState.open = self.progress
          },
        },
      })
      panels.forEach((panel, i) => {
        const at = i
        tl.fromTo(
          panel,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.35, ease: 'none' },
          at,
        )
        if (i < panels.length - 1) {
          tl.to(panel, { opacity: 0, y: -24, duration: 0.25, ease: 'none' }, at + 0.75)
        }
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      className={`transmission${reducedMotion ? ' transmission--static' : ''}`}
      ref={root}
      aria-labelledby="transmission-heading"
    >
      <div className="transmission__sticky">
        <h2 id="transmission-heading" className="sr-only">
          What is {fest.name}
        </h2>
        {fest.description.map((text, i) => (
          <article className={`transmission__panel transmission__panel--${i + 1}`} key={i}>
            <p className="transmission__label readout">{LABELS[i]}</p>
            <p className="transmission__text">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
