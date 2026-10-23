import { useRef, useState } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { getLenis, scrollToHash } from '../lib/scroll'
import { SHOP_URL } from '../data'
import Cup from './Cup'
import { pageReady } from '../lib/ready'

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
  { tag: 'Capsules', name: 'Espresso Capsules', img: 'images/capsules.webp', cls: 'md:left-[63%] md:top-[18%]' },
  { tag: 'Syrups', name: 'Syrups & Sauces', img: 'images/syrups.webp', cls: 'md:right-[9%] md:top-[40%]' },
  { tag: 'Machines', name: 'Espresso Machines', img: 'images/machines.webp', cls: 'md:left-[22%] md:bottom-[14%]' },
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
              <Cup id="brew-cup" stream />
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
            <div data-product className="relative origin-[80%_60%]">
              {/* the photo as shot, with its splash */}
              <img data-pour-full src="images/right-way.webp" alt="Barista iced coffee can pouring a coffee splash" className="w-full" />
              {/* the same photo without the splash: this one tilts to pour into the glass in the next section */}
              <div data-pour-tilt className="absolute inset-0 opacity-0">
                <img
                  src="images/right-way.webp"
                  alt=""
                  aria-hidden="true"
                  className="size-full [clip-path:polygon(26%_44%,36.5%_23%,48%_0,100%_0,100%_100%,26%_100%)]"
                />
                {/* the can's opening: the coffee stream starts here */}
                <span data-can-mouth className="absolute top-[39%] left-[28%] size-px" />
              </div>
            </div>
          </div>
          {/* coffee drops falling from the splash */}
          <div data-pour-drops className="pointer-events-none absolute top-[24%] left-[8%] h-[60%] w-[26%]" aria-hidden="true">
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
      <div className="absolute bottom-[max(25%,12rem)] left-1/2 w-[min(92vw,36svh)] -translate-x-1/2 md:inset-x-auto md:bottom-[10%] md:left-[50%] md:w-[52%] md:-translate-x-1/2">
        <div className="relative">
          <FloorShadow className="bottom-[2%] w-[70%]" />
          <div data-float>
            {/*
              The photo is split into the glass (left of 50.5%) and the can (right of it). The "empty"
              glass is the same photo washed out; the full glass is revealed from the bottom up as the
              stream from the can in scene 2 pours in. Markup = finished state.
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
                className="absolute inset-0 size-full [clip-path:inset(0_27.5%_0_50.5%)]"
              />
            </div>
          </div>
        </div>
      </div>
      {/* phones: the cards sit in a row under the product; larger screens: they float around it */}
      <div className="absolute inset-x-4 bottom-[max(10%,5.5rem)] z-20 flex justify-center gap-2 md:contents">
      {rangeCards.map((c) => (
        <a
          key={c.name}
          data-card
          href={SHOP_URL}
          target="_blank"
          rel="noreferrer"
          className={`group relative w-[31%] max-w-36 md:absolute md:z-20 md:w-40 md:max-w-none ${c.cls}`}
        >
          <span
            data-card-float
            className="block rounded-2xl border border-white/60 bg-[#f7f1ea]/90 p-2.5 text-ink shadow-[0_24px_40px_-18px_rgba(0,0,0,.55)] transition-[scale] duration-500 ease-expo group-hover:scale-105 md:p-3"
          >
            <span className="flex items-center justify-between font-display text-[13px] font-bold uppercase md:text-[15px]">
              {c.tag}
              <span className="text-[10px] opacity-50">↗</span>
            </span>
            <span className="mt-2 block h-12 overflow-hidden rounded-xl bg-white p-1.5 md:h-24 md:p-2">
              <img src={c.img} alt="" className="size-full object-contain" />
            </span>
            <span className="mt-2 hidden text-[11px] leading-tight font-semibold opacity-70 md:block">{c.name}</span>
          </span>
        </a>
      ))}
      </div>
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

        /* ---------- first scene plays in once the loading screen lifts ---------- */
        const first = sceneEls[0]
        const intro = gsap
          .timeline({ defaults: { ease: 'expo.out' }, paused: true })
          .from(first.querySelectorAll('[data-char]'), { yPercent: 115, rotate: 10, duration: 1.3, stagger: 0.06 })
          .from(first.querySelectorAll('[data-in]'), { y: 26, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.2)
          .from(first.querySelector('[data-product]'), { y: 140, opacity: 0, duration: 1.8 }, 0)
          .from(first.querySelector('[data-ghost-in]'), { yPercent: 50, opacity: 0, duration: 1.8 }, 0.15)
          .from(q('[data-ui]'), { opacity: 0, duration: 1 }, 0.7)
        pageReady.then(() => intro.play())

        /* ---------- pinned scroll sequence (follows the wheel directly, no snapping) ---------- */
        // Scroll "units":
        //   0→1  scene 1: espresso pours into the cup
        //   1→2  scene 2 slides in
        //   2→3  scene 2: the hand tilts the can and coffee starts pouring down
        //   3→4  scene 3 slides in under the stream; the glass fills (until ~4.5)
        const sceneStart = [0, 1, 3]
        const units = 5
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
              const i = u < 1.5 ? 0 : u < 3.5 ? 1 : 2
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
          const at = sceneStart[i]
          // the last scene is revealed by the liquid wave (below) instead of sliding up
          if (i === n - 1) gsap.set(cur, { yPercent: 0, y: 0 })
          else
            tl.to(cur, { yPercent: 0, y: 0, duration: 1, ease: 'power1.inOut' }, at).fromTo(
              cur.querySelector('[data-wave]'),
              { scaleY: 1 },
              { scaleY: 0, duration: 0.4 },
              at + 0.6,
            )
          tl
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

        /* ---------- scene 2 → 3: the can pours one stream that lands in the glass below ---------- */
        const glassFull = q('[data-glass-full]')
        const pourStream = q('[data-pour-stream] path')
        const mouth = q('[data-can-mouth]')[0]
        const stageEl = q('[data-stage]')[0]
        // grow: how far the stream's front has travelled (0 = at the can, 1 = in the glass)
        // cut: how far its tail has left the can (stream ends when cut reaches grow)
        // fill: top of the visible coffee in the glass, as a share of the photo height
        const pour = { grow: 0, cut: 0, fill: 0.9 }
        gsap.set(q('[data-glass-empty]'), { opacity: 0.7 })
        gsap.set(glassFull, { clipPath: 'inset(90% 49.5% 0% 0%)' })
        tl.to(q('[data-pour-full]'), { opacity: 0, duration: 0.12 }, 2.05)
          .to(q('[data-pour-drops]'), { opacity: 0, duration: 0.12 }, 2.05)
          .to(q('[data-pour-tilt]'), { opacity: 1, duration: 0.1 }, 2.05)
          .to(q('[data-pour-tilt]'), { rotation: -38, transformOrigin: '72% 70%', duration: 0.35, ease: 'power2.inOut' }, 2.05)
          .to(pour, { grow: 1, duration: 1.3, ease: 'power1.in' }, 2.35)
          .to(pour, { fill: 0, duration: 0.9, ease: 'power1.inOut' }, 3.65)
          .to(glassFull, { clipPath: 'inset(0% 49.5% 0% 0%)', duration: 0.9, ease: 'power1.inOut' }, 3.65)
          .to(pour, { cut: 1, duration: 0.18, ease: 'power1.in' }, 4.35)

        // Draw the stream every frame from the can's opening to the coffee surface in the glass.
        // Both move (scenes slide, products float), so the ends are measured live.
        const drawStream = () => {
          if (pour.grow <= pour.cut) {
            pourStream.forEach((p) => p.setAttribute('d', ''))
            return
          }
          const s = stageEl.getBoundingClientRect()
          const m = mouth.getBoundingClientRect()
          const g = glassFull[0].getBoundingClientRect()
          const x0 = m.left - s.left
          const y0 = m.top - s.top
          const x1 = g.left - s.left + g.width * 0.405
          const y1 = g.top - s.top + g.height * Math.max(pour.fill, 0.4)
          // leaves the can sideways, then falls (quadratic curve)
          const d = `M${x0} ${y0} Q${x0 + (x1 - x0) * 0.75} ${y0 + (y1 - y0) * 0.08} ${x1} ${y1}`
          pourStream.forEach((p) => {
            p.setAttribute('d', d)
            p.setAttribute('stroke-dasharray', `${pour.grow - pour.cut} 2`)
            p.setAttribute('stroke-dashoffset', String(-pour.cut))
          })
        }
        gsap.ticker.add(drawStream)

        /* ---------- unit 3→4: a glossy wave of coffee rises and reveals "Sip" inside it (as in the reel) ---------- */
        const sipScene = sceneEls[n - 1]
        const liquidSvg = q('[data-liquid-edge]')[0]
        const [tint, edgeTop, edgeBottom, shineTop, shineBottom] = q('[data-liquid-edge] path')
        const wave = { p: 0 }
        gsap.set(sipScene.querySelector('[data-wave]'), { display: 'none' })
        tl.to(wave, { p: 1, duration: 1.05, ease: 'power1.inOut' }, sceneStart[n - 1])

        const STEPS = 36
        const drawLiquid = (time) => {
          const p = wave.p
          if (p >= 1) {
            if (sipScene.style.clipPath !== 'none') sipScene.style.clipPath = 'none'
            liquidSvg.style.opacity = '0'
            return
          }
          if (p <= 0) {
            sipScene.style.clipPath = 'polygon(0 0, 0 0, 0 0)'
            liquidSvg.style.opacity = '0'
            return
          }
          const W = stageEl.clientWidth
          const H = stageEl.clientHeight
          // a lens of liquid: thin and wavy at first, then it swells until it covers the screen
          const mid = 0.74 - 0.24 * p
          const half = 0.95 * p * p + 0.05 * p
          const wob = 0.05 * (1 - p)
          const t = time * 0.35
          const top = []
          const bot = []
          for (let k = 0; k <= STEPS; k++) {
            const x = k / STEPS
            const shape = 0.8 + 0.2 * Math.sin(Math.PI * (x * 1.2 + 0.1))
            const ripple = wob * Math.sin(Math.PI * 2 * (x * 0.9 + t))
            top.push([x * W, (mid - half * shape + ripple) * H])
            bot.push([x * W, (mid + half * shape * 0.9 + ripple * 0.8) * H])
          }
          const pct = ([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`
          sipScene.style.clipPath = `polygon(${[...top, ...bot.slice().reverse()].map(pct).join(',')})`

          // glossy amber surfaces along both edges of the wave
          const th = Math.min(0.07 * H, half * H * 0.6)
          const band = (edge, dir) =>
            `M${edge.map(([x, y]) => `${x},${y}`).join(' L')} L${edge
              .slice()
              .reverse()
              .map(([x, y]) => `${x},${y + dir * th}`)
              .join(' L')} Z`
          const line = (edge, off) => `M${edge.map(([x, y]) => `${x},${y + off}`).join(' L')}`
          liquidSvg.setAttribute('viewBox', `0 0 ${W} ${H}`)
          liquidSvg.style.opacity = '1'
          // amber tint through the whole wave, clearing as it covers the screen
          tint.setAttribute('d', `M${top.map(([x, y]) => `${x},${y}`).join(' L')} L${bot.slice().reverse().map(([x, y]) => `${x},${y}`).join(' L')} Z`)
          tint.setAttribute('fill-opacity', String(0.42 * (1 - p) * (1 - p)))
          edgeTop.setAttribute('d', band(top, 1))
          edgeBottom.setAttribute('d', band(bot, -1))
          shineTop.setAttribute('d', line(top, th * 0.28))
          shineBottom.setAttribute('d', line(bot, -th * 0.3))
        }
        gsap.ticker.add(drawLiquid)
        // keep the timeline exactly `units` long so scroll position maps to the units above
        tl.set({}, {}, units)

        /* ---------- product cards burst out from behind the glass, tumbling, then float around it ---------- */
        const cardEls = q('[data-card]')
        const burstFrom = (el) => {
          const g = glassFull[0].getBoundingClientRect()
          const c = el.getBoundingClientRect()
          return { x: g.left + g.width * 0.42 - (c.left + c.width / 2), y: g.top + g.height * 0.35 - (c.top + c.height / 2) }
        }
        let cardsTween = null
        const makeCards = () => {
          cardsTween?.progress(0).kill()
          gsap.set(cardEls, { clearProps: 'transform,opacity' })
          cardsTween = gsap.fromTo(
            cardEls,
            {
              x: (i, el) => burstFrom(el).x,
              y: (i, el) => burstFrom(el).y,
              scale: 0.15,
              opacity: 0,
              rotationX: (i) => [65, -55, 70][i % 3],
              rotationY: (i) => [-80, 70, 45][i % 3],
              rotation: (i) => [-35, 30, -20][i % 3],
              transformPerspective: 900,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              rotationX: 0,
              rotationY: 0,
              rotation: (i) => [-4, 5, -3][i % 3],
              duration: 1.15,
              stagger: 0.12,
              ease: 'back.out(1.3)',
              paused: true,
            },
          )
        }
        makeCards()
        let cardsOut = false
        tl.eventCallback('onUpdate', () => {
          // the wave covers the screen at ~unit 3.9; cards burst out then (and tuck back when scrolling up)
          if (tl.progress() > 3.85 / units && !cardsOut) {
            cardsOut = true
            makeCards()
            cardsTween.play()
          } else if (tl.progress() < 3.5 / units && cardsOut) {
            cardsOut = false
            cardsTween.reverse()
          }
        })

        /* ---------- mouse parallax (desktop) ---------- */
        if (!window.matchMedia('(pointer: fine)').matches)
          return () => {
            gsap.ticker.remove(drawStream)
            gsap.ticker.remove(drawLiquid)
            trigger.current = null
          }
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
          gsap.ticker.remove(drawStream)
          gsap.ticker.remove(drawLiquid)
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
    // where each scene is fully in view, in scroll units (see the timeline)
    const unit = [0, 2, 4][target]
    const y = st.start + (st.end - st.start) * (unit / 5)
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
                    className={`font-display leading-none whitespace-nowrap ${s.ghostSize ?? 'text-[22vw] md:text-[min(19vw,34vh)]'} ${s.ghostCls}`}
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

        {/* glossy amber edges of the liquid wave that reveals "Sip" (shapes are drawn in Chapters' timeline) */}
        <svg data-liquid-edge className="pointer-events-none absolute inset-0 z-[4] size-full opacity-0" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="liquid-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a1a0a" stopOpacity=".95" />
              <stop offset=".25" stopColor="#8a4a1e" stopOpacity=".85" />
              <stop offset="1" stopColor="#c27a3a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="liquid-bottom" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#3a1a0a" stopOpacity=".95" />
              <stop offset=".3" stopColor="#b8702f" stopOpacity=".8" />
              <stop offset="1" stopColor="#e0a060" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="#b8692c" />
          <path fill="url(#liquid-top)" />
          <path fill="url(#liquid-bottom)" />
          <path fill="none" stroke="#ffe2b8" strokeOpacity=".55" strokeWidth="2.5" strokeLinecap="round" />
          <path fill="none" stroke="#ffe2b8" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* the coffee stream from the can in scene 2 to the glass in scene 3, drawn above both scenes */}
        <svg data-pour-stream className="pointer-events-none absolute inset-0 z-[5] size-full overflow-visible" aria-hidden="true">
          <path pathLength="1" fill="none" stroke="#7a4524" strokeWidth="9" strokeLinecap="round" strokeDasharray="0 2" />
          <path pathLength="1" fill="none" stroke="#c28d5e" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" strokeDasharray="0 2" />
        </svg>

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
