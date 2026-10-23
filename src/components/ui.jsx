import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToHash } from '../lib/scroll'

export function ArrowIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 192 192" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 35.0784L32.832 0H192V157.824L155.712 192V113.856C155.712 94.8096 155.885 77.568 156.288 62.112L28.7616 188.448L3.4944 160.8L131.002 34.464C115.891 34.8864 98.9376 35.0784 80.1792 35.0784H0Z"
      />
    </svg>
  )
}

export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] ${className}`}>
      <span className="size-1.5 rounded-full bg-red" />
      {children}
    </p>
  )
}

const buttonThemes = {
  cream: 'bg-cream text-ink',
  ink: 'bg-ink text-cream',
  tan: 'bg-tan text-ink',
}

/*
  Pill button with the bouncing circle-arrow hover from the original site:
  the left circle pops away, the label slides left, a new circle pops in on the right.
*/
export function AnimatedButton({ href, children, theme = 'cream', external = false, className = '' }) {
  const root = useRef(null)
  const tl = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.set(q('[data-c2]'), { scale: 0, x: '-2.5rem' })
      tl.current = gsap
        .timeline({ paused: true })
        .to(q('[data-c1]'), { scale: 0, duration: 0.2, ease: 'back.in(2)' }, 0)
        .to(q('[data-body]'), { x: '-3.25rem', rotation: -4, duration: 0.3, ease: 'back.out(2)' }, 0.18)
        .to(q('[data-body]'), { rotation: 0, duration: 0.3, ease: 'power2.out' }, 0.45)
        .to(q('[data-c2]'), { scale: 1, x: 0, duration: 0.45, ease: 'back.out(2)' }, 0.24)
    },
    { scope: root },
  )

  const color = buttonThemes[theme]
  return (
    <a
      ref={root}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      onClick={(e) => scrollToHash(e, href)}
      onMouseEnter={() => tl.current?.play()}
      onMouseLeave={() => tl.current?.reverse()}
      onFocus={() => tl.current?.play()}
      onBlur={() => tl.current?.reverse()}
      data-magnetic="0.25"
      className={`relative inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.14em] ${className}`}
    >
      <span data-c1 className={`grid size-12 place-items-center rounded-full ${color}`}>
        <ArrowIcon className="size-3.5" />
      </span>
      <span data-body className={`flex h-12 items-center rounded-full px-7 ${color}`}>
        {children}
      </span>
      <span data-c2 className={`absolute right-0 grid size-12 place-items-center rounded-full ${color}`}>
        <ArrowIcon className="size-3.5" />
      </span>
    </a>
  )
}

/* Heading whose lines slide up from a mask when scrolled into view. */
export function RevealText({ as: Tag = 'h2', children, className = '', delay = 0, start = 'top 85%' }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              ease: 'expo.out',
              stagger: 0.1,
              delay,
              scrollTrigger: { trigger: ref.current, start, once: true },
            }),
        })
        return () => split.revert()
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/* Big statement text whose words light up one by one as you scroll. */
export function ScrubWords({ as: Tag = 'h2', children, className = '' }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current, {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 50%', scrub: true },
              },
            ),
        })
        return () => split.revert()
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/* Fades + lifts every [data-reveal] child when the wrapper scrolls into view. */
export function useRevealChildren(scope, selector = '[data-reveal]', start = 'top 85%') {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray(selector, scope.current).forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 1.1,
            ease: 'expo.out',
            delay: Number(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start, once: true },
          })
        })
      })
    },
    { scope },
  )
}

/* Infinite horizontal loop. Content is rendered twice so it wraps seamlessly. */
export function Marquee({ children, duration = 40, reverse = false, gap = 'gap-12 pr-12', className = '' }) {
  return (
    <div className={`marquee-pause flex overflow-hidden ${className}`}>
      <div
        className="flex min-w-max shrink-0 animate-marquee"
        style={{ '--marquee-duration': `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <div className={`flex shrink-0 items-center ${gap}`}>{children}</div>
        <div className={`flex shrink-0 items-center ${gap}`} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
