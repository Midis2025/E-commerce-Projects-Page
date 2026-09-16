import './style.css';
import { site, concepts } from './config.js';
import {
  $,
  $$,
  esc,
  pad,
  safeUrl,
  displayUrl,
  shortPath,
  conceptById,
  conceptPath,
  icon,
  button,
  media,
  bindMediaFallbacks,
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
  renderConceptMenu,
  setupConceptMenu,
  setConceptMenuCurrent,
  brandLogo,
  brandWordmark,
} from './shared.js';

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
        ${brandWordmark({ withName: true })}
        ${brand.project ? `<span class="brand__divider" aria-hidden="true">/</span><span class="brand__project">${esc(brand.project)}</span>` : ''}
      </a>
      <div class="header__right">
        <nav aria-label="Primary"><ul class="nav">${links}</ul></nav>
        <button class="theme-toggle" type="button" role="switch" aria-checked="false" aria-label="Dark mode" data-theme-toggle>
          <span class="theme-toggle__track" aria-hidden="true">
            <span class="theme-toggle__thumb"><span class="theme-toggle__sun">${icon.sun}</span><span class="theme-toggle__moon">${icon.moon}</span></span>
          </span>
        </button>
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
  const { hero, background } = site;
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
      (s, i) => `<li class="step glass glass-soft" data-hero-in style="--d:${i + 4}">
        <span class="step__num">${esc(s.number)}</span>
        <span class="step__title">${esc(s.title)}</span>
        <span class="step__text">${esc(s.text)}</span>
      </li>`,
    )
    .join('');
  /* The plate reuses the site's own background image at full strength and a different
     crop: the hero reads as a window cut into the same material. No new assets. */
  const plate = background?.image?.trim();

  return `
  <section class="hero" id="project" aria-labelledby="hero-title">
    <div class="page-container">
      <div class="hero__grid">
        <div class="hero__lede">
          <p class="eyebrow hero__eyebrow" data-hero-in style="--d:0">${esc(hero.eyebrow)}</p>
          <h1 class="hero__title" id="hero-title">${lines}</h1>
          <p class="hero__intro" data-hero-in style="--d:1">${esc(hero.intro)}</p>
          <div class="hero__actions" data-hero-in style="--d:2">
            ${button({ label: hero.cta, anchor: '#concepts', iconHtml: icon.down, iconClass: 'btn__icon--down' })}
            <p class="hero__status"><span class="status-dot" aria-hidden="true"></span><span data-selection-status></span></p>
          </div>
        </div>
        <div class="hero__visual">
          <div class="hero__plate">
            ${plate ? `<img class="hero__plate-img" src="${esc(plate)}" alt="" width="2400" height="1500" fetchpriority="high" decoding="async">` : ''}
            <span class="hero__plate-veil" aria-hidden="true"></span>
          </div>
          ${meta ? `<dl class="hero__panel glass">${meta}</dl>` : ''}
        </div>
      </div>
      ${steps ? `<ol class="steps" aria-label="How this review works">${steps}</ol>` : ''}
    </div>
  </section>`;
}

