# Context

- Read `PRODUCT.md` when a task needs XionTechs background or story (positioning, offices, services, brand commitments, what never to fabricate).
- Read `DESIGN.md` to verify a change against the design system (tokens, type, color, motion, components).

# Rules

- After every UI change (markup, CSS, animation, scroll behavior), verify it in a browser before reporting it done. Use the dev-browser skill against `astro dev`.
  - Port 3000 may belong to another app; run this repo's dev server on its own port (e.g. `npx astro dev --port 4400`).
  - Headless screenshots paint only the top part of the viewport and lag behind scroll: wait ~3s after scrolling and crop the top area.
  - For timing and visibility, measure in `page.evaluate` (opacity, `getBoundingClientRect`, computed styles) instead of trusting pixels.
- Do not run `astro build` while `astro dev` is running; it breaks the dev server.
