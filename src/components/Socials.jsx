import { socialImages, INSTAGRAM_URL, FACEBOOK_URL } from '../data'
import { Marquee, RevealText } from './ui'

export default function Socials() {
  return (
    <section aria-label="Follow our socials" data-header="ink" className="overflow-hidden bg-cream py-24 text-ink md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 sm:flex-row sm:items-end md:px-8">
        <RevealText className="font-display text-[clamp(2.75rem,6vw,5.5rem)] uppercase leading-[0.9] tracking-tight">
          Follow our <span className="font-script normal-case tracking-normal text-red">socials</span>
        </RevealText>
        <div className="flex gap-3">
          <a
            href={INSTAGRAM_URL}
            aria-label="Instagram"
            data-magnetic="0.4"
            className="grid size-14 place-items-center rounded-full bg-ink transition-transform duration-500 ease-expo hover:-translate-y-1 hover:rotate-12"
          >
            <img src="images/instagram.webp" alt="" className="size-6 invert" />
          </a>
          <a
            href={FACEBOOK_URL}
            aria-label="Facebook"
            data-magnetic="0.4"
            className="grid size-14 place-items-center rounded-full bg-ink transition-transform duration-500 ease-expo hover:-translate-y-1 hover:-rotate-12"
          >
            <img src="images/facebook.webp" alt="" className="size-7" />
          </a>
        </div>
      </div>

      <div className="mt-14">
        <div data-skew>
        <Marquee duration={45} gap="gap-5 pr-5 py-6">
          {socialImages.map((src, i) => (
            <a
              key={src}
              href={INSTAGRAM_URL}
              className={`group block aspect-[3/4] w-[220px] shrink-0 overflow-hidden rounded-[1.75rem] shadow-[0_20px_40px_-20px_rgba(20,13,11,.5)] transition-transform duration-700 ease-expo hover:rotate-0 hover:scale-[1.04] md:w-[280px] ${
                i % 2 ? 'rotate-3' : '-rotate-3'
              }`}
            >
              <img
                src={src}
                alt="Barista on Instagram"
                className="size-full object-cover transition-transform duration-700 ease-expo group-hover:scale-110"
                loading="lazy"
              />
            </a>
          ))}
        </Marquee>
        </div>
      </div>
    </section>
  )
}
