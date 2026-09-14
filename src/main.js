import './style.css';
import { site, concepts } from './config.js';

/* ------------------------------------------------------------------
 * Utilities
 * ------------------------------------------------------------------ */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

const pad = (n) => String(n).padStart(2, '0');

/** Returns a normalised http(s) URL, or null if the value is empty / a placeholder / invalid. */
function safeUrl(value) {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!url || url === '#' || /^paste/i.test(url)) return null;
  try {
    const parsed = new URL(url, window.location.href);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

function displayUrl(href) {
  const { host, pathname } = new URL(href);
  return (host + pathname).replace(/\/$/, '');
}

function shortPath(href) {
  const { host, pathname } = new URL(href);
  return pathname === '/' ? host : pathname.replace(/\/$/, '');
}

const conceptById = (id) => concepts.find((c) => c.id === id) || null;

/* ------------------------------------------------------------------
 * Icons (inline SVG, inherit currentColor)
 * ------------------------------------------------------------------ */

const svg = (paths, size = 16) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${paths}</svg>`;

const icon = {
  external: svg('<path d="M4.5 11.5l7-7M5.75 4.5h5.75v5.75" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  down: svg('<path d="M8 2.5v11M3.75 9.25L8 13.5l4.25-4.25" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  up: svg('<path d="M8 13.5v-11M3.75 6.75L8 2.5l4.25 4.25" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  right: svg('<path d="M2.5 8h11M9.25 3.75L13.5 8l-4.25 4.25" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  check: svg('<path d="M3 8.5l3.25 3.25L13 5" fill="none" stroke="currentColor" stroke-width="1.6"/>'),
  copy: svg('<rect x="5.5" y="5.5" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 10.5v-8h8" fill="none" stroke="currentColor" stroke-width="1.3"/>'),
  close: svg('<path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.4"/>'),
  info: svg('<path d="M8 7v5M8 4.5v.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'),
  dash: svg('<path d="M4 8h8" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
};

/* ------------------------------------------------------------------
 * Shared button component
 *  - href    → external link (new tab), disabled if the URL is missing
 *  - anchor  → in-page link (e.g. "#review")
 *  - neither → <button>
 * ------------------------------------------------------------------ */

function button({ label, variant = 'primary', href, anchor, iconHtml = '', iconClass = '', block = false, attrs = '' }) {
  const classes = ['btn', `btn--${variant}`, block && 'btn--block'].filter(Boolean).join(' ');
  const inner = `<span class="btn__label">${esc(label)}</span>${
    iconHtml ? `<span class="btn__icon ${iconClass}">${iconHtml}</span>` : ''
  }`;

  if (href !== undefined) {
    const url = safeUrl(href);
    if (!url) {
      return `<a class="${classes} is-disabled" role="link" aria-disabled="true" tabindex="0" data-disabled-link ${attrs}>
        <span class="btn__label">${esc(label)}</span><span class="btn__note">Coming soon</span></a>`;
    }
    return `<a class="${classes}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${attrs}>${inner}<span class="sr-only"> (opens in a new tab)</span></a>`;
  }
  if (anchor) return `<a class="${classes}" href="${esc(anchor)}" ${attrs}>${inner}</a>`;
  return `<button type="button" class="${classes}" ${attrs}>${inner}</button>`;
}

/* ------------------------------------------------------------------
 * Media (screenshot with graceful fallback)
 * ------------------------------------------------------------------ */

function media(concept, { className = '', alt = '', loading = 'lazy' } = {}) {
  const src = typeof concept.previewImage === 'string' ? concept.previewImage.trim() : '';
  return `<span class="media ${className} ${src ? '' : 'is-missing'}" data-media>
    ${src ? `<img class="media__img" src="${esc(src)}" alt="${esc(alt)}" loading="${loading}" decoding="async" width="1440" height="2700" />` : ''}
    <span class="media__fallback" aria-hidden="true">
      <span class="media__fallback-num">${esc(concept.number)}</span>
      <span class="media__fallback-name">${esc(concept.name)}</span>
      <span class="media__fallback-note">Preview image coming soon</span>
    </span>
  </span>`;
}

