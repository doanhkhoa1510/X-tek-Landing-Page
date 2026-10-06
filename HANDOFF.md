# Handoff: hero headline visibility (#38)

Session date: 2026-10-06. Branch `fix/38-hero-contrast`, PR #61 (stacked on `fix/39-remove-custom-cursor`, closes #38).

## Where things stand

- Head is `91ded13 feat: add options on main hero change`, committed and pushed by the owner on top of `50d02c1`. Working tree clean at handoff.
- Waiting on the owner: pick one of the round-2 options (see "Open decision"). Recommended: option 7. Smaller step: option 1.
- Dev server is not running (Claude Code stopped it for low system memory). Start it with `npx astro dev --port 4400` when needed.

## Working with the owner

- Do only what is asked. No extra changes; if a change has side effects, say so before making it. The owner was upset once over a suspected unrequested change.
- Explain results in simple, non-technical words. The owner asked for this.
- A hook asks for the caveman skill (terse replies) on every turn.
- Do not commit or push unless asked. The owner commits.
- After every UI change, verify in a browser before reporting (CLAUDE.md).

## What changed on the branch since 50d02c1

### src/styles/global.css

| What | Before | After | Why |
|---|---|---|---|
| `--fs-display` | `clamp(3rem, 6.2vw, 6rem)` | `clamp(2.4rem, 5vw, 4.8rem)` | Owner: headline about 20% smaller |
| `--fs-display-sm` | `clamp(2.2rem, 11.2vw, 3.4rem)` | `clamp(1.75rem, 9vw, 2.7rem)` | Same, mobile |
| `:root:lang(fr) --fs-display-sm` | `clamp(1.9rem, 9.4vw, 2.9rem)` | `clamp(1.5rem, 7.5vw, 2.3rem)` | Same, French mobile |
| Dark field behind the headline | `.hero-copy::before, .hero-next::before` | `.hero-next::before` only | Owner: turn off the shadow behind the headline "for now". The second screen keeps its field. |
| `.hero-title` | no filter | `filter: drop-shadow(0 0 0.14em rgba(3, 8, 19, 0.55))` | Round 1 option 8, the owner's pick |

The drop-shadow sits on the `h1`, not on `.ln > span`: each `.ln` has `clip-path: inset(-0.6em -0.6em 0)` for the entrance animation, which would cut a wide shadow off under the letters. Side effect: GET IT DONE. gets the glow too. Shadow color is the sky color `#030813`, so it is invisible on plain sky.

### src/scripts/mountain.ts

- Terrain dots switched from additive to normal blending (the `blending: THREE.AdditiveBlending` line removed), so overlapping dots no longer add up to white.
- Snow color `vec3(0.9, 0.93, 1.0)` became `vec3(0.521)`, which is `#BFBFBF` on screen. The shader works in linear light and `OutputPass` converts to sRGB. Path: owner first asked for `#E6E6E6` (`vec3(0.787)`), then `#BFBFBF`.
- Fragment alpha clamped: `min(1.0, (1.0 - d * 2.0) * vAlpha)`. The HalfFloat render target does not clamp alpha, and normal blending needs it.
- Bloom strength on desktop 0.55 became 0.4 (the owner set this). Small screens stay 0.5; radius 0.18 and threshold 0.72 unchanged. Path: 0.55, then 50% (0.28/0.25), then off, then 50%, then back to 0.55, then the owner's 0.4.
- A brightness cap was added during the session and later removed by the owner: `c *= min(1.0, snow.r / max(c.r, max(c.g, c.b)));` after the contour bands. Without it, the rim light (`c += rimCol * rim * 1.1`) lifts edge-on slopes past `#BFBFBF` up to white. Measured in the ridge band above the headline: 1.6% pure-white pixels at 1440 and 3.1% at 390, against 0% with the cap. Restoring it was offered; no answer yet.

### hero-shadow-options/ (committed)

- Round 1 (folder root): 10 subtle shadow options. Laptop and mobile shots, comparison sheets, `README.md` with the CSS and measurements. The owner picked option 8.
- `round-2/`: 8 options built on top of option 8. Same layout, `README.md` with the CSS and edge-contrast numbers.
- `round-2/laptop/option-4.png` is not in the folder or the commit. The original shot is still at `~/.dev-browser/tmp/round2/laptop/option-4.png`.

## Open decision: round 2

"Edge contrast" is the contrast of the brightest 1% of background in a 1-4 px band just outside the white letters, against the white text. Higher is better; 4.5 is the usual minimum for readable text.

