import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, useGSAP } from './lib/gsap'
import { setLenis } from './lib/scroll'
import { initEffects } from './lib/effects'
import Navbar from './components/Navbar'
import Chapters from './components/Chapters'
import Stores from './components/Stores'
import Range from './components/Range'
import Lineup from './components/Lineup'
import Partners from './components/Partners'
import Reviews from './components/Reviews'
import Why from './components/Why'
import Story from './components/Story'
import Socials from './components/Socials'
import Footer from './components/Footer'
import ChatButton from './components/ChatButton'

export default function App() {
  const progress = useRef(null)

  // Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const lenis = new Lenis({ lerp: 0.09 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Re-measure once fonts and images have loaded
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  // Thin progress bar at the top of the page
  // Shared hover/scroll effects (data-tilt, data-skew, data-pop, ...) for the sections below the chapters
  useEffect(() => initEffects(document.querySelector('main')), [])

  useGSAP(() => {
    gsap.to(progress.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    })
  })

  return (
    <>
      <div ref={progress} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-caramel" />
      <Navbar />
      <main>
        <Chapters />
        <Range />
        <Stores />
        <Lineup />
        <Partners />
        <Reviews />
        <Why />
        <Story />
        <Socials />
      </main>
      <Footer />
      <ChatButton />
    </>
  )
}
