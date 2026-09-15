/* ------------------------------------------------------------------
 * Shared by the review homepage (main.js) and the concept detail
 * pages (concept-page.js): utilities, icons, buttons, toasts, reveal,
 * and the ONE selection system (localStorage + confirm modal).
 * ------------------------------------------------------------------ */

import { site, concepts } from './config.js';

/* ------------------------------------------------------------------
 * Utilities
 * ------------------------------------------------------------------ */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const pad = (n) => String(n).padStart(2, '0');

/** Returns a normalised http(s) URL, or null if the value is empty / a placeholder / invalid. */
export function safeUrl(value) {
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

export function displayUrl(href) {
  const { host, pathname } = new URL(href);
  return (host + pathname).replace(/\/$/, '');
}

export function shortPath(href) {
  const { host, pathname } = new URL(href);
  return pathname === '/' ? host : pathname.replace(/\/$/, '');
}

export const conceptById = (id) => concepts.find((c) => c.id === id) || null;

/** Internal design-presentation page for a concept. */
export const conceptPath = (concept) => `/concepts/${encodeURIComponent(concept.id)}/`;

/* ------------------------------------------------------------------
 * Icons (inline SVG, inherit currentColor)
 * ------------------------------------------------------------------ */

export const svg = (paths, size = 16) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${paths}</svg>`;

export const icon = {
  external: svg('<path d="M4.5 11.5l7-7M5.75 4.5h5.75v5.75" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  down: svg('<path d="M8 2.5v11M3.75 9.25L8 13.5l4.25-4.25" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  up: svg('<path d="M8 13.5v-11M3.75 6.75L8 2.5l4.25 4.25" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  right: svg('<path d="M2.5 8h11M9.25 3.75L13.5 8l-4.25 4.25" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  left: svg('<path d="M13.5 8h-11M6.75 3.75L2.5 8l4.25 4.25" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
  check: svg('<path d="M3 8.5l3.25 3.25L13 5" fill="none" stroke="currentColor" stroke-width="1.6"/>'),
  copy: svg('<rect x="5.5" y="5.5" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 10.5v-8h8" fill="none" stroke="currentColor" stroke-width="1.3"/>'),
  close: svg('<path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.4"/>'),
  info: svg('<path d="M8 7v5M8 4.5v.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'),
  dash: svg('<path d="M4 8h8" fill="none" stroke="currentColor" stroke-width="1.35"/>'),
};

/* ------------------------------------------------------------------
 * Shared button component
 *  - href    → external link (new tab), disabled if the URL is missing
 *  - anchor  → same-tab link (in-page "#review" or internal route)
 *  - neither → <button>
 * ------------------------------------------------------------------ */

export function button({ label, variant = 'primary', href, anchor, iconHtml = '', iconClass = '', block = false, attrs = '' }) {
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

export function media(concept, { className = '', alt = '', loading = 'lazy' } = {}) {
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

export function bindMediaFallbacks(root = document) {
  $$('[data-media] img', root).forEach((img) => {
    const fail = () => img.closest('[data-media]').classList.add('is-missing');
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
    img.addEventListener('error', fail, { once: true });
  });
}

/* ------------------------------------------------------------------
 * Toasts
 * ------------------------------------------------------------------ */

export function toast(message, tone = 'success') {
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
 * Selection state (localStorage) — one key, one format, every page
 * ------------------------------------------------------------------ */

export const storageKey = site.selection?.storageKey || 'design-review:selection';

export function readSelection() {
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

export function writeSelection(id) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ id, selectedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

export const state = { selected: readSelection() };

export function copyText(concept) {
  const template = site.selection?.copyTemplate || 'Selected design direction:\nConcept {number} — {name}';
  return template
    .replaceAll('{number}', concept.number)
    .replaceAll('{label}', concept.label)
    .replaceAll('{name}', concept.name)
    .replaceAll('{project}', site.brand?.project || '');
}

/**
 * Page hooks: `apply` re-renders the page's selection UI after a change;
 * `beforeOpen` runs before the modal opens (e.g. close a mobile menu).
 */
const hooks = { apply() {}, beforeOpen() {} };

export function configureSelection(options) {
  Object.assign(hooks, options);
}

/* ------------------------------------------------------------------
 * Modal (focus-trapped, ESC + backdrop close, focus return)
 * ------------------------------------------------------------------ */

export const modal = {
  el: null,
  panel: null,
  content: null,
  trigger: null,
  pendingId: null,
  open: false,
  hideTimer: 0,
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initModal() {
  modal.el = $('[data-modal]');
  modal.panel = $('[data-modal-panel]');
  modal.content = $('[data-modal-content]');
}

export function renderOverlays() {
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
  closeConceptMenu();
  hooks.beforeOpen();

  // Force a frame so the enter transition runs.
  void modal.el.offsetWidth;
  modal.el.classList.add('is-open');
  focusFirstInModal();
}

function focusFirstInModal() {
  const primary = $('[data-modal-confirm], [data-copy]', modal.content);
  (primary || modal.panel).focus({ preventScroll: true });
}

export function closeModal() {
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

export function handleModalKeys(event) {
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

export function startSelection(id, trigger) {
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

export function confirmSelection() {
  const concept = conceptById(modal.pendingId);
  if (!concept) return;

  state.selected = concept.id;
  modal.pendingId = null;
  const saved = writeSelection(concept.id);
  hooks.apply();

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

export async function copySelection(trigger) {
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
 * Concepts menu — one scalable control for any number of concepts,
 * shared by the homepage sub-nav and every concept page header.
 *  variant 'home'   → items jump to the homepage sections (#id)
 *  variant 'detail' → items open each concept page
 *  stateAttr        → the page's existing selection/active hook
 *                     ('data-subnav' on the homepage, 'data-cp-nav' on concept pages)
 * ------------------------------------------------------------------ */

const caret = svg('<path d="M4 6.25l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.35"/>');

const currentMarkup = (c) =>
  c ? `<span class="cmenu__current-num">${esc(c.number)}</span><span class="cmenu__current-name">${esc(c.name)}</span>` : '';

export function renderConceptMenu({ variant = 'home', activeId = null, stateAttr = 'data-subnav', menuId = 'concept-menu' } = {}) {
  const active = conceptById(activeId);
  const items = concepts
    .map((c) => {
      const href = variant === 'home' ? `#${c.id}` : conceptPath(c);
      const current = c.id === activeId ? `aria-current="${variant === 'home' ? 'true' : 'page'}"` : '';
      return `<li><a class="cmenu__item" href="${esc(href)}" ${stateAttr}="${esc(c.id)}" data-cmenu-item ${current}>
        <span class="cmenu__num">${esc(c.number)}</span>
        <span class="cmenu__text">
          <span class="cmenu__name">${esc(c.name)}</span>
          ${c.traits?.length ? `<span class="cmenu__traits">${c.traits.map(esc).join(' · ')}</span>` : ''}
        </span>
        <span class="cmenu__chosen" aria-hidden="true"></span>
        <span class="cmenu__arrow" aria-hidden="true">${icon.right}</span>
        <span class="sr-only" ${stateAttr}-state></span>
      </a></li>`;
    })
    .join('');

  return `<div class="cmenu ${active ? 'has-current' : ''}" data-cmenu>
    <button type="button" class="cmenu__toggle" aria-expanded="false" aria-controls="${esc(menuId)}" data-cmenu-toggle>
      <span class="cmenu__label">Concepts</span>
      <span class="cmenu__current" data-cmenu-current>${currentMarkup(active)}</span>
      <span class="cmenu__caret" aria-hidden="true">${caret}</span>
    </button>
    <div class="cmenu__panel" id="${esc(menuId)}" data-cmenu-panel hidden>
      <p class="cmenu__head"><span>All concepts</span><span>${pad(concepts.length)}</span></p>
      <ul class="cmenu__grid">${items}</ul>
    </div>
  </div>`;
}

