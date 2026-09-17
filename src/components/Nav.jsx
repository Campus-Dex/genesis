import { useEffect, useState } from 'react'
import { fest } from '../content'

export default function Nav() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > lastY && y > 120)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${hidden ? ' nav--hidden' : ''}`}>
      <a href="#top" className="nav__mark">
        {fest.name}
        <span className="readout">{fest.year}</span>
      </a>
      <nav aria-label="Primary">
        <a href="#events">Events</a>
        <a href="#schedule">Schedule</a>
        <a href={fest.registerUrl} className="nav__cta">
          Register
        </a>
      </nav>
    </header>
  )
}
