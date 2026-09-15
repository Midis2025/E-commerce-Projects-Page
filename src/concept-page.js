/* ------------------------------------------------------------------
 * Concept detail page — /concepts/<id>/
 * One renderer for every concept. The page reads its concept from
 * <html data-concept="…">; content comes from `concepts` and
 * `conceptDetails` in config.js; `detail.theme` picks its visual world.
 * Selection uses the same localStorage key + modal as the homepage.
 * ------------------------------------------------------------------ */

import './style.css';
import './concept.css';
import { site, concepts, conceptDetails } from './config.js';
import {
  $,
  $$,
  esc,
  pad,
  safeUrl,
  displayUrl,
  conceptById,
  conceptPath,
  icon,
  button,
  toast,
  reducedMotion,
  finePointer,
  state,
  readSelection,
  storageKey,
  configureSelection,
  initModal,
  modal,
  startSelection,
  confirmSelection,
  copySelection,
  closeModal,
  handleModalKeys,
  renderOverlays,
  setupReveal,
} from './shared.js';

const concept = conceptById(document.documentElement.dataset.concept);
const detail = concept ? conceptDetails[concept.id] : null;
const THEMES = ['alinkriti', 'samriti', 'country', 'gulf'];
const theme = THEMES.includes(detail?.theme) ? detail.theme : 'alinkriti';

/* Phones get the capture instead of a live iframe: a small nested frame traps touch scrolling. */
const phone = window.matchMedia('(max-width: 699px)');

/* ------------------------------------------------------------------
 * Atmosphere — abstract, fixed, behind everything (decorative only)
 * ------------------------------------------------------------------ */

