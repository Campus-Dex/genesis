# Product

## Register

brand

## Platform

web

## Users

College students (primarily undergraduates at the host institution and nearby campuses) deciding whether to attend and register for GENESIS 2026, a college tech fest. They arrive from a shared link on their phone, often at night, in a browsing-and-curious state rather than a task state. Secondary audience: sponsors and faculty who need to see that the fest is serious and well-produced.

## Product Purpose

The site is the fest's opening title sequence. It exists to make a visitor feel the scale and mood of GENESIS before they read a single event name, and then to convert that feeling into a registration. Success is a visitor who scrolls the whole page and taps Register.

## Positioning

The only college fest whose site feels like the first two minutes of a film, not a poster with buttons.

## Conversion & proof

- Primary CTA: Register (placeholder link, `#register`, until the real registration URL exists). Secondary CTA: See events, which scrolls to the events strip.
- The line a visitor remembers after 10 seconds: "Genesis is happening, and it looks bigger than any fest I've been to."
- Belief ladder: this is real and dated → it is ambitious and well-produced → there are events I care about → registering is one tap.
- Proof on hand: none yet. Dates, venue, and events are placeholders in `src/content.js` until the organizers supply them.

## Brand Personality

Cinematic, composed, cold-lit. The voice is Ghost in the Shell and Blade Runner 2049: slow camera, haze and rain, serious rather than loud. Copy is short and declarative. Motion is deliberate and rehearsed; nothing bounces.

## Anti-references

Studio Trigger maximalism (neon yellow, speed lines, glitch on everything). Generic dark SaaS landing pages with identical card grids, gradient text, and a small uppercase label above every section. Anime fan-site clichés: stock character art, katakana as decoration, sakura petals.

## Design Principles

- One signature moment: the Genesis Core and the scroll-driven camera carry the page; everything else is quieter than it.
- Pacing over density: one idea per viewport, generous silence between beats.
- Holograms, not cards: information appears as projected readouts in the scene, not as boxes on top of it.
- Real content only: placeholders are centralized and clearly marked, never scattered lorem ipsum.
- Motion respects the viewer: reduced-motion users get the same content with the choreography removed, not a broken page.

## Accessibility & Inclusion

WCAG AA as the floor. Body text ≥ 4.5:1 against the near-black background, all interactive elements keyboard reachable with visible amber focus rings, the 3D canvas hidden from assistive tech, the boot sequence skippable and announced politely, and a full `prefers-reduced-motion` alternative with no pinned sections and a static scene.
