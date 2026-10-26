import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { AnimatedButton, RevealText, ScrubWords, useRevealChildren } from './ui'

const cards = [
  { src: 'images/every-1.webp', alt: 'Friends laughing with Barista iced coffee cans' },
  { src: 'images/every-2.webp', alt: 'Barista espresso capsule boxes by a pool' },
  { src: 'images/every-3.webp', alt: 'Woman sipping from a Barista coffee cup' },
]

export default function Range() {
  const root = useRef(null)
  useRevealChildren(root)

  // The three photos start stacked and fan out as you scroll.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 768px)', motion: MOTION_OK }, (ctx) => {
        if (!ctx.conditions.motion) return
        const spread = ctx.conditions.desktop ? 105 : 34
        gsap
          .timeline({ scrollTrigger: { trigger: q('[data-fan]')[0], start: 'top 85%', end: 'center 50%', scrub: 1 } })
          .fromTo(q('[data-card="0"]'), { xPercent: 0, rotate: -3, y: 80 }, { xPercent: -spread, rotate: -9, y: 40, ease: 'none' }, 0)
          .fromTo(q('[data-card="2"]'), { xPercent: 0, rotate: 3, y: 80 }, { xPercent: spread, rotate: 9, y: 40, ease: 'none' }, 0)
          .fromTo(q('[data-card="1"]'), { y: 140, scale: 0.88 }, { y: 0, scale: 1, ease: 'none' }, 0)
      })
    },
    { scope: root },
  )

  return (
    <section id="range" data-header="ink" ref={root} className="overflow-hidden bg-cream py-28 text-ink md:py-40">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <ScrubWords className="text-center font-display text-[clamp(2.4rem,6.4vw,6rem)] uppercase leading-[0.95] tracking-tight">
          We make coffee for every kitchen, counter and service bar
        </ScrubWords>
      </div>

      <div data-fan className="relative mt-16 grid place-items-center py-10 md:mt-24">
        {/* coffee beans drifting around the photos */}
        {[
          ['left-[6%] top-[8%] w-10 md:left-[14%] md:w-14', 60, 'images/bean-b6.webp', 140],
          ['right-[8%] top-[2%] w-8 md:right-[16%] md:w-12', 25, 'images/bean-b7.webp', -90],
          ['left-[10%] bottom-[4%] w-7 md:left-[22%] md:w-10', 15, 'images/bean-b8.webp', 60],
          ['right-[5%] bottom-[12%] w-11 md:right-[12%] md:w-16', 90, 'images/bean-b9.webp', -200],
        ].map(([cls, p, src, spin]) => (
          <div key={cls} data-parallax={p} data-spin={spin} className={`pointer-events-none absolute z-20 ${cls}`} aria-hidden="true">
            <img src={src} alt="" className="w-full" />
          </div>
        ))}
        {cards.map((c, i) => (
          <div
            key={c.src}
            data-card={i}
            className={`aspect-[3/4] w-[min(64vw,330px)] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-20px_rgba(20,13,11,.55)] [grid-area:1/1] ${
              i === 1 ? 'z-10' : ''
            }`}
          >
            <img src={c.src} alt={c.alt} className="size-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 grid max-w-6xl gap-10 px-5 md:mt-28 md:grid-cols-2 md:px-8">
        <RevealText className="font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.92] tracking-tight">
          Coffee for every way you drink it.
        </RevealText>
        <div>
          <p data-reveal className="text-lg leading-relaxed text-ink/75">
            From the machine on the counter to the last sip, Barista is made end to end, sourcing only the finest Arabica
            and Robusta from sustainable origins and turning them into rich, distinct blends.
          </p>
          <div data-reveal data-delay="0.1" className="mt-8">
            <AnimatedButton href="#products" theme="ink">
              Learn More
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  )
}
