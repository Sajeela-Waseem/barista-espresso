import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { promises } from '../data'
import { AnimatedButton, RevealText, useRevealChildren } from './ui'

export default function Why() {
  const root = useRef(null)
  useRevealChildren(root)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Giant headline slides sideways as you scroll past
        const track = q('[data-track]')[0]
        gsap.fromTo(
          track,
          { x: () => window.innerWidth * 0.1 },
          {
            x: () => -(track.scrollWidth - window.innerWidth * 0.9),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center top', scrub: 1, invalidateOnRefresh: true },
          },
        )
        // The can swings in with its splash
        gsap.fromTo(
          q('[data-can]'),
          { rotate: -35, xPercent: -35, scale: 0.8, opacity: 0 },
          {
            rotate: 0,
            xPercent: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: q('[data-can-wrap]')[0], start: 'top 90%', end: 'center 55%', scrub: 1 },
          },
        )
        // Checklist pops in item by item
        gsap.from(q('[data-promise]'), {
          x: -40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('[data-promises]')[0], start: 'top 85%', once: true },
        })
        gsap.from(q('[data-promise-icon]'), {
          scale: 0,
          rotate: -90,
          duration: 0.8,
          stagger: 0.09,
          ease: 'back.out(2.5)',
          delay: 0.15,
          scrollTrigger: { trigger: q('[data-promises]')[0], start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="why" data-header="ink" ref={root} className="overflow-hidden bg-cream py-28 text-ink md:py-40">
      <div
        data-track
        className="w-max whitespace-nowrap font-display text-[clamp(4.5rem,14vw,13rem)] uppercase leading-none tracking-tight"
      >
        The whole coffee journey, <span className="text-red">one name</span>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl items-center gap-12 px-5 md:mt-24 md:px-8 lg:grid-cols-2">
        <div data-can-wrap className="relative">
          <div className="absolute inset-0 -z-0 bg-[radial-gradient(closest-side,rgba(224,198,153,.55),transparent)]" />
          <img
            data-can
            src="images/right-way.webp"
            alt="Hand holding a Barista iced coffee can with a coffee splash"
            className="relative w-full scale-110 [mask-image:linear-gradient(to_right,black_75%,transparent_98%)]"
            loading="lazy"
          />
        </div>

        <div>
          <RevealText className="font-display text-[clamp(2.75rem,6vw,5.5rem)] uppercase leading-[0.9] tracking-tight">
            We make coffee the right way.
          </RevealText>
          <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-ink/75">
            Crafted for the morning rush and the slow afternoon alike. From the machine on the counter to the last sip, every
            format carries the same standard.
          </p>

          <ul data-promises className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {promises.map((p) => (
              <li data-promise key={p.text} className="flex items-center gap-4 py-4">
                <span
                  data-promise-icon
                  className={`grid size-9 shrink-0 place-items-center rounded-full ${p.ok ? 'bg-ink text-tan' : 'bg-red/10 text-red'}`}
                >
                  {p.ok ? (
                    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
                      <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span className="font-display text-xl uppercase tracking-wide md:text-2xl">{p.text}</span>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-10">
            <AnimatedButton href="#story" theme="ink">
              Learn More
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  )
}
