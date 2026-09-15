/**
 * ============================================================
 *  DESIGN REVIEW — CONTENT CONFIG
 * ============================================================
 *  Everything the client sees is edited here. No copy, names or
 *  links are hard-coded in the components.
 *
 *  Links
 *  - Any empty string ("") or value starting with "PASTE" is
 *    treated as "not supplied yet": the link is shown disabled
 *    and never navigates. Nothing crashes.
 *  - External links always open in a new tab.
 *
 *  Preview images
 *  - Drop screenshots into /public/previews and point `previewImage`
 *    at them (e.g. "/previews/alinkriti.jpg"). Tall, full-page
 *    screenshots work best: on desktop the preview slowly scrolls
 *    on hover. If an image is missing, an elegant placeholder shows.
 *
 *  Selection
 *  - The concept `id` is what gets saved as the client's choice.
 *    Stored values that don't match a current id are cleared.
 * ============================================================
 */

export const site = {
  /** Browser tab title. */
  title: 'Design Review',

  brand: {
    /** Small wordmark, top-left. */
    mark: 'Design Review',
    /** Optional project name shown next to the mark (desktop). Leave empty to hide. */
    project: '',
  },

  /** Header status pill. */
  status: 'Client Review',

  nav: [
    { label: 'Project', target: 'project' },
    { label: 'Concepts', target: 'concepts' },
    { label: 'Review', target: 'review' },
  ],

  /**
   * Site-wide background image (subtle, sits behind a warm overlay).
   * Swap in any photo — architecture, material or textile detail work best.
   * Leave `image` empty to use the plain warm background.
   */
  background: {
    image: '/images/design-review-background.webp',
  },

  hero: {
    eyebrow: 'Website Design Review',
    /** Each item starts on a new line and wraps naturally. All lines share one style. */
    heading: [{ text: 'Two directions.' }, { text: 'One final experience.' }],
    intro:
      'Explore both proposed website concepts below. Review the layouts, interactions and individual page experiences, then choose the direction that best represents the brand.',
    cta: 'Begin the review',
    /** Small key/value details beside the intro. Remove any you don't need. */
    meta: [
      { label: 'Prepared', value: 'September 2026' },
      { label: 'Scope', value: 'Homepage, Collection, Product' },
    ],
    steps: [
      { number: '01', title: 'Concepts', text: 'Two curated design directions.' },
      { number: '02', title: 'Explore', text: 'Browse each live build, page by page.' },
      { number: '03', title: 'Select', text: 'Confirm the direction to develop.' },
    ],
  },

  conceptsIntro: {
    eyebrow: 'The Concepts',
    heading: 'Two proposed directions, each presented as a live, browsable build.',
  },

  review: {
    eyebrow: 'Review',
    heading: 'Seen both directions?',
    text: 'Review the individual pages and interactions before confirming the direction you would like to develop further.',
  },

  finalCta: {
    eyebrow: 'Next step',
    headingNone: 'Choose the direction that feels most like the brand.',
    headingSelected: 'You’ve chosen {name}.',
    textNone: 'Once you’ve made a selection, copy it and send it back — we’ll take that direction forward into the final build.',
    textSelected: 'Copy your selection and send it back to us. You can still change your mind at any point before development begins.',
  },

  footer: {
    note: 'Prepared for client review.',
    tagline: 'Two directions. One final build.',
  },

  selection: {
    /** localStorage key — change it per project so selections never collide. */
    storageKey: 'design-review:selection',
    /** Text copied to the clipboard. Tokens: {number} {label} {name} {project} */
    copyTemplate: 'Selected design direction:\nConcept {number} — {name}',
  },
};

