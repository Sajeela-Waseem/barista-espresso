import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { audiences, doors, PHONE, PHONE_HREF } from '../data'
import { ArrowIcon, Eyebrow, RevealText, useRevealChildren } from './ui'
import { scrollToHash } from '../lib/scroll'
import Cup from './Cup'

export default function Partners() {
  const root = useRef(null)
  const tabs = useRef([])
  const bar = useRef(null)
  const stage = useRef(null)
  const pane = useRef(null)
  const [cur, setCur] = useState(0)
  const mounted = useRef(false)
  useRevealChildren(root)

  // Slide the highlight pill under the active tab
  useLayoutEffect(() => {
    const place = (animate) => {
      const t = tabs.current[cur]
      if (!t || !bar.current) return
      gsap.to(bar.current, { x: t.offsetLeft, width: t.offsetWidth, duration: animate ? 0.6 : 0, ease: 'expo.out' })
    }
    place(mounted.current)
    const onResize = () => place(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [cur])

  // Swap the product shot and the details when the tab changes
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(stage.current.querySelector('[data-shot]'), { opacity: 0, scale: 1.12, rotate: -6 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: 'expo.out' })
    gsap.fromTo(pane.current.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' })
  }, [cur])

  // Door cards rise in one after another
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-door]', {
          y: 60,
          opacity: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-doors]', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  const onKey = (e, i) => {
    if (e.key === 'ArrowRight') {
      const n = (i + 1) % audiences.length
      setCur(n)
      tabs.current[n]?.focus()
    }
    if (e.key === 'ArrowLeft') {
      const n = (i - 1 + audiences.length) % audiences.length
      setCur(n)
      tabs.current[n]?.focus()
    }
  }

  const a = audiences[cur]

  return (
    <div data-header="ink" className="bg-cream px-2 pb-16 md:px-4 md:pb-28">
      <section id="partner" data-header="cream" ref={root} data-grow className="overflow-hidden rounded-[2.5rem] bg-brown py-24 text-cream md:rounded-[3.5rem] md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <Eyebrow className="text-tan">For business</Eyebrow>
              <RevealText className="mt-5 font-display text-[clamp(2.75rem,13vw,8rem)] uppercase lg:text-[clamp(3rem,5vw,5.75rem)] leading-[0.86] tracking-tight">
                Coffee,
                <br />
                <span className="text-tan">handled.</span>
              </RevealText>
              <p data-reveal className="mt-8 max-w-lg text-lg leading-relaxed text-cream/75">
                One supplier for the machine, the coffee, and the service behind both. Tell us how you serve it and we will
                build the setup around you, across Lebanon and Jordan.
              </p>

              <div data-reveal data-delay="0.1" className="mt-10 max-w-full overflow-x-auto pb-1">
                <div role="tablist" aria-label="Who we serve" className="relative inline-flex rounded-full bg-cream/10 p-1.5">
                  <span ref={bar} className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-tan" />
                  {audiences.map((item, i) => (
                    <button
                      key={item.tab}
                      ref={(el) => (tabs.current[i] = el)}
                      role="tab"
                      aria-selected={cur === i}
                      tabIndex={cur === i ? 0 : -1}
                      onClick={() => setCur(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors duration-300 md:px-6 md:text-sm ${
                        cur === i ? 'text-ink' : 'text-cream/75 hover:text-cream'
                      }`}
                    >
                      {/* shorter labels on phones so all three tabs fit */}
                      <span className="sm:hidden">{item.short}</span>
                      <span className="hidden sm:inline">{item.tab}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div ref={pane} role="tabpanel" className="mt-10">
                <h3 className="font-display text-3xl uppercase md:text-4xl">{a.title}</h3>
                <p className="mt-3 max-w-md text-cream/70">{a.text}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {a.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-cream/90">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-tan text-ink">
                        <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
                          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div data-reveal className="relative min-w-0">
              <div
                ref={stage}
                data-tilt="8"
                className="relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_45%,#7a4a38_0%,#2a1813_70%)]"
              >
                <div className="absolute inset-[10%] animate-spin-slow rounded-full border border-dashed border-cream/20" />
                <div className="absolute inset-[5%] bg-[radial-gradient(closest-side,rgba(224,198,153,.18),transparent)]" />
                {a.img.includes('machines') ? (
                  // the machine gets a Barista cup on its drip tray
                  <div key={a.img} data-shot className="relative aspect-[861/900] h-[72%] drop-shadow-[0_40px_40px_rgba(0,0,0,.5)]">
                    <img src={a.img} alt={a.title} className="absolute inset-0 size-full" loading="lazy" />
                    <Cup id="office-cup" />
                  </div>
                ) : (
                  <img
                    key={a.img}
                    data-shot
                    src={a.img}
                    alt={a.title}
                    className="relative max-h-[72%] max-w-[72%] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.5)]"
                    loading="lazy"
                  />
                )}
                <span className="absolute top-6 left-6 rounded-full bg-cream/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  {String(cur + 1).padStart(2, '0')} / {String(audiences.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <div id="contact" data-doors className="mt-20 grid gap-4 md:grid-cols-3">
            {doors.map((d) => (
              <a
                key={d.title}
                data-door
                data-tilt="8"
                href={d.href}
                target={d.external ? '_blank' : undefined}
                rel={d.external ? 'noreferrer' : undefined}
                onClick={(e) => scrollToHash(e, d.href)}
                className="group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-[1.75rem] border border-cream/15 p-7 transition-colors duration-500 hover:text-ink"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-tan transition-transform duration-500 ease-expo group-hover:scale-y-100" />
                <span className="relative flex items-start justify-between gap-4">
                  <span className="font-display text-3xl uppercase leading-none">{d.title}</span>
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-full border border-current transition-transform duration-500 ease-expo ${
                      d.external ? 'group-hover:rotate-0' : 'rotate-45 group-hover:rotate-0'
                    }`}
                  >
                    <ArrowIcon className="size-3.5" />
                  </span>
                </span>
                <span className="relative mt-10 text-cream/70 transition-colors duration-500 group-hover:text-ink/80">{d.text}</span>
              </a>
            ))}
          </div>

          <div data-reveal className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-10 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-tan">Prefer to talk</p>
              <a href={PHONE_HREF} data-magnetic="0.15" className="mt-3 block font-display text-[clamp(2.25rem,5vw,4rem)] leading-none transition-colors hover:text-tan">
                {PHONE}
              </a>
            </div>
            <p className="text-cream/60">Beirut, Lebanon · Serving Lebanon & Jordan</p>
          </div>
        </div>
      </section>
    </div>
  )
}
