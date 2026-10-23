import { PHONE, PHONE_HREF } from '../data'

/* Round contact button pinned to the bottom-right corner (like the reel). */
export default function ChatButton() {
  return (
    <a
      href={PHONE_HREF}
      aria-label={`Call us on ${PHONE}`}
      className="group fixed right-5 bottom-5 z-40 flex h-12 items-center gap-0 overflow-hidden rounded-full bg-ink pr-0 pl-3.5 text-cream shadow-[0_10px_30px_-8px_rgba(0,0,0,.5)] ring-1 ring-cream/15 transition-all duration-500 ease-expo hover:gap-2 hover:pr-5"
    >
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
        <path
          d="M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v8a2.5 2.5 0 01-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 014 13.5v-8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <span className="max-w-0 overflow-hidden text-[11px] font-bold tracking-[0.18em] whitespace-nowrap uppercase transition-all duration-500 ease-expo group-hover:max-w-40">
        Talk to us
      </span>
      <span className="w-3.5 shrink-0 transition-all group-hover:w-0" />
    </a>
  )
}
