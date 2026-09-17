// TODO: replace placeholders with real fest details. Everything on the page reads from here.

export const fest = {
  name: 'GENESIS',
  year: '2026',
  tagline: 'Three days. One city that only exists in the dark.',
  description: [
    'Genesis is the annual technical festival of Placeholder Institute of Technology, where 4,000 students from 120 campuses build, break, and compete across three days.',
    'Hackathons that run through the night. Robotics on a floor that used to be a parking deck. A keynote stage lit like a runway.',
    'This year the city wakes on the 13th of March. Registration is open.',
  ],
  // ISO string with timezone; the countdown targets this instant.
  startsAt: '2026-03-13T09:00:00+05:30',
  dateLabel: '13 – 15 MAR 2026',
  venue: 'PLACEHOLDER INSTITUTE OF TECHNOLOGY',
  city: 'HYDERABAD, IN',
  coordinates: '17.3850° N, 78.4867° E',
  registerUrl: '#register',
  organizerUrl: 'https://campusdex.com',
}

// Later: replace with fetch('/api/events') from the Worker (D1 `events` table).
export const events = [
  {
    id: 'hackathon',
    name: 'Nightfall Hackathon',
    blurb: '36 hours. 200 teams. The building does not close.',
    day: 'Day 1 – 2',
    span: 'wide',
  },
  {
    id: 'robowars',
    name: 'Robowars',
    blurb: '30 kg bots, a steel arena, and a crowd that wants sparks.',
    day: 'Day 2',
    span: 'tall',
  },
  {
    id: 'ctf',
    name: 'Capture the Flag',
    blurb: 'Reverse it, break it, own it. Jeopardy format, live scoreboard.',
    day: 'Day 1',
    span: 'base',
  },
  {
    id: 'keynote',
    name: 'Keynote Stage',
    blurb: 'Founders and researchers on a stage lit like a runway.',
    day: 'Day 2',
    span: 'wide',
  },
  {
    id: 'droneracing',
    name: 'Drone Racing',
    blurb: 'FPV through a neon gate course at 120 km/h.',
    day: 'Day 3',
    span: 'base',
  },
  {
    id: 'showcase',
    name: 'Project Showcase',
    blurb: 'Two hundred demos on the deck. Judges walk the floor at dusk.',
    day: 'Day 3',
    span: 'tall',
  },
]

export const schedule = [
  { day: 'Day 1', date: '13 Mar', beats: ['Gates open 09:00', 'Opening ceremony', 'Hackathon begins 18:00'] },
  { day: 'Day 2', date: '14 Mar', beats: ['Robowars finals', 'Keynote stage', 'Hackathon judging 06:00'] },
  { day: 'Day 3', date: '15 Mar', beats: ['Drone racing', 'Project showcase', 'Closing 21:00'] },
]

export const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'X', href: '#' },
  { label: 'Mail', href: 'mailto:hello@example.com' },
]