const ATMOSPHERE = {
  // Metallic rings, a burnished arc and a sheet of glass.
  alinkriti: `
    <div class="cp-atmos__base"></div>
    <div class="cp-atmos__layer cp-atmos__ring" style="--depth:0.05">
      <svg viewBox="0 0 800 800" fill="none">
        <defs>
          <linearGradient id="ak-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F3D9A8" />
            <stop offset="0.35" stop-color="#B8732E" />
            <stop offset="0.6" stop-color="#FBE7C2" />
            <stop offset="1" stop-color="#8A5220" />
          </linearGradient>
        </defs>
        <circle cx="400" cy="400" r="362" stroke="url(#ak-metal)" stroke-width="1.4" opacity="0.6" />
        <circle cx="400" cy="400" r="340" stroke="url(#ak-metal)" stroke-width="12" opacity="0.07" />
        <circle cx="400" cy="400" r="318" stroke="url(#ak-metal)" stroke-width="0.8" opacity="0.4" />
      </svg>
    </div>
    <div class="cp-atmos__layer cp-atmos__arc" style="--depth:0.1">
      <svg viewBox="0 0 600 320" fill="none">
        <path d="M12 312C110 70 490 70 588 312" stroke="url(#ak-metal)" stroke-width="1.2" opacity="0.55" />
        <path d="M52 312C140 110 460 110 548 312" stroke="url(#ak-metal)" stroke-width="0.7" opacity="0.35" />
      </svg>
    </div>
    <div class="cp-atmos__layer cp-atmos__glass" style="--depth:0.03"><span></span></div>
    <div class="cp-atmos__layer cp-atmos__glint" style="--depth:0.08"><span></span></div>`,

  // Draped fabric folds, a woven grain and two layered textile planes.
  samriti: `
    <div class="cp-atmos__base"></div>
    <div class="cp-atmos__weave"></div>
    <div class="cp-atmos__layer cp-atmos__drape" style="--depth:0.05">
      <svg viewBox="0 0 900 720" fill="none" preserveAspectRatio="xMaxYMin meet">
        <defs>
          <linearGradient id="sm-wine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#6E262B" />
            <stop offset="1" stop-color="#A84F2D" />
          </linearGradient>
          <linearGradient id="sm-rust" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#A84F2D" />
            <stop offset="1" stop-color="#B89458" />
          </linearGradient>
        </defs>
        <path d="M900 0H330c50 120-30 210 30 330s200 140 260 270c30 60 80 90 280 100z" fill="url(#sm-wine)" opacity="0.1" />
        <path d="M900 0H470c40 110-20 230 40 340s180 130 230 240c30 60 80 90 160 100z" fill="url(#sm-rust)" opacity="0.12" />
        <path d="M900 0H610c30 120-10 220 40 320s150 120 190 200c20 40 40 60 60 70z" fill="url(#sm-wine)" opacity="0.14" />
        <path d="M430 0c40 120-20 220 30 330s180 140 230 260" stroke="#B89458" stroke-width="1.2" opacity="0.5" />
        <path d="M560 0c30 120-10 230 40 330s150 130 190 230" stroke="#B89458" stroke-width="0.8" opacity="0.4" />
      </svg>
    </div>
    <div class="cp-atmos__layer cp-atmos__plane cp-atmos__plane--a" style="--depth:0.09"><span></span></div>
    <div class="cp-atmos__layer cp-atmos__plane cp-atmos__plane--b" style="--depth:0.12"><span></span></div>`,

  // Soft organic gradient fields, abstract leaf outlines and layered paper sheets.
  country: `
    <div class="cp-atmos__base"></div>
    <div class="cp-atmos__grain"></div>
    <div class="cp-atmos__layer cp-atmos__blob cp-atmos__blob--a" style="--depth:0.04">
      <svg viewBox="0 0 600 600">
        <defs>
          <radialGradient id="ck-euc" cx="45%" cy="45%" r="60%">
            <stop offset="0" stop-color="#9DB8A2" stop-opacity="0.55" />
            <stop offset="1" stop-color="#9DB8A2" stop-opacity="0" />
          </radialGradient>
        </defs>
        <path d="M421 72c73 45 132 128 121 212-11 85-92 170-186 214S154 537 94 476 4 318 36 222 142 70 234 45s114-18 187 27z" fill="url(#ck-euc)" />
      </svg>
    </div>
    <div class="cp-atmos__layer cp-atmos__blob cp-atmos__blob--b" style="--depth:0.07">
      <svg viewBox="0 0 600 600">
        <defs>
          <radialGradient id="ck-sun" cx="50%" cy="50%" r="55%">
            <stop offset="0" stop-color="#E7BE62" stop-opacity="0.42" />
            <stop offset="1" stop-color="#E7BE62" stop-opacity="0" />
          </radialGradient>
        </defs>
        <path d="M312 40c96 10 206 76 234 170s-26 208-116 268-214 76-300 24S12 356 36 258 216 30 312 40z" fill="url(#ck-sun)" />
      </svg>
    </div>
    <div class="cp-atmos__layer cp-atmos__blob cp-atmos__blob--c" style="--depth:0.05">
      <svg viewBox="0 0 600 600">
        <defs>
          <radialGradient id="ck-sky" cx="50%" cy="50%" r="55%">
            <stop offset="0" stop-color="#9FC6DA" stop-opacity="0.4" />
            <stop offset="1" stop-color="#9FC6DA" stop-opacity="0" />
          </radialGradient>
        </defs>
        <path d="M300 30c110 0 250 90 260 210S460 540 330 566 60 520 38 380 190 30 300 30z" fill="url(#ck-sky)" />
      </svg>
    </div>
    <div class="cp-atmos__layer cp-atmos__leaves" style="--depth:0.09">
      <svg viewBox="0 0 400 420" fill="none">
        <g stroke="#4F7A4E" stroke-linecap="round">
          <path d="M200 60c74 62 84 168 0 250-84-82-74-188 0-250z" stroke-width="1.2" opacity="0.4" />
          <path d="M200 84v216" stroke-width="0.8" opacity="0.28" />
          <g transform="rotate(40 200 330)">
            <path d="M200 120c56 48 64 128 0 190-64-62-56-142 0-190z" stroke-width="1" opacity="0.32" />
            <path d="M200 140v162" stroke-width="0.7" opacity="0.22" />
          </g>
          <g transform="rotate(-36 200 330)">
            <path d="M200 150c46 40 52 104 0 156-52-52-46-116 0-156z" stroke-width="1" opacity="0.28" />
          </g>
        </g>
      </svg>
    </div>
    <div class="cp-atmos__layer cp-atmos__sheet cp-atmos__sheet--a" style="--depth:0.1"><span></span></div>
    <div class="cp-atmos__layer cp-atmos__sheet cp-atmos__sheet--b" style="--depth:0.13"><span></span></div>`,

  // Architectural grid, fine gold routes between abstract regional nodes, a sheet of glass.
  gulf: `
    <div class="cp-atmos__base"></div>
    <div class="cp-atmos__grid"></div>
    <div class="cp-atmos__layer cp-atmos__routes" style="--depth:0.05">
      <svg viewBox="0 0 900 600" fill="none">
        <defs>
          <linearGradient id="gc-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#B8955A" stop-opacity="0" />
            <stop offset="0.5" stop-color="#B8955A" />
            <stop offset="1" stop-color="#B8955A" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="M40 430C250 170 620 150 870 300" stroke="url(#gc-gold)" stroke-width="1" opacity="0.7" />
        <path d="M110 540C340 300 610 280 840 420" stroke="url(#gc-gold)" stroke-width="0.8" opacity="0.5" />
        <path d="M300 330L420 300L560 250L640 280L700 380L520 360Z" stroke="#0F1B2D" stroke-width="0.7" opacity="0.14" />
        <path d="M420 300L520 360M560 250L520 360M640 280L520 360" stroke="#0F1B2D" stroke-width="0.6" opacity="0.1" />
        <g fill="#B8955A">
          <circle cx="300" cy="330" r="3" opacity="0.7" /><circle cx="420" cy="300" r="3.5" opacity="0.8" />
          <circle cx="560" cy="250" r="3" opacity="0.7" /><circle cx="640" cy="280" r="3" opacity="0.7" />
          <circle cx="700" cy="380" r="3" opacity="0.7" /><circle cx="520" cy="360" r="4" opacity="0.9" />
        </g>
        <g stroke="#B8955A" stroke-width="0.8" opacity="0.3">
          <circle cx="520" cy="360" r="14" /><circle cx="420" cy="300" r="11" />
        </g>
      </svg>
    </div>
    <div class="cp-atmos__layer cp-atmos__pane" style="--depth:0.03"><span></span></div>`,
};

