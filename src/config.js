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
    heading: [{ text: 'Eight directions.' }, { text: 'One final experience.' }],
    intro:
      'Explore all eight proposed website concepts below. Review the layouts, interactions and individual page experiences, then choose the direction that best represents the brand.',
    cta: 'Begin the review',
    /** Small key/value details beside the intro. Remove any you don't need. */
    meta: [
      { label: 'Prepared', value: 'September 2026' },
      { label: 'Scope', value: 'Homepage and key pages' },
    ],
    steps: [
      { number: '01', title: 'Concepts', text: 'Eight curated design directions.' },
      { number: '02', title: 'Explore', text: 'Browse each live build, page by page.' },
      { number: '03', title: 'Select', text: 'Confirm the direction to develop.' },
    ],
  },

  conceptsIntro: {
    eyebrow: 'The Concepts',
    heading: 'Eight proposed directions, each presented as a live, browsable build.',
  },

  review: {
    eyebrow: 'Review',
    heading: 'Seen all eight directions?',
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
    tagline: 'Eight directions. One final build.',
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
  {
    id: 'country-kids',
    number: '03',
    label: 'Concept Three',
    name: 'Country Kids',
    description:
      'A not-for-profit early learning centre rooted in Country, where every child belongs. Seven nature-named rooms, a curriculum shaped like the landscape and clear family pathways give the brand warmth and trust.',
    traits: ['Early Learning', 'Country', 'Belonging'],
    websiteUrl: 'https://www.countrykids.au/',
    previewImage: '/previews/country-kids.jpg',
    previewAlt: 'Country Kids — homepage screenshot',
    pages: [
      { name: 'Homepage', url: 'https://www.countrykids.au/' },
      { name: 'Our Story', url: 'https://www.countrykids.au/about' },
      { name: 'Rooms', url: 'https://www.countrykids.au/rooms' },
      { name: 'Curriculum', url: 'https://www.countrykids.au/curriculum' },
    ],
  },
  {
    id: 'gulf-connect',
    number: '04',
    label: 'Concept Four',
    name: 'Gulf Connect',
    description:
      'A capital-markets communications consultancy connecting international companies with Gulf capital, partners and media. An institutional palette, a three-part capability model and investor-focused pathways build confidence.',
    traits: ['Capital Markets', 'Gulf', 'Strategic Communications'],
    websiteUrl: 'https://www.gulfconnectconsultancy.com/',
    previewImage: '/previews/gulf-connect.jpg',
    previewAlt: 'Gulf Connect — homepage screenshot',
    pages: [
      { name: 'Homepage', url: 'https://www.gulfconnectconsultancy.com/' },
      { name: 'What We Do', url: 'https://www.gulfconnectconsultancy.com/what-we-do' },
      { name: 'About', url: 'https://www.gulfconnectconsultancy.com/about' },
      { name: 'Contact', url: 'https://www.gulfconnectconsultancy.com/contact' },
    ],
  },
  {
    id: 'midis',
    number: '05',
    label: 'Concept Five',
    name: 'MIDIS',
    description:
      'A design and digital growth agency presented through a bold, dark, visual-first homepage. Web design and development, graphic design, SEO and Google & Meta ads are brought together as one connected offer.',
    traits: ['Digital Strategy', 'Creative', 'Growth'],
    websiteUrl: 'https://www.midis.in/',
    previewImage: '/previews/midis.jpg',
    previewAlt: 'MIDIS — homepage screenshot',
    // Only the homepage resolves as a direct link (other routes return 404 when opened directly).
    pages: [{ name: 'Homepage', url: 'https://www.midis.in/' }],
  },
  {
    id: 'us-data-centers',
    number: '06',
    label: 'Concept Six',
    name: 'U.S. Data Centers',
    description:
      'Enterprise-scale AI infrastructure presented with technical clarity. Deployment speed, power, cooling and GPU-ready architecture lead a dark, data-rich interface built around high-density compute.',
    traits: ['AI Infrastructure', 'Data Centers', 'Deployment'],
    websiteUrl: 'https://www.usdatacenters.ai/',
    previewImage: '/previews/us-data-centers.jpg',
    previewAlt: 'U.S. Data Centers — homepage screenshot',
    pages: [
      { name: 'Homepage', url: 'https://www.usdatacenters.ai/' },
      { name: 'Data Centers', url: 'https://www.usdatacenters.ai/data-center' },
      { name: 'ARMS', url: 'https://www.usdatacenters.ai/arms' },
      { name: 'Use Cases', url: 'https://www.usdatacenters.ai/use-cases' },
    ],
  },
  {
    id: 'digipowerx',
    number: '07',
    label: 'Concept Seven',
    name: 'DigiPowerX',
    description:
      'Energy, data centers and bare-metal GPU compute told as one vertically integrated story. A black-and-yellow industrial identity carries the journey from owned power to live AI infrastructure.',
    traits: ['Energy', 'Data Centers', 'AI Compute'],
    websiteUrl: 'https://www.digipowerx.com/',
    previewImage: '/previews/digipowerx.jpg',
    previewAlt: 'DigiPowerX — homepage screenshot',
    pages: [
      { name: 'Homepage', url: 'https://www.digipowerx.com/' },
      { name: 'About', url: 'https://www.digipowerx.com/about' },
      { name: 'Energy', url: 'https://www.digipowerx.com/energy' },
      { name: 'Data Centers', url: 'https://www.digipowerx.com/data-centers' },
      { name: 'Investors', url: 'https://www.digipowerx.com/investors' },
    ],
  },
  {
    id: 'neocloudz',
    number: '08',
    label: 'Concept Eight',
    name: 'NeoCloudz',
    description:
      'A GPU cloud presented as a live cluster terminal. Blackwell-class compute, workload-led solutions and developer tooling sit inside a dark, green-lit interface that feels operational from the first screen.',
    traits: ['GPU Cloud', 'AI Infrastructure', 'Compute'],
    websiteUrl: 'https://www.neocloudz.com/',
    previewImage: '/previews/neocloudz.jpg',
    previewAlt: 'NeoCloudz — homepage screenshot',
    pages: [
      { name: 'Homepage', url: 'https://www.neocloudz.com/' },
      { name: 'Products', url: 'https://www.neocloudz.com/products' },
      { name: 'Solutions', url: 'https://www.neocloudz.com/solution' },
      { name: 'About', url: 'https://www.neocloudz.com/about' },
      { name: 'GPU as a Service', url: 'https://www.neocloudz.com/gpu-as-a-service' },
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
 *  theme       Visual world of the page: 'alinkriti' | 'samriti' |
 *              'country' | 'gulf' | 'midis' | 'usdc' | 'digipowerx' | 'neocloudz'.
 *  tone        'dark' puts the whole page on a dark ground (for dark sites).
 *  panel       Decision panel ground: 'dark', 'plain' (theme styles it) or
 *              default glass.
 *  pagesNote   Optional line under the page links.
 *  embeddable  true only if the live site allows being shown in an
 *              iframe (checked September 2026):
 *              - AlinKriti, Samriti: `X-Frame-Options: DENY` and
 *                `frame-ancestors 'none'` (Shopify default) → false.
 *              - Country Kids, Gulf Connect: no framing restrictions,
 *                verified rendering in a real iframe → true.
 *              `capture` (a full-page screenshot) is always shown when
 *              embedding is off, on phones, or if the live site fails
 *              to load.
 *  strengths   What the client should look for. Images are crops of
 *              the live site in /public/captures/<id>/.
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
    panel: 'dark',
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

  'country-kids': {
    theme: 'country',
    themeColor: '#F3F0E4',
    titleLines: ['Country', 'Kids'],
    tagline: 'A warm, story-led early learning experience built around Country, belonging and child-centred discovery.',
    tags: ['Early Learning', 'Country', 'Belonging'],
    embeddable: true,
    capture: {
      src: '/captures/country-kids/full.jpg',
      width: 1200,
      height: 750,
      alt: 'Capture of the Country Kids homepage',
    },
    strengths: [
      {
        label: 'Brand story',
        title: 'Strong Brand Story',
        text: 'The website builds its identity around “Rooted in Country” and the idea that every child belongs, creating a clear emotional foundation for the brand.',
        image: '/captures/country-kids/story.jpg',
        width: 1200,
        height: 750,
        alt: 'Country Kids homepage: “Rooted in Country. Where every child belongs.”',
      },
      {
        label: 'Room discovery',
        title: 'Age-Based Room Discovery',
        text: 'Seven rooms are organised by age and stage, making it easy for families to understand where their child fits.',
        image: '/captures/country-kids/rooms.jpg',
        width: 1200,
        height: 583,
        alt: 'Country Kids rooms page: “A room for every age & stage”',
      },
      {
        label: 'Naming system',
        title: 'Nature-Led Naming System',
        text: 'Rooms such as Joey, Koala, Kookaburra, Kingfisher, Kangaroo and Bunjil reinforce the Australian identity throughout the experience.',
        image: '/captures/country-kids/names.jpg',
        width: 1200,
        height: 750,
        alt: 'Country Kids room cards named after Australian animals',
      },
      {
        label: 'Curriculum',
        title: 'Curriculum Storytelling',
        text: 'The curriculum is presented through concepts such as Seeds, Country, River, Seasons and High Country, giving the educational approach a memorable structure.',
        image: '/captures/country-kids/curriculum.jpg',
        width: 1200,
        height: 733,
        alt: 'Country Kids curriculum page: “Five Landscapes of Country Kids”',
      },
      {
        label: 'Family pathways',
        title: 'Family-Focused Conversion',
        text: 'Book a Tour, Enrolment, Fees & CCS, Families and Contact pathways support practical parent decision-making.',
        image: '/captures/country-kids/families.jpg',
        width: 1200,
        height: 750,
        alt: 'Country Kids family pathways: tours, enrolment, fees and contact',
      },
      {
        label: 'Trust + compliance',
        title: 'Trust and Compliance Layer',
        text: 'The site gives clear space to child safety, National Quality Framework alignment, Victorian Kinder Funding and other family-relevant information.',
        image: '/captures/country-kids/compliance.jpg',
        width: 1200,
        height: 683,
        alt: 'Country Kids compliance and child safety information',
      },
    ],
  },

  'gulf-connect': {
    theme: 'gulf',
    panel: 'dark',
    themeColor: '#0F1B2D',
    titleLines: ['Gulf', 'Connect'],
    tagline: 'A strategic Gulf-market platform connecting international companies with capital, media and regional audiences.',
    tags: ['Capital Markets', 'Gulf', 'Strategic Communications'],
    embeddable: true,
    capture: {
      src: '/captures/gulf-connect/full.jpg',
      width: 1200,
      height: 11274,
      alt: 'Full-page capture of the Gulf Connect homepage',
    },
    strengths: [
      {
        label: 'Positioning',
        title: 'Clear Gulf Positioning',
        text: 'The homepage immediately establishes the business around international companies, Gulf capital, partners and media across Dubai, Abu Dhabi and Riyadh.',
        image: '/captures/gulf-connect/positioning.jpg',
        width: 1200,
        height: 733,
        alt: 'Gulf Connect homepage hero: “We Connect International Companies With Gulf Capital, Partners and Media.”',
      },
      {
        label: 'Market context',
        title: 'Regional Market Context',
        text: 'The site explains Gulf market coverage across the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman, creating a strong geographic framework.',
        image: '/captures/gulf-connect/markets.jpg',
        width: 1200,
        height: 467,
        alt: 'Gulf Connect “Gulf market coverage” section',
      },
      {
        label: 'Capability model',
        title: 'Simple Capability Structure',
        text: 'Convene, Place and Produce give the service model a memorable three-part structure.',
        image: '/captures/gulf-connect/model.jpg',
        width: 1200,
        height: 750,
        alt: 'Gulf Connect “Convene, Place, Produce” section',
      },
      {
        label: 'Capabilities',
        title: 'Integrated Corporate Narrative',
        text: 'Investor relations, market outreach, media and digital communications are presented as connected capabilities rather than disconnected services.',
        image: '/captures/gulf-connect/capabilities.jpg',
        width: 1200,
        height: 950,
        alt: 'Gulf Connect “Our Capabilities” section',
      },
      {
        label: 'Investor pathway',
        title: 'Investor-Focused Information Architecture',
        text: 'The site separates company-facing and investor-facing pathways while keeping the wider capital-markets narrative consistent.',
        image: '/captures/gulf-connect/investors.jpg',
        width: 1200,
        height: 750,
        alt: 'Gulf Connect “For Investors” page',
      },
      {
        label: 'Arabic + regional',
        title: 'Arabic and Regional Communication Layer',
        text: 'Arabic communications, certified financial translation and regional distribution add a clearly differentiated regional capability.',
        image: '/captures/gulf-connect/arabic.jpg',
        width: 1200,
        height: 683,
        alt: 'Gulf Connect Arabic corporate communications and certified financial translation section',
      },
      {
        label: 'Thought leadership',
        title: 'Strong Thought-Leadership Structure',
        text: 'Sections such as Regional Perspective, The Opportunity, Regional Case and Market Presence explain the reasoning behind the service model rather than simply listing services.',
        image: '/captures/gulf-connect/perspective.jpg',
        width: 1200,
        height: 750,
        alt: 'Gulf Connect “Regional Perspective. Global Market Standards.” section',
      },
    ],
  },

  midis: {
    theme: 'midis',
    tone: 'dark',
    panel: 'dark',
    themeColor: '#0A0A0A',
    titleLines: ['MIDIS'],
    tagline: 'An integrated digital experience bringing creative, technology and performance marketing into one brand system.',
    tags: ['Digital', 'Creative', 'Growth'],
    embeddable: true,
    capture: { src: '/captures/midis/full.jpg', width: 1200, height: 10833, alt: 'Capture of the MIDIS homepage' },
    pagesNote: 'The other MIDIS sections open from the homepage’s own navigation; their direct URLs don’t load on their own, so only the homepage is linked here.',
    strengths: [
      {
        label: 'Positioning',
        title: 'End-to-End Digital Positioning',
        text: 'The brand presents web development, creative, content and marketing as one connected digital capability.',
        image: '/captures/midis/hero.jpg',
        width: 1200,
        height: 750,
        alt: 'MIDIS homepage hero with the MIDIS wordmark',
      },
      {
        label: 'Services',
        title: 'Strong Service Breadth',
        text: 'Web design and development, graphic design, content, video, SEO, email, social media and Google & Meta ads create a broad full-service proposition.',
        image: '/captures/midis/services.jpg',
        width: 1200,
        height: 750,
        alt: 'MIDIS services section: web designing and web development',
      },
      {
        label: 'Visual identity',
        title: 'Visual-First Agency Identity',
        text: 'The brand uses bold digital presentation to make creative and technology capabilities feel connected.',
        image: '/captures/midis/visual.jpg',
        width: 1200,
        height: 750,
        alt: 'MIDIS homepage visuals below the hero',
      },
      {
        label: 'Performance + creative',
        title: 'Performance + Creative',
        text: 'Organic growth, SEO and advertising capabilities sit alongside design and content rather than being separated from them.',
        image: '/captures/midis/growth.jpg',
        width: 1200,
        height: 833,
        alt: 'MIDIS “Why choose MIDIS for your success” section',
      },
      {
        label: 'Web offering',
        title: 'Conversion-Focused Web Offering',
        text: 'Website development is positioned around responsive experiences designed to support business outcomes.',
        image: '/captures/midis/web.jpg',
        width: 1200,
        height: 708,
        alt: 'MIDIS web development service section',
      },
    ],
  },

  'us-data-centers': {
    theme: 'usdc',
    tone: 'dark',
    panel: 'dark',
    themeColor: '#04070F',
    titleLines: ['U.S. Data', 'Centers'],
    tagline: 'AI-ready infrastructure presented through speed, scale, power and next-generation data center engineering.',
    tags: ['AI Infrastructure', 'Data Centers', 'Deployment'],
    embeddable: true,
    capture: { src: '/captures/us-data-centers/full.jpg', width: 1200, height: 8503, alt: 'Full-page capture of the U.S. Data Centers homepage' },
    strengths: [
      {
        label: 'Proposition',
        title: 'Immediate Infrastructure Proposition',
        text: 'The homepage clearly positions the company around deploying AI infrastructure in months rather than years.',
        image: '/captures/us-data-centers/deploy.jpg',
        width: 1200,
        height: 750,
        alt: 'USDC homepage hero: “Deploy AI Infrastructure in Months Not Years”',
      },
      {
        label: 'Performance',
        title: 'Performance-Led Storytelling',
        text: 'Power capacity, deployment speed, design standards and AI readiness are surfaced prominently.',
        image: '/captures/us-data-centers/performance.jpg',
        width: 1200,
        height: 583,
        alt: 'USDC “Engineered for performance. Built for efficiency.” section',
      },
      {
        label: 'Infrastructure stack',
        title: 'Complete Infrastructure Stack',
        text: 'Power, cooling, networking, GPU compute and AI applications are presented as one connected infrastructure system.',
        image: '/captures/us-data-centers/stack.jpg',
        width: 1200,
        height: 750,
        alt: 'USDC “From Power to AI Compute” infrastructure stack',
      },
      {
        label: 'Visualisation',
        title: 'Strong Technical Visualisation',
        text: 'Cooling telemetry, infrastructure architecture and deployment diagrams make complex infrastructure more tangible.',
        image: '/captures/us-data-centers/telemetry.jpg',
        width: 1200,
        height: 750,
        alt: 'USDC DCIM telemetry and closed-loop cooling telemetry section',
      },
      {
        label: 'AI-specific',
        title: 'AI-Specific Positioning',
        text: 'The design is built around high-density GPU workloads rather than generic enterprise data centers.',
        image: '/captures/us-data-centers/ai.jpg',
        width: 1200,
        height: 750,
        alt: 'USDC “Built for AI infrastructure excellence” section',
      },
      {
        label: 'Future-ready',
        title: 'Future-Ready Architecture',
        text: 'Blackwell, Grace Blackwell and future accelerator infrastructure create a strong next-generation narrative.',
        image: '/captures/us-data-centers/future.jpg',
        width: 1200,
        height: 833,
        alt: 'USDC “Chip-agnostic. Architecture-ready.” section with Blackwell, Grace Blackwell and Vera Rubin',
      },
    ],
  },

  digipowerx: {
    theme: 'digipowerx',
    tone: 'dark',
    panel: 'plain',
    themeColor: '#050505',
    titleLines: ['Digi', 'PowerX'],
    tagline: 'A vertically integrated infrastructure story connecting energy, data centers and bare-metal AI compute.',
    tags: ['Energy', 'Data Centers', 'AI Compute'],
    embeddable: false,
    capture: { src: '/captures/digipowerx/full.jpg', width: 1200, height: 9325, alt: 'Full-page capture of the DigiPowerX homepage' },
    strengths: [
      {
        label: 'Vertical integration',
        title: 'Strong Vertical-Integration Story',
        text: 'The website connects power generation, substations, data centers and GPU compute under one infrastructure narrative.',
        image: '/captures/digipowerx/integration.jpg',
        width: 1200,
        height: 717,
        alt: 'DigiPowerX “Built from the ground up. Owned at every layer.” section',
      },
      {
        label: 'Operating model',
        title: 'Clear Three-Layer Operating Model',
        text: 'Own the energy source, build the data centers and operate the GPU clusters creates an easy-to-understand structure.',
        image: '/captures/digipowerx/model.jpg',
        width: 1200,
        height: 750,
        alt: 'DigiPowerX layered infrastructure diagram',
      },
      {
        label: 'NeoCloudz',
        title: 'NeoCloudz Integration',
        text: 'The GPU platform is presented as the compute layer built on top of DigiPowerX-owned infrastructure.',
        image: '/captures/digipowerx/neocloudz.jpg',
        width: 1200,
        height: 750,
        alt: 'DigiPowerX “Meet Neo Cloudz” section',
      },
      {
        label: 'Facility depth',
        title: 'Technical Infrastructure Depth',
        text: 'Power, cooling, network fabric, physical security and facility specifications are given substantial visual weight.',
        image: '/captures/digipowerx/specs.jpg',
        width: 1200,
        height: 958,
        alt: 'DigiPowerX “Full-stack facility specifications” section',
      },
      {
        label: 'AI / HPC',
        title: 'High-Density AI Positioning',
        text: 'The design consistently frames the company around AI/HPC infrastructure rather than traditional hosting.',
        image: '/captures/digipowerx/density.jpg',
        width: 1200,
        height: 750,
        alt: 'DigiPowerX “Your hardware, our infrastructure” section',
      },
      {
        label: 'Site to compute',
        title: 'Site-to-Compute Journey',
        text: 'The “Site & Power → Substation → Data Center → GPU Deployment → NeoCloudz Live” sequence explains the business model visually.',
        image: '/captures/digipowerx/journey.jpg',
        width: 1200,
        height: 583,
        alt: 'DigiPowerX “From site to live infra” sequence',
      },
    ],
  },

  neocloudz: {
    theme: 'neocloudz',
    tone: 'dark',
    panel: 'dark',
    themeColor: '#0A0F0A',
    titleLines: ['NeoCloudz'],
    tagline: 'A high-performance GPU cloud experience built around AI compute, infrastructure visibility and developer control.',
    tags: ['GPU Cloud', 'AI Compute', 'Blackwell'],
    embeddable: true,
    capture: { src: '/captures/neocloudz/full.jpg', width: 1200, height: 10217, alt: 'Full-page capture of the NeoCloudz homepage' },
    strengths: [
      {
        label: 'Compute positioning',
        title: 'Immediate Compute Positioning',
        text: 'The homepage immediately establishes NeoCloudz around AI compute and GPU infrastructure.',
        image: '/captures/neocloudz/compute.jpg',
        width: 1200,
        height: 667,
        alt: 'NeoCloudz homepage hero: “Deploy in 60 Seconds. Compute Starts Here.”',
      },
      {
        label: 'Live system',
        title: 'Live-System Visual Language',
        text: 'Cluster telemetry, terminal-style components and system metrics make the platform feel operational rather than conceptual.',
        image: '/captures/neocloudz/system.jpg',
        width: 1200,
        height: 750,
        alt: 'NeoCloudz cluster terminal interface with system metrics',
      },
      {
        label: 'GPU products',
        title: 'GPU-Centric Product Discovery',
        text: 'Blackwell, Grace Blackwell and future GPU architectures are presented as clear compute products.',
        image: '/captures/neocloudz/gpus.jpg',
        width: 1200,
        height: 750,
        alt: 'NeoCloudz GPU product cards: Blackwell, Grace Blackwell, Vera Rubin',
      },
      {
        label: 'Workloads',
        title: 'Lifecycle-Based Solutions',
        text: 'Training, inference, prototyping, rendering and other workloads are organised around real AI use cases.',
        image: '/captures/neocloudz/lifecycle.jpg',
        width: 1200,
        height: 750,
        alt: 'NeoCloudz “Optimized for Every AI and HPC Workload” section',
      },
      {
        label: 'Own stack',
        title: 'Own-Stack Infrastructure Story',
        text: 'The platform connects compute with DigiPowerX and U.S. Data Centers rather than presenting itself as a detached hyperscaler layer.',
        image: '/captures/neocloudz/ownstack.jpg',
        width: 1200,
        height: 750,
        alt: 'NeoCloudz “Own-Stack Infrastructure. No Middlemen.” section',
      },
      {
        label: 'Developer experience',
        title: 'Strong Developer Experience',
        text: 'GPU provisioning, bare metal, APIs, Kubernetes, notebooks and cluster workflows reinforce technical credibility.',
        image: '/captures/neocloudz/developer.jpg',
        width: 1200,
        height: 583,
        alt: 'NeoCloudz “Simple Deployment Model”: provision in minutes, API & dashboard, standard images',
      },
    ],
  },
};
