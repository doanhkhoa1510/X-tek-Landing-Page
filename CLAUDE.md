# Context

- Read `PRODUCT.md` when a task needs XionTechs background or story (positioning, offices, services, brand commitments, what never to fabricate).
- Read `DESIGN.md` to verify a change against the design system (tokens, type, color, motion, components).

# Rules

- After every UI change (markup, CSS, animation, scroll behavior), verify it in a browser before reporting it done. Use the dev-browser skill against `astro dev`.
  - Port 3000 may belong to another app; run this repo's dev server on its own port (e.g. `npx astro dev --port 4400`).
  - Headless screenshots paint only the top part of the viewport and lag behind scroll: wait ~3s after scrolling and crop the top area.
  - For timing and visibility, measure in `page.evaluate` (opacity, `getBoundingClientRect`, computed styles) instead of trusting pixels.
- Full UI pass: `npm run ui:check -- [filter] [widths]` (script: `scripts/ui-check.sh` + `scripts/ui-check.js`).
  - Needs `npx astro dev --port 4400` running (`PORT=` to change). Run outside the sandbox: dev-browser and localhost are blocked inside it.
  - Shoots every landing section, header, footer, each subpage top and its CTA band, at desktop 1440, tablet 834, mobile 390. Output: `.ui-check/<width>/<name>.png` + `.ui-check/report.json` (rect, opacity, colors, theme, x-overflow per element).
  - Console prints `ok`/`WARN` per shot (hidden, missing, x-overflow). Open the PNGs of what you changed with Read and check them against DESIGN.md.
  - Filter by name: `npm run ui:check -- header`, `-- mobile/landing`, `-- page-careers desktop`. Full run takes about 3 minutes.
  - New section, page, or shared part: add it to `SECTIONS`, `PAGES`, or `PARTS` in `scripts/ui-check.js`.
- Do not run `astro build` while `astro dev` is running; it breaks the dev server.
