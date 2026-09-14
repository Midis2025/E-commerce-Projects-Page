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
    image: '/images/design-review-bg.jpg',
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
