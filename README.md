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
