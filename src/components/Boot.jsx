import { useEffect, useRef, useState } from 'react'
import { fest } from '../content'

const LINES = [
  'CORE // POWER ........ OK',
  'GRID // SYNC ......... OK',
  'CITY // WAKING',
]
const DURATION = 1700

export default function Boot({ onDone }) {
  const [pct, setPct] = useState(0)
  const [exiting, setExiting] = useState(false)
  const finishRef = useRef(() => {})

  useEffect(() => {
    const start = performance.now()
    let raf
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      setPct(100)
      setExiting(true)
      window.setTimeout(onDone, 720)
    }
    finishRef.current = finish
    const step = (now) => {
      const p = Math.min(1, (now - start) / DURATION)
      // ease-out so the counter slows into 100 like a real readout
      setPct(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(step)
      else finish()
    }
    raf = requestAnimationFrame(step)
    const skip = (e) => {
      if (e.type === 'keydown' && e.key === 'Tab') return
      finish()
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone])

  const visibleLines = LINES.filter((_, i) => pct > 25 + i * 25)

  return (
    <div className={`boot${exiting ? ' boot--exit' : ''}`} role="status" aria-live="polite">
      <div className="boot__frame">
        <p className="boot__name readout">
          {fest.name} <span>{fest.year}</span>
        </p>
        <p className="boot__pct readout" aria-hidden="true">
          {String(pct).padStart(3, '0')}
        </p>
        <ol className="boot__lines readout" aria-hidden="true">
          {visibleLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <span className="sr-only">Loading {fest.name}, {pct} percent</span>
        <button type="button" className="boot__skip" onClick={() => finishRef.current()}>
          Skip
        </button>
      </div>
    </div>
  )
}
