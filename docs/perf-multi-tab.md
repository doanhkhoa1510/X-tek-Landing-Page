# Multi-tab performance: how it was found, fixed, and verified

Branch `chore/improve-performance`, PR #25. Date: 2026-10-04.

## 1. Problem

Opening 20+ XionTechs landing tabs made Chrome lag. One landing tab cost far more than a subpage tab, and the cost did not drop when the tab went to the background.

## 2. Investigation

### 2.1 Tools

| Need | Tool |
|---|---|
| Single-tab timing, screenshots, scroll offsets | dev-browser (Playwright) against `npx astro dev --port 4400` |
| Real background tabs | Plain Chrome for Testing with `--remote-debugging-port=9333`, driven by raw CDP |
| Memory per process | `vmmap --summary <pid>` and "Physical footprint", summed per Chrome `--type=` |
| Production numbers | `astro build` in a temp clone, served by `astro preview --port 4402/4403` |

Why raw CDP: Playwright launches Chromium with flags that keep every tab `visibilityState: "visible"`. It cannot show what a hidden tab does. With raw CDP, `Target.createTarget {background: true}` opens a real hidden tab and `Target.activateTarget` switches tabs.

Why a temp clone: `astro build` while `astro dev` runs breaks the dev server. Clone with `git archive HEAD | tar -x -C /tmp/xt-new`, copy `node_modules` with `cp -c -R`, delete `node_modules/.vite`, then build there.

### 2.2 Scenarios measured

- One tab at each section offset (hero, summit, values, branches, trek, footer), at 1440×900 and 390×844.
- Scroll through the full page, frame times at 1× and 4× CPU throttle.
- 20 landing tabs opened in the background.
- 20 tabs with 19 hidden, compared with 20 careers tabs.
- Click through 10 tabs at 1 s each; flip between 2 tabs.
- Boot long tasks (production build, 4× CPU).

### 2.3 Findings

1. **Hero WebGL in every tab.** Each tab kept a three.js renderer, an EffectComposer and UnrealBloomPass render targets, even when hidden. This was most of the 4.5 GB GPU memory.
2. **MSAA canvas buffer with no use.** The composer renders into its own targets, so `antialias: true` on the canvas only held memory. `powerPreference: "high-performance"` woke the discrete GPU for every tab.
3. **Static contour backdrops drawn every frame.** `topo.ts` kept a second canvas and redrew it even when nothing animated.
4. **Offscreen canvases painted at boot, twice.** Trail, ridge, dots and topo painted at once and then again on the first ResizeObserver report. This gave long boot tasks.
5. **Fast tab switching built many scenes.** After fix 1, each tab still built a scene when shown and held it for 10 s.

## 3. Fixes (one commit each)

### 3.1 Build the hero scene only while the tab is visible (`5863464`)

`src/scripts/mountain.ts`

- The renderer and the composer moved into a `Gpu` object built by `build()` and freed by `release()`.
- `sync()` builds when the tab is visible. When the tab goes hidden it starts a 10 s timer (`RELEASE_MS`) and then releases.
- `release()` disposes the passes, the composer and the renderer, calls `forceContextLoss()`, then replaces the canvas with `canvas.cloneNode()`. A lost context never comes back on the same canvas.
- `renderer.compileAsync()` compiles shaders off the main thread. Frames render only when `gpu.ready` is true.
- `webglcontextlost` releases and rebuilds, so a context loss caused by the browser recovers.
- `mountMountain()` takes an `onFail` callback. `app.ts` uses it to add `.no-webgl` (fallback gradient) if the renderer cannot be created.
- The scene is not released on scroll-away: a rebuild cost about 0.1 s of main thread and stalled the scroll back up.

### 3.2 Renderer settings (`45913a5`)

- `antialias: false`, because the composer has its own targets. No visual change.
- Default GPU instead of `high-performance`.
- That commit also capped the pixel ratio at 1.5. **This was reverted in 3.6.**

### 3.3 Static contour backdrops (`0eed471`)

`src/scripts/topo.ts`

- The second (`base`) canvas exists only for the amber style. Other styles draw straight to the visible canvas.
- `draw()` returns at once when there is no amber line to animate.
- That commit also painted cover backdrops at 1×. **This was reverted in 3.6.**

### 3.4 Paint offscreen canvases once, when needed (`3198db0`)

New `src/scripts/defer.ts`:

```ts
export function paintWhenNear(el: Element, paint: () => void) {
  let started = false;
  const start = () => { if (started) return; started = true; near.disconnect(); new ResizeObserver(paint).observe(el); };
  const near = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && start(), { rootMargin: "100% 0px" });
  near.observe(el);
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 4000 });
  else setTimeout(start, 2000);
}
```

- Painting starts when the canvas is within one viewport of the screen, or when the browser is idle.
- The ResizeObserver sends its first report without help, so the explicit first draw was removed. Each canvas now paints once.
- `trail.ts`, `ridge.ts`, `dots.ts` and `topo.ts` use it.

### 3.5 Free hidden scenes when other tabs are shown (`42f90d3`)

`src/scripts/mountain.ts`

- A `BroadcastChannel("xt-hero")` connects the landing tabs. Each tab posts `"shown"` when it becomes visible.
- A hidden tab that holds a scene counts these messages. After 2, it releases at once and does not wait for the 10 s timer.
- Flipping between 2 tabs never rebuilds. Clicking through 10 tabs leaves at most 2 scenes.

### 3.6 Restore full resolution (`6983515`)

Rule: a performance fix must not lower quality.

- Hero pixel ratio is back to `Math.min(devicePixelRatio, small ? 1.5 : 2)`.
- Contour backdrops paint at `Math.min(devicePixelRatio, 2)`.
- The memory savings now come only from freeing hidden and offscreen work.

## 4. Verification

| Check | Before | After |
|---|---|---|
| Real Chrome, 20 tabs opened in background: total memory | 6.55 GB | 1.82 GB |
| Same: GPU process | 4.5 GB | 73 MB |
| Playwright, 20 tabs with 19 hidden | 9.3 GB | 5.4 GB (20 careers tabs: 5.0 GB) |
| Click through 10 tabs: scenes held | 10 | 2 |
| Longest boot task, production, 4× CPU | 653 ms | 407 ms |
| Scroll p95 frame, 4× CPU | not measured | 18 ms |

The GPU numbers were measured before 3.6. The visible tab uses more memory again at 2×, but hidden tabs hold no scene, so the 20-tab result does not change.

Visual checks:
- Hero screenshot after every rebuild (hidden, shown, context lost).
- Summit, values, branches and trek sections in the headed browser.
- `npm run ui:check` passes at desktop and mobile. The tablet x-overflow WARN exists on `main` too.

## 5. How to measure again

1. Stop dev-browser (`dev-browser stop`), so only one Chrome is counted.
2. Build in a temp clone and run `astro preview --port 4402`.
3. Start Chrome for Testing with `--remote-debugging-port=9333 --user-data-dir=/tmp/chrome-real`.
4. Open 20 tabs with CDP `Target.createTarget {url, background: true}`.
5. Run `vmmap --summary` on each Chrome process and sum "Physical footprint" per `--type=`.

## 6. Known items not changed

- The visible tab still holds its hero scene. Possible trim: drop depth buffers (about 13%; every material has `depthWrite: false`).
- When you return to a tab hidden for more than 10 s, the hero takes about 0.1 s to appear.
