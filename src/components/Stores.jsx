import { stores } from '../data'
import { Marquee } from './ui'

export default function Stores() {
  const items = [...stores, ...stores]
  return (
    <section aria-label="Available in" data-header="cream" className="border-y border-cream/10 bg-ink py-8 md:py-10">
      <Marquee duration={35} gap="gap-14 pr-14 md:gap-20 md:pr-20">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-14 md:gap-20">
            {i % stores.length === 0 && (
              <span className="font-script text-4xl whitespace-nowrap text-tan md:text-5xl">Available in</span>
            )}
            <img
              src={s.src}
              alt={s.alt}
              className="h-9 w-auto max-w-[180px] object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-12"
              loading="lazy"
            />
          </div>
        ))}
      </Marquee>
    </section>
  )
}