| Option | What it does | Laptop 1536x730 | Mobile 390x844 |
|---|---|---|---|
| before | No glow | 3.56 | 9.49 |
| 0 | Now: round 1 option 8 | 5.62 | 11.11 |
| 1 | Sharper edge: extra tight glow `drop-shadow(0 0 0.04em rgba(3,8,19,.75))` before the current one | 7.35 | 11.84 |
| 2 | Deeper glow | 9.03 | 14.08 |
| 3 | Thin dark outline (`-webkit-text-stroke` with `paint-order: stroke fill`) | 6.37 | 11.19 |
| 4 | Bolder letters (weight 760 to 860) | 5.89 | 10.80 |
| 5 | Quieter mountain behind the words (CSS mask on `#mountain`) | 10.88 | 16.02 |
| 6 | Frosted glass behind the words (backdrop blur) | 11.25 | 17.39 |
| 7 | 1 + 5 | 12.75 | 16.62 |
| 8 | 1 + 4 + 5 | 13.31 | 16.76 |

Notes for implementing the pick (exact CSS is in `hero-shadow-options/round-2/README.md`):

- Options 1-3 are CSS only on the headline.
- Option 4 changes the headline weight, a design system value (DESIGN.md).
- Options 5, 7 and 8 mask the `#mountain` canvas: an oval centered on the headline (desktop `at 26% 46%`, mobile under 768px `at 50% 53%`). Arabic puts the headline on the right, so it needs a mirrored center under `[dir="rtl"]`. The canvas is replaced by a clone when its GPU is released (`release()` in mountain.ts); the id is kept, so an `#mountain` selector still applies. The same effect could be done in the terrain shader instead.
- Option 6 reads as a visible hazy patch over the ridge. Not recommended.
- No option was tested in other languages or during the entrance animation and scroll. Only option 8 (live) was checked in en, vi and ar at 1536x730 and in en at 390x844: filter applied, lines settle at opacity 1, no page errors.

## Findings

- Whether the ridge crosses the headline depends on window size. Worst contrast of the white lines against the brightest pixel behind them, without any glow, with the current snow color and bloom:
  - Ridge on the text: 1536x730 and 1366x657 (WHERE and INTELLIGENCE at 1.0:1), 1440x760 and 1280x720 (WHERE 1.0:1), 360x740 (1.1-2.7:1), 390x844 (2.85:1).
  - Clear (10:1 or more): 1920x960, 1440x900, 1280x800, 1024x700, 834x1112, 430x932.
- Earlier, with the field off and the original white snow, 11 of 21 language x width combinations failed 4.5:1.
- With the brightness cap in place, bloom strength barely changed the ridge (the capped dots stayed under the 0.72 threshold); it mostly affected beacons and arcs. The cap is now gone, so this may no longer hold.

## Not done

- DESIGN.md does not reflect any of this: display sizes (around lines 32 and 365), bloom strength 0.55 (around line 475), the headline night field (around line 561), snow color and blending, the headline drop-shadow. Update once the owner settles on the final look.
- PR #61 description not updated for these changes.
- `npm run ui:check` not run on these changes.
- Possible pre-existing bug, not checked against main: on the summit screen at 1440x900 the DA NANG chip sits under the "READY TO CLIMB?" headline.

## How the checks were done

- dev-browser on Windows: piping a script on stdin hangs. Run a file through PowerShell, outside the sandbox:
  ```powershell
  $p = Start-Process cmd.exe -ArgumentList "/c dev-browser --headless --timeout 280 run `"$dir\script.js`" > `"$dir\out.txt`" 2>&1" -WorkingDirectory $dir -PassThru -WindowStyle Hidden
  if (-not $p.WaitForExit(300000)) { "TIMEOUT" }
  ```
- Fair comparisons: load the page, wait about 7 s, freeze the scene with `window.requestAnimationFrame = () => 0` (the canvas keeps its last frame), then inject each option as a `<style>` and screenshot. Only the injected area changes between shots.
- Contrast behind text: hide `.hero-title, .hero-lede`, take `Page.captureScreenshot` over a CDP session, decode it in a page canvas, and take the brightest pixel in each line box.
- Edge contrast: per option, a second shot with the headline in magenta and no filter gives a glyph mask. The band is the mask dilated by 4 px minus the mask dilated by 1 px (PIL `MaxFilter`); report the p99 luminance as a contrast ratio against white.
- The scripts (`hero-check.js`, `title-probe.js`, `shadow-options.js`, `round2.js`, `edge.py`, `sheet.py`) are in the session scratchpad `C:\Users\LENOVO\AppData\Local\Temp\claude\D--Projects-X-tek-Landing-Page\acb73c12-c7c8-4fb0-bad7-1e4ccfedd51f\scratchpad\`, which is temporary. Shots are in `~/.dev-browser/tmp/`.