/** Homepage: reflect the section in view on the toggle. */
export function setConceptMenuCurrent(id) {
  const menu = $('[data-cmenu]');
  if (!menu) return;
  const c = conceptById(id);
  menu.classList.toggle('has-current', Boolean(c));
  $('[data-cmenu-current]', menu).innerHTML = currentMarkup(c);
}

let closeConceptMenu = () => {};

export function setupConceptMenu() {
  const menu = $('[data-cmenu]');
  if (!menu) return;
  const toggle = $('[data-cmenu-toggle]', menu);
  const panel = $('[data-cmenu-panel]', menu);
  let hideTimer = 0;
  const isOpen = () => menu.classList.contains('is-open');

  const open = () => {
    window.clearTimeout(hideTimer);
    panel.hidden = false;
    void panel.offsetWidth;
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };
  const close = ({ focus = false } = {}) => {
    if (!isOpen()) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    hideTimer = window.setTimeout(() => (panel.hidden = true), reducedMotion.matches ? 0 : 280);
    if (focus) toggle.focus();
  };
  closeConceptMenu = close;

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  panel.addEventListener('click', (event) => {
    if (event.target.closest('[data-cmenu-item]')) close();
  });
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target)) close();
  });
  menu.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) close({ focus: true });
  });
  // Arrow keys move through the items; Down from the toggle opens and enters the panel.
  menu.addEventListener('keydown', (event) => {
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const items = $$('[data-cmenu-item]', panel);
    if (event.target === toggle) {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      open();
      items[0]?.focus();
      return;
    }
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    event.preventDefault();
    const next = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 }[event.key];
    items[(next + items.length) % items.length].focus();
  });
}

/* ------------------------------------------------------------------
 * Reveal animations — adds `.is-in` once an element scrolls into view
 * ------------------------------------------------------------------ */

export function setupReveal(selector = '[data-reveal]') {
  const els = $$(selector);
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
