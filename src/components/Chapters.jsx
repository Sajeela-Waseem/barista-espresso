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
    ghostWrap: 'bottom-[22%] opacity-45 md:bottom-auto md:opacity-100 md:top-[10%] md:pl-[11vw] lg:top-[63%]',
    ghostAlign: 'justify-center md:justify-start',
    ghostSize: 'text-[26vw] md:text-[13vw] lg:text-[min(8.8vw,19vh)]',
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
      // a light counter for the glass to stand on, like the reel's pour shot
      'linear-gradient(to bottom, transparent 0 82%, rgba(0,0,0,.12) 82%, transparent 85%)',
      'linear-gradient(to bottom, transparent 0 82%, #efe4d6 82%, #faf5ee 100%)',
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
  { tag: 'Capsules', name: 'Espresso Capsules', img: 'images/capsules.webp' },
  { tag: 'Syrups', name: 'Syrups & Sauces', img: 'images/syrups.webp' },
  { tag: 'Machines', name: 'Espresso Machines', img: 'images/machines.webp' },
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
      <div className="absolute bottom-[7%] left-1/2 aspect-[861/900] h-[min(34svh,72vw)] -translate-x-1/2 md:left-[60%] md:h-[min(40svh,58vw)] lg:bottom-[10%] lg:left-[max(50vw,calc(11vw+25rem))] lg:h-[min(62svh,40vw)] lg:translate-x-0">
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
      // top-right, so the can pours straight down into the glass standing in the middle
      <div className="absolute top-[34%] right-[-46%] w-[126%] md:top-[calc(41svh-37vw)] md:right-[-6%] md:w-[71%]">
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
  // Without motion this static glass and card row is shown; with motion the travelling
  // glass and the orbiting cards (in the stage, see Chapters) replace it.
  return (
    <div data-static-sip>
      <div data-product className="absolute bottom-[14%] left-1/2 h-[30svh] -translate-x-1/2 md:bottom-[10%] md:left-[55%] md:h-[min(50svh,38vw)]">
        <FloorShadow className="bottom-[-3%] w-[80%]" />
        <GlassImage full className="relative h-full" />
      </div>
      <div className="absolute inset-x-4 bottom-[3%] z-20 flex justify-center gap-2">
        {rangeCards.map((c) => (
          <RangeCard key={c.name} c={c} className="w-[31%] max-w-36" />
        ))}
      </div>
    </div>
  )
}

/* The whole product photo (glass + can) from images/hero.webp, trimmed to the products */
const GLASS_CROP = { l: 0.2, t: 0, w: 0.53, h: 0.98 }
// width / height of the trimmed photo
const PHOTO_RATIO = (GLASS_CROP.w * 1400) / (GLASS_CROP.h * 788)
// the photo is centred on its spot
const GLASS_MID = 0.5
// where the glass is inside the trimmed photo: its centre, and where the can starts
const GLASS_CENTER_X = (0.405 - GLASS_CROP.l) / GLASS_CROP.w
const CAN_LEFT = (0.505 - GLASS_CROP.l) / GLASS_CROP.w
// share of the photo on the right that is the can (used to clip the glass layers)
const CAN_CLIP = `${((1 - CAN_LEFT) * 100).toFixed(2)}%`
const glassImgStyle = {
  position: 'absolute',
  maxWidth: 'none',
  width: `${100 / GLASS_CROP.w}%`,
  height: `${100 / GLASS_CROP.h}%`,
  left: `${(-GLASS_CROP.l / GLASS_CROP.w) * 100}%`,
  top: `${(-GLASS_CROP.t / GLASS_CROP.h) * 100}%`,
}