/* ------------------------------------------------------------------
 * Templates
 * ------------------------------------------------------------------ */

function renderHeader() {
  const { brand, nav, status } = site;
  const links = nav
    .map((item) => `<li><a class="nav__link" href="#${esc(item.target)}">${esc(item.label)}</a></li>`)
    .join('');
  const mobileLinks = nav
    .map(
      (item, i) => `<li><a class="mobile-menu__link" href="#${esc(item.target)}" data-menu-link>
        <span class="mobile-menu__num">${pad(i + 1)}</span>${esc(item.label)}</a></li>`,
    )
    .join('');

  return `
  <div class="progress" aria-hidden="true"><span class="progress__bar" data-progress></span></div>
  <header class="header" data-header data-inertable>
    <div class="page-container header__inner">
      <a class="brand" href="#project">
        <span class="brand__glyph" aria-hidden="true"></span>
        <span class="brand__mark">${esc(brand.mark)}</span>
        ${brand.project ? `<span class="brand__divider" aria-hidden="true">/</span><span class="brand__project">${esc(brand.project)}</span>` : ''}
      </a>
      <div class="header__right">
        <nav aria-label="Primary"><ul class="nav">${links}</ul></nav>
        ${status ? `<span class="pill"><span class="pill__dot" aria-hidden="true"></span>${esc(status)}</span>` : ''}
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
          <span class="menu-toggle__label">Menu</span><span class="menu-toggle__lines" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu" hidden data-menu>
      <nav aria-label="Mobile"><ul class="mobile-menu__list">${mobileLinks}</ul></nav>
      ${status ? `<p class="mobile-menu__status"><span class="pill"><span class="pill__dot" aria-hidden="true"></span>${esc(status)}</span><span data-selection-status></span></p>` : ''}
    </div>
  </header>`;
}

function renderHero() {
  const { hero } = site;
  const lines = hero.heading
    .map(
      (line, i) =>
        `<span class="line"><span class="line__inner" style="--i:${i}">${esc(line.text)}</span></span>`,
    )
    .join('');
  const meta = (hero.meta || [])
    .map((m) => `<div class="hero__meta-row"><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`)
    .join('');
  const steps = (hero.steps || [])
    .map(
      (s, i) => `<li class="step" data-hero-in style="--d:${i + 3}">
        <span class="step__num">${esc(s.number)}</span>
        <span class="step__title">${esc(s.title)}</span>
        <span class="step__text">${esc(s.text)}</span>
      </li>`,
    )
    .join('');

  return `
  <section class="hero" id="project" aria-labelledby="hero-title">
    <div class="page-container">
      <div class="hero__top" data-hero-in style="--d:0">
        <p class="eyebrow">${esc(hero.eyebrow)}</p>
        <p class="hero__status"><span class="status-dot" aria-hidden="true"></span><span data-selection-status></span></p>
      </div>
      <div class="hero__grid">
        <h1 class="hero__title" id="hero-title">${lines}</h1>
        <div class="hero__aside" data-hero-in style="--d:1">
          <p class="hero__intro">${esc(hero.intro)}</p>
          ${meta ? `<dl class="hero__meta">${meta}</dl>` : ''}
          <div class="hero__cta">${button({ label: hero.cta, anchor: '#concepts', iconHtml: icon.down, iconClass: 'btn__icon--down' })}</div>
        </div>
      </div>
      ${steps ? `<ol class="steps" aria-label="How this review works">${steps}</ol>` : ''}
    </div>
  </section>`;
}

