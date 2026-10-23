import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { lineup, SHOP_URL } from '../data'
import { ArrowIcon, Eyebrow, RevealText } from './ui'

export default function Lineup() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-row]', {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-list]', start: 'top 85%', once: true },
        })
        gsap.from('[data-row-line]', {
          scaleX: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-list]', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="products" data-header="ink" ref={root} className="bg-cream pb-28 text-ink md:pb-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow className="text-ink/60">The lineup</Eyebrow>
            <RevealText className="mt-5 font-display text-[clamp(2.75rem,6vw,5.5rem)] uppercase leading-[0.92] tracking-tight">
              Nine ranges under one name.
            </RevealText>
          </div>
          <p className="max-w-xs text-ink/70">Everything from the capsule to the cup. Tap a range to shop it online.</p>
        </div>

        <ul data-list className="mt-14">
          {lineup.map((name, i) => (
            <li key={name} className="relative">
              <span data-row-line className="absolute inset-x-0 top-0 h-px origin-left bg-ink/15" />
              <a
                data-row
                href={SHOP_URL}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center gap-5 overflow-hidden px-2 py-5 md:gap-10 md:px-4 md:py-6"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-brown transition-transform duration-500 ease-expo group-hover:scale-y-100" />
                <span className="relative w-8 text-sm text-ink/45 tabular-nums transition-colors duration-500 group-hover:text-tan">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative flex-1 font-display text-[clamp(1.75rem,4.4vw,3.75rem)] uppercase leading-none transition-all duration-500 ease-expo group-hover:translate-x-3 group-hover:text-cream">
                  {name}
                </span>
                <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-tan group-hover:bg-tan">
                  <ArrowIcon className="size-3.5" />
                </span>
              </a>
            </li>
          ))}
          <li className="h-px bg-ink/15" />
        </ul>
      </div>
    </section>
  )
}
