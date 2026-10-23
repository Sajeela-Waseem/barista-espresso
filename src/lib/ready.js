/*
  Waits until the first screen can be shown properly (heading fonts + first-scene images),
  then fades out the loading screen from index.html. Never waits longer than MAX_WAIT,
  so a slow connection still gets the page.
*/
const MAX_WAIT = 4000
const FIRST_SCREEN = ['images/machines.webp', 'images/logo-white.webp', 'images/bean-b6.webp', 'images/bean-b7.webp']

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
    img.decode?.().then(resolve, resolve)
  })

const assets = Promise.all([document.fonts?.ready ?? Promise.resolve(), ...FIRST_SCREEN.map(loadImage)])
const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT))

export const pageReady = Promise.race([assets, timeout]).then(() => {
  const loader = document.getElementById('loader')
  if (loader) {
    loader.classList.add('done')
    setTimeout(() => loader.remove(), 700)
  }
})

/* Images further down fade in when they finish loading instead of popping in.
   Listening in the capture phase catches every <img> load on the page. */
document.addEventListener(
  'load',
  (e) => {
    if (e.target instanceof HTMLImageElement) e.target.setAttribute('data-loaded', '')
  },
  true,
)
