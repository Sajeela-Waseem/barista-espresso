// Holds the single Lenis (smooth scroll) instance so any component can use it.
let lenis = null

export const setLenis = (instance) => {
  lenis = instance
}
export const getLenis = () => lenis

// Smoothly scroll to an in-page link like "#story". Leaves other links alone.
export function scrollToHash(event, href) {
  if (!href || !href.startsWith('#')) return
  event?.preventDefault()
  const target = href === '#' || href === '#top' ? 0 : document.querySelector(href)
  if (target === null) return
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 })
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
