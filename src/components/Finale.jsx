import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fest, socials } from '../content'
import { sceneState } from '../scene/state'

gsap.registerPlugin(ScrollTrigger)

export default function Finale() {
  const root = useRef()

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 90%',
        end: 'top 20%',
        scrub: true,
        onUpdate: (self) => {
          sceneState.finale = self.progress
          sceneState.recede = 1 - self.progress
        },
      })
      gsap.from('.finale__title', {
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.1,
        ease: 'expo.out',
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="finale" id="register" ref={root} aria-labelledby="finale-heading">
      <div className="finale__inner">
        <h2 id="finale-heading" className="finale__title">
          Enter the city.
        </h2>
        <p className="finale__text">
          Registration is open for {fest.name} {fest.year}. {fest.dateLabel}, {fest.venue.toLowerCase()}.
        </p>
        <a className="btn btn--primary btn--large" href={fest.registerUrl}>
          Register
        </a>
      </div>
      <footer className="footer">
        <p className="footer__mark">
          {fest.name} <span className="readout">{fest.year}</span>
        </p>
        <ul className="footer__socials">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href}>{s.label}</a>
            </li>
          ))}
        </ul>
        <p className="footer__credit">
          Hosted on <a href={fest.organizerUrl}>CampusDex</a>
        </p>
      </footer>
    </section>
  )
}