export const concepts = [
  {
    id: 'alinkriti',
    number: '01',
    label: 'Concept One',
    name: 'AlinKriti',
    description:
      'Handcrafted jewellery inspired by heritage and refined for the modern woman. Warm metallics, soft neutrals and story-led product presentation give every piece room to shine.',
    /** Shown as tags on the concept and as "Jewellery · Heritage · Modern" in the review. */
    traits: ['Jewellery', 'Heritage', 'Modern'],
    websiteUrl: 'https://alinkriti.com/',
    previewImage: '/previews/alinkriti.jpg',
    previewAlt: 'AlinKriti — homepage screenshot',
    pages: [
      { name: 'Homepage', url: 'https://alinkriti.com/' },
      { name: 'Collection', url: 'https://alinkriti.com/collections/all' },
      { name: 'Product', url: 'https://alinkriti.com/products/golden-aura-necklace-earring-set' },
    ],
  },
  {
    id: 'samriti-textiles',
    number: '02',
    label: 'Concept Two',
    name: 'Samriti Textiles',
    description:
      'Traditional Indian ethnic wear with an elegant, lifestyle-led approach. Rich jewel tones, intricate embroidery and curated looks celebrate textile heritage in a contemporary way.',
    traits: ['Ethnic Wear', 'Tradition', 'Lifestyle'],
    websiteUrl: 'https://samrititextile.myshopify.com/',
    previewImage: '/previews/samriti-textiles.jpg',
    previewAlt: 'Samriti Textiles — homepage screenshot',
    pages: [
      { name: 'Homepage', url: 'https://samrititextile.myshopify.com/' },
      { name: 'Collection', url: 'https://samrititextile.myshopify.com/collections/collection-2' },
      {
        name: 'Product',
        url: 'https://samrititextile.myshopify.com/products/aarvika-tie-dye-printed-kurta-set-with-dupatta',
      },
    ],
  },
];

/**
 * ============================================================
 *  CONCEPT DETAIL PAGES — /concepts/<id>/
 * ============================================================
 *  Keyed by concept `id`. Name, number, live URL and page links
 *  come from `concepts` above; this adds the presentation layer.
 *
 *  theme       Visual world of the page: 'alinkriti' | 'samriti'.
 *  embeddable  true only if the live site allows being shown in an
 *              iframe. Both stores send `X-Frame-Options: DENY` and
 *              `frame-ancestors 'none'` (Shopify default, checked
 *              September 2026), so the page shows `capture` — a
 *              full-page screenshot — plus links to the live site.
 *  strengths   What the client should look for. Images are crops of
 *              the live homepage in /public/captures/<id>/.
 * ============================================================
 */
