import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { events } from '../content'
import { sceneState } from '../scene/state'

gsap.registerPlugin(ScrollTrigger)

export default function Events() {
  const root = useRef()
  const track = useRef()

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 85%',
        end: 'top 15%',
        scrub: true,
        onUpdate: (self) => {
          sceneState.recede = self.progress
        },
      })
    })
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.current.scrollWidth - window.innerWidth
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: '.events__viewport',
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="events" id="events" ref={root} aria-labelledby="events-heading">
      <div className="events__viewport">
        <header className="events__head">
          <h2 id="events-heading">Events</h2>
          <p className="events__count readout">{String(events.length).padStart(2, '0')} ON THE FLOOR</p>
        </header>
        <ul className="events__track" ref={track}>
          {events.map((ev, i) => (
            <li className={`event event--${ev.span}`} key={ev.id} style={{ '--i': i }}>
              <span className="event__index readout" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="event__body">
                <p className="event__day readout">{ev.day}</p>
                <h3 className="event__name">{ev.name}</h3>
                <p className="event__blurb">{ev.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
