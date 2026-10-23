export const SHOP_URL = 'https://baristacoffee.com/'
export const PHONE = '+961 1 685 686'
export const PHONE_HREF = 'tel:+9611685686'
// The original site links these to "#"; replace with the real profile URLs.
export const INSTAGRAM_URL = '#'
export const FACEBOOK_URL = '#'
export const LINKEDIN_URL = '#'

export const explore = [
  { label: 'The Range', href: '#range' },
  { label: 'Why Barista', href: '#why' },
  { label: 'Our Story', href: '#story' },
  { label: 'Partners', href: '#partner' },
]

export const lineup = [
  'Espresso Capsules',
  'Pods & Filter',
  'Machines',
  'Instant Coffee',
  'American & K-Cup',
  'Lebanese Coffee',
  'Chocolate',
  'Syrups & Sauces',
  'Accessories',
]

export const stores = [
  { src: 'images/store-1.webp', alt: 'Toters' },
  { src: 'images/store-spinneys.webp', alt: 'Spinneys' },
  { src: 'images/store-3.webp', alt: 'Happy' },
  { src: 'images/store-4.webp', alt: 'Abed Tahan' },
]

export const audiences = [
  {
    tab: 'Offices',
    img: 'images/machines.webp',
    title: 'Coffee your team actually drinks',
    text: 'Machines matched to your headcount and kept stocked, so nobody is out buying coffee at eleven.',
    items: ['Machine supply and installation', 'Capsules, pods or instant', 'Scheduled resupply', 'Maintenance and repairs'],
  },
  {
    tab: 'Restaurants & hotels',
    img: 'images/syrups.webp',
    title: 'Built for daily service',
    text: 'Equipment that holds up through a full service, plus everything that goes around the cup.',
    items: ['Professional machines', 'Syrups, sauces and purées', 'Cups, stirrers and sugar', 'One delivery, one contact'],
  },
  {
    tab: 'Retail & distribution',
    img: 'images/capsules.webp',
    title: 'The full range on your shelves',
    text: 'Nine ranges under one name, already moving in shops across Lebanon.',
    items: ['Espresso capsules and pods', 'American and K-Cup', 'Lebanese coffee', 'The full instant line'],
  },
]

export const doors = [
  { title: 'Become a distributor', text: 'Bring the full range to your customers.', href: '#contact' },
  { title: 'Careers & vacancies', text: 'Sales, service and production roles.', href: '#contact' },
  { title: 'Shop online', text: 'Buying for home instead? Visit the store.', href: SHOP_URL, external: true },
]

export const reviews = [
  { title: 'Worth waking up for', quote: 'Auro Perfetto every morning. Coffee at home I don’t want to fix.', name: 'Rana K.' },
  { title: 'Fast, still real', quote: 'The Gold jar lives on my desk. Seconds to make, tastes like coffee.', name: 'Karim H.' },
  { title: 'Forty people, no complaints', quote: 'We switched the whole office over. Serviced the same week I called.', name: 'Nour A.' },
  { title: 'It moves off the shelf', quote: 'Customers know the name before they reach it. Capsules go fastest.', name: 'Elie S.' },
  { title: 'One call, not three', quote: 'Machines, pods and service from the same people. In summer, that matters.', name: 'Joe M.' },
  { title: 'Same cup, every room', quote: 'Guests notice consistency more than they notice a good espresso.', name: 'Maya T.' },
]

export const promises = [
  { ok: true, text: 'Arabica & Robusta beans' },
  { ok: true, text: 'Crafted since 1999' },
  { ok: false, text: 'No white-label roasters' },
  { ok: false, text: 'No gaps in the range' },
  { ok: false, text: 'No unsupported machines' },
]

export const socialImages = [1, 2, 3, 4, 5, 6].map((n) => `images/social-${n}.webp`)