export const conceptDetails = {
  alinkriti: {
    theme: 'alinkriti',
    themeColor: '#F4EDE2',
    titleLines: ['AlinKriti'],
    tagline: 'Heritage-led jewellery presented through a modern editorial storefront.',
    tags: ['Jewellery', 'Heritage', 'Modern'],
    embeddable: false,
    capture: {
      src: '/captures/alinkriti/full.jpg',
      width: 1200,
      height: 7532,
      alt: 'Full-page capture of the AlinKriti homepage',
    },
    strengths: [
      {
        label: 'Brand hero',
        title: 'Heritage Meets Modern Styling',
        text: 'The storefront positions jewellery around a heritage-inspired identity while keeping the presentation suitable for a contemporary shopper.',
        image: '/captures/alinkriti/hero.jpg',
        width: 1200,
        height: 817,
        alt: 'AlinKriti homepage hero with the brand wordmark over a jewellery portrait',
      },
      {
        label: 'Category discovery',
        title: 'Category-Led Product Discovery',
        text: 'The homepage surfaces categories including anklets, bracelets, chokers, earrings, necklaces and rings, making product discovery direct and visual.',
        image: '/captures/alinkriti/categories.jpg',
        width: 1200,
        height: 467,
        alt: 'AlinKriti homepage category row: anklets, bracelets, chokers, earrings, necklace and rings',
      },
      {
        label: 'Shop the look',
        title: 'Editorial Product Storytelling',
        text: '“Shop the look,” visual collections and editorial content give products context beyond a simple catalogue.',
        image: '/captures/alinkriti/shop-the-look.jpg',
        width: 1200,
        height: 833,
        alt: 'AlinKriti “Shop the look” section with a styled necklace image',
      },
      {
        label: 'Reviews + FAQ',
        title: 'Trust-Building Content',
        text: 'Customer reviews, FAQs and policy access create supporting reassurance around the shopping experience.',
        image: '/captures/alinkriti/trust.jpg',
        width: 1200,
        height: 900,
        alt: 'AlinKriti customer reviews and frequently asked questions sections',
      },
      {
        label: 'Editorial content',
        title: 'Content Beyond Commerce',
        text: 'The blog layer adds storytelling around jewellery, styling and the AlinKriti brand.',
        image: '/captures/alinkriti/blogs.jpg',
        width: 1200,
        height: 600,
        alt: 'AlinKriti “Our Blogs” section with three article cards',
      },
    ],
  },

  'samriti-textiles': {
    theme: 'samriti',
    themeColor: '#F3E9DF',
    titleLines: ['Samriti', 'Textiles'],
    tagline: 'A richer, collection-led fashion experience built around Indian ethnic wear and visual discovery.',
    tags: ['Ethnic Wear', 'Collection-Led', 'Lifestyle'],
    embeddable: false,
    capture: {
      src: '/captures/samriti-textiles/full.jpg',
      width: 1200,
      height: 11160,
      alt: 'Full-page capture of the Samriti Textiles homepage',
    },
    strengths: [
      {
        label: 'Category navigation',
        title: 'Clear Ethnic-Wear Navigation',
        text: 'Products and collections are organised around categories including Anarkali sets, lehenga sets, sharara suits, kurta-palazzo sets, gowns and co-ord sets.',
        image: '/captures/samriti-textiles/categories.jpg',
        width: 1200,
        height: 367,
        alt: 'Samriti Textiles category row: co-ord sets, kurta-palazzo sets, lehenga sets, Anarkali suit sets, sharara suit',
      },
      {
        label: 'New arrivals',
        title: 'Strong New-Arrival Discovery',
        text: 'The homepage foregrounds new arrivals and multiple fashion categories for fast product exploration.',
        image: '/captures/samriti-textiles/arrivals.jpg',
        width: 1200,
        height: 833,
        alt: 'Samriti Textiles “New Arrivals” section with categories and product cards',
      },
      {
        label: 'Trending looks',
        title: 'Trend-Led Merchandising',
        text: '“Trending Looks To Watch” gives selected products a stronger fashion-editorial presentation rather than relying only on a standard product grid.',
        image: '/captures/samriti-textiles/trending.jpg',
        width: 1200,
        height: 667,
        alt: 'Samriti Textiles “Trending Looks To Watch” carousel',
      },
      {
        label: 'Shop by collection',
        title: 'Collection-Based Shopping',
        text: 'The “Shop By Collection” structure helps visitors browse by garment type instead of requiring product-by-product discovery.',
        image: '/captures/samriti-textiles/collection.jpg',
        width: 1200,
        height: 1050,
        alt: 'Samriti Textiles “Shop By Collection” grid: lehenga, co-ord, Anarkali, sharara, winter and palazzo sets',
      },
      {
        label: 'Shop by looks',
        title: 'Lifestyle and Styling Layer',
        text: '“Shop By Looks” and editorial-style messaging add aspirational presentation beyond catalogue browsing.',
        image: '/captures/samriti-textiles/looks.jpg',
        width: 858,
        height: 467,
        alt: 'Samriti Textiles “Shop By Looks” section with styled outfit photography',
      },
      {
        label: 'Campaign module',
        title: 'Promotional Merchandising',
        text: 'Seasonal promotional areas such as the current sale module give the storefront a strong campaign layer.',
        image: '/captures/samriti-textiles/sale.jpg',
        width: 1200,
        height: 500,
        alt: 'Samriti Textiles “Winter Sale is On!” promotional module',
      },
    ],
  },
};
