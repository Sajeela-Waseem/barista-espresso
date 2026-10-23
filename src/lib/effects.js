import { gsap, ScrollTrigger, MOTION_OK } from './gsap'

/*
  Site-wide motion, switched on by data attributes so any section can use it:
    data-tilt          3D tilt towards the mouse (cards, photos)
    data-magnetic      pulled a little towards the mouse (buttons, round icons)
    data-skew          leans with scroll speed (marquee rows)
    data-parallax="n"  drifts n% of its height while the page scrolls past
    data-bob           bobs gently up and down
    data-pop           grows in with a bounce when scrolled into view (children stagger)
  Everything is transform-only, so it stays smooth. Returns a cleanup function.
*/
export function initEffects(root = document) {
  const mm = gsap.matchMedia()

  mm.add(MOTION_OK, () => {
    const all = (sel) => gsap.utils.toArray(root.querySelectorAll(sel))

    // moving parts get their own layer, so moving them doesn't redraw what's inside
    gsap.set(all('[data-skew], [data-grow], [data-parallax], [data-bob]'), { willChange: 'transform' })

    // parallax
    all('[data-parallax]').forEach((el) => {
      const amt = Number(el.dataset.parallax || 15)
      gsap.fromTo(
        el,
        { yPercent: amt },
        { yPercent: -amt, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    })

    // cards that swell from slightly smaller to full size as they scroll in
    all('[data-grow]').forEach((el) =>
      gsap.fromTo(
        el,
        { scale: 0.9 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: true } },
      ),
    )

    // gentle bobbing
    all('[data-bob]').forEach((el, i) =>
      gsap.to(el, { y: -14, rotation: i % 2 ? 2 : -2, duration: 2.6 + (i % 3) * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
    )

    // bounce-in groups
    all('[data-pop]').forEach((group) => {
      const items = group.children.length ? [...group.children] : [group]
      gsap.from(items, {
        scale: 0.6,
        y: 60,
        rotation: (i) => (i % 2 ? 6 : -6),
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      })
    })

    // lean with scroll speed
    const skewers = all('[data-skew]').map((el) => gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' }))
    let skewTrigger
    if (skewers.length) {
      skewTrigger = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-8, 8, self.getVelocity() / -300)
          skewers.forEach((to) => to(v))
        },
      })
      // settle back when scrolling stops
      ScrollTrigger.addEventListener('scrollEnd', () => skewers.forEach((to) => to(0)))
    }

    // mouse effects only with a real mouse
    if (!window.matchMedia('(pointer: fine)').matches) return () => skewTrigger?.kill()
    const cleanups = []

    all('[data-tilt]').forEach((el) => {
      gsap.set(el, { transformPerspective: 900 })
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' })
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' })
      const strength = Number(el.dataset.tilt || 10)
      const move = (e) => {
        const r = el.getBoundingClientRect()
        ry(((e.clientX - r.left) / r.width - 0.5) * strength)
        rx(-((e.clientY - r.top) / r.height - 0.5) * strength)
      }
      const leave = () => {
        rx(0)
        ry(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      })
    })

    all('[data-magnetic]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
      const pull = Number(el.dataset.magnetic || 0.3)
      const move = (e) => {
        const r = el.getBoundingClientRect()
        x((e.clientX - r.left - r.width / 2) * pull)
        y((e.clientY - r.top - r.height / 2) * pull)
      }
      const leave = () => {
        x(0)
        y(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      })
    })

    return () => {
      skewTrigger?.kill()
      cleanups.forEach((c) => c())
    }
  })

  return () => mm.revert()
}
