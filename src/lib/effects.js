import { gsap, MOTION_OK } from './gsap'

/*
  Scroll-linked motion for the sections below the chapters, switched on by attributes:
    data-parallax="n"  moves n% of its height against the scroll, so things at different
                       depths drift past at different speeds
    data-spin="deg"    also turns this many degrees over the same distance
    data-grow          eases up from 92% to full size as it comes into view
  Transform-only, so it stays smooth. Returns a cleanup function.
*/
export function initEffects(root = document) {
  const mm = gsap.matchMedia()

  mm.add(MOTION_OK, () => {
    const all = (sel) => gsap.utils.toArray(root.querySelectorAll(sel))

    all('[data-parallax]').forEach((el) => {
      const amt = Number(el.dataset.parallax || 15)
      const spin = Number(el.dataset.spin || 0)
      gsap.set(el, { willChange: 'transform' })
      gsap.fromTo(
        el,
        { yPercent: amt, rotation: -spin / 2 },
        {
          yPercent: -amt,
          rotation: spin / 2,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      )
    })

    all('[data-grow]').forEach((el) => {
      gsap.set(el, { willChange: 'transform' })
      gsap.fromTo(
        el,
        { scale: 0.92 },
        { scale: 1, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: 0.6 } },
      )
    })
  })

  return () => mm.revert()
}