/* Concepts sit behind one scalable menu; the bar itself never grows with the concept count. */
function renderSubnav() {
  return `
  <nav class="subnav" aria-label="Concepts" data-inertable>
    <div class="page-container subnav__inner">
      <ul class="subnav__list">
        <li class="subnav__menu">${renderConceptMenu({ variant: 'home', stateAttr: 'data-subnav', menuId: 'concept-menu' })}</li>
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

/* The large browser preview opens the internal concept presentation. */
function renderPreview(concept) {
  const url = safeUrl(concept.websiteUrl);
  const bar = `<span class="preview__bar" aria-hidden="true">
      <span class="preview__dots"><i></i><i></i><i></i></span>
      <span class="preview__url"><span>${url ? esc(displayUrl(url)) : 'Live link coming soon'}</span></span>
      <span class="preview__open"><span class="preview__open-text">Explore</span>${icon.right}</span>
    </span>`;
  const body = `${bar}<span class="preview__viewport">${media(concept, { alt: concept.previewAlt || `${concept.name} concept preview`, loading: 'eager' })}</span>`;

  return `<a class="preview" href="${esc(conceptPath(concept))}" aria-label="Explore the ${esc(concept.name)} concept presentation">${body}</a>`;
}

function renderConcept(concept, index) {
  const reversed = index % 2 === 1;
  // Both concepts sit directly on the shared background (light theme).
  // A config `theme: 'dark'` still works.
  const theme = concept.theme || 'light';
  const traits = (concept.traits || []).filter(Boolean);
  const pages = (concept.pages || []).filter((p) => p && p.name);
  const path = conceptPath(concept);

  return `
  <section class="concept ${reversed ? 'concept--reverse' : ''} theme-${theme}" id="${esc(concept.id)}"
    data-concept="${esc(concept.id)}" aria-labelledby="${esc(concept.id)}-title">
    <div class="page-container concept__grid">
      <header class="concept__head">
        <div class="concept__kicker" data-reveal>

          <a class="concept__label concept__label-link" href="${esc(path)}" tabindex="-1" aria-hidden="true">${esc(concept.label)}</a>
          <span class="concept__rule" aria-hidden="true"></span>
          <span class="concept__badge">${icon.check}Selected direction</span>
        </div>
        <h3 class="concept__name" id="${esc(concept.id)}-title" data-reveal><a class="concept__name-link" href="${esc(path)}">${esc(concept.name)}</a></h3>
        <p class="concept__desc" data-reveal>${esc(concept.description)}</p>
        ${traits.length ? `<ul class="traits" aria-label="Design characteristics" data-reveal>${traits.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      </header>

      <figure class="concept__preview" data-reveal="clip">
        ${renderPreview(concept)}
        <figcaption class="concept__caption">

          <span>${esc(concept.previewCaption || 'Homepage preview')}</span>
          <span class="concept__caption-hint">Hover to scroll · Click to explore</span>
        </figcaption>
      </figure>

      <div class="concept__actions">
        <div class="concept__live" data-reveal>
          ${button({ label: 'Explore the concept', anchor: path, iconHtml: icon.right, block: true, attrs: `aria-label="Explore the ${esc(concept.name)} concept presentation"` })}
          ${button({ label: 'View live concept', variant: 'secondary', href: concept.websiteUrl, iconHtml: icon.external, iconClass: 'btn__icon--diag', block: true })}
        </div>
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
  <section class="final" aria-labelledby="final-title">
    <div class="page-container final__inner">
      <p class="eyebrow" data-reveal>${esc(finalCta.eyebrow)}</p>
      <h2 class="final__title" id="final-title" data-reveal data-final-title></h2>
      <p class="final__text" data-reveal data-final-text></p>
      <div class="final__actions" data-reveal>
        <div class="final__group" data-when="none">
          ${button({ label: 'View Our Work', anchor: '#concepts', iconHtml: icon.up, iconClass: 'btn__icon--up' })}
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
  <footer class="footer" data-inertable>
    <div class="page-container footer__inner">
      <p class="footer__brand">${brandLogo()}${esc(brand.mark)}</p>
      <p class="footer__note">${esc(footer.note)}${brand.project ? ` <span>${esc(brand.project)}</span>` : ''}</p>
      <p class="footer__tagline">${esc(footer.tagline)}</p>
      <a class="footer__top" href="#project">Back to top ${icon.up}</a>
    </div>
  </footer>`;
}

function render() {
  document.title = site.title || document.title;
  const bgImage = site.background?.image?.trim();
  // One fixed background for the whole site (never tied to scroll); all content scrolls above it.
  $('#app').innerHTML = `
    <div class="site-root">
      <div class="global-background" aria-hidden="true">
        ${bgImage ? `<div class="global-background-image" style="background-image:url('${esc(bgImage)}')"></div>` : ''}
        <div class="global-background-overlay"></div>
        <div class="global-background-light"></div>
      </div>
      <div class="site-content">
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
      </div>
    </div>
  `;
}

/* ------------------------------------------------------------------
 * Selection UI (state + storage live in shared.js)
 * ------------------------------------------------------------------ */

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
    setConceptMenuCurrent(conceptById(id) ? id : null);
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
 * Depth: subtle pointer tilt on the concept previews.
 * Desktop mouse only; off for touch and reduced motion. Work happens
 * once per pointer move (one rAF), never in a continuous loop.
 * ------------------------------------------------------------------ */

const depthEnabled = () => finePointer.matches && !reducedMotion.matches && window.innerWidth >= 1024;

function setupDepth() {
  const previews = $$('.concept .preview');
  const visible = new Set(previews);
  let active = null;
  let pointer = null;
  let frame = 0;

  // Only tilt previews that are on screen.
  if ('IntersectionObserver' in window) {
    visible.clear();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    });
    previews.forEach((p) => observer.observe(p));
  }

  const clearTilt = (preview) => {
    preview.style.removeProperty('--rx');
    preview.style.removeProperty('--ry');
  };

  const flush = () => {
    frame = 0;
    const { x, y } = pointer;
    if (!active || !visible.has(active)) return;
    const rect = active.getBoundingClientRect();
    const px = Math.max(-0.5, Math.min(0.5, (x - rect.left) / rect.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (y - rect.top) / rect.height - 0.5));
    const amount = window.innerWidth < 1200 ? 0.5 : 1; // gentler on small laptops
    active.style.setProperty('--ry', `${(px * 4 * amount).toFixed(2)}deg`); // max 2deg
    active.style.setProperty('--rx', `${(-py * 3 * amount).toFixed(2)}deg`); // max 1.5deg
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse' || !depthEnabled()) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(flush);
    },
    { passive: true },
  );

  previews.forEach((preview) => {
    preview.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') active = preview;
    });
    preview.addEventListener('pointerleave', () => {
      if (active === preview) active = null;
      clearTilt(preview);
    });
  });

  const reset = () => {
    if (depthEnabled()) return;
    active = null;
    previews.forEach(clearTilt);
  };
  reducedMotion.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
  window.addEventListener('resize', reset, { passive: true });
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

  // Keep open tabs — and pages restored from the back/forward cache after
  // a selection on a concept page — in sync.
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
 * Light / dark mode — tokens switch via html[data-theme="dark"].
 * The inline script in index.html applies a saved choice before paint.
 * ------------------------------------------------------------------ */

