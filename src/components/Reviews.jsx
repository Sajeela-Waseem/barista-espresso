import { reviews } from '../data'
import { Marquee, RevealText } from './ui'

function ReviewCard({ r }) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col rounded-[1.75rem] border border-cream/10 bg-[#241712]/85 p-7 md:w-[360px]">
      <img src="images/five-stars.avif" alt="Five stars" className="h-4 w-fit" loading="lazy" />
      <h3 className="mt-6 font-display text-2xl uppercase leading-none text-tan">{r.title}</h3>
      <p className="mt-4 flex-1 text-lg leading-relaxed text-cream/85">“{r.quote}”</p>
      <div className="mt-6 flex items-center justify-between border-t border-cream/10 pt-5">
        <span className="font-semibold">{r.name}</span>
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cream/60">
          <img src="images/verified.svg" alt="" className="size-5" />
          Verified
        </span>
      </div>
    </article>
  )
}

export default function Reviews() {
  return (
    <section aria-labelledby="reviews-title" data-header="cream" className="relative isolate overflow-hidden bg-ink py-28 md:py-36">
      <video
        className="absolute inset-0 -z-10 size-full object-cover opacity-40 mix-blend-screen"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src="video/dust.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,#140d0b_85%)]" />

      <div className="mx-auto max-w-4xl px-5 text-center">
        <img src="images/five-stars.avif" alt="Five stars" className="mx-auto h-5" loading="lazy" />
        <RevealText
          as="h2"
          className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.9] tracking-tight"
        >
          <span id="reviews-title">
            The reviews <span className="font-script normal-case tracking-normal text-tan">are in</span>
          </span>
        </RevealText>
      </div>

      <div className="mt-16 space-y-5">
        <Marquee duration={55} gap="gap-5 pr-5">
          {reviews.map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
        </Marquee>
        <Marquee duration={55} reverse gap="gap-5 pr-5">
          {[...reviews].reverse().map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
