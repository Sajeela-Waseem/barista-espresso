import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { SHOP_URL } from '../data'
import { AnimatedButton, Eyebrow, RevealText, useRevealChildren } from './ui'

export default function Story() {
  const root = useRef(null)
  useRevealChildren(root)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Photos unveil from the bottom, then drift at different speeds (parallax)
        q('[data-photo]').forEach((el, i) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0% round 2rem)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 2rem)',
              duration: 1.6,
              ease: 'expo.inOut',
              delay: i * 0.2,
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            },
          )
          gsap.fromTo(
            el.querySelector('img'),
            { yPercent: -10, scale: 1.25 },
            { yPercent: 10, scale: 1.25, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })
        gsap.fromTo(
          q('[data-photo-small]'),
          { y: 120 },
          { y: -80, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        // Big "1999" counts up in the background
        const yearEl = q('[data-year]')[0]
        const year = { v: 1900 }
        gsap.to(year, {
          v: 1999,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: () => (yearEl.textContent = Math.round(year.v)),
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="story" data-header="cream" ref={root} className="relative isolate overflow-hidden bg-ink py-28 md:py-40">
      <span
        data-year
        aria-hidden="true"
        className="pointer-events-none absolute top-8 right-[-2vw] -z-10 font-display text-[30vw] leading-none text-cream/[0.04] tabular-nums"
      >
        1999
      </span>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 md:px-8 lg:grid-cols-12">
        <div className="relative pb-24 lg:col-span-6 lg:pb-0">
          <div data-photo data-tilt="8" className="aspect-[4/5] w-[80%] overflow-hidden rounded-[2rem]">
            <img src="images/story-1.webp" alt="Barista Bar iced drinks held up by the sea" className="size-full object-cover" loading="lazy" />
          </div>
          <div data-photo-small className="absolute right-0 bottom-0 w-[48%] lg:-bottom-10">
            <div data-photo className="aspect-[3/4] overflow-hidden rounded-[2rem] border-[6px] border-ink">
              <img src="images/story-2.webp" alt="Barista Bar kiosk with a giant iced latte" className="size-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Eyebrow className="text-tan">Our story</Eyebrow>
          <RevealText className="mt-5 font-display text-[clamp(2.75rem,5.6vw,5.25rem)] uppercase leading-[0.9] tracking-tight">
            A house of coffee, built since <span className="text-tan">1999.</span>
          </RevealText>
          <p data-reveal className="mt-8 text-lg leading-relaxed text-cream/75">
            Barista set out to bring premium espresso into homes, businesses and everyday life. As part of Automatic Brewers
            SAL, we approach authentic coffee with precision and passion, crafted for a convenient, individual experience.
          </p>
          <div data-reveal className="mt-10">
            <AnimatedButton href={SHOP_URL} external theme="cream">
              About Us
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  )
}