function renderSubnav() {
  const items = concepts
    .map(
      (c) => `<li><a class="subnav__link" href="#${esc(c.id)}" data-subnav="${esc(c.id)}">
        <span class="subnav__num">${esc(c.number)}</span>
        <span class="subnav__name">${esc(c.name)}</span>
        <span class="subnav__short">Concept ${esc(c.number)}</span>
        <span class="subnav__chosen" aria-hidden="true"></span>
        <span class="sr-only" data-subnav-state></span>
      </a></li>`,
    )
    .join('');

  return `
  <nav class="subnav" aria-label="Concepts" data-inertable>
    <div class="page-container subnav__inner">
      <ul class="subnav__list">
        ${items}
        <li><a class="subnav__link" href="#review" data-subnav="review"><span class="subnav__name subnav__name--always">Review</span></a></li>
      </ul>
      <p class="subnav__selection"><span class="subnav__selection-label">Selected direction</span><span class="subnav__selection-name" data-selection-name></span></p>
    </div>
  </nav>`;
}

function renderPageRow(page, index) {
  const url = safeUrl(page.url);
  const idx = `<span class="page-row__idx">${pad(index + 1)}</span>`;
  const name = `<span class="page-row__name">${esc(page.name)}</span>`;

  if (!url) {
    return `<li><a class="page-row is-disabled" role="link" aria-disabled="true" tabindex="0" data-disabled-link>
      ${idx}${name}<span class="page-row__path page-row__path--soon">Coming soon</span><span class="page-row__arrow">${icon.dash}</span></a></li>`;
  }
  return `<li><a class="page-row" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
    ${idx}${name}<span class="page-row__path">${esc(shortPath(url))}</span><span class="page-row__arrow">${icon.external}</span>
    <span class="sr-only"> (opens in a new tab)</span></a></li>`;
}

function renderPreview(concept) {
  const url = safeUrl(concept.websiteUrl);
  const bar = `<span class="preview__bar" aria-hidden="true">
      <span class="preview__dots"><i></i><i></i><i></i></span>
      <span class="preview__url"><span>${url ? esc(displayUrl(url)) : 'Live link coming soon'}</span></span>
      <span class="preview__open">${url ? `<span class="preview__open-text">Open</span>${icon.external}` : ''}</span>
    </span>`;
  const body = `${bar}<span class="preview__viewport">${media(concept, { alt: concept.previewAlt || `${concept.name} concept preview`, loading: 'eager' })}</span>`;

  return url
    ? `<a class="preview" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="Open the ${esc(concept.name)} live concept (opens in a new tab)">${body}</a>`
    : `<div class="preview">${body}</div>`;
}