/*
  Layers: the can (always as photographed), the glass empty (washed out), and the glass
  full, which is revealed from the bottom up as it is poured. `full` = static, already full.
*/
function GlassImage({ full = false, className = '' }) {
  return (
    <div className={`relative aspect-[742/772] overflow-hidden ${className}`}>
      {full ? (
        <img src="images/hero.webp" alt="Barista iced coffee can and a glass of iced coffee" style={glassImgStyle} />
      ) : (
        <>
          <img
            src="images/hero.webp"
            alt="Barista iced coffee can"
            style={{ ...glassImgStyle, clipPath: `inset(0 0 0 ${((GLASS_CROP.l + CAN_LEFT * GLASS_CROP.w) * 100).toFixed(2)}%)` }}
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${CAN_CLIP} 0 0)` }}>
            <img
              data-glass-empty
              src="images/hero.webp"
              alt=""
              aria-hidden="true"
              style={glassImgStyle}
              className="opacity-70 [filter:grayscale(1)_brightness(2.3)_contrast(.4)]"
            />
            <div data-glass-full className="absolute inset-0">
              <img src="images/hero.webp" alt="A glass of Barista iced coffee" style={glassImgStyle} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function RangeCard({ c, className = '', ...rest }) {
  return (
    <a href={SHOP_URL} target="_blank" rel="noreferrer" className={`group block ${className}`} {...rest}>
      <span className="block rounded-2xl border border-white/60 bg-[#f7f1ea]/95 p-2 text-ink shadow-[0_24px_40px_-18px_rgba(0,0,0,.55)] transition-[scale] duration-500 ease-expo group-hover:scale-105 md:p-3">
        <span className="flex items-center justify-between font-display text-[12px] font-bold uppercase md:text-[15px]">
          {c.tag}
          <span className="text-[10px] opacity-50">↗</span>
        </span>
        <span className="mt-2 block h-12 overflow-hidden rounded-xl bg-white p-1.5 md:h-24 md:p-2">
          <img src={c.img} alt="" className="size-full object-contain" />
        </span>
        <span className="mt-2 hidden text-[11px] leading-tight font-semibold opacity-70 md:block">{c.name}</span>
      </span>
    </a>
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

        /* ---------- unit 2→3 (in "Pour"): the hand tilts the can and pours the glass full ---------- */
        // One glass lives in the stage above the scenes. It sits on a slot in "Pour", fills there,
        // then rides the liquid wave to its slot in "Sip" (unit 3→4), where the cards orbit it.
        const travelGlass = q('[data-travel-glass]')[0]
        const glassFull = q('[data-travel-glass] [data-glass-full]')
        const slotPour = q('[data-glass-slot="pour"]')[0]
        const slotSip = q('[data-glass-slot="sip"]')[0]
        const pourStream = q('[data-pour-stream] path')
        const mouth = q('[data-can-mouth]')[0]
        const stageEl = q('[data-stage]')[0]
        gsap.set(q('[data-hero-layer]'), { display: 'block' })
        gsap.set(q('[data-static-sip]'), { display: 'none' })
        // grow: how far the stream's front has travelled (0 = at the can, 1 = in the glass)
        // cut: how far its tail has left the can (stream ends when cut reaches grow)
        // fill: top of the coffee in the glass, as a share of the glass height
        const pour = { grow: 0, cut: 0, fill: 0.9 }
        const move = { t: 0 }
        gsap.set(glassFull, { clipPath: 'inset(88% 0% 0% 0%)' })
        tl.to(q('[data-pour-full]'), { opacity: 0, duration: 0.12 }, 2.05)
          .to(q('[data-pour-drops]'), { opacity: 0, duration: 0.12 }, 2.05)
          .to(q('[data-pour-tilt]'), { opacity: 1, duration: 0.1 }, 2.05)
          .to(q('[data-pour-tilt]'), { rotation: -38, transformOrigin: '72% 70%', duration: 0.35, ease: 'power2.inOut' }, 2.05)
          .to(pour, { grow: 1, duration: 0.3, ease: 'power1.in' }, 2.35)
          .to(pour, { fill: 0, duration: 0.7, ease: 'power1.inOut' }, 2.55)
          .to(glassFull, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power1.inOut' }, 2.55)
          .to(pour, { cut: 1, duration: 0.12, ease: 'power1.in' }, 3.15)
          .to(q('[data-pour-tilt]'), { rotation: 0, duration: 0.3, ease: 'power2.inOut' }, 3.25)
          // the full glass travels with the wave into "Sip"
          .to(move, { t: 1, duration: 0.9, ease: 'power2.inOut' }, 3.1)

        /* ---------- unit 3→4: a glossy wave of coffee rises and reveals "Sip" inside it (as in the reel) ---------- */
        const sipScene = sceneEls[n - 1]
        const liquidSvg = q('[data-liquid-edge]')[0]
        const [tint, edgeTop, edgeBottom, shineTop, shineBottom] = q('[data-liquid-edge] path')
        const wave = { p: 0 }
        gsap.set(sipScene.querySelector('[data-wave]'), { display: 'none' })
        tl.to(wave, { p: 1, duration: 1.05, ease: 'power1.inOut' }, sceneStart[n - 1])
        // keep the timeline exactly `units` long so scroll position maps to the units above
        tl.set({}, {}, units)

        /* ---------- in "Sip": the cards fly out from behind the glass once, then rest around it (as in the reel) ---------- */
        // Resting spots, relative to the glass: dx/dy in glass widths/heights from its centre.
        // front = drawn in front of the glass, otherwise behind it.
        const SPOTS = [
          { dx: 0.74, dy: -0.4, rot: 5, front: true }, // Capsules: top right, just overlapping the can
          { dx: 0.8, dy: 0.06, rot: -4, front: true }, // Syrups: to the right
          { dx: -0.52, dy: 0.2, rot: -6, front: true }, // Machines: low on the front-left, overlapping the glass
        ]
        // phones are too narrow for cards beside the can, so two of them sit above the products
        const SPOTS_PHONE = [
          { dx: -0.32, dy: -0.58, rot: -5, front: false },
          { dx: 0.36, dy: -0.62, rot: 4, front: false },
          { dx: -0.5, dy: 0.22, rot: -6, front: true },
        ]
        const orbitCards = q('[data-orbit-card]')
        const settle = { r: 0 }
        tl.to(settle, { r: 1, duration: 0.75, ease: 'none' }, 3.7)
        const backOut = gsap.parseEase('back.out(1.3)')

        /*
          One per-frame update for the glass, the stream, the wave and the cards.
          For smooth frames it first READS every position it needs, then only WRITES
          (transforms, SVG paths), so the browser lays the page out once per frame.
          It sleeps while the section is off screen.
        */
        let onScreen = true
        const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting))
        io.observe(stageEl)
        const mouse = { x: 0, y: 0 }
        const onGlassMouse = (e) => {
          mouse.x = e.clientX / window.innerWidth - 0.5
          mouse.y = e.clientY / window.innerHeight - 0.5
        }
        window.addEventListener('mousemove', onGlassMouse)
        let tiltX = 0
        let tiltY = 0
        let baseH = 0
        let cardW = 0
        let clipState = ''
        const lerp = (a, b, t) => a + (b - a) * t
        const STEPS = 28
        const fmt = (v) => v.toFixed(1)

        const frame = (time) => {
          if (!onScreen) return

          /* ----- reads ----- */
          const s = stageEl.getBoundingClientRect()
          const a = slotPour.getBoundingClientRect()
          const b = slotSip.getBoundingClientRect()
          const streamOn = pour.grow > pour.cut
          const m = streamOn ? mouth.getBoundingClientRect() : null
          const W = s.width
          const H = s.height

          /* ----- glass: travels from its "Pour" spot to its "Sip" spot ----- */
          const t = move.t
          const h = lerp(a.height, b.height, t)
          const w = h * PHOTO_RATIO
          const cx = lerp(a.left + a.width / 2, b.left + b.width / 2, t) - s.left
          // a small hop on the way, and a gentle float once it has arrived
          const lift = Math.sin(Math.PI * t) * h * 0.12 + Math.sin(time * 1.6) * 4 * t
          const bottom = lerp(a.bottom, b.bottom, t) - s.top - lift
          // the element keeps one size (the "Sip" size) and is scaled, so nothing is re-laid out
          if (Math.abs(baseH - b.height) > 0.5) {
            baseH = b.height
            travelGlass.style.height = `${baseH}px`
            travelGlass.style.width = `${baseH * PHOTO_RATIO}px`
            travelGlass.style.transformOrigin = `${GLASS_MID * 100}% 100%`
          }
          // 3D: the glass turns slightly towards the mouse and sways a little on its own
          tiltX += (mouse.y * -7 - tiltX) * 0.08
          tiltY += (mouse.x * 12 + Math.sin(time * 0.8) * 3 - tiltY) * 0.08
          const ox = baseH * PHOTO_RATIO * GLASS_MID
          travelGlass.style.transform =
            `translate3d(${fmt(cx - ox)}px, ${fmt(bottom - baseH)}px, 0) scale(${(h / baseH).toFixed(4)}) ` +
            `perspective(${fmt(baseH * 3.4)}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) rotate(${(Math.sin(Math.PI * t) * -4).toFixed(2)}deg)`
          const gTop = bottom - h
          const gLeft = cx - w * GLASS_MID

          /* ----- stream: from the can's opening to the coffee surface ----- */
          if (streamOn) {
            const x0 = m.left - s.left
            const y0 = m.top - s.top
            const x1 = gLeft + w * GLASS_CENTER_X
            const y1 = gTop + h * Math.max(pour.fill, 0.4)
            // leaves the can sideways, then falls (quadratic curve)
            const d = `M${fmt(x0)} ${fmt(y0)} Q${fmt(x0 + (x1 - x0) * 0.75)} ${fmt(y0 + (y1 - y0) * 0.08)} ${fmt(x1)} ${fmt(y1)}`
            pourStream.forEach((p) => {
              p.setAttribute('d', d)
              p.setAttribute('stroke-dasharray', `${(pour.grow - pour.cut).toFixed(4)} 2`)
              p.setAttribute('stroke-dashoffset', String(-pour.cut))
            })
          } else if (pourStream[0].getAttribute('d')) pourStream.forEach((p) => p.setAttribute('d', ''))

          /* ----- liquid wave ----- */
          const p = wave.p
          if (p <= 0 || p >= 1) {
            const want = p <= 0 ? 'hidden' : 'shown'
            if (clipState !== want) {
              clipState = want
              sipScene.style.clipPath = p <= 0 ? 'polygon(0 0, 0 0, 0 0)' : 'none'
              liquidSvg.style.opacity = '0'
            }
          } else {
            clipState = 'wave'
            // a lens of liquid: thin and wavy at first, then it swells until it covers the screen
            const mid = 0.74 - 0.24 * p
            const half = 0.95 * p * p + 0.05 * p
            const wob = 0.05 * (1 - p)
            const ph = time * 0.35
            const top = []
            const bot = []
            for (let k = 0; k <= STEPS; k++) {
              const x = k / STEPS
              const shape = 0.8 + 0.2 * Math.sin(Math.PI * (x * 1.2 + 0.1))
              const ripple = wob * Math.sin(Math.PI * 2 * (x * 0.9 + ph))
              top.push([x * W, (mid - half * shape + ripple) * H])
              bot.push([x * W, (mid + half * shape * 0.9 + ripple * 0.8) * H])
            }
            const botRev = bot.slice().reverse()
            sipScene.style.clipPath = `polygon(${top
              .concat(botRev)
              .map(([x, y]) => `${fmt(x)}px ${fmt(y)}px`)
              .join(',')})`
            // glossy amber surfaces along both edges of the wave
            const th = Math.min(0.07 * H, half * H * 0.6)
            const pts = (edge, off = 0) => edge.map(([x, y]) => `${fmt(x)},${fmt(y + off)}`).join(' L')
            const band = (edge, dir) => `M${pts(edge)} L${pts(edge.slice().reverse(), dir * th)} Z`
            liquidSvg.setAttribute('viewBox', `0 0 ${fmt(W)} ${fmt(H)}`)
            liquidSvg.style.opacity = '1'
            // amber tint through the whole wave, clearing as it covers the screen
            tint.setAttribute('d', `M${pts(top)} L${pts(botRev)} Z`)
            tint.setAttribute('fill-opacity', (0.42 * (1 - p) * (1 - p)).toFixed(3))
            edgeTop.setAttribute('d', band(top, 1))
            edgeBottom.setAttribute('d', band(bot, -1))
            shineTop.setAttribute('d', `M${pts(top, th * 0.28)}`)
            shineBottom.setAttribute('d', `M${pts(bot, -th * 0.3)}`)
          }

          /* ----- cards ----- */
          const r = settle.r
          if (r <= 0.001) {
            if (orbitCards[0].style.visibility !== 'hidden') orbitCards.forEach((c) => (c.style.visibility = 'hidden'))
            return
          }
          // cards are sized to the glass, like the reel (about a third of its width)
          const cw = Math.round(gsap.utils.clamp(92, 200, b.width * 0.32))
          if (cw !== cardW) {
            cardW = cw
            orbitCards.forEach((c) => (c.style.width = `${cw}px`))
          }
          const ccy = gTop + h * 0.45
          orbitCards.forEach((c, i) => {
            const spot = (W < 768 ? SPOTS_PHONE : SPOTS)[i % SPOTS.length]
            // each card starts a little after the one before
            const k = gsap.utils.clamp(0, 1, (r - i * 0.15) / 0.7)
            const e = backOut(k)
            const halfW = cw / 2
            const tx = gsap.utils.clamp(halfW + 8, W - halfW - 8, cx + spot.dx * w)
            // on short phones the top cards come down a little to clear the button above
            const ty = ccy + spot.dy * h * (W < 768 && H < 720 && spot.dy < 0 ? 0.78 : 1)
            // out of the glass in an arc, tumbling, then a gentle bob at rest
            const arc = Math.sin(Math.PI * k) * h * 0.25
            const bob = Math.sin(time * 1.4 + i * 1.7) * 6 * k
            const rx = (1 - k) * [60, -50, 70][i % 3]
            const ry = (1 - k) * [-90, 80, 60][i % 3] + Math.sin(time * 0.9 + i) * 4 * k
            const rz = spot.rot * e + (1 - k) * [-40, 30, -25][i % 3]
            c.style.visibility = k > 0 ? 'visible' : 'hidden'
            c.style.opacity = Math.min(1, k * 2.5).toFixed(3)
            // cards come out from behind the glass; the front ones move in front once they are clear
            c.style.zIndex = spot.front && k > 0.45 ? '3' : '1'
            c.style.transform =
              `translate3d(${fmt(cx + (tx - cx) * e - halfW)}px, ${fmt(ccy + (ty - ccy) * e - arc + bob)}px, 0) translateY(-50%) ` +
              `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotate(${rz.toFixed(2)}deg) scale(${(0.2 + 0.8 * e).toFixed(3)})`
          })
        }
        gsap.ticker.add(frame)

        /* ---------- mouse parallax (desktop) ---------- */
        if (!window.matchMedia('(pointer: fine)').matches)
          return () => {
            gsap.ticker.remove(frame)
            io.disconnect()
            window.removeEventListener('mousemove', onGlassMouse)
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
          gsap.ticker.remove(frame)
          io.disconnect()
          window.removeEventListener('mousemove', onGlassMouse)
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

            {/* where the travelling glass stands in this scene (it is drawn in the stage, above the scenes) */}
            {s.id === 'pour' && (
              <div
                data-glass-slot="pour"
                className="pointer-events-none absolute bottom-[4%] left-1/2 aspect-[742/772] h-[26svh] -translate-x-1/2 md:bottom-[5%] md:h-[min(44svh,32vw)]"
                aria-hidden="true"
              >
                <FloorShadow className="bottom-[-4%] w-[85%]" />
              </div>
            )}
            {s.id === 'sip' && (
              <div
                data-glass-slot="sip"
                className="pointer-events-none absolute bottom-[12%] left-1/2 aspect-[742/772] h-[32svh] -translate-x-1/2 md:bottom-[10%] md:h-[min(56svh,40vw)]"
                aria-hidden="true"
              >
                <FloorShadow className="bottom-[-4%] w-[85%]" />
              </div>
            )}

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

        {/* the glass that is filled in "Pour" and carried into "Sip", plus the cards that orbit it there.
            Hidden until the scroll animation sets it up; positions are set every frame in the timeline code. */}
        <div data-hero-layer className="pointer-events-none absolute inset-0 z-[5] hidden">
          <div data-travel-glass className="absolute top-0 left-0 z-[2] will-change-transform">
            <GlassImage className="size-full" />
          </div>
          {rangeCards.map((c) => (
            <RangeCard
              key={c.name}
              c={c}
              data-orbit-card=""
              className="pointer-events-auto invisible absolute top-0 left-0 w-[22vw] max-w-28 will-change-transform md:w-36 md:max-w-none"
            />
          ))}
        </div>

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
        <svg data-pour-stream className="pointer-events-none absolute inset-0 z-[6] size-full overflow-visible" aria-hidden="true">
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
