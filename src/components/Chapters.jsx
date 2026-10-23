import { useRef, useState } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { getLenis, scrollToHash } from '../lib/scroll'
import { SHOP_URL } from '../data'

/*
  Full-screen "chapters" modelled on the reference reel.
  Layout: text sits left and vertically centred, the product stands large in the
  centre on a soft floor shadow, and one giant word sits behind the product.
  Scrolling slides the next scene up over the previous one with a wavy edge.
*/
const scenes = [
  {
    id: 'brew',
    label: 'Section 1',
    title: 'Brew',
    text: 'Precision espresso machines for the kitchen, the counter and the service bar. Installed, stocked and serviced by one team.',
    cta: { label: 'Read more', href: '#partner' },
    ghost: 'Espresso',
    header: 'ink',
    textCls: 'text-ink',
    ghostCls: 'text-[#6b4634]',
    // the machine needs the right half, so the word sits under the text on the left instead
    ghostWrap: 'top-[41%] md:top-[10%] md:pl-[11vw] lg:top-[63%]',
    ghostAlign: 'justify-center md:justify-start',
    ghostSize: 'text-[22vw] md:text-[13vw] lg:text-[min(8.8vw,19vh)]',
    waveFill: '#efe5d6',
    bg: [
      'linear-gradient(112deg, transparent 38%, rgba(255,255,255,.45) 47%, transparent 58%)',
      'radial-gradient(70% 70% at 62% 42%, #fbf6ee 0%, #efe5d6 55%, #e2d3bf 100%)',
    ].join(','),
  },
  {
    id: 'pour',
    label: 'Section 2',
    title: 'Pour',
    text: 'Capsules, pods and a full instant range, blended from the finest Arabica and Robusta from sustainable origins.',
    cta: { label: 'Read more', href: '#range' },
    ghost: 'Perfetto',
    header: 'cream',
    textCls: 'text-cream',
    ghostCls: 'text-[#4e2614]/75',
    waveFill: '#a35f3b',
    bg: [
      'linear-gradient(115deg, transparent 30%, rgba(255,214,170,.16) 42%, transparent 55%)',
      'linear-gradient(to bottom, #a35f3b 0%, rgba(163,95,59,0) 22%)',
      'radial-gradient(65% 70% at 60% 45%, #bd7a51 0%, #a35f3b 50%, #7f4227 100%)',
    ].join(','),
  },
  {
    id: 'sip',
    label: 'Section 3',
    title: 'Sip',
    text: 'Iced, hot, at home or on the go. One name for the entire coffee journey, crafted in Lebanon since 1999.',
    cta: { label: 'Find your cup', href: SHOP_URL, external: true },
    ghost: 'Freddo',
    header: 'cream',
    textCls: 'text-cream',
    ghostCls: 'text-[#f4ece1]/[0.13]',
    waveFill: '#86503a',
    bg: [
      'linear-gradient(115deg, transparent 32%, rgba(255,220,180,.12) 44%, transparent 56%)',
      // wall on top, warm table surface on the bottom
      'linear-gradient(to bottom, transparent 0 70%, rgba(0,0,0,.12) 70%, transparent 74%)',
      'linear-gradient(to bottom, #86503a 0%, #7a4630 70%, #b07a57 70%, #c08d69 100%)',
    ].join(','),
  },
]

const rangeCards = [
  { tag: 'Capsules', name: 'Espresso Capsules', img: 'images/capsules.webp', cls: 'left-[4%] top-[50%] md:left-[63%] md:top-[18%]' },
  { tag: 'Syrups', name: 'Syrups & Sauces', img: 'images/syrups.webp', cls: 'right-[4%] top-[56%] md:right-[9%] md:top-[40%]' },
  { tag: 'Machines', name: 'Espresso Machines', img: 'images/machines.webp', cls: 'left-[6%] bottom-[6%] md:left-[22%] md:bottom-[14%]' },
]

const beanSrcs = ['images/bean-b6.webp', 'images/bean-b7.webp', 'images/bean-b8.webp', 'images/bean-b9.webp']

