# Design Review

A single landing page for presenting two website design concepts to a client: large live previews,
per-page links, a side-by-side comparison, and a saved "select this direction" choice.

Built with Vite and vanilla JavaScript. No framework and no runtime dependencies.

```bash
npm install
npm run dev      # local preview
npm run build    # production build → dist/
```

## Editing content

**Everything is in `src/config.js`.** You never need to touch the components.

| What                           | Where in `src/config.js`                          |
| ------------------------------ | ------------------------------------------------- |
| Concept names / descriptions   | `concepts[].name`, `concepts[].description`       |
| Live website link              | `concepts[].websiteUrl`                           |
| Homepage / Collection / Product | `concepts[].pages[]` (add or remove rows freely) |
| Preview screenshots            | `concepts[].previewImage` → file in `/public`     |
| Hero heading and intro         | `site.hero`                                       |
| Header mark / status pill      | `site.brand`, `site.status`                       |
| Review, CTA, footer copy       | `site.review`, `site.finalCta`, `site.footer`     |
| Copied selection text          | `site.selection.copyTemplate`                     |

### Links

- An empty string, or any value starting with `PASTE`, is treated as "not supplied yet": the link
  appears disabled and never navigates.
- All external links open in a new tab (`target="_blank" rel="noopener noreferrer"`).

### Preview images

Put screenshots in `/public/previews` (e.g. `public/previews/alinkriti.jpg`). Tall, full-page captures around
1440px wide look best: on desktop the frame slowly scrolls through the page on hover. If an image is
missing, a styled placeholder is shown instead.

### Selection

The client's choice is saved in `localStorage` under `site.selection.storageKey`, so it survives a page
refresh on their device. Use a unique key per project. There is no backend, so the client sends their
choice back with **Copy selection**.

## Concept detail pages

Each concept has its own presentation page at `/concepts/<id>/` (e.g. `/concepts/alinkriti/`). Clicking a
concept's preview, title or **Explore the concept** opens it; **View live site** and the page links still go
straight to the live store in a new tab.

| What                               | Where                                                     |
| ---------------------------------- | --------------------------------------------------------- |
| Tagline, tags, strengths, capture  | `conceptDetails` in `src/config.js`                       |
| Page template (shared by all)      | `src/concept-page.js` + `src/concept.css`                 |
| Route entry files                  | `concepts/<id>/index.html` (listed in `vite.config.js`)   |
| Screenshots                        | `public/captures/<id>/` (full page + section crops)       |

- **Live preview.** Both stores send `X-Frame-Options: DENY` / `frame-ancestors 'none'`, so they can't be
  shown in an iframe. The page shows a scrollable full-page capture with **Open full website** instead. If a
  site later allows framing, set `embeddable: true` and the live site loads in the frame.
- **Adding a concept.** Add it to `concepts` and `conceptDetails`, then copy one of the
  `concepts/<id>/index.html` files and change its `data-concept` attribute.
- **Selection** uses the same `localStorage` key and confirmation dialog as the homepage, so a choice made
  on a concept page shows up on the review page and vice versa.
- Shared code (utilities, buttons, selection, modal, toasts) lives in `src/shared.js`.