/* ------------------------------------------------------------------
 * Templates
 * ------------------------------------------------------------------ */

function renderHeader() {
  const links = concepts
    .map(
      (c) => `<li><a class="cp-nav__link" href="${esc(conceptPath(c))}" data-cp-nav="${esc(c.id)}" ${c.id === concept.id ? 'aria-current="page"' : ''}>
        <span class="cp-nav__num">${esc(c.number)}</span>
        <span class="cp-nav__name">${esc(c.name)}</span>
        <span class="cp-nav__dot" aria-hidden="true"></span>
        <span class="sr-only" data-cp-nav-state></span>
      </a></li>`,
    )
    .join('');

  return `
  <div class="progress" aria-hidden="true"><span class="progress__bar" data-progress></span></div>
  <header class="cp-header" data-header data-inertable>
    <div class="page-container cp-header__inner">
      <a class="brand" href="/">
        <span class="brand__glyph" aria-hidden="true"></span>
        <span class="brand__mark">${esc(site.brand.mark)}</span>
      </a>
      <nav class="cp-nav" aria-label="Design review">
        <ul class="cp-nav__list">
          ${links}
          <li><a class="cp-nav__link" href="/#review"><span class="cp-nav__name cp-nav__name--always">Review</span></a></li>
        </ul>
      </nav>
      <a class="cp-back" href="/#concepts">${icon.left}<span class="cp-back__long">Back to concepts</span><span class="cp-back__short">Concepts</span></a>
    </div>
  </header>`;
}