function FloorShadow({ className = '' }) {
  // radial gradient instead of a blur filter: same soft look, far cheaper to draw
  return (
    <div
      className={`absolute left-1/2 h-[9%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(0,0,0,.38),rgba(0,0,0,.12)_60%,transparent)] ${className}`}
      aria-hidden="true"
    />
  )
}

function Steam({ className }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <svg key={i} data-steam viewBox="0 0 40 120" className="absolute bottom-0 h-full w-1/3 opacity-0" style={{ left: `${i * 30}%` }}>
          <path
            d="M20 120 C 4 96, 36 80, 20 60 C 4 40, 36 24, 20 0"
            fill="none"
            stroke="rgba(255,255,255,.35)"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  )
}

/*
  Branded paper cup + espresso stream, drawn in the machine photo's coordinates.
  The SVG box starts at the spout (51% down the photo) and ends at the drip tray.
  Markup shows the finished state (cup full, no stream) for reduced-motion users;
  the scroll timeline sets the starting state.
*/
function Cup() {
  return (
    <svg
      viewBox="0 0 100 152"
      className="pointer-events-none absolute top-[51%] left-[69.2%] h-[29%] w-[20%] overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="cup-mouth">
          <ellipse cx="50" cy="37" rx="41.5" ry="7.4" />
        </clipPath>
        <linearGradient id="cup-body" x1="0" x2="1">
          <stop offset="0" stopColor="#060606" />
          <stop offset=".2" stopColor="#2c2c2c" />
          <stop offset=".42" stopColor="#141414" />
          <stop offset="1" stopColor="#030303" />
        </linearGradient>
        <linearGradient id="cup-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#111" />
        </linearGradient>
        <radialGradient id="crema" cx=".45" cy=".4" r=".65">
          <stop offset="0" stopColor="#dca570" />
          <stop offset=".5" stopColor="#a8683a" />
          <stop offset="1" stopColor="#4f250f" />
        </radialGradient>
        <linearGradient id="espresso-stream" x1="0" x2="1">
          <stop offset="0" stopColor="#2b1206" />
          <stop offset=".45" stopColor="#8a4a20" />
          <stop offset="1" stopColor="#3a1808" />
        </linearGradient>
      </defs>

      {/* back of the cup: shadow, inside wall and the coffee surface */}
      <g data-cup>
        <ellipse cx="50" cy="147" rx="44" ry="6" fill="rgba(0,0,0,.4)" />
        <ellipse cx="50" cy="37" rx="42.5" ry="8" fill="url(#cup-inner)" />
        <g clipPath="url(#cup-mouth)">
          <ellipse data-liquid cx="50" cy="40" rx="41" ry="7.2" fill="url(#crema)" />
        </g>
      </g>

      {/* espresso stream from the spout */}
      <rect data-stream x="48" y="2.6" width="4" height="0" rx="2" fill="url(#espresso-stream)" />

      {/* front of the cup */}
      <g data-cup>
        <path d="M7.5 37 L17 145 A33 6 0 0 0 83 145 L92.5 37 A42.5 8 0 0 1 7.5 37 Z" fill="url(#cup-body)" />
        <path d="M14 48 L21 138 L27 139 L21 48 Z" fill="rgba(255,255,255,.07)" />
        <ellipse cx="50" cy="37" rx="42.5" ry="8" fill="none" stroke="#3b3b3b" strokeWidth="1.6" />
        <image href="images/logo-white.webp" x="25" y="82" width="50" height="15" preserveAspectRatio="xMidYMid meet" />
      </g>
    </svg>
  )
}

