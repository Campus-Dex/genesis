import { useEffect, useState } from 'react'
import { fest, schedule } from '../content'

const target = new Date(fest.startsAt).getTime()

function remaining() {
  const diff = Math.max(0, target - Date.now())
  const s = Math.floor(diff / 1000)
  return {
    live: diff === 0,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown() {
  const [t, setT] = useState(remaining)

  useEffect(() => {
    const id = window.setInterval(() => setT(remaining()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="countdown" id="schedule" aria-labelledby="countdown-heading">
      <div className="countdown__inner">
        <h2 id="countdown-heading">
          The city wakes <span className="countdown__date">{fest.dateLabel}</span>
        </h2>

        {t.live ? (
          <p className="countdown__live readout">LIVE NOW</p>
        ) : (
          <p className="countdown__clock readout" aria-hidden="true">
            <span>
              {pad(t.d)}
              <small>days</small>
            </span>
            <span>
              {pad(t.h)}
              <small>hrs</small>
            </span>
            <span>
              {pad(t.m)}
              <small>min</small>
            </span>
            <span>
              {pad(t.s)}
              <small>sec</small>
            </span>
          </p>
        )}
        <p className="sr-only">
          {fest.name} begins {fest.dateLabel} at {fest.venue}.
        </p>

        <ol className="schedule">
          {schedule.map((day) => (
            <li className="schedule__day" key={day.day}>
              <p className="schedule__label readout">
                {day.day} <span>{day.date}</span>
              </p>
              <ul className="schedule__beats">
                {day.beats.map((beat) => (
                  <li key={beat}>{beat}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="countdown__venue readout">{fest.venue}</p>
      </div>
    </section>
  )
}
