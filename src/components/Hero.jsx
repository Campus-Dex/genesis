import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { fest } from '../content'

export default function Hero({ ready, reducedMotion }) {
  const root = useRef()

  useEffect(() => {
    if (!ready || reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero__letter', { yPercent: 115, duration: 1.1, stagger: 0.055 }, 0.1)
        .from('.hero__readout', { opacity: 0, y: 12, duration: 0.7 }, 0.55)
        .from('.hero__tagline', { opacity: 0, y: 18, duration: 0.8 }, 0.75)
        .from('.hero__actions > *', { opacity: 0, y: 14, duration: 0.7, stagger: 0.08 }, 0.95)
        .from('.hero__coords', { opacity: 0, duration: 0.6 }, 1.1)
    }, root)
    return () => ctx.revert()
  }, [ready, reducedMotion])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__inner">
        <p className="hero__readout readout">
          <span>{fest.dateLabel}</span>
          <span aria-hidden="true">//</span>
          <span>{fest.city}</span>
        </p>
        <h1 className="hero__title" aria-label={`${fest.name} ${fest.year}`}>
          <span className="hero__word" aria-hidden="true">
            {fest.name.split('').map((ch, i) => (
              <span className="hero__letter-mask" key={i}>
                <span className="hero__letter">{ch}</span>
              </span>
            ))}
          </span>
          <span className="hero__year readout" aria-hidden="true">
            {fest.year}
          </span>
        </h1>
        <p className="hero__tagline">{fest.tagline}</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href={fest.registerUrl}>
            Register
          </a>
          <a className="btn btn--ghost" href="#events">
            See events
          </a>
        </div>
      </div>
      <p className="hero__coords readout" aria-hidden="true">
        {fest.coordinates}
      </p>
    </section>
  )
}
