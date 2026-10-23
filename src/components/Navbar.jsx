import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { getLenis, scrollToHash } from '../lib/scroll'
import { explore, lineup, PHONE, PHONE_HREF, SHOP_URL, INSTAGRAM_URL, LINKEDIN_URL } from '../data'

// Turns the white logo dark while keeping the red "A" red
const DARK_LOGO = '[filter:invert(1)_hue-rotate(180deg)_saturate(1.4)]'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path d="M6 7h12l-1 13H7L6 7z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 7a3 3 0 016 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState('ink') // text color needed for the section behind the bar
  const [solid, setSolid] = useState(false)
  const header = useRef(null)
  const panel = useRef(null)
  const tl = useRef(null)
  const firstRun = useRef(true)

  // Pick dark or light text for the section behind the bar.
  // Uses ScrollTrigger callbacks (no per-frame measuring, which made scrolling stutter).
  const chapterTheme = useRef('ink')
  const inChapters = useRef(true)
  useEffect(() => {
    const onChapter = (e) => {
      chapterTheme.current = e.detail
      if (inChapters.current) setTheme(e.detail)
    }
    window.addEventListener('chapter-theme', onChapter)

    const triggers = []
    // refreshPriority -1: measure after the pinned chapters have added their scroll space
    document.querySelectorAll('[data-header]:not([data-scene])').forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 40px',
          end: 'bottom 40px',
          refreshPriority: -1,
          onToggle: (self) => self.isActive && setTheme(el.dataset.header),
        }),
      )
    })
    const afterChapters = document.getElementById('range')
    if (afterChapters) {
      triggers.push(
        ScrollTrigger.create({
          trigger: afterChapters,
          start: 'top 80px',
          refreshPriority: -1,
          onEnter: () => {
            inChapters.current = false
            setSolid(true)
          },
          onLeaveBack: () => {
            inChapters.current = true
            setSolid(false)
            setTheme(chapterTheme.current)
          },
        }),
      )
    }
    return () => {
      window.removeEventListener('chapter-theme', onChapter)
      triggers.forEach((t) => t.kill())
    }
  }, [])

  // Full-screen menu: circular wipe from the button, then items stagger in
  useGSAP(
    () => {
      const q = gsap.utils.selector(panel)
      gsap.set(panel.current, { clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)', visibility: 'hidden' })
      tl.current = gsap
        .timeline({ paused: true })
        .set(panel.current, { visibility: 'visible' })
        .to(panel.current, { clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)', duration: 0.9, ease: 'expo.inOut' })
        .from(q('[data-item]'), { yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.03, ease: 'expo.out' }, '-=0.35')
    },
    { scope: panel },
  )

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const lenis = getLenis()
    if (open) {
      tl.current?.timeScale(1).play()
      lenis?.stop()
    } else {
      tl.current?.timeScale(1.7).reverse()
      lenis?.start()
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (e, href) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToHash(null, href), 60)
  }

  const light = open || theme === 'cream' // light text on dark background
  // Solid colours instead of backdrop blur: blur re-renders every scroll frame and causes stutter
  const barBg = solid && !open ? (light ? 'bg-ink/95 shadow-[0_1px_0_rgba(255,255,255,.06)]' : 'bg-cream/95 shadow-[0_1px_0_rgba(0,0,0,.06)]') : 'bg-transparent'

  return (
    <>
      <header ref={header} className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${barBg} ${light ? 'text-cream' : 'text-ink'}`}>
        <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-6 md:px-12">
          <a href="#top" onClick={(e) => go(e, '#top')} aria-label="Barista home" className="flex flex-col items-start leading-none">
            <img
              src="images/logo-white.webp"
              alt="Barista"
              className={`h-6 w-auto transition-[filter] duration-500 md:h-7 ${light ? '' : DARK_LOGO}`}
            />
            <span className="mt-1.5 text-[8px] font-semibold tracking-[0.42em] uppercase opacity-70">Espresso · Since 1999</span>
          </a>

          <ul className="hidden items-center gap-9 text-[11px] font-semibold tracking-[0.22em] uppercase lg:flex">
            {explore.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={(e) => go(e, l.href)} className="group relative py-2">
                  {l.label}
                  <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" onClick={(e) => go(e, '#contact')} className="group relative py-2">
                Contact
                <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noreferrer"
              className={`hidden h-10 items-center rounded-full border px-6 text-[10px] font-bold tracking-[0.22em] uppercase transition-colors duration-500 sm:flex ${
                light ? 'border-cream bg-cream text-ink hover:bg-tan' : 'border-ink text-ink hover:bg-ink hover:text-cream'
              }`}
            >
              Shop Now
            </a>
            <a href={SHOP_URL} target="_blank" rel="noreferrer" aria-label="Shop" className="grid size-9 place-items-center rounded-full hover:bg-current/10">
              <CartIcon />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative grid size-10 place-items-center rounded-full lg:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-500 ease-expo ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
                <span
                  className={`absolute right-0 h-0.5 bg-current transition-all duration-500 ease-expo ${open ? 'top-[5px] w-5 -rotate-45' : 'top-[10px] w-3'}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div id="site-menu" ref={panel} className="invisible fixed inset-0 z-40 overflow-y-auto bg-brown text-cream" aria-hidden={!open}>
        <div className="mx-auto grid min-h-full max-w-7xl gap-12 px-6 pt-28 pb-12 md:px-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="line-mask text-xs tracking-[0.3em] text-tan uppercase">
              <span data-item className="block">Explore</span>
            </p>
            <ul className="mt-6 space-y-1">
              {explore.map((l) => (
                <li key={l.href} className="line-mask">
                  <a
                    data-item
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    tabIndex={open ? 0 : -1}
                    className="block font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] font-black transition-colors hover:text-tan"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="line-mask text-xs tracking-[0.3em] text-tan uppercase">
              <span data-item className="block">The lineup</span>
            </p>
            <ul className="mt-6 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
              {lineup.map((name, i) => (
                <li key={name} className="line-mask border-b border-cream/10">
                  <a
                    data-item
                    href="#products"
                    onClick={(e) => go(e, '#products')}
                    tabIndex={open ? 0 : -1}
                    className="group flex items-baseline gap-4 py-2.5 text-lg transition-colors hover:text-tan"
                  >
                    <span className="text-xs text-cream/40 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="transition-transform duration-500 ease-expo group-hover:translate-x-2">{name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-3">
            <div>
              <p className="line-mask text-xs tracking-[0.3em] text-tan uppercase">
                <span data-item className="block">Get in touch</span>
              </p>
              <div className="line-mask mt-6">
                <p data-item className="text-cream/70">Beirut, Lebanon</p>
              </div>
              <div className="line-mask">
                <a data-item href={PHONE_HREF} tabIndex={open ? 0 : -1} className="block font-display text-3xl font-bold hover:text-tan">
                  {PHONE}
                </a>
              </div>
            </div>
            <div className="line-mask">
              <a
                data-item
                href={SHOP_URL}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="inline-flex h-11 items-center rounded-full bg-cream px-7 text-[11px] font-bold tracking-[0.2em] text-ink uppercase"
              >
                Shop Now
              </a>
            </div>
            <div className="line-mask mt-auto">
              <div data-item className="flex gap-6 text-sm tracking-[0.2em] uppercase">
                <a href={INSTAGRAM_URL} tabIndex={open ? 0 : -1} className="hover:text-tan">Instagram</a>
                <a href={LINKEDIN_URL} tabIndex={open ? 0 : -1} className="hover:text-tan">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
