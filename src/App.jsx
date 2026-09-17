import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Boot from './components/Boot'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Transmission from './components/Transmission'
import Events from './components/Events'
import Countdown from './components/Countdown'
import Finale from './components/Finale'
import { useLenis } from './hooks/useLenis'
import { sceneState } from './scene/state'
import './App.css'

const Scene = lazy(() => import('./scene/Scene'))

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const mobile = window.matchMedia('(max-width: 767px)').matches
const BOOT_KEY = 'genesis-booted'

function alreadyBooted() {
  try {
    return sessionStorage.getItem(BOOT_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [booted, setBooted] = useState(() => reducedMotion || alreadyBooted())
  useLenis({ enabled: !reducedMotion, locked: !booted })

  const onBootDone = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_KEY, '1')
    } catch {
      // storage unavailable: boot simply replays next visit
    }
    setBooted(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-booting', !booted)
    if (booted) {
      sceneState.booted = true
      ScrollTrigger.refresh()
    }
  }, [booted])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!booted && <Boot onDone={onBootDone} />}
      <Suspense fallback={null}>
        <Scene reducedMotion={reducedMotion} mobile={mobile} />
      </Suspense>
      <Nav />
      <main id="main" className="page">
        <Hero ready={booted} reducedMotion={reducedMotion} />
        <Transmission reducedMotion={reducedMotion} />
        <Events />
        <Countdown />
        <Finale />
      </main>
    </>
  )
}
