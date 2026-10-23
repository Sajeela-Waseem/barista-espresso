import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToHash } from '../lib/scroll'
import { PHONE, PHONE_HREF, SHOP_URL, INSTAGRAM_URL, FACEBOOK_URL, LINKEDIN_URL } from '../data'

const exploreLinks = [
  { label: 'The Range', href: '#range' },
  { label: 'Products', href: '#products' },
  { label: 'Why Barista', href: '#why' },
  { label: 'Our Story', href: '#story' },
]
const companyLinks = [
  { label: 'Become a Distributor', href: '#partner' },
  { label: 'Careers & Vacancies', href: '#partner' },
  { label: 'Contact', href: '#contact' },
  { label: 'Shop Online ↗', href: SHOP_URL, external: true },
]

function LinkList({ title, links }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-tan">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              onClick={(e) => scrollToHash(e, l.href)}
              className="group relative inline-block text-cream/80 transition-colors hover:text-cream"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-tan transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const root = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from(q('[data-letter]'), {
          yPercent: 100,
          duration: 1.3,
          stagger: 0.05,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('[data-word]')[0], start: 'top 95%', once: true },
        })
        gsap.fromTo(
          q('[data-can]'),
          { yPercent: 14, rotate: 8 },
          { yPercent: -6, rotate: -4, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 1 } },
        )
        gsap.from(q('[data-ft]'), {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <footer ref={root} data-header="cream" className="relative isolate overflow-hidden bg-ink pt-24 text-cream md:pt-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div data-ft className="max-w-md">
            <a href="#top" onClick={(e) => scrollToHash(e, '#top')} aria-label="Back to top">
              <img src="images/logo-white.webp" alt="Barista" className="h-9 w-auto" />
            </a>
            <h2 className="mt-8 font-display text-4xl uppercase leading-none">Preserving the art of fine coffee.</h2>
            <p className="mt-4 text-cream/65">
              One name for the entire coffee journey. Precision espresso machines, capsules and pods, and a full instant range,
              crafted in Lebanon since 1999.
            </p>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            <div data-ft>
              <LinkList title="Explore" links={exploreLinks} />
            </div>
            <div data-ft>
              <LinkList title="Company" links={companyLinks} />
            </div>
            <div data-ft>
              <p className="text-xs uppercase tracking-[0.3em] text-tan">Get in touch</p>
              <p className="mt-5 text-cream/80">Beirut, Lebanon</p>
              <a href={PHONE_HREF} className="mt-2 block text-cream/80 hover:text-cream">
                {PHONE}
              </a>
              <p className="mt-2 text-cream/80">Lebanon & Jordan</p>
              <div className="mt-6 flex gap-4 text-sm uppercase tracking-[0.15em]">
                <a href={INSTAGRAM_URL} className="text-cream/70 hover:text-tan">IG</a>
                <a href={FACEBOOK_URL} className="text-cream/70 hover:text-tan">FB</a>
                <a href={LINKEDIN_URL} className="text-cream/70 hover:text-tan">IN</a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(224,198,153,.22),transparent)]" />
          <img data-can src="images/footer.webp" alt="Hand holding a Barista iced coffee can" className="relative w-full [mask-image:linear-gradient(to_bottom,black_65%,transparent_95%)]" loading="lazy" />
        </div>
      </div>

      <div data-word aria-hidden="true" className="mt-16 flex justify-center overflow-hidden px-2 md:mt-10">
        {'BARISTA'.split('').map((ch, i) => (
          <span
            key={i}
            data-letter
            className={`inline-block font-display text-[19vw] leading-[0.82] ${i === 1 ? 'text-red' : 'text-cream'}`}
          >
            {ch}
          </span>
        ))}
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-5 py-6 text-sm text-cream/50 md:flex-row md:px-8">
          <p>© 2026 Barista · Automatic Brewers SAL. All rights reserved.</p>
          <p>
            Lebanon & Jordan ·{' '}
            <a href={SHOP_URL} target="_blank" rel="noreferrer" className="hover:text-cream">
              baristacoffee.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
