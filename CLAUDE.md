# Context

- Read `PRODUCT.md` when a task needs XionTechs background or story (positioning, offices, services, brand commitments, what never to fabricate).
- Read `DESIGN.md` to verify a change against the design system (tokens, type, color, motion, components).

# How to organize a task

Read this before you start any task. Split the work into two kinds:

- **Main context: decisions only.** Keep in the main context the work that needs judgment: understanding the request, choosing an approach, design and product calls, questions to the user, reviewing subagent results, and the final report.
- **Subagent swarm: everything else.** Subagents run on Haiku and cost little, so use many of them and win on quantity: several parallel agents with narrow tasks beat one broad agent. Delegate:
  - writing or changing code to a clear spec (one bounded change per agent),
  - searching the codebase, finding errors, defects, or regressions,
  - browser testing with dev-browser or `npm run ui:check`, and reading screenshots,
  - running tests, builds, and lint, and reporting the results,
  - research and reading large files or logs.
- Launch independent subagents in one message so they run in parallel. Give each one a self-contained prompt: goal, exact files or URLs, done criteria, and the short report format you want back.
- For quality, spend the extra agents on checking: when a result matters, send a second agent to verify or review it, or let 2–3 agents try the same task and pick the best result.
- Do not read big files, logs, or screenshots in the main context when a subagent can read them and report the conclusion.
- Exception: do small one-step actions (one short file read, one-line edit, one git command) directly. A subagent for these costs more than it saves.

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