function renderHero() {
  const url = safeUrl(concept.websiteUrl);
  const lines = (detail.titleLines?.length ? detail.titleLines : [concept.name])
    .map((text, i) => `<span class="line"><span class="line__inner" style="--i:${i}">${esc(text)}</span></span>`)
    .join('');
  const tags = (detail.tags || concept.traits || []).filter(Boolean);

  return `
  <section class="cp-hero" aria-labelledby="cp-title">
    <div class="page-container">
      <div class="cp-crumbs" data-hero-in style="--d:0">
        <nav aria-label="Breadcrumb">
          <ol class="cp-crumbs__list">
            <li><a class="cp-crumbs__back" href="/#${esc(concept.id)}">${icon.left}Back to concepts</a></li>
            <li>Concept ${esc(concept.number)}</li>
            <li aria-current="page">${esc(concept.name)}</li>
          </ol>
        </nav>
        ${url ? `<a class="cp-crumbs__live" href="${esc(url)}" target="_blank" rel="noopener noreferrer">View live site ${icon.external}<span class="sr-only"> (opens in a new tab)</span></a>` : ''}
      </div>

      <div class="cp-hero__grid">
        <div class="cp-hero__main">
          <p class="cp-kicker" data-hero-in style="--d:1">
            <span>Concept ${esc(concept.number)}</span>
            <span class="cp-kicker__rule" aria-hidden="true"></span>
            <span class="cp-badge">${icon.check}Selected direction</span>
          </p>
          <h1 class="cp-hero__title" id="cp-title" aria-label="${esc(concept.name)}">${lines}</h1>
          ${tags.length ? `<ul class="cp-tags" aria-label="Design characteristics" data-hero-in style="--d:2">${tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        </div>
        <div class="cp-hero__aside" data-hero-in style="--d:3">
          <p class="cp-hero__lede">${esc(detail.tagline)}</p>
          <div class="cp-hero__actions">
            ${button({ label: 'See the live build', anchor: '#live-preview', iconHtml: icon.down, iconClass: 'btn__icon--down' })}
            ${button({ label: 'View live site', variant: 'secondary', href: concept.websiteUrl, iconHtml: icon.external, iconClass: 'btn__icon--diag' })}
          </div>
          <p class="cp-status"><span class="status-dot" aria-hidden="true"></span><span data-cp-status></span></p>
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------
 * LiveWebsiteFrame — live iframe when the site permits framing,
 * otherwise a scrollable full-page capture + open-live-site actions.
 * ------------------------------------------------------------------ */

const captureData = () =>
  detail.capture?.src ? detail.capture : { src: concept.previewImage, width: 1440, height: 2700, alt: `${concept.name} homepage` };

/* Live iframe only when the site permits framing and the screen is big enough to browse it. */
const embedLive = () => Boolean(safeUrl(concept.websiteUrl) && detail.embeddable && !phone.matches);

const captureNote = () =>
  detail.embeddable
    ? '<strong>Showing a capture on this screen.</strong> The live site is too small to browse comfortably in a frame here, so you’re viewing a capture of its homepage. Open the full website to browse it live.'
    : '<strong>Live embedding unavailable.</strong> This store doesn’t allow itself to be shown inside other pages, so you’re viewing a full-page capture of its homepage. Open the full website to browse it live.';

function captureScreen(cap = captureData()) {
  return `
    <div class="lwf__scroll" data-lwf-scroll tabindex="0" role="region" aria-label="${esc(cap.alt)} — scroll to explore">
      <img class="lwf__img" src="${esc(cap.src)}" alt="${esc(cap.alt)}" width="${cap.width}" height="${cap.height}" decoding="async" data-lwf-img />
    </div>
    <span class="lwf__fade" aria-hidden="true"></span>
    <span class="lwf__cue" aria-hidden="true">Scroll inside ${icon.down}</span>
    <p class="lwf__missing">Preview unavailable — open the full website to browse it.</p>`;
}

function liveWebsiteFrame() {
  const url = safeUrl(concept.websiteUrl);
  const live = embedLive();
  const cap = captureData();
  // A capture shorter than it is wide (e.g. a single-screen homepage) shows whole, never scrolls.
  const short = cap.height / cap.width < 1.1;
  const screen = live
    ? `<div class="lwf__loading" data-lwf-loading><span class="lwf__spinner" aria-hidden="true"></span>Loading the live site…</div>
       <iframe class="lwf__iframe" src="${esc(url)}" title="${esc(concept.name)} live website preview" loading="lazy" data-lwf-iframe></iframe>`
    : captureScreen(cap);

  return `
  <div class="lwf" data-lwf data-mode="${live ? 'live' : 'capture'}" data-capture="${short ? 'short' : 'tall'}">
    <div class="lwf__stage">
      <div class="lwf__frame" data-lwf-frame data-cp-reveal="frame">
        <div class="lwf__bar">
          <span class="preview__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="lwf__url"><span>${url ? esc(displayUrl(url)) : 'Live link coming soon'}</span></span>
          ${url ? `<a class="lwf__open" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open ${icon.external}<span class="sr-only"> the ${esc(concept.name)} website in a new tab</span></a>` : '<span></span>'}
        </div>
        <div class="lwf__screen" data-lwf-screen>${screen}</div>
      </div>
    </div>
    <div class="lwf__foot">
      <p class="lwf__note" data-lwf-note ${live ? 'hidden' : ''}>
        <span class="lwf__note-icon">${icon.info}</span>
        <span data-lwf-note-text>${captureNote()}</span>
      </p>
      <div class="lwf__actions">
        <button type="button" class="btn btn--secondary lwf__expand" data-lwf-expand aria-expanded="false" ${live || short ? 'hidden' : ''}>
          <span class="btn__label">Show full capture</span><span class="btn__icon btn__icon--down">${icon.down}</span>
        </button>
        ${button({ label: 'Open full website', href: concept.websiteUrl, iconHtml: icon.external, iconClass: 'btn__icon--diag' })}
      </div>
    </div>
  </div>`;
}

function renderStage() {
  const live = embedLive();
  return `
  <section class="cp-stage" id="live-preview" aria-labelledby="cp-stage-title">
    <div class="page-container">
      <div class="cp-stage__head" data-cp-reveal>
        <div class="cp-stage__intro">
          <h2 class="cp-eyebrow" id="cp-stage-title">Live website preview</h2>
          <p class="cp-stage__title">${live ? 'The live homepage, ready to browse.' : 'The complete homepage, as built.'}</p>
        </div>
        <p class="cp-stage__hint">
          <span class="cp-stage__pulse" aria-hidden="true"></span>
          <span class="cp-stage__hint-wide">${live ? 'Live site — browse inside' : 'Full-page capture — scroll inside'}</span>
          <span class="cp-stage__hint-narrow">${live ? 'Live site' : 'Full-page capture'}</span>
        </p>
      </div>
      ${liveWebsiteFrame()}
    </div>
  </section>`;
}

/* Panel ratio follows the capture, clamped so very wide rows don't become thin strips. */
const panelRatio = (s) => Math.min(2.6, Math.max(1.25, (s.width || 1200) / (s.height || 750))).toFixed(3);

function renderWork() {
  const strengths = detail.strengths || [];
  if (!strengths.length) return '';
  const items = strengths
    .map(
      (s, i) => `
      <li class="cp-feature" data-cp-reveal>
        ${
          s.image
            ? `<figure class="cp-feature__media" data-cp-reveal="clip" style="--ar:${panelRatio(s)}">
                <img src="${esc(s.image)}" alt="${esc(s.alt || '')}" width="${s.width || 1200}" height="${s.height || 800}" loading="lazy" decoding="async" data-cp-img />
              </figure>`
            : ''
        }
        <div class="cp-feature__body">
          <p class="cp-feature__meta"><span class="cp-feature__num">${pad(i + 1)}</span>${s.label ? `<span class="cp-feature__label">${esc(s.label)}</span>` : ''}</p>
          <h3 class="cp-feature__title">${esc(s.title)}</h3>
          <p class="cp-feature__text">${esc(s.text)}</p>
        </div>
      </li>`,
    )
    .join('');

  return `
  <section class="cp-work" aria-labelledby="cp-work-title">
    <div class="page-container">
      <div class="cp-work__head">
        <p class="eyebrow" data-cp-reveal>Design review</p>
        <h2 class="cp-work__title" id="cp-work-title" data-cp-reveal>What makes this direction work</h2>
        <p class="cp-work__intro" data-cp-reveal>The details worth looking for as you browse the live build — each shown as it appears on the ${esc(concept.name)} website.</p>
      </div>
      <ol class="cp-work__list">${items}</ol>
    </div>
  </section>`;
}

function renderBuild() {
  const pages = (concept.pages || []).filter((p) => p && p.name);
  if (!pages.length) return '';
  const rows = pages
    .map((page, i) => {
      const url = safeUrl(page.url);
      const num = `<span class="cp-page__num">${pad(i + 1)}</span>`;
      const name = `<span class="cp-page__name">${esc(page.name)}</span>`;
      if (!url) {
        return `<li><a class="cp-page is-disabled" role="link" aria-disabled="true" tabindex="0" data-disabled-link>
          ${num}${name}<span class="cp-page__path">Coming soon</span><span class="cp-page__arrow">${icon.dash}</span></a></li>`;
      }
      return `<li><a class="cp-page" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
        ${num}${name}<span class="cp-page__path">${esc(displayUrl(url))}</span><span class="cp-page__arrow">${icon.external}</span>
        <span class="sr-only"> (opens in a new tab)</span></a></li>`;
    })
    .join('');

  return `
  <section class="cp-build" aria-labelledby="cp-build-title">
    <div class="page-container">
      <div class="cp-build__head">
        <p class="eyebrow" data-cp-reveal>Explore the live build</p>
        <h2 class="cp-build__title" id="cp-build-title" data-cp-reveal>Open each page on the live store.</h2>
        <p class="cp-build__text" data-cp-reveal>Every link opens the real ${esc(concept.name)} website in a new tab, so this presentation stays open.</p>
      </div>
      <ul class="cp-build__list" data-cp-reveal>${rows}</ul>
    </div>
  </section>`;
}

function renderDecision() {
  // Next concept in review order; the last one loops back to the first.
  const index = concepts.findIndex((c) => c.id === concept.id);
  const next = concepts[(index + 1) % concepts.length];
  return `
  <section class="cp-decide" id="decide" aria-labelledby="cp-decide-title">
    <div class="page-container">
      <div class="cp-decide__panel ${detail.panel === 'dark' ? 'theme-dark' : 'glass glass-strong'}" data-cp-reveal>
        <div class="cp-decide__copy">
          <p class="cp-eyebrow">Your decision</p>
          <h2 class="cp-decide__title" id="cp-decide-title">Ready to choose?</h2>
          <p class="cp-decide__text" data-cp-decide-text></p>
        </div>
        <div class="cp-decide__actions">
          ${button({ label: 'Select this direction', iconHtml: icon.right, block: true, attrs: `data-select="${esc(concept.id)}"` })}
          ${
            next && next.id !== concept.id
              ? button({
                  label: `View ${next.name}`,
                  variant: 'secondary',
                  anchor: conceptPath(next),
                  iconHtml: icon.right,
                  block: true,
                  attrs: `data-next-concept aria-label="Next concept: ${esc(next.number)} ${esc(next.name)}"`,
                })
              : ''
          }
          <a class="cp-compare" href="/#review">Compare all directions ${icon.right}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function renderFooter() {
  return `
  <footer class="footer" data-inertable>
    <div class="page-container footer__inner">
      <p class="footer__brand"><span class="brand__glyph" aria-hidden="true"></span>${esc(site.brand.mark)}</p>
      <p class="footer__note">Concept ${esc(concept.number)} — ${esc(concept.name)}</p>
      <p class="footer__tagline">${esc(site.footer.tagline)}</p>
      <a class="footer__top" href="#main">Back to top ${icon.up}</a>
    </div>
  </footer>`;
}

function render() {
  $('#app').innerHTML = `
  <div class="cp cp--${theme}" data-cp>
    <div class="cp-atmos cp-atmos--${theme}" aria-hidden="true" data-atmos>${ATMOSPHERE[theme]}</div>
    <div class="cp-content">
      ${renderHeader()}
      <main id="main" data-inertable>
        ${renderHero()}
        ${renderStage()}
        ${renderWork()}
        ${renderBuild()}
        ${renderDecision()}
      </main>
      ${renderFooter()}
      ${renderOverlays()}
    </div>
  </div>`;
}

/* ------------------------------------------------------------------
 * Selection UI (shared state, key and modal from shared.js)
 * ------------------------------------------------------------------ */

function applySelection() {
  const selected = conceptById(state.selected);
  const isThis = state.selected === concept.id;
  document.documentElement.classList.toggle('has-selection', Boolean(selected));
  $('[data-cp]').classList.toggle('is-selected', isThis);

  $$('[data-select]').forEach((btn) => {
    const c = conceptById(btn.dataset.select);
    const on = btn.dataset.select === state.selected;
    btn.classList.toggle('is-selected', on);
    $('.btn__label', btn).textContent = on ? 'Selected direction' : 'Select this direction';
    $('.btn__icon', btn).innerHTML = on ? icon.check : icon.right;
    btn.setAttribute('aria-label', on ? `${c.name} is your selected direction. View selection` : `Select ${c.name} as your design direction`);
  });

  $$('[data-cp-nav]').forEach((link) => {
    const on = link.dataset.cpNav === state.selected;
    link.classList.toggle('is-chosen', on);
    $('[data-cp-nav-state]', link).textContent = on ? ' (selected direction)' : '';
  });

  $$('[data-cp-status]').forEach((el) => {
    el.textContent = isThis ? 'Your selected direction' : selected ? `${selected.name} is currently selected` : 'Awaiting selection';
  });

  const text = $('[data-cp-decide-text]');
  if (text) {
    text.textContent = isThis
      ? `${concept.name} is your selected direction. You can still change it at any time before development begins.`
      : selected
        ? `You’ve currently selected ${selected.name}. Choose ${concept.name} instead if it feels more like the brand.`
        : `If ${concept.name} feels most like the brand, select it as the direction to develop.`;
  }
}

/* ------------------------------------------------------------------
 * Live website frame behaviour
 * ------------------------------------------------------------------ */

function bindCapture(root) {
  const scroller = $('[data-lwf-scroll]', root);
  const img = $('[data-lwf-img]', root);
  if (!scroller || !img) return;

  scroller.addEventListener('scroll', () => root.classList.toggle('is-scrolled', scroller.scrollTop > 40), { passive: true });

  // Missing capture → fall back to the homepage preview image, then to a message.
  const fallbackSrc = concept.previewImage;
  const onError = () => {
    if (fallbackSrc && !img.dataset.fallback) {
      img.dataset.fallback = 'true';
      img.width = 1440;
      img.height = 2700;
      img.src = fallbackSrc;
    } else {
      root.classList.add('is-missing');
    }
  };
  img.addEventListener('error', onError);
  if (img.complete && img.naturalWidth === 0 && img.currentSrc) onError();
}

function fallbackToCapture(root) {
  root.dataset.mode = 'capture';
  $('[data-lwf-screen]', root).innerHTML = captureScreen();
  $('[data-lwf-note-text]', root).innerHTML =
    '<strong>Live preview unavailable right now.</strong> The live site didn’t load in time, so you’re viewing a capture of its homepage. Open the full website to browse it live.';
  $('[data-lwf-note]', root).hidden = false;
  $('[data-lwf-expand]', root).hidden = root.dataset.capture === 'short';
  bindCapture(root);
}

/* Crossing the phone breakpoint swaps live iframe ⇄ capture in place. */
function setupStageSwap() {
  if (!detail.embeddable) return;
  phone.addEventListener('change', () => {
    const stage = $('.cp-stage');
    if (!stage) return;
    stage.outerHTML = renderStage();
    $$('.cp-stage [data-cp-reveal]').forEach((el) => el.classList.add('is-in', 'is-settled'));
    setupFrame();
    bindTilt($('[data-lwf-frame]'));
  });
}

function setupFrame() {
  const root = $('[data-lwf]');
  if (!root) return;
  const iframe = $('[data-lwf-iframe]', root);
  if (iframe) {
    // Browsers still fire `load` for frames blocked by X-Frame-Options / CSP, so
    // blocking can't be detected here — `embeddable` in config.js is the source
    // of truth. This timer only covers a live site that never responds.
    let loaded = false;
    const timer = window.setTimeout(() => {
      if (!loaded) fallbackToCapture(root);
    }, 15000);
    iframe.addEventListener(
      'load',
      () => {
        loaded = true;
        window.clearTimeout(timer);
        $('[data-lwf-loading]', root)?.remove();
      },
      { once: true },
    );
  }
  bindCapture(root);
}

/* Phones: the capture is shown collapsed (no nested scrolling) and expands in place. */
function toggleCapture(btn) {
  const root = btn.closest('[data-lwf]');
  const open = !root.classList.contains('is-expanded');
  root.classList.toggle('is-expanded', open);
  btn.setAttribute('aria-expanded', String(open));
  $('.btn__label', btn).textContent = open ? 'Collapse capture' : 'Show full capture';
  const iconEl = $('.btn__icon', btn);
  iconEl.innerHTML = open ? icon.up : icon.down;
  iconEl.classList.toggle('btn__icon--down', !open);
  iconEl.classList.toggle('btn__icon--up', open);
  const scroller = $('[data-lwf-scroll]', root);
  if (scroller) scroller.scrollTop = 0;
  if (!open) $('[data-lwf-frame]', root).scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

/* ------------------------------------------------------------------
 * Depth: pointer tilt on the browser frame (desktop mouse only, ≤1.5deg)
 * ------------------------------------------------------------------ */

const tiltEnabled = () => finePointer.matches && !reducedMotion.matches && window.innerWidth >= 768;

const clearTilt = (frame) => {
  frame.style.removeProperty('--rx');
  frame.style.removeProperty('--ry');
};

function bindTilt(frame) {
  if (!frame) return;
  let pointer = null;
  let raf = 0;

  // After the entrance, tilt uses a short transition instead of the long reveal one.
  frame.addEventListener('transitionend', (event) => {
    if (event.target === frame && event.propertyName === 'transform' && frame.classList.contains('is-in')) {
      frame.classList.add('is-settled');
    }
  });
  if (reducedMotion.matches) frame.classList.add('is-settled');

  const flush = () => {
    raf = 0;
    if (!pointer || !tiltEnabled()) return;
    const rect = frame.getBoundingClientRect();
    const px = Math.max(-0.5, Math.min(0.5, (pointer.x - rect.left) / rect.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (pointer.y - rect.top) / rect.height - 0.5));
    const amount = window.innerWidth < 1100 ? 0.7 : 1; // tablets: ≤1deg
    frame.style.setProperty('--ry', `${(px * 3 * amount).toFixed(2)}deg`); // max 1.5deg
    frame.style.setProperty('--rx', `${(-py * 2 * amount).toFixed(2)}deg`); // max 1deg
  };

  frame.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse' || !tiltEnabled()) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!raf) raf = requestAnimationFrame(flush);
    },
    { passive: true },
  );
  frame.addEventListener('pointerleave', () => {
    pointer = null;
    clearTilt(frame);
  });
}

function setupTilt() {
  bindTilt($('[data-lwf-frame]'));
  const reset = () => {
    const frame = $('[data-lwf-frame]');
    if (frame && !tiltEnabled()) clearTilt(frame);
  };
  reducedMotion.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
  window.addEventListener('resize', reset, { passive: true });
}

/* ------------------------------------------------------------------
 * Scroll: header state, progress line, gentle atmosphere parallax
 * ------------------------------------------------------------------ */

function setupScroll() {
  const header = $('[data-header]');
  const bar = $('[data-progress]');
  const atmos = $('[data-atmos]');
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;
    const parallax = !reducedMotion.matches && window.innerWidth >= 700;
    atmos.style.setProperty('--sy', parallax ? String(Math.round(Math.min(y, 2400))) : '0');
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update, { passive: true });
  update();
}

function bindImageFallbacks() {
  $$('[data-cp-img]').forEach((img) => {
    const fail = () => img.closest('figure')?.classList.add('is-missing');
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
    img.addEventListener('error', fail, { once: true });
  });
}

/* ------------------------------------------------------------------
 * Events
 * ------------------------------------------------------------------ */

function bindEvents() {
  document.addEventListener('click', (event) => {
    const target = event.target;

    if (target.closest('[data-disabled-link]')) {
      event.preventDefault();
      toast('This link hasn’t been added yet', 'info');
      return;
    }

    const select = target.closest('[data-select]');
    if (select) {
      startSelection(select.dataset.select, select);
      return;
    }

    if (target.closest('[data-modal-confirm]')) {
      confirmSelection();
      return;
    }

    const copy = target.closest('[data-copy]');
    if (copy) {
      copySelection(copy);
      return;
    }

    if (target.closest('[data-modal-close]')) {
      closeModal();
      return;
    }

    const expand = target.closest('[data-lwf-expand]');
    if (expand) toggleCapture(expand);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.closest?.('[data-disabled-link]')) {
      event.preventDefault();
      toast('This link hasn’t been added yet', 'info');
    }
    if (modal.open) handleModalKeys(event);
  });

  // Same key as the homepage: stay in sync across tabs and back/forward navigation.
  const sync = () => {
    state.selected = readSelection();
    applySelection();
  };
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) sync();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) sync();
  });
}

/* ------------------------------------------------------------------
 * Boot
 * ------------------------------------------------------------------ */

function init() {
  if (!concept || !detail) {
    window.location.replace('/#concepts');
    return;
  }

  document.title = `${concept.name} — Concept ${concept.number} · ${site.title}`;
  if (detail.themeColor) $('meta[name="theme-color"]')?.setAttribute('content', detail.themeColor);

  render();
  initModal();
  configureSelection({ apply: applySelection });
  applySelection();
  bindEvents();
  setupFrame();
  bindImageFallbacks();
  setupScroll();
  setupReveal('[data-cp-reveal]');
  setupTilt();
  setupStageSwap();

  const start = () => document.body.classList.add('is-loaded');
  if (document.fonts?.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(start);
  else start();
}

init();
