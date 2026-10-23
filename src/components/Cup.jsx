/*
  Branded Barista paper cup (+ optional espresso stream), drawn to sit on the drip tray of
  images/machines.webp. Place it inside a box with the photo's aspect ratio (861/900):
  the SVG starts at the spout (51% down the photo) and ends on the tray.
  Markup shows the finished state (cup full, no stream); Chapters animates it on scroll.
  `id` keeps the gradient ids unique when more than one cup is on the page.
*/
export default function Cup({ id = 'cup', stream = false, className = '' }) {
  const u = (name) => `${id}-${name}`
  return (
    <svg
      viewBox="0 0 100 152"
      className={`pointer-events-none absolute top-[51%] left-[69.2%] h-[29%] w-[20%] overflow-visible ${className}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={u('mouth')}>
          <ellipse cx="50" cy="37" rx="41.5" ry="7.4" />
        </clipPath>
        <linearGradient id={u('body')} x1="0" x2="1">
          <stop offset="0" stopColor="#060606" />
          <stop offset=".2" stopColor="#2c2c2c" />
          <stop offset=".42" stopColor="#141414" />
          <stop offset="1" stopColor="#030303" />
        </linearGradient>
        <linearGradient id={u('inner')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#111" />
        </linearGradient>
        <radialGradient id={u('crema')} cx=".45" cy=".4" r=".65">
          <stop offset="0" stopColor="#dca570" />
          <stop offset=".5" stopColor="#a8683a" />
          <stop offset="1" stopColor="#4f250f" />
        </radialGradient>
        <linearGradient id={u('stream')} x1="0" x2="1">
          <stop offset="0" stopColor="#2b1206" />
          <stop offset=".45" stopColor="#8a4a20" />
          <stop offset="1" stopColor="#3a1808" />
        </linearGradient>
      </defs>

      {/* back of the cup: shadow, inside wall and the coffee surface */}
      <g data-cup>
        <ellipse cx="50" cy="147" rx="44" ry="6" fill="rgba(0,0,0,.4)" />
        <ellipse cx="50" cy="37" rx="42.5" ry="8" fill={`url(#${u('inner')})`} />
        <g clipPath={`url(#${u('mouth')})`}>
          <ellipse data-liquid cx="50" cy="40" rx="41" ry="7.2" fill={`url(#${u('crema')})`} />
        </g>
      </g>

      {/* espresso stream from the spout */}
      {stream && <rect data-stream x="48" y="2.6" width="4" height="0" rx="2" fill={`url(#${u('stream')})`} />}

      {/* front of the cup */}
      <g data-cup>
        <path d="M7.5 37 L17 145 A33 6 0 0 0 83 145 L92.5 37 A42.5 8 0 0 1 7.5 37 Z" fill={`url(#${u('body')})`} />
        <path d="M14 48 L21 138 L27 139 L21 48 Z" fill="rgba(255,255,255,.07)" />
        <ellipse cx="50" cy="37" rx="42.5" ry="8" fill="none" stroke="#3b3b3b" strokeWidth="1.6" />
        <image href="images/logo-white.webp" x="25" y="82" width="50" height="15" preserveAspectRatio="xMidYMid meet" />
      </g>
    </svg>
  )
}