function Product({ id }) {
  if (id === 'brew') {
    return (
      // Sized by height and kept to the right of the text column on large screens, so they never overlap
      <div className="absolute bottom-[7%] left-1/2 aspect-[861/900] h-[min(36svh,76vw)] -translate-x-1/2 md:left-[60%] md:h-[min(40svh,58vw)] lg:bottom-[10%] lg:left-[max(50vw,calc(11vw+25rem))] lg:h-[min(62svh,40vw)] lg:translate-x-0">
        <FloorShadow className="bottom-[-4%] w-[90%]" />
        <div data-product className="absolute inset-0">
          <div data-zoom className="absolute inset-0">
            <div data-float className="absolute inset-0">
              <img src="images/machines.webp" alt="Barista espresso machine" className="absolute inset-0 size-full" />
              {/* beans fall into the capsule slot on top and disappear inside */}
              <div
                data-rain
                className="pointer-events-none absolute bottom-[87%] left-[51%] h-[8svh] w-[18%] md:h-[24svh] lg:h-[80svh] overflow-hidden"
                aria-hidden="true"
              >
                {Array.from({ length: 18 }).map((_, i) => (
                  <img key={i} data-drop src={beanSrcs[i % beanSrcs.length]} alt="" className="absolute top-0 left-1/2 w-4 opacity-0 md:w-6 lg:w-7" />
                ))}
              </div>
              <Cup />
              <div data-cup-steam className="absolute top-[36%] left-[71%] h-[22%] w-[16%]">
                <Steam className="inset-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (id === 'pour') {
    return (
      <div className="absolute right-[-22%] bottom-[10%] w-[128%] md:top-[4%] md:right-[-2%] md:bottom-auto md:w-[64%]">
        <div className="relative">
          <div data-float>
            <img data-product src="images/right-way.webp" alt="Barista iced coffee can pouring a coffee splash" className="w-full origin-[80%_60%]" />
          </div>
          {/* coffee drops falling from the splash */}
          <div className="pointer-events-none absolute top-[24%] left-[8%] h-[60%] w-[26%]" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} data-coffee-drop className="absolute top-0 block rounded-full bg-[#4a230f] opacity-0" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="absolute inset-x-[-14%] bottom-[8%] md:inset-x-auto md:bottom-[10%] md:left-[50%] md:w-[52%] md:-translate-x-1/2">
        <div className="relative">
          <FloorShadow className="bottom-[2%] w-[70%]" />
          <div data-float>
            {/*
              The photo is split into the glass (left of 50.5%) and the can (50.5–72.5%) so the can
              can lift and pour on its own. The "empty" glass is the same photo washed out; the full
              glass is revealed from the bottom up as the coffee pours. Markup = finished state.
            */}
            <div data-product className="relative">
              <img src="images/hero.webp" alt="" aria-hidden="true" className="invisible w-full" />
              <img
                data-glass-empty
                src="images/hero.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 size-full opacity-0 [clip-path:inset(0_49.5%_0_0)] [filter:grayscale(1)_brightness(2.3)_contrast(.4)]"
              />
              <svg data-can-pour viewBox="0 0 1400 788" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
                <defs>
                  <linearGradient id="iced-stream" x1="0" x2="1">
                    <stop offset="0" stopColor="#5b3219" />
                    <stop offset=".5" stopColor="#b47a4c" />
                    <stop offset="1" stopColor="#6b3c1f" />
                  </linearGradient>
                </defs>
                <path
                  data-can-stream
                  d="M567 173 C 562 260, 556 420, 552 700"
                  pathLength="1"
                  fill="none"
                  stroke="url(#iced-stream)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="1 1"
                  strokeDashoffset="1"
                />
              </svg>
              <img
                data-glass-full
                src="images/hero.webp"
                alt="A glass of Barista iced coffee"
                className="absolute inset-0 size-full [clip-path:inset(0%_49.5%_0%_0%)]"
              />
              <img
                data-can
                src="images/hero.webp"
                alt="Barista iced coffee can"
                className="absolute inset-0 size-full origin-[61.25%_50%] [clip-path:inset(0_27.5%_0_50.5%)]"
              />
            </div>
          </div>
        </div>
      </div>
      {rangeCards.map((c) => (
        <a
          key={c.name}
          data-card
          href={SHOP_URL}
          target="_blank"
          rel="noreferrer"
          className={`group absolute z-20 w-28 md:w-40 ${c.cls}`}
        >
          <span
            data-card-float
            className="block rounded-2xl border border-white/60 bg-[#f7f1ea]/90 p-2.5 text-ink shadow-[0_24px_40px_-18px_rgba(0,0,0,.55)] transition-[scale] duration-500 ease-expo group-hover:scale-105 md:p-3"
          >
            <span className="flex items-center justify-between font-display text-[13px] font-bold uppercase md:text-[15px]">
              {c.tag}
              <span className="text-[10px] opacity-50">↗</span>
            </span>
            <span className="mt-2 block h-14 overflow-hidden rounded-xl bg-white p-2 md:h-24">
              <img src={c.img} alt="" className="size-full object-contain" />
            </span>
            <span className="mt-2 block text-[10px] leading-tight font-semibold opacity-70 md:text-[11px]">{c.name}</span>
          </span>
        </a>
      ))}
    </>
  )
}

export default function Chapters() {
  const root = useRef(null)
  const trigger = useRef(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const sceneEls = q('[data-scene]')
      const n = sceneEls.length
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Stack the scenes inside one full-screen stage
        gsap.set(q('[data-stage]'), { height: '100svh' })
        gsap.set(sceneEls, { position: 'absolute', inset: 0 })
        // y offset keeps the next scene's wavy edge out of view until scrolling starts
        gsap.set(sceneEls.slice(1), { yPercent: 100, y: '18vh' })

        /* ---------- looping "alive" animations (transform/opacity only = smooth) ---------- */
        const rain = q('[data-rain]')[0]
        const fall = rain ? rain.offsetHeight : 400
        const spread = rain ? rain.offsetWidth * 0.32 : 26
        q('[data-drop]').forEach((el, i) => {
          gsap.set(el, { xPercent: -50, x: gsap.utils.random(-spread, spread), rotation: gsap.utils.random(0, 360) })
          // beans stay fully visible until the slot edge (the container clips them there)
          gsap.to(el, {
            keyframes: { y: [-40, fall + 10], opacity: [0, 1, 1, 1, 1, 1], easeEach: 'none' },
            rotation: '+=300',
            duration: 1.5,
            ease: 'power1.in',
            repeat: -1,
            delay: i * 0.09,
          })
        })

        // the espresso stream shimmers slightly while it pours
        gsap.to(q('[data-stream]'), { attr: { width: 3.2, x: 48.4 }, duration: 0.12, yoyo: true, repeat: -1, ease: 'sine.inOut' })

        q('[data-coffee-drop]').forEach((el, i) => {
          const size = gsap.utils.random(5, 10)
          gsap.set(el, { width: size, height: size * 1.25, left: `${gsap.utils.random(0, 90)}%` })
          gsap.to(el, {
            keyframes: { y: [0, window.innerHeight * 0.45], opacity: [0, 0.9, 0.9, 0], easeEach: 'none' },
            duration: gsap.utils.random(1.1, 1.8),
            ease: 'power2.in',
            repeat: -1,
            delay: i * 0.22,
          })
        })

        q('[data-steam]').forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 30, scaleY: 0.6, opacity: 0 },
            { keyframes: { opacity: [0, 0.9, 0], easeEach: 'none' }, y: -50, scaleY: 1.3, duration: 3.4, ease: 'sine.out', repeat: -1, delay: i * 1.1 },
          )
        })

        // The big word drifts slowly from side to side
        q('[data-ghost-drift]').forEach((el, i) =>
          gsap.fromTo(el, { xPercent: -4 }, { xPercent: 4, duration: 9 + i * 2, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
        )

        q('[data-float]').forEach((el, i) =>
          gsap.to(el, { y: -12, rotation: i === 1 ? -2 : 0.6, duration: 3 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
        )
        gsap.to(q('[data-card-float]'), { y: -10, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.4 })

        /* ---------- first scene plays in on load ---------- */
        const first = sceneEls[0]
        gsap
          .timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
          .from(first.querySelectorAll('[data-char]'), { yPercent: 115, rotate: 10, duration: 1.3, stagger: 0.06 })
          .from(first.querySelectorAll('[data-in]'), { y: 26, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.2)
          .from(first.querySelector('[data-product]'), { y: 140, opacity: 0, duration: 1.8 }, 0)
          .from(first.querySelector('[data-ghost-in]'), { yPercent: 50, opacity: 0, duration: 1.8 }, 0.15)
          .from(q('[data-ui]'), { opacity: 0, duration: 1 }, 0.7)

        /* ---------- pinned scroll sequence (follows the wheel directly, no snapping) ---------- */
        // Scroll "units": 0→1 brews the espresso in scene 1, one unit per scene change,
        // and a last unit where the can pours into the glass in scene 3
        const units = n + 1
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => '+=' + window.innerHeight * units * 1.15,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              const u = self.progress * units
              const i = u < 1.5 ? 0 : Math.min(n - 1, Math.round(u - 1))
              if (i !== activeRef.current) {
                activeRef.current = i
                setActive(i)
                window.dispatchEvent(new CustomEvent('chapter-theme', { detail: scenes[i].header }))
              }
            },
          },
        })
        trigger.current = tl.scrollTrigger

        /* ---------- unit 0→1: beans stop, cup slides in, espresso pours and fills it ---------- */
        const cups = q('[data-cup]')
        const stream = q('[data-stream]')
        const liquid = q('[data-liquid]')
        gsap.set(cups, { x: 150, opacity: 0 })
        gsap.set(liquid, { attr: { cy: 118, rx: 30, ry: 5 } })
        gsap.set(stream, { attr: { y: 2.6, height: 0 } })
        gsap.set(q('[data-cup-steam]'), { opacity: 0 })
        tl.to(q('[data-rain]'), { opacity: 0, duration: 0.12 }, 0)
          .to(q('[data-zoom]'), { scale: 1.1, transformOrigin: '79% 70%', duration: 0.5, ease: 'power1.inOut' }, 0)
          .to(cups, { x: 0, opacity: 1, duration: 0.28, ease: 'power2.out' }, 0.04)
          // stream reaches down into the cup
          .to(stream, { attr: { height: 116 }, duration: 0.08 }, 0.32)
          // coffee rises; the stream shortens with it so it always ends on the surface
          .to(liquid, { attr: { cy: 40, rx: 41, ry: 7.2 }, duration: 0.5, ease: 'power1.out' }, 0.38)
          .to(stream, { attr: { height: 37.4 }, duration: 0.5, ease: 'power1.out' }, 0.38)
          // last drops: the stream detaches from the spout and falls in
          .to(stream, { attr: { y: 40, height: 0 }, duration: 0.08 }, 0.88)
          .to(q('[data-cup-steam]'), { opacity: 1, duration: 0.2 }, 0.8)
          .to(q('[data-zoom]'), { scale: 1, duration: 0.3, ease: 'power1.inOut' }, 0.7)

        for (let i = 1; i < n; i++) {
          const prev = sceneEls[i - 1]
          const cur = sceneEls[i]
          const at = i
          tl.to(cur, { yPercent: 0, y: 0, duration: 1, ease: 'power1.inOut' }, at)
            .fromTo(cur.querySelector('[data-wave]'), { scaleY: 1 }, { scaleY: 0, duration: 0.4 }, at + 0.6)
            // outgoing scene keeps moving up like a page
            .to(prev.querySelector('[data-content]'), { yPercent: -35, opacity: 0, duration: 0.6, ease: 'power1.in' }, at)
            .to(prev.querySelector('[data-product-wrap]'), { yPercent: -45, duration: 1 }, at)
            .to(prev.querySelector('[data-ghost]'), { yPercent: -160, duration: 1 }, at)
            // incoming scene builds up
            .from(cur.querySelectorAll('[data-char]'), { yPercent: 115, rotate: 8, duration: 0.35, stagger: 0.05, ease: 'power3.out' }, at + 0.55)
            .from(cur.querySelectorAll('[data-in]'), { y: 26, opacity: 0, duration: 0.35, stagger: 0.05, ease: 'power3.out' }, at + 0.62)
            .from(cur.querySelector('[data-ghost-in]'), { yPercent: 60, opacity: 0, duration: 0.5 }, at + 0.45)
            .from(
              cur.querySelector('[data-product]'),
              i === 1
                ? { xPercent: 40, yPercent: -40, rotate: 25, opacity: 0, duration: 0.6, ease: 'power2.out' }
                : { yPercent: 30, scale: 0.85, opacity: 0, duration: 0.6, ease: 'power2.out' },
              at + 0.38,
            )
        }

        /* ---------- last unit: the can lifts, tilts over the glass and pours it full ---------- */
        const can = q('[data-can]')
        const canStream = q('[data-can-stream]')
        const glassFull = q('[data-glass-full]')
        const pourAt = n
        gsap.set(q('[data-glass-empty]'), { opacity: 0.7 })
        gsap.set(glassFull, { clipPath: 'inset(90% 49.5% 0% 0%)' })
        tl.to(can, { yPercent: -10, duration: 0.12, ease: 'power1.out' }, pourAt)
          // lip of the can ends up just above the middle of the glass
          .to(can, { rotation: -80, xPercent: 7.9, yPercent: -38.3, duration: 0.22, ease: 'power1.inOut' }, pourAt + 0.1)
          .to(canStream, { strokeDashoffset: 0, duration: 0.06 }, pourAt + 0.3)
          .to(glassFull, { clipPath: 'inset(0% 49.5% 0% 0%)', duration: 0.44, ease: 'power1.inOut' }, pourAt + 0.33)
          // last of the stream falls into the glass, then the can goes back
          .to(canStream, { strokeDashoffset: -1, duration: 0.06 }, pourAt + 0.77)
          .to(can, { rotation: 0, xPercent: 0, yPercent: 0, duration: 0.18, ease: 'power2.inOut' }, pourAt + 0.8)
        gsap.to(canStream, { attr: { 'stroke-width': 11 }, duration: 0.14, yoyo: true, repeat: -1, ease: 'sine.inOut' })

        // Product cards pop in when the last scene arrives (and tuck away when leaving)
        const cardsTween = gsap.from(q('[data-card]'), {
          scale: 0.5,
          opacity: 0,
          y: 40,
          rotate: (i) => (i % 2 ? 8 : -8),
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          paused: true,
        })
        tl.eventCallback('onUpdate', () => {
          // units: scene 3 slides in over 2→3 (cards at 2.6), the can pours over 3→4
          if (tl.progress() > 2.6 / units) cardsTween.play()
          else if (tl.progress() < 2.1 / units) cardsTween.reverse()
        })

        /* ---------- mouse parallax (desktop) ---------- */
        if (!window.matchMedia('(pointer: fine)').matches) return () => (trigger.current = null)
        const movers = [
          ...q('[data-mouse]').map((el) => ({ el, d: 1 })),
          ...q('[data-ghost-mouse]').map((el) => ({ el, d: -0.5 })),
        ].map(({ el, d }) => ({
          d,
          x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
        }))
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          movers.forEach((m) => {
            m.x(nx * 40 * m.d)
            m.y(ny * 24 * m.d)
          })
        }
        const stage = q('[data-stage]')[0]
        stage.addEventListener('mousemove', onMove)
        return () => {
          stage.removeEventListener('mousemove', onMove)
          trigger.current = null
        }
      })
    },
    { scope: root },
  )

  const goTo = (i) => {
    const st = trigger.current
    const target = Math.max(0, Math.min(scenes.length - 1, i))
    if (!st) {
      document.querySelectorAll('[data-scene]')[target]?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    // scene 1 starts at unit 0; every later scene sits one unit after the espresso pour
    const unit = target === 0 ? 0 : target + 1
    const y = st.start + (st.end - st.start) * (unit / (scenes.length + 1))
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.4 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section id="top" ref={root} aria-label="The Barista coffee journey" className="relative">
      <div data-stage className="relative overflow-hidden">
        {scenes.map((s, i) => (
          <article
            key={s.id}
            data-scene={s.id}
            data-header={s.header}
            className="relative h-[100svh] w-full will-change-transform"
            style={{ background: s.bg, zIndex: i + 1 }}
          >
            {i > 0 && (
              <svg
                data-wave
                viewBox="0 0 1440 160"
                preserveAspectRatio="none"
                className="absolute bottom-full left-0 h-[16vh] w-full origin-bottom"
                aria-hidden="true"
              >
                <path d="M0,160 L0,70 C160,10 320,0 480,40 C640,80 760,150 940,120 C1100,92 1260,10 1440,30 L1440,160 Z" fill={s.waveFill} />
              </svg>
            )}

            {/* one giant word behind the product, below the text block */}
            <div data-ghost className={`pointer-events-none absolute inset-x-0 ${s.ghostWrap ?? 'top-[46%] md:top-[60%]'}`} aria-hidden="true">
              <div data-ghost-mouse>
                <div data-ghost-in className={`flex ${s.ghostAlign ?? 'justify-center'}`}>
                  <div
                    data-ghost-drift
                    className={`font-display leading-none whitespace-nowrap ${s.ghostSize ?? 'text-[30vw] md:text-[min(19vw,34vh)]'} ${s.ghostCls}`}
                    style={{ fontWeight: 700, fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
                  >
                    {s.ghost}
                  </div>
                </div>
              </div>
            </div>

            <div data-product-wrap className="absolute inset-0 z-10">
              <div data-mouse className="absolute inset-0 will-change-transform">
                <Product id={s.id} />
              </div>
            </div>

            {/* text: left, vertically centred in the upper part */}
            <div
              data-content
              className={`relative z-20 flex h-full flex-col px-6 pt-[13svh] md:justify-start md:pt-[24vh] md:pl-[11vw] ${s.textCls}`}
            >
              <div className="w-fit">
                <p data-in className="text-[11px] font-bold tracking-[0.32em] uppercase opacity-80">
                  {s.label}
                </p>
                <h2 aria-label={s.title} className="line-mask mt-2 font-display text-[clamp(3rem,min(6.4vw,11vh),6.25rem)] leading-[1] uppercase">
                  {s.title.split('').map((ch, k) => (
                    <span key={k} data-char aria-hidden="true" className="inline-block origin-bottom-left">
                      {ch}
                    </span>
                  ))}
                </h2>
                <p data-in className="mt-3 max-w-[19rem] text-sm leading-relaxed opacity-80 md:max-w-[22rem] md:text-[15px]">
                  {s.text}
                </p>
                <a
                  data-in
                  href={s.cta.href}
                  target={s.cta.external ? '_blank' : undefined}
                  rel={s.cta.external ? 'noreferrer' : undefined}
                  onClick={(e) => scrollToHash(e, s.cta.href)}
                  className="group relative mt-6 inline-flex h-11 items-center gap-0 overflow-hidden rounded-full bg-ink px-7 text-[11px] font-bold tracking-[0.2em] text-cream uppercase shadow-[0_12px_24px_-12px_rgba(0,0,0,.6)] transition-[gap,padding] duration-500 ease-expo hover:gap-3 hover:pr-6"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-caramel transition-transform duration-500 ease-expo group-hover:scale-x-100" />
                  <span className="relative">{s.cta.label}</span>
                  <span className="relative w-0 overflow-hidden transition-[width] duration-500 ease-expo group-hover:w-3">→</span>
                </a>
              </div>
            </div>
          </article>
        ))}

        {/* slider controls like the reel: white round arrows + dots */}
        <div data-ui className="pointer-events-none absolute inset-0 z-30">
          {[
            { dir: -1, label: 'Previous section', cls: 'left-4 md:left-[3vw]', d: 'M10 3L5 8l5 5' },
            { dir: 1, label: 'Next section', cls: 'right-4 md:right-[3vw]', d: 'M6 3l5 5-5 5' },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => goTo(active + b.dir)}
              disabled={b.dir < 0 ? active === 0 : active === scenes.length - 1}
              aria-label={b.label}
              className={`pointer-events-auto absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-[0_10px_24px_-10px_rgba(0,0,0,.45)] transition-[scale,opacity] duration-300 hover:scale-110 disabled:opacity-0 md:grid ${b.cls}`}
            >
              <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
                <path d={b.d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
          <div className={`absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 ${scenes[active].header === 'ink' ? 'text-ink' : 'text-cream'}`}>
            {scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${s.title}`}
                aria-current={active === i}
                className={`pointer-events-auto h-1.5 rounded-full bg-current transition-[width,opacity] duration-500 ease-expo ${active === i ? 'w-6 opacity-100' : 'w-1.5 opacity-40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