function renderConcept(concept, index) {
  const reversed = index % 2 === 1;
  const theme = concept.theme || (reversed ? 'dark' : 'light');
  const traits = (concept.traits || []).filter(Boolean);
  const pages = (concept.pages || []).filter((p) => p && p.name);

  return `
  <section class="concept ${reversed ? 'concept--reverse' : ''} theme-${theme}" id="${esc(concept.id)}"
    data-concept="${esc(concept.id)}" aria-labelledby="${esc(concept.id)}-title">
    <div class="page-container concept__grid">
      <header class="concept__head">
        <div class="concept__kicker" data-reveal>

          <span class="concept__label">${esc(concept.label)}</span>
          <span class="concept__rule" aria-hidden="true"></span>
          <span class="concept__badge">${icon.check}Selected direction</span>
        </div>
        <h3 class="concept__name" id="${esc(concept.id)}-title" data-reveal>${esc(concept.name)}</h3>
        <p class="concept__desc" data-reveal>${esc(concept.description)}</p>
        ${traits.length ? `<ul class="traits" aria-label="Design characteristics" data-reveal>${traits.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      </header>

      <figure class="concept__preview" data-reveal="clip">
        ${renderPreview(concept)}
        <figcaption class="concept__caption">

          <span>${esc(concept.previewCaption || 'Homepage preview')}</span>
          <span class="concept__caption-hint">Hover to scroll the page</span>
        </figcaption>
      </figure>

      <div class="concept__actions">
        <div class="concept__live" data-reveal>${button({ label: 'View live concept', href: concept.websiteUrl, iconHtml: icon.external, iconClass: 'btn__icon--diag', block: true })}</div>
        ${
          pages.length
            ? `<div class="pages" data-reveal>
            <p class="pages__label" id="${esc(concept.id)}-pages"><span>Explore pages</span><span>${pad(pages.length)}</span></p>
            <ul class="pages__list" aria-labelledby="${esc(concept.id)}-pages">${pages.map(renderPageRow).join('')}</ul>
          </div>`
            : ''
        }
        <div class="concept__select" data-reveal>${button({
          label: 'Select this direction',
          variant: 'secondary',
          block: true,
          iconHtml: icon.right,
          attrs: `data-select="${esc(concept.id)}"`,
        })}</div>
      </div>
    </div>
  </section>`;
}

function renderReview() {
  const { review } = site;
  const rows = concepts
    .map(
      (c) => `
      <li class="compare__item" data-compare="${esc(c.id)}" data-reveal>
        <a class="compare__thumb" href="#${esc(c.id)}" tabindex="-1" aria-hidden="true">${media(c)}</a>
        <div class="compare__title">
          <p class="compare__index"><span class="compare__num">${esc(c.number)}</span><span aria-hidden="true">—</span><span>${esc(c.label)}</span></p>
          <h3 class="compare__name">${esc(c.name)}</h3>
        </div>
        <div class="compare__meta">
          ${c.traits?.length ? `<p class="compare__traits">${c.traits.map(esc).join('<span aria-hidden="true"> · </span>')}</p>` : ''}
          <p class="compare__status"><span class="status-dot" aria-hidden="true"></span><span data-compare-status></span></p>
        </div>
        <div class="compare__actions">
          ${button({ label: 'Revisit', variant: 'secondary', href: c.websiteUrl, iconHtml: icon.external, iconClass: 'btn__icon--diag', attrs: `aria-label="Revisit the ${esc(c.name)} website (opens in a new tab)"` })}
          ${button({ label: 'Select this direction', variant: 'primary', iconHtml: icon.right, attrs: `data-select="${esc(c.id)}"` })}
        </div>
      </li>`,
    )
    .join('');

  return `
  <section class="review" id="review" aria-labelledby="review-title">
    <div class="page-container">
      <div class="review__head">
        <p class="eyebrow" data-reveal>${esc(review.eyebrow)}</p>
        <h2 class="review__title" id="review-title" data-reveal>${esc(review.heading)}</h2>
        <p class="review__text" data-reveal>${esc(review.text)}</p>
      </div>
      <ul class="compare" aria-label="Concept comparison">${rows}</ul>
    </div>
  </section>`;
}

function renderFinal() {
  const { finalCta } = site;
  return `
  <section class="final theme-dark" aria-labelledby="final-title">
    <div class="page-container final__inner">
      <p class="eyebrow" data-reveal>${esc(finalCta.eyebrow)}</p>
      <h2 class="final__title" id="final-title" data-reveal data-final-title></h2>
      <p class="final__text" data-reveal data-final-text></p>
      <div class="final__actions" data-reveal>
        <div class="final__group" data-when="none">
          ${button({ label: 'Review the concepts', anchor: '#concepts', iconHtml: icon.up, iconClass: 'btn__icon--up' })}
        </div>
        <div class="final__group" data-when="selected" hidden>
          ${button({ label: 'Copy selection', iconHtml: icon.copy, attrs: 'data-copy' })}
          ${button({ label: 'Change direction', variant: 'secondary', anchor: '#review', iconHtml: icon.up, iconClass: 'btn__icon--up' })}
        </div>
      </div>
    </div>
  </section>`;
}

function renderFooter() {
  const { brand, footer } = site;
  return `
  <footer class="footer theme-dark" data-inertable>
    <div class="page-container footer__inner">
      <p class="footer__brand"><span class="brand__glyph" aria-hidden="true"></span>${esc(brand.mark)}</p>
      <p class="footer__note">${esc(footer.note)}${brand.project ? ` <span>${esc(brand.project)}</span>` : ''}</p>
      <p class="footer__tagline">${esc(footer.tagline)}</p>
      <a class="footer__top" href="#project">Back to top ${icon.up}</a>
    </div>
  </footer>`;
}

function renderOverlays() {
  return `
  <div class="modal" data-modal hidden>
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc" tabindex="-1" data-modal-panel>
      <button class="modal__close" type="button" aria-label="Close" data-modal-close>${icon.close}</button>
      <div data-modal-content></div>
    </div>
  </div>
  <div class="toasts" role="status" aria-live="polite" aria-atomic="false" data-toasts></div>`;
}

function render() {
  document.title = site.title || document.title;
  const bgImage = site.background?.image?.trim();
  $('#app').innerHTML = `
    ${bgImage ? `<div class="site-background" aria-hidden="true" style="background-image:url('${esc(bgImage)}')"></div>` : ''}
    <div class="site-background-overlay" aria-hidden="true"></div>
    ${renderHeader()}
    <main id="main" data-inertable>
      ${renderHero()}
      ${renderSubnav()}
      <div class="concepts" id="concepts">
        <div class="concepts-intro">
          <div class="page-container concepts-intro__inner">
            <p class="eyebrow" data-reveal>${esc(site.conceptsIntro.eyebrow)}</p>
            <h2 class="concepts-intro__title" data-reveal>${esc(site.conceptsIntro.heading)}</h2>
            <p class="concepts-intro__count" data-reveal aria-hidden="true">${pad(concepts.length)}</p>
          </div>
        </div>
        ${concepts.map(renderConcept).join('')}
      </div>
      ${renderReview()}
      ${renderFinal()}
    </main>
    ${renderFooter()}
    ${renderOverlays()}
  `;
}

/* ------------------------------------------------------------------
 * Selection state (localStorage)
 * ------------------------------------------------------------------ */

const storageKey = site.selection?.storageKey || 'design-review:selection';
const state = { selected: readSelection() };

function readSelection() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    let id = null;
    try {
      const data = JSON.parse(raw);
      id = typeof data === 'string' ? data : data?.id;
    } catch {
      id = raw;
    }
    if (conceptById(id)) return id;
    // Stale or unknown value (e.g. a concept that has since been replaced): reset it.
    window.localStorage.removeItem(storageKey);
    return null;
  } catch {
    return null;
  }
}

function writeSelection(id) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ id, selectedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

function copyText(concept) {
  const template = site.selection?.copyTemplate || 'Selected design direction:\nConcept {number} — {name}';
  return template
    .replaceAll('{number}', concept.number)
    .replaceAll('{label}', concept.label)
    .replaceAll('{name}', concept.name)
    .replaceAll('{project}', site.brand?.project || '');
}

function applySelection() {
  const selected = conceptById(state.selected);
  document.documentElement.classList.toggle('has-selection', Boolean(selected));

  $$('[data-concept]').forEach((el) => el.classList.toggle('is-selected', el.dataset.concept === state.selected));

  $$('[data-compare]').forEach((el) => {
    const on = el.dataset.compare === state.selected;
    el.classList.toggle('is-selected', on);
    $('[data-compare-status]', el).textContent = on ? 'Selected direction' : selected ? 'Not selected' : 'Awaiting decision';
  });

  $$('[data-select]').forEach((btn) => {
    const concept = conceptById(btn.dataset.select);
    const on = btn.dataset.select === state.selected;
    btn.classList.toggle('is-selected', on);
    $('.btn__label', btn).textContent = on ? 'Selected' : 'Select this direction';
    $('.btn__icon', btn).innerHTML = on ? icon.check : icon.right;
    btn.setAttribute(
      'aria-label',
      on ? `${concept.name} is your selected direction. View selection` : `Select ${concept.name} as your design direction`,
    );
  });

  $$('[data-subnav]').forEach((link) => {
    const on = link.dataset.subnav === state.selected;
    link.classList.toggle('is-chosen', on);
    const sr = $('[data-subnav-state]', link);
    if (sr) sr.textContent = on ? ' (selected direction)' : '';
  });

  $$('[data-selection-status]').forEach((el) => {
    el.textContent = selected ? `${selected.name} selected` : 'Awaiting selection';
  });
  $$('[data-selection-name]').forEach((el) => {
    el.textContent = selected ? `${selected.number} — ${selected.name}` : 'None yet';
  });

  // Final CTA
  const { finalCta } = site;
  const title = $('[data-final-title]');
  if (selected) {
    const [before, after = ''] = finalCta.headingSelected.split('{name}');
    title.innerHTML = `${esc(before)}<em>${esc(selected.name)}</em>${esc(after)}`;
  } else {
    title.textContent = finalCta.headingNone;
  }
  $('[data-final-text]').textContent = selected ? finalCta.textSelected : finalCta.textNone;
  $$('[data-when]').forEach((el) => {
    el.hidden = el.dataset.when !== (selected ? 'selected' : 'none');
  });
}

/* ------------------------------------------------------------------
 * Modal (focus-trapped, ESC + backdrop close, focus return)
 * ------------------------------------------------------------------ */

const modal = {
  el: null,
  panel: null,
  content: null,
  trigger: null,
  pendingId: null,
  open: false,
  hideTimer: 0,
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function modalConfirmMarkup(concept, previous) {
  const change = Boolean(previous);
  return `
    <div class="modal__media">${media(concept, { loading: 'eager' })}</div>
    <div class="modal__body">
      <p class="modal__eyebrow">Concept ${esc(concept.number)}${change ? ' · Change of direction' : ''}</p>
      <h2 class="modal__title" id="modal-title">${
        change ? `Change your selected direction to <em>${esc(concept.name)}</em>?` : `You’ve selected <em>${esc(concept.name)}</em>.`
      }</h2>
      <p class="modal__text" id="modal-desc">${
        change
          ? `This replaces <strong>${esc(previous.name)}</strong> as your preferred direction. You can change it again at any time.`
          : 'Confirm to save this as your preferred design direction. You can change it at any time.'
      }</p>
      <div class="modal__actions">
        ${button({ label: 'Confirm selection', iconHtml: icon.check, attrs: 'data-modal-confirm' })}
        ${button({ label: 'Cancel', variant: 'secondary', attrs: 'data-modal-close' })}
      </div>
    </div>`;
}

function modalConfirmedMarkup(concept) {
  return `
    <div class="modal__body modal__body--confirmed">
      <span class="modal__seal" aria-hidden="true">${svg('<path d="M3 8.5l3.25 3.25L13 5" fill="none" stroke="currentColor" stroke-width="1.6"/>', 22)}</span>
      <p class="modal__eyebrow">Selected direction</p>
      <h2 class="modal__title" id="modal-title">Concept ${esc(concept.number)} — <em>${esc(concept.name)}</em></h2>
      <p class="modal__text" id="modal-desc">Your choice is saved on this device. Copy it below to send your decision back — you can change direction at any time.</p>
      <p class="modal__summary">${esc(copyText(concept))}</p>
      <div class="modal__actions">
        ${button({ label: 'Copy selection', iconHtml: icon.copy, attrs: 'data-copy' })}
        ${button({ label: 'Done', variant: 'secondary', attrs: 'data-modal-close' })}
      </div>
    </div>`;
}

function setModalContent(markup) {
  modal.content.innerHTML = markup;
  bindMediaFallbacks(modal.content);
}

function openModal(trigger) {
  modal.trigger = trigger || document.activeElement;
  window.clearTimeout(modal.hideTimer);
  modal.open = true;
  modal.el.hidden = false;

  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-gap', `${scrollbar}px`);
  document.documentElement.classList.add('is-locked');
  $$('[data-inertable]').forEach((el) => el.setAttribute('inert', ''));
  closeMenu();

  // Force a frame so the enter transition runs.
  void modal.el.offsetWidth;
  modal.el.classList.add('is-open');
  focusFirstInModal();
}

function focusFirstInModal() {
  const primary = $('[data-modal-confirm], [data-copy]', modal.content);
  (primary || modal.panel).focus({ preventScroll: true });
}

function closeModal() {
  if (!modal.open) return;
  modal.open = false;
  modal.pendingId = null;
  modal.el.classList.remove('is-open');
  $$('[data-inertable]').forEach((el) => el.removeAttribute('inert'));
  document.documentElement.classList.remove('is-locked');

  const finish = () => {
    modal.el.hidden = true;
    modal.content.innerHTML = '';
  };
  if (reducedMotion.matches) finish();
  else modal.hideTimer = window.setTimeout(finish, 380);

  const target = modal.trigger;
  if (target && target.isConnected && typeof target.focus === 'function') target.focus({ preventScroll: true });
}

function handleModalKeys(event) {
  if (!modal.open) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusables = $$(FOCUSABLE, modal.panel).filter((el) => el.offsetParent !== null || el === document.activeElement);
  if (!focusables.length) {
    event.preventDefault();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || active === modal.panel || !modal.panel.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !modal.panel.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

function startSelection(id, trigger) {
  const concept = conceptById(id);
  if (!concept) return;

  if (state.selected === id) {
    setModalContent(modalConfirmedMarkup(concept));
  } else {
    modal.pendingId = id;
    setModalContent(modalConfirmMarkup(concept, conceptById(state.selected)));
  }
  openModal(trigger);
}

function confirmSelection() {
  const concept = conceptById(modal.pendingId);
  if (!concept) return;

  state.selected = concept.id;
  modal.pendingId = null;
  const saved = writeSelection(concept.id);
  applySelection();

  setModalContent(modalConfirmedMarkup(concept));
  focusFirstInModal();
  toast(
    saved ? `${concept.name} saved as your selected direction` : `${concept.name} selected (couldn’t save on this device)`,
    saved ? 'success' : 'info',
  );
}

/* ------------------------------------------------------------------
 * Clipboard
 * ------------------------------------------------------------------ */

function legacyCopy(text) {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.append(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

async function copySelection(trigger) {
  const concept = conceptById(state.selected);
  if (!concept) {
    toast('Select a direction first', 'info');
    return;
  }
  const text = copyText(concept);
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch {
    ok = legacyCopy(text);
  }
  // Keep focus inside the modal after the fallback textarea steals it.
  if (trigger?.isConnected) trigger.focus({ preventScroll: true });

  toast(ok ? 'Selection copied to clipboard' : 'Clipboard unavailable — please copy the text manually', ok ? 'success' : 'info');

  if (ok && trigger) {
    const label = $('.btn__label', trigger);
    const iconEl = $('.btn__icon', trigger);
    label.textContent = 'Copied';
    iconEl.innerHTML = icon.check;
    window.clearTimeout(trigger._resetTimer);
    trigger._resetTimer = window.setTimeout(() => {
      label.textContent = 'Copy selection';
      iconEl.innerHTML = icon.copy;
    }, 2000);
  }
}

/* ------------------------------------------------------------------
 * Toasts
 * ------------------------------------------------------------------ */

function toast(message, tone = 'success') {
  const region = $('[data-toasts]');
  const el = document.createElement('div');
  el.className = `toast toast--${tone}`;
  el.innerHTML = `<span class="toast__icon">${tone === 'success' ? icon.check : icon.info}</span><span>${esc(message)}</span>`;
  region.append(el);

  while (region.children.length > 2) region.firstElementChild.remove();

  requestAnimationFrame(() => el.classList.add('is-in'));
  window.setTimeout(() => {
    el.classList.remove('is-in');
    window.setTimeout(() => el.remove(), reducedMotion.matches ? 0 : 450);
  }, 3400);
}

/* ------------------------------------------------------------------
 * Mobile menu
 * ------------------------------------------------------------------ */

function openMenu() {
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  menu.hidden = false;
  void menu.offsetWidth;
  menu.classList.add('is-open');
  toggle.setAttribute('aria-expanded', 'true');
  $('[data-header]').classList.add('menu-open');
}

function closeMenu({ returnFocus = false } = {}) {
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  if (!menu || menu.hidden) return;
  menu.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  $('[data-header]').classList.remove('menu-open');
  window.setTimeout(() => {
    if (!menu.classList.contains('is-open')) menu.hidden = true;
  }, reducedMotion.matches ? 0 : 300);
  if (returnFocus) toggle.focus();
}

/* ------------------------------------------------------------------
 * Scroll effects: header state, progress line, active sub-nav
 * ------------------------------------------------------------------ */

function setupScrollEffects() {
  const header = $('[data-header]');
  const bar = $('[data-progress]');
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;
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

  if (!('IntersectionObserver' in window)) return;

  const links = $$('[data-subnav]');
  const setActive = (id) => {
    links.forEach((link) => {
      if (link.dataset.subnav === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    $$('.nav__link').forEach((link) => {
      const target = link.getAttribute('href').slice(1);
      const on = target === id || (target === 'concepts' && conceptById(id));
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const sections = [$('#project'), ...concepts.map((c) => document.getElementById(c.id)), $('#review')].filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => observer.observe(s));
}

/* ------------------------------------------------------------------
 * Reveal animations
 * ------------------------------------------------------------------ */

function setupReveal() {
  const els = $$('[data-reveal]');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((entry, i) => {
          const el = entry.target;
          el.style.transitionDelay = `${Math.min(i, 6) * 80}ms`;
          el.classList.add('is-in');
          el.addEventListener('transitionend', () => (el.style.transitionDelay = ''), { once: true });
          observer.unobserve(el);
        });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => observer.observe(el));
}

function bindMediaFallbacks(root = document) {
  $$('[data-media] img', root).forEach((img) => {
    const fail = () => img.closest('[data-media]').classList.add('is-missing');
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

    const disabled = target.closest('[data-disabled-link]');
    if (disabled) {
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

    if (target.closest('[data-menu-toggle]')) {
      const menu = $('[data-menu]');
      if (menu.hidden || !menu.classList.contains('is-open')) openMenu();
      else closeMenu();
      return;
    }

    if (target.closest('[data-menu-link]')) {
      closeMenu();
      return;
    }

    // Click outside the open mobile menu closes it.
    const menu = $('[data-menu]');
    if (menu && !menu.hidden && !target.closest('[data-header]')) closeMenu();
  });

  // Keyboard activation for role="link" disabled items (Enter), matching native links.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.closest?.('[data-disabled-link]')) {
      event.preventDefault();
      toast('This link hasn’t been added yet', 'info');
    }
    if (modal.open) {
      handleModalKeys(event);
      return;
    }
    if (event.key === 'Escape') closeMenu({ returnFocus: true });
  });

  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });

  // Keep multiple open tabs in sync.
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey) return;
    state.selected = readSelection();
    applySelection();
  });
}

/* ------------------------------------------------------------------
 * Boot
 * ------------------------------------------------------------------ */

function init() {
  render();

  modal.el = $('[data-modal]');
  modal.panel = $('[data-modal-panel]');
  modal.content = $('[data-modal-content]');

  applySelection();
  bindMediaFallbacks();
  bindEvents();
  setupScrollEffects();
  setupReveal();

  // Start the hero entrance once fonts are ready (with a short cap so it never stalls).
  const start = () => document.body.classList.add('is-loaded');
  if (document.fonts?.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(start);
  else start();
}

init();
