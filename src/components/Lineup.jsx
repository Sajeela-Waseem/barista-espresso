import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { lineup, SHOP_URL } from '../data'
import { ArrowIcon, Eyebrow, RevealText } from './ui'

// Picture shown next to the cursor while hovering each range (product shots where we have them)
const previews = {
  'Espresso Capsules': 'images/capsules.webp',
  'Pods & Filter': 'images/capsules.webp',
  Machines: 'images/machines.webp',
  'Instant Coffee': 'images/every-3.webp',
  'American & K-Cup': 'images/every-2.webp',
  'Lebanese Coffee': 'images/story-1.webp',
  Chocolate: 'images/every-1.webp',
  'Syrups & Sauces': 'images/syrups.webp',
  Accessories: 'images/story-2.webp',
}

export default function Lineup() {
  const root = useRef(null)
  const preview = useRef(null)
  const previewImg = useRef(null)
  const follow = useRef(null)

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
        // the numbers count in from 00
        gsap.utils.toArray('[data-num]').forEach((el, i) => {
          const n = { v: 0 }
          gsap.to(n, {
            v: i + 1,
            duration: 1,
            delay: i * 0.06,
            ease: 'power2.out',
            onUpdate: () => (el.textContent = String(Math.round(n.v)).padStart(2, '0')),
            scrollTrigger: { trigger: '[data-list]', start: 'top 85%', once: true },
          })
        })
      })

      // cursor preview (mouse only)
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0, rotation: -8 })
        follow.current = {
          x: gsap.quickTo(preview.current, 'x', { duration: 0.55, ease: 'power3' }),
          y: gsap.quickTo(preview.current, 'y', { duration: 0.55, ease: 'power3' }),
          r: gsap.quickTo(preview.current, 'rotation', { duration: 0.8, ease: 'power3' }),
        }
        return () => (follow.current = null)
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

        {/* picture that follows the cursor over the list */}
        <div
          ref={preview}
          style={{ transform: 'scale(0)' }}
          className="pointer-events-none fixed top-0 left-0 z-40 hidden aspect-[4/5] w-56 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_30px_60px_-20px_rgba(20,13,11,.6)] [@media(pointer:fine)]:block"
          aria-hidden="true"
        >
          <img ref={previewImg} src="images/capsules.webp" alt="" className="size-full object-cover" />
        </div>

        <ul
          data-list
          className="mt-14"
          onPointerMove={(e) => {
            const f = follow.current
            if (!f) return
            f.x(e.clientX + 150)
            f.y(e.clientY)
            f.r(gsap.utils.clamp(-12, 12, e.movementX * 0.8))
          }}
          onPointerLeave={() => follow.current && gsap.to(preview.current, { scale: 0, duration: 0.4, ease: 'power3.in' })}
        >
          {lineup.map((name, i) => (
            <li key={name} className="relative">
              <span data-row-line className="absolute inset-x-0 top-0 h-px origin-left bg-ink/15" />
              <a
                data-row
                href={SHOP_URL}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center gap-5 overflow-hidden px-2 py-5 md:gap-10 md:px-4 md:py-6"
                onPointerEnter={() => {
                  if (!follow.current) return
                  const src = previews[name]
                  const img = previewImg.current
                  if (!img.src.endsWith(src)) {
                    img.src = src
                    img.className = src.includes('every') || src.includes('story') ? 'size-full object-cover' : 'size-full object-contain p-5'
                    gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 0.6, ease: 'expo.out' })
                  }
                  gsap.to(preview.current, { scale: 1, duration: 0.5, ease: 'back.out(1.6)' })
                }}
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-brown transition-transform duration-500 ease-expo group-hover:scale-y-100" />
                <span data-num className="relative w-8 text-sm text-ink/45 tabular-nums transition-colors duration-500 group-hover:text-tan">
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