const themeKey = site.theme?.storageKey || 'midis-portfolio:theme';
const THEME_COLOR = { light: '#F3EFE7', dark: '#141311' };

function applyTheme(mode) {
  const dark = mode === 'dark';
  const root = document.documentElement;
  if (dark) root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  $('[data-theme-toggle]')?.setAttribute('aria-checked', String(dark));
  $('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[dark ? 'dark' : 'light']);
}

function setupThemeToggle() {
  const toggle = $('[data-theme-toggle]');
  if (!toggle) return;
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      window.localStorage.setItem(themeKey, next);
    } catch {
      /* preference just won't persist */
    }
    // Cross-fade between themes where supported; instant otherwise or with reduced motion.
    if (document.startViewTransition && !reducedMotion.matches) document.startViewTransition(() => applyTheme(next));
    else applyTheme(next);
  });

  window.addEventListener('storage', (event) => {
    if (event.key === themeKey) applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
  });
}

/* ------------------------------------------------------------------
 * Boot
 * ------------------------------------------------------------------ */

function init() {
  render();
  initModal();
  configureSelection({ apply: applySelection, beforeOpen: () => closeMenu() });

  applySelection();
  bindMediaFallbacks();
  bindEvents();
  setupThemeToggle();
  setupConceptMenu();
  setupScrollEffects();
  setupReveal();
  setupDepth();

  // Returning from a concept page (/#alinkriti, /#review): the sections are
  // rendered by script, so land on the target once it exists.
  const target = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));

  // Start the hero entrance once fonts are ready (with a short cap so it never stalls).
  const start = () => document.body.classList.add('is-loaded');
  if (document.fonts?.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(start);
  else start();
}

init();
