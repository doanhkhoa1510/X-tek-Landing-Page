---
name: XionTechs
description: The Night Ascent. A B2B product-engineering landing page built as a climb from base camp to summit, with unitedcarriers.com-grade motion on the XionTechs navy and amber.
colors:
  night: "#030813"
  night-band: "#07101F"
  brand-navy: "#103060"
  navy-ink: "#0B1A33"
  glacier: "#2E6BF0"
  xion-amber: "#F8C000"
  amber-hi: "#FFD23D"
  ember: "#FF6A1A"
  snow: "#FFFFFF"
  ice: "#F3F5F9"
  mist: "#A9B4CC"
  slate: "#4A5670"
  dim-ink: "#858FA1"
  dim-night: "#76839F"
  limb-deep: "#10277A"
  limb-mid: "#6F9AF5"
  limb-pale: "#DBE6FD"
  giant-ink: "#E6EBF3"
  map-dot-night: "#1F3566"
  map-dot-loader: "#2A3B63"
  map-dot-snow: "#C9D2E3"
  pending: "#B8470F"
  error: "#FF9A7A"
  line-dark: "rgba(255, 255, 255, 0.12)"
  line-light: "rgba(11, 26, 51, 0.12)"
typography:
  display:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 6.2vw, 6rem)"
    fontWeight: 760
    lineHeight: 0.92
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 125"
  display-sm:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 11.5vw, 3.4rem)"
    fontWeight: 760
    lineHeight: 0.92
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 125"
  giant:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(7rem, 21vw, 21rem)"
    fontWeight: 800
    lineHeight: 0.74
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 4.25rem)"
    fontWeight: 760
    lineHeight: 0.94
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  headline-compact:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(1.75rem, 2.8vw, 2.75rem)"
    fontWeight: 760
    lineHeight: 0.94
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  figure:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(3.5rem, 7vw, 6rem)"
    fontWeight: 760
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 125"
  stage:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)"
    fontWeight: 760
    lineHeight: 1.04
    fontVariation: "'wdth' 125"
  title-lg:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(1.25rem, 1.8vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.04
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "clamp(1.125rem, 1.5vw, 1.375rem)"
    fontWeight: 700
    lineHeight: 1.04
    fontVariation: "'wdth' 125"
  logo:
    fontFamily: "Saira Variable, Saira, Arial Narrow, sans-serif"
    fontSize: "17px"
    fontWeight: 760
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 125"
  quote:
    fontFamily: "Host Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(20px, 1.9vw, 26px)"
    fontWeight: 400
    lineHeight: 1.4
  lede:
    fontFamily: "Host Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(17px, 1.35vw, 19px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Host Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Host Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "Martian Mono Variable, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.03em"
  label:
    fontFamily: "Martian Mono Variable, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.04em"
  micro:
    fontFamily: "Martian Mono Variable, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.05em"
  ipa:
    fontFamily: "Noto Sans Mono Variable, Martian Mono Variable, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  none: "0px"
  chip: "2px"
  pill: "999px"
spacing:
  gap: "20px"
  gutter: "clamp(20px, 2.8vw, 40px)"
  section: "clamp(120px, 12vw, 190px)"
  horizon: "min(60vh, 560px)"
  control: "44px"
  header: "96px"
  header-compact: "64px"
components:
  button-filled-dark:
    backgroundColor: "{colors.snow}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "{spacing.control}"
    padding: "0 26px"
  button-filled-light:
    backgroundColor: "{colors.brand-navy}"
    textColor: "{colors.snow}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "{spacing.control}"
    padding: "0 26px"
  button-filled-hover:
    backgroundColor: "{colors.xion-amber}"
    textColor: "{colors.navy-ink}"
  button-filled-active:
    backgroundColor: "{colors.amber-hi}"
    textColor: "{colors.navy-ink}"
  button-outline-dark:
    backgroundColor: "transparent"
    textColor: "{colors.snow}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "{spacing.control}"
    padding: "0 26px"
  button-outline-light:
    backgroundColor: "transparent"
    textColor: "{colors.navy-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "{spacing.control}"
    padding: "0 26px"
  chip-map:
    backgroundColor: "{colors.night-band}"
    textColor: "{colors.mist}"
    typography: "{typography.micro}"
    rounded: "{rounded.chip}"
    padding: "5px 8px"
  chip-map-focus:
    backgroundColor: "{colors.xion-amber}"
    textColor: "{colors.navy-ink}"
  chip-3d:
    backgroundColor: "{colors.night}"
    textColor: "{colors.snow}"
    typography: "{typography.micro}"
    rounded: "{rounded.chip}"
    padding: "4px 7px"
  chip-summit:
    backgroundColor: "{colors.xion-amber}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.micro}"
    rounded: "{rounded.chip}"
    padding: "4px 7px"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.snow}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "10px 0"
  form-panel:
    backgroundColor: "{colors.night-band}"
    textColor: "{colors.snow}"
    rounded: "{rounded.none}"
    padding: "clamp(24px, 2.8vw, 40px)"
  service-column:
    backgroundColor: "{colors.night-band}"
    textColor: "{colors.snow}"
    typography: "{typography.title}"
    width: "clamp(270px, 23vw, 340px)"
    padding: "32px clamp(24px, 2.4vw, 36px)"
  case-cell:
    backgroundColor: "{colors.snow}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.none}"
    padding: "28px"
  case-cell-hover:
    backgroundColor: "{colors.ice}"
  faq-row:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.title}"
    padding: "26px 0"
  stat:
    backgroundColor: "{colors.snow}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.figure}"
    padding: "22px 0 30px"
  altimeter:
    backgroundColor: "transparent"
    textColor: "{colors.snow}"
    typography: "{typography.micro}"
  climber-chip:
    backgroundColor: "{colors.night-band}"
    textColor: "{colors.snow}"
    typography: "{typography.micro}"
    rounded: "{rounded.chip}"
    padding: "5px 8px"
  pronunciation:
    backgroundColor: "transparent"
    textColor: "currentColor"
    typography: "{typography.ipa}"
  dictionary-entry:
    backgroundColor: "{colors.snow}"
    textColor: "{colors.brand-navy}"
    typography: "{typography.title-lg}"
    padding: "0"
---

<!-- v2.1 · 2026-09-29 · v2.1 swaps the procedural massif for the real relief of Mount Zion and adds the pronunciation. Recorded from the built page (src/pages/index.astro, src/styles/global.css, src/scripts/*.ts). Tokens here are normative; global.css :root mirrors them one to one. v1 was the pre-build target extracted from unitedcarriers.com. -->

# Design System: XionTechs

## Overview

**Creative North Star: "The Night Ascent"**

XionTechs is named for Mount Zion, the legendary mountain of Jerusalem, and the landing page is a climb up it. It opens at night at base camp: a Three.js Mount Zion made of white particle dots under stars. The hill is not invented; it is the real SRTM relief of Mount Zion and the valleys around it (see the 3D spec). An amber dawn glows behind the ridge and a glacier-blue rim light catches the lower slopes. Chips mark the camps where the team lives, Dallas, TX and Ho Chi Minh City. As the visitor scrolls, the camera climbs toward the summit and dawn breaks. A curved atmospheric limb, glacier blue with an amber sunrise line, hands the page to snow-white daylight. From there the page alternates daylight and night bands like weather on a mountain. An altimeter in the corner counts the climb in meters. The last night section is the summit, where the visitor names their project. The footer closes in daylight with the wordmark at mountain scale.

The mechanics come from unitedcarriers.com (Awwwards Site of the Day, teardown in the appendix), because the user named it as the quality bar:
- Lenis smooth scroll and GSAP ScrollTrigger scenes scrubbed to scroll.
- A preloader with a dot world map and a counter.
- A ring-and-dot cursor in difference blend.
- Mono button labels that shuffle their own letters on hover.
- Two-tone uppercase headlines whose ink line fills word by word.
- A giant background type band over a dark service track.
- Hairline grids, dot-matrix icons, and a strict dark and light rhythm joined by atmospheric horizons.

Only the story and the palette are XionTechs': the globe becomes the mountain, freight lanes become routes to the summit, the KM/H speedometer becomes an altimeter, and UC's electric blue and orange become the logo navy and amber.

The mood is heavy, exact, and confident. It is not soft; a pale-haze, rounded, sentence-case rewrite was tried and rejected. Density is low: sections run tall, type runs big, and a lot of the screen is left empty.

**Key Characteristics:**
- One continuous story: night, dawn, daylight, dusk, summit, daylight.
- One real mountain: Mount Zion, from elevation data, in 3D, as contours, and as the ridge silhouette. The altimeter reads its real metres, 602 to 765.
- The name teaches itself: /siː.ɒn.teks/ hangs under the wordmark, and the footer closes with a dictionary entry.
- Saira at 125% width, uppercase, carries every heading. Host Grotesk carries prose. Martian Mono carries every control, label, and reading.
- Flat surfaces and 1px hairlines. No shadows, no cards with depth, no glass.
- Pills for controls, a 2px radius for chips, square for everything else.
- Motion is scrubbed to scroll or answers a gesture. The only things that loop are the 3D scene, the map beacons, and the route arcs, and only while on screen.
- Every interactive element answers the pointer: a letter scramble, an amber fill, a cell tint, or a cursor state.

## Colors

The palette is the two logo colors, brand navy and Xion amber, stretched across a full night-to-snow value range. Glacier blue, derived from the navy hue, adds light. It works as a strict rhythm of dark and light fields, not accents scattered on one ground.

### Primary
- **Brand Navy** (#103060): the logo navy.
  - The filled button on daylight, the ink of the footer wordmark and the logo mark, the contour lines of the topo tile (at 34% and 72% alpha), and the case icons.
  - It is also the focus-ring color on daylight surfaces.
- **Xion Amber** (#F8C000): the logo swoosh.
  - Always: the "GET IT DONE." hero line, the walked trail, camps and climber diamond, the 3D beacons and arcs, the map beacons and arcs, office phone links on night, and the altimeter's amber contour on the topo tile.
  - As a surface, only as the hover fill of every filled button and the focus fill of chips.
  - It is the focus-ring color on night.
- **Amber Hi** (#FFD23D): the pressed (:active) state of a filled button. Nothing else.

### Secondary
- **Glacier** (#2E6BF0): the light source.
  - The brightest band of every horizon limb, the in-between color of the scrubbed headline fill, the Vietnam work window on the day bar, and (as a shader constant) the rim light and valley glow of Mount Zion.
  - It is navy's hue pushed to light: UC's #0016CB, re-derived.
- **Ember** (#FF6A1A): 3D only, the hot trailing color of an arc as its head travels to the summit. It never appears in HTML or CSS.

### Horizon ramp (tertiary)
The atmospheric limb between night and daylight always uses these five stops, in this order: **Night** (#030813), **Limb Deep** (#10277A), **Glacier** (#2E6BF0), **Limb Mid** (#6F9AF5), **Limb Pale** (#DBE6FD), then **Snow** or **Ice**. On dawn limbs, an amber sunrise ellipse (Xion Amber at 42–45% alpha) sits on the glacier band.

### Neutral
- **Night** (#030813): the hero, the summit section, the preloader, the WebGL clear color and `scene.background`, and the html/body background.
- **Night Band** (#07101F): dark fields inside the flow: the service track, the ascent route strip, the brief form panel, and map chips.
- **Navy Ink** (#0B1A33): primary text on snow and ice (17.4:1 on white), and the text on any amber fill (10.4:1).
- **Snow** (#FFFFFF): daylight sections (intro, routes sky, ascent, proof, footer).
- **Ice** (#F3F5F9): the FAQ field, the case-cell hover, and the sky of the summit's dusk limb.
- **Mist** (#A9B4CC): secondary text on night (9.6:1).
- **Slate** (#4A5670): secondary text and captions on snow (7.4:1).
- **Dim Ink** (#858FA1): the dim first line of two-tone headlines on daylight (3.3:1, display sizes only).
- **Dim Night** (#76839F): the dim first line on night, plus the loader lists and the day-bar axis (5.2:1, so it passes at micro sizes too).
- **Giant Ink** (#E6EBF3): background type on snow. It is atmosphere, never the only carrier of meaning.
- **Map Dot Night / Loader / Snow** (#1F3566, #2A3B63, #C9D2E3): the land dots of the world map on night, in the preloader, and in the footer. The map is always quieter than its amber beacons.
- **Pending** (#B8470F): the mono tag on every unfinished placeholder (5.3:1 on white). It marks content the user must replace.
- **Error** (#FF9A7A): form error text and invalid field rule on night (8.7:1).
- **Hairlines:** `rgba(255,255,255,.12)` on night, `rgba(11,26,51,.12)` on daylight.

### Named Rules
**The Dawn Rule.** Full-bleed night and daylight never meet at a straight edge. Night to daylight goes through a dawn limb (a snow dome rising from below, glacier band, amber sunrise). Daylight to night goes through a dusk limb (a night dome rising under a white or ice sky). Bands inside a section, like the service track under the giant type, may cut hard: they are ground, not sky.

**The Limb-Never-Fades Rule.** A horizon moves; it never fades. Snow faded over night at partial opacity reads as grey mud (measured #252933 → #D8D9DB on the first build). A limb rises or sets as a whole (the hero dawn is `yPercent 100 → 0` at full opacity) so the saturated glacier band always leads.

**The Amber Ration Rule.** At rest, amber covers at most about 5% of any viewport: one headline line, beacons, a route, a few links. It floods a surface only as a response: the hover fill of a filled button, or the focus fill of a chip.

**The No-Amber-On-Snow Rule.** Amber is never text or a thin rule on white (1.6:1). On daylight, amber appears only in these forms:
- As a fill that carries navy ink.
- As a 2px graphic line inside a bounded figure (the intro topo tile's altitude contour).
- As the climber diamond.

A live line that crosses copy is navy.

**The Placeholder Is Loud Rule.** Anything the user must still supply (case write-ups, testimonials) carries the Pending mono tag. A placeholder that looks finished is a fabrication.

## Typography

**Display Font:** Saira Variable, `font-stretch: 125%` (wdth 125), weights 700–800 (fallback: Saira, Arial Narrow, sans-serif)
**Body Font:** Host Grotesk Variable, weight 400 (fallback: Helvetica Neue, Arial, sans-serif)
**Label/Mono Font:** Martian Mono Variable, weights 400–500 (fallback: ui-monospace, SFMono-Regular, monospace)

**IPA Font:** Noto Sans Mono Variable, weight 400, used only for the pronunciation `/siː.ɒn.teks/` (token `--ipa`, falling back to the mono stack).

All four are self-hosted through Fontsource (OFL): `@fontsource-variable/saira/wdth.css`, `@fontsource-variable/martian-mono/wdth.css`, `@fontsource-variable/host-grotesk`, `@fontsource-variable/noto-sans-mono`. Saira ships a Vietnamese subset, so office addresses set correctly.

**Character:** Saira at 125% width has the squared, rounded-corner forms of the XIONTECH wordmark, so the headings speak in the logo's voice. It does the job UC gives to BT Steinhart. Host Grotesk is a quiet Helvetica-class body that never competes. Martian Mono is wide and technical, like BT Steinhart Mono at UC, and it is the voice of the machine: buttons, clocks, coordinates, altitude, counters.

### Hierarchy
- **Display** (760, clamp(3rem, 6.2vw, 6rem), 0.92, -0.012em, uppercase): the hero H1 only, three lines. The third line, "GET IT DONE.", is amber. Mobile uses **Display SM** (clamp(2.5rem, 11.5vw, 3.4rem)).
- **Giant** (800, clamp(7rem, 21vw, 21rem), 0.74, -0.02em, uppercase, Giant Ink): the background type band over the service track. It is `aria-hidden`, and a real H2 carries the heading.
- **Headline** (760, clamp(2.25rem, 4.4vw, 4.25rem), 0.94, -0.01em, uppercase, balanced): every section H2, always two-tone. On ≥768px the intro H2 is sticky at `bottom: 60px`. **Headline Compact** (clamp(1.75rem, 2.8vw, 2.75rem)) is the same role inside the service band.
- **Figure** (760, clamp(3.5rem, 7vw, 6rem), 0.9, -0.02em, tabular): count-up statistics.
- **Stage** (760, clamp(1.5rem, 2.4vw, 2.25rem), 1.04, uppercase): 4-D stage names.
- **Title LG** (700, clamp(1.25rem, 1.8vw, 1.625rem)) and **Title** (700, clamp(1.125rem, 1.5vw, 1.375rem)), uppercase: case names, then service names, office names, and FAQ questions.
- **Logo** (760, 17px, 0.02em, uppercase): the header and preloader wordmark.
- **Quote** (400, clamp(20px, 1.9vw, 26px), 1.4, pretty wrap): testimonials.
- **Lede** (400, clamp(17px, 1.35vw, 19px), 1.5, max 44–46ch): the hero and intro paragraphs.
- **Body** (400, 17px, 1.5, max 40–60ch) and **Body Small** (400, 15px, 1.5, max 30ch in service columns): prose.
- **Button** (Martian Mono 500, 12px, 0.03em, uppercase): every pill and the menu toggle.
- **Label** (Martian Mono 500, 11px, 0.04em, uppercase): stat labels, the trailing stage phase word, form labels, footer column heads. A label never sits above a heading.
- **Micro** (Martian Mono 400–500, 10–10.5px, 0.05em, uppercase): the ticker, chips, the altimeter, captions, pending tags, and the legal line. 10px is the floor on every breakpoint.
- **IPA** (Noto Sans Mono 400, 11px under the wordmark, 17px in the footer entry, 0.02em, never uppercase): the pronunciation only.

### Named Rules
**The Two-Tone Rule.** Every H2 is two statements: a dim line (`.tt-a`) and an ink line (`.tt-b`), each `display:block`.
- On daylight (and inside the service band), each word of the ink line passes from dim through Glacier to ink, stepping 0.14 per word, scrubbed between `top 85%` and `top 40%`.
- On full night sections (base camps, summit), the ink words pull into focus instead: blur 10px→0 and opacity 0.15→1, stagger 0.12, scrubbed `top 85%`→`top 45%`. It reads like a summit coming out of cloud.
- Without JS or with reduced motion, the final colors show at once.

**The Mono-Means-Machine Rule.** Mono is only for what you press or read as data: buttons, the menu, chips, clocks, coordinates, altitude, vertical speed, counters' labels, legal and pending tags. Paragraphs are never mono.

**The Uppercase-Is-Display Rule.** Uppercase belongs to Saira headings and mono labels. Body text is always sentence case.

**The IPA-Needs-Its-Own-Face Rule.** Saira, Host Grotesk, and Martian Mono all lack ɒ (U+0252) and ː (U+02D0); measured in the browser, both fall back to a system face. The pronunciation is therefore set whole in Noto Sans Mono, never glyph by glyph, so the string keeps one rhythm. IPA is phonetic data: it is never uppercased, never scrambled, and never letter-spaced beyond 0.02em.

**The Tabular Rule.** Every number that changes in place (clocks, altitude, V/S, figures, the loader counter) uses `font-variant-numeric: tabular-nums` so digits never jitter.

## Layout

- **Grid:** 12 columns, `repeat(12, minmax(0, 1fr))`, gap 20px, full bleed with a side gutter of clamp(20px, 2.8vw, 40px). The page has no max width, like UC (whose container is 100vw).
- **Recurring spans:**
  - Headings take 1/7 or 1/8.
  - Copy takes 8/13 or 9/13.
  - Sticky side heads (ascent, FAQ) take 1/6 against content at 7/13 or 8/13.
  - The header puts the logo in 1/4, the menu in 4/8, and the CTA in 10/13.
- **Vertical rhythm:**
  - Section padding is clamp(120px, 12vw, 190px).
  - Sections that open or close on a horizon pad with min(60vh, 560px) so the limb has room.
  - Headings get more space above than below.
- **Section order and fields:**
  1. Hero (night, 210vh with a sticky 100svh stage)
  2. Intro (snow)
  3. Routes (snow sky over a night-band track, pinned for about 1.15× the track overflow)
  4. Ascent (snow, sticky head, night-band route strip)
  5. Base camps (night, dusk limb in, dawn limb out)
  6. Expedition log (snow)
  7. FAQ (ice)
  8. Summit (transparent over the WebGL night, dusk-ice limb in, dawn limb out)
  9. Footer (snow)
- **Breakpoints:** desktop ≥ 992px. Tablet 768–991px: headings and copy stack to full width, sticky heads go static, and the route strip moves to columns 1/3. Mobile ≤ 767px:
  - The header becomes a flex row (logo left, menu right), and the CTA, the ticker phones, the HUD, and the 3D camp chips hide.
  - The hero shortens to 170vh, the services stack vertically with no pin, the route strip narrows to 36px, and the map bleeds to the viewport edge.
  - The cursor and scramble turn off with no fine pointer.
- **Header geometry:** a 32px ticker plus a 64px row (96px total). After 40px of scroll the whole header translates up 32px, so the ticker slides away with a transform, not a layout change.

## Elevation & Depth

The system is flat. Depth comes from light and from layers sliding over each other, never from box shadows. The layers:
- The 3D scene: bloom strength 0.55, radius 0.18, and threshold 0.72, so only rims, beacons, and arcs glow.
- The horizon limbs.
- Sticky stages (hero, pinned routes, sticky heads) that later sections pass over.
- The fixed layers, from back to front: canvas (z 0), 3D chips (1), main (2), HUD (55), header (60), cursor (120), preloader (150), skip link (200).

**The No-Shadow Rule.** No element casts a box shadow. To lift, a surface changes field (snow to ice, night to night band) or gains a hairline. The one box-shadow in the system is a 1px amber underline on a focused field, and it is a rule, not a shadow.

**The Light-Is-Depth Rule.** Glow belongs to light sources in the world: the dawn behind the ridge, the glacier limb, the beacons. It is never a halo around a UI element.

## Shapes

- **Pill** (999px): every button, the only rounded control.
- **Chip** (2px): 3D chips, map chips, and the climber chip. Hard, nearly square, like survey tags.
- **Square** (0): grids, bands, cells, the form panel, and inputs. Inputs are a single bottom hairline with no box.
- **Dot:** everything drawn is made of dots.
  - Mount Zion is particles.
  - The world map is a 2°-grid dot raster (180×68 cells from Natural Earth land, 3,526 dots).
  - Icons are 24×24 vector glyphs sampled onto a 13×13 dot grid. A covered cell draws a dot of r 0.36 at full opacity; a partly covered cell draws r 0.30 at 55%.
- **The mark:** the XT logo is traced as SVG (viewBox `0 30 294 162`).
  - A navy mountain "^" with a tapering swoosh forms the lower half of the X.
  - An amber check-swoosh forms the upper half.
  - A navy T carries a crescent crossbar.
  - The navy parts use `currentColor`, so the mark goes white on night and navy on snow. The amber never changes.
- **Diamond:** the trek climber and the ridge rider are 14px amber squares rotated 45°. They are the only rotated shapes.

## Components

### Buttons
Character: heavy pills with a machine voice. The fill answers the pointer.
- **Shape:** pill (999px), 44px tall, padding 0 26px, Button type, no wrap.
- **Filled on night:** Snow with Navy Ink text. **Filled on daylight:** Brand Navy with Snow text. The theme comes from the nearest `[data-on]` ancestor.
- **Hover / focus-visible:** fill → Xion Amber with Navy Ink text over 0.4s `cubic-bezier(.445,.05,.55,.95)`, and the label scrambles. **Active:** Amber Hi. **Disabled:** 45% opacity, no pointer events.
- **Outline:** transparent, 1px border at 32% of the text color, going to 100% on hover. The label scrambles.
- The cursor hides over every button and link.

### Scramble label (signature)
UC's hover gesture, rebuilt.
- **Trigger:** on `pointerenter` (fine pointers only, no reduced motion), the `.scr` span inside any `[data-scramble]` host shuffles its own letters as an anagram, never random glyphs.
- **Timing:** every 28ms it reshuffles and locks one more letter from the left, after a 3-tick head start, so a 12-letter label resolves in about 420ms.
- **Stability:** the width is frozen during the shuffle so layout never moves.
- **Accessibility:** links get an `aria-label` with the true text, so assistive tech never hears the shuffle.

### Cursor (signature)
- **Shape:** a 48px ring (1px track at 22% opacity, 2px progress stroke) with a 5px dot, fixed at z 120, `mix-blend-mode: difference`.
- **Motion:** it follows the pointer at a lerp of 0.15 per frame.
- **Progress:** the progress stroke (dasharray 179.07) draws the page's climb progress.
- **States:**
  - It hides over links, buttons, inputs, and labels.
  - It becomes a labeled ring over anything with `data-cursor-label` (the map cities): the ring scales ×1.35, the dot collapses, and a mono label appears.
- **Scope:** desktop above 991px with a fine pointer only. The native cursor stays visible, as on UC.

### Altimeter HUD (signature)
UC's KM/H speedometer, turned into a climb reading.
- **Placement:** fixed bottom-left in Micro type, `mix-blend-mode: difference`, reading `ALT 684 M · V/S 10 M/S · MOUNT ZION 31.77°N 35.23°E`.
- **Altitude:** real metres above sea level, linear in page progress from the valley floor (602 m, `ZION.baseM`) to the published summit (765 m, `ZION.summitM`), rounded to 1 m.
- **Coordinates:** the third reading is fixed, the summit of Mount Zion. It tells the visitor the mountain is a real place.
- **Vertical speed:** scroll velocity ÷ 40, capped at 99, with ±1 jitter above 12. It eases up at 0.1, down at 0.06, and to zero at 0.15.
- **Linked readouts:** the same altitude drives the rider chip over the routes sky and the amber contour on the topo tile. The page never shows two different altitudes.
- **Visibility:** it fades in with the hero entrance, steps aside (opacity 0) when the footer wordmark enters so it never prints over the legal row, and hides on mobile.

### Header
- **Ticker (32px, Micro):**
  - Left: live clocks, `DALLAS, TX 08:15 CT · HO CHI MINH CITY 20:15 ICT`. They update on the minute, and mobile uses short names.
  - Right: phone links that scramble on hover.
  - A hairline sits under it.
- **Row (64px):**
  - The logo: the mark plus XIONTECHS, with the pronunciation subtitle under the word (see Pronunciation subtitle). After 80px of scroll, "ION" and "ECHS" collapse through `grid-template-columns: 1fr → 0fr` over 0.7s, leaving **XT**, like UC's UNITEDCARRIERS → UC.
  - The `•••• MENU` toggle: four 3px squares at opacity .24/.5/.7/1. On hover they go to 1 and the odd dots hop 2px. On open, MENU rolls up and CLOSE rolls in.
  - The `START A PROJECT` filled pill.
- **Theme:** on every scroll frame, the header probes the section under its row with `elementsFromPoint` and takes that section's `data-on` (dark/light). Text colors cross-fade in 0.4s. Once scrolled, a gradient backdrop of that theme's ground (92–94% alpha) keeps the header legible.

### Navigation (menu)
- **Layout:** a dropdown under the toggle, a mono uppercase list of six anchors (Services, Process, Base camps, Work, FAQ, Contact).
- **Open:** a clip-path wipe (0.6s expo). Links drop in 8px with a 0.04s stagger and scramble on hover.
- **Close:** Esc (focus returns to the toggle), an outside click, or following a link.
- **Anchors:** Lenis `scrollTo` over 1.6s with quartic ease-out. The target gets focus with `preventScroll`. Night sections with a top limb scroll past the limb, so the heading lands under the header.

### Preloader
- **Layout:**
  - Night field.
  - Row 1: the logo lockup at left; the counter (0→100, tabular) with an 8-dot spinner at right (steps(8), 1.1s).
  - Row 2: a mono list of the three cities at left, the dot world map (max 520px) with amber city dots in the center, and the eight services right-aligned at right.
- **Timing:**
  - It counts to 90 over 1.6s (0.5s on a repeat visit in the same session), waits for fonts, then finishes to 100.
  - Exit (power3.inOut): lists fade up with a 0.02 stagger, the map scales to 0, the logo travels by FLIP into the header's exact logo slot, and the field fades out over 0.6s.
  - The hero entrance starts at 0.95s into the exit.
- **Reduced motion:** there is no preloader.

### Hero entrance (the authored moment)
- **The mountain rig** (GSAP on a plain object the render loop reads):
  - Scale 0.6→1 and x-shift 7→0 over 1.4s, expo.out.
  - Glow 0→1 over 1.3s, circ.inOut.
  - Arcs and chips 0→1 over 0.9s.
- **Chips** blur in (5px→0) with a 0.07s stagger.
- **Headline:** lines rise from masks (yPercent 110→0, 1.1s expo.out, stagger 0.08). The lede and buttons rise 24px and fade in.
- **The dive** (scrubbed over the 210vh hero):
  - The camera climbs from the Hinnom valley up the south face to the crest of Mount Zion.
  - The amber altitude contour climbs the hill.
  - The headline block drifts up 16% and fades by 42% progress.
  - The dawn limb rises (`yPercent 100 → 0` at full opacity, never a fade) from 42% to 100%, ending in pure snow that meets the intro. GSAP's `fromTo` zeroes `y` so it does not stack on the CSS resting `translateY(100%)`.

### Two-tone headline
Two block spans in one H2, following the Two-Tone Rule. On night the fill runs Dim Night → Glacier → Snow. On daylight it runs Dim Ink → Glacier → Navy Ink.

### Stat
The figure (count-up from 0, 1s power1.out at `top 85%`, once) sits over a Label, with a top hairline. The row wipes in with clip-path from the left (1.2s expo, stagger 0.12). The figures are real: 25+ years of leadership, 3 offices, 20+ tech stacks.

### Service column
- **Layout:** a 270–340px column on the night band with a 1px left hairline. It holds a 44px dot icon, a Title (max 12ch), and Body Small in Mist.
- **Motion:** on desktop the eight columns ride a horizontal track pinned under the giant type.
  - The track clip is `.track-wrap` with overflow hidden, so columns never slide over the intro copy.
  - The clip's left 48px fades through a mask, so no card is guillotined mid-word.
  - On mobile the track is `width: 100%`, so hairlines run edge to edge.
- **Entrance:** the children rise 24px with a 0.035 stagger.

### Mountain trek (ascent)
Drawn in the page's survey language (dot matrix, hairlines, mono chips, amber as the one live accent), never as an illustration: no tents, flags, casings or filled shapes.
- **Panel:** the left half stays in view (sticky, 100vh) while the stages scroll past on the right. On tablet and mobile it becomes a sticky snow strip (34svh + header room) with a 40px fade below. Code: `trail.ts` (canvas for the mountain, inline SVG for the trail and scale, HTML for camps and climber).
- **Mountain:** Mount Zion from the south, framed closer than the routes sky so the dome fills it: the real skyline (highest ground behind each point, from `heightAt`). The routes-sky dot matrix (7px grid, 6px under 560px wide; body dots 20% navy, skyline band 62%) over a white knockout that hides the contour backdrop. Both edges fade out over 10–14% instead of cropping. Dashed 50 m guides (12% navy) run behind it.
- **Elevation scale:** a hairline axis on the east edge, 10 m ticks, labels every 50 m ("700 m", Micro mono, slate). Labels hide on mobile.
- **Trail:** switchbacks up the dome's face from the trailhead (609 m) to the summit. Straight traverses joined by semicircle hairpins (radius up to 10px), cut inside the ground at each level; legs vary in length, wander toward the summit and tighten as the dome narrows. About one leg per 80px of relief (36px on narrow). Ahead: a 1.2px navy dash (3/4, 55%). Walked: a 2px amber line up to the climber. Always climbs upward on screen; never a road, rail or straight bar.
- **Camps:** an 8px ring (1.5px navy) on the trailhead, two hairpins and the summit; it fills amber once reached, and the summit ring pings. Each has a tag with a 17px hairline leader, pointing outside its hairpin (the summit's points up): `01 Base camp · 609 m` … `04 Summit · 765 m`, elevations from the real profile. Tag states: ahead = snow with a light border and slate text; reached = Night Band with mist text; current (the stage nearest the viewport centre) = amber with ink text, like a focused hero chip. On mobile the tags hide; the stage text names the camp.
- **Climber:** the amber diamond (14px, 2px snow halo), like the ridge rider. It stands on camp s while stage s is centred and walks between camps in step with scroll.
- **Stages:** 32% opacity until the climber passes `top 62%`, then full. Each stage, in order:
  1. A dot icon.
  2. A Stage title.
  3. Body.
  4. A trailing Label phase word: Base camp, Route set, The climb, Summit.

### Contour backdrop (ascent)
- **Layout:** a sticky, full-viewport canvas (`position: sticky; top: 0; height: 100vh; margin-bottom: -100vh`) behind the ascent.
- **Content:** Mount Zion as marching-squares contours at real 10 m intervals (610–760 m), in Brand Navy at 7% (minor) and 15% (index contours at every 50 m: 650, 700, 750).
- **Extent:** a 5:3 excerpt of the ground, x −9…9 and z −7.4…3.4 world units (1.26 × 0.76 km): the hill, the Hinnom bend, and the Kidron edge. The intro tile shows the same excerpt, captioned "Mount Zion, Jerusalem · 10 m contours".
- **Fit:** cover-fit, so the hill never distorts on portrait screens.
- **Live line:** a 1.5px Brand Navy contour at 34% sits at the altimeter's current altitude. It is navy, not amber, because it crosses copy, and an amber line through text reads as a strike-through. Between the hero and the summit, this is where the mountain stays physically present.

### Ridge and rider (routes sky, signature)
UC's truck on its road, rebuilt as a climber on a ridge.
- **Ridge:** Mount Zion's silhouette seen from the south (the max `heightAt` over z, for x −14…14): the west shoulder across the Hinnom, the Hinnom saddle, then the dome. It is drawn as a dot grid (7px pitch, 6px on mobile) standing on the service band. The body is Brand Navy at 16%; the ridge line is 62%. It sits in front of the giant type.
- **Rider:** the amber diamond (14px, rotated 45°) plus a climber chip with the live altitude.
- **Motion:** the rider climbs from the west base (6% across), over the shoulder and through the saddle, to the top of the dome (`ZION.peakAt`, 52% across), driven by the pinned track's scroll progress. On mobile it is driven by the section's pass. The same diamond then carries on down the ascent rail.

### Dot world map (base camps)
- **Map:** a canvas raster in #1F3566 on night (#2A3B63 in the loader, #C9D2E3 on snow in the footer), with an SVG overlay in the same 180:68 space.
- **Arcs:** each has a 30% amber base arc that draws in (1.8s power3.inOut) and a 2px amber head that travels on a loop (3.6s Dallas→HCMC, 1.6s HCMC→Da Nang) while the map is on screen.
- **Cities:** 10px amber dots with a ping ring, and Night Band chips with live local time. Hover or focus fills a chip amber.
- **Chip offsets:** chips keep their CSS `translate` offsets. Never tween them with GSAP transforms, because GSAP writes an inline `translate: none`.
- **Below the map:** an offices row in three columns, each with a Title, address in Mist, and phone in Amber mono. There are no icons; a glyph with no meaning is decoration. The row blurs in (6px, stagger 0.1).

### Day bar
Two 12px rows on a shared 24h UTC track with hourly ticks. The work window is 08:00–17:00 local: Dallas in amber, Vietnam in glacier. A 1px snow "NOW" rule marks the current UTC time.

### Case cell
- **Layout:** a three-column hairline grid, 240–320px tall, 28px padding. Each cell has a navy dot icon that names the subject (cloud, analytics, discovery), a Title LG pushed to the bottom, and a Pending tag.
- **Hover:** the cell goes to Ice.
- **Entrance:** clip-path rises from the bottom (1.1s expo, stagger 0.1).

### Inputs / Fields
- **Label:** mono 10.5px in Mist, stacked above the field.
- **Field:** Body 17px Snow text on transparent, with a single 1px bottom rule at 28% white (55% on hover). No box, no radius.
- **Focus:** the rule turns Xion Amber, plus a 1px amber underline.
- **Error:** `aria-invalid` turns the rule Error, and a mono status names the problem and the fix.
- **Submit:**
  - When `data-endpoint` is set, the form POSTs JSON, shows "Sending your brief…" with the button disabled, then either "Brief sent. We reply by email." or an error with a phone fallback.
  - With no endpoint (the current state: no inbox exists yet), the status says plainly "Not sent yet: online sending is not live" in Mist (`data-state="info"`) and hands over the phone line. It never claims receipt, and it keeps the fields filled.
  - Status text is amber on success. An inline link in a status is Snow with an amber underline.

### FAQ accordion
- **Layout:** an Ice field with hairline rows. The question is a Title in a full-width button; the answer is Body in Slate, max 56ch.
- **Icon:** a 14px plus built from two 2px bars, rotating 45° into a cross (0.5s expo).
- **Motion:** the height tweens 0↔auto (0.5s/0.45s power2.inOut), using the `hidden` attribute plus `aria-expanded` and `aria-controls`.

### Footer
- **Top:** a snow field with a light dot map (columns 1–5) and three columns (Base camps, Call, Explore) with Label heads.
- **Wordmark:** the mark plus XIONTECHS at 11.4vw (10.2vw on mobile), Saira 800 125% in Brand Navy.
- **Dictionary entry:** directly under the wordmark (see below).
- **Legal:** a hairline row with ©, the secondary tagline, and "Back to base camp".

### Pronunciation subtitle (signature)
Many people misread the name. The fix is to teach it the way a dictionary teaches a new word.
- **Content:** `/siː.ɒn.teks/`, exactly as the owner specified (with the plural /s/ of Techs).
- **Placement:** under the wordmark in the preloader and the header, left-aligned to the word, 6px below it. It is absolutely positioned, so it adds no height and the preloader-to-header FLIP stays exact.
- **Type:** IPA role, 11px, `currentColor` at 80%. It follows the header theme (snow on night, navy on daylight).
- **Motion:** when the header compacts to XT, it fades out and lifts 4px (0.4s opacity, 0.5s expo translate). It returns with the full word.
- **Accessibility:** the visual line is `aria-hidden`; the logo link says "XionTechs, said see-on-teks, back to the top".

### Dictionary entry (footer)
The name set as a dictionary headword, the page's last word.
- **Markup:** a `<dl>` labelled "How to say XionTechs": `dt` headword, then `dd` rows for IPA, sound-out, and definition.
- **Row:** headword **Xi·on·techs** (Saira 700 125%, Title LG, Brand Navy, mixed case like a real headword); IPA `/siː.ɒn.teks/` at 17px in Navy Ink with a `NOUN` part-of-speech tag (Micro, Slate); under it the sound-out **Say it: see · on · teks** (Label, Slate, syllables in Navy Ink 600); at the right, the definition (Body Small, max 46ch): "Named for Mount Zion, the legendary mountain. The team that takes a product from base camp to summit."
- **Grid:** `auto auto 1fr minmax(0, 46ch)`, baseline-aligned, gap 10px 32px. On mobile it stacks in one column.
- **Color:** no amber on snow. Every tag uses Slate, not Dim Ink, because Dim Ink fails 4.5:1 at these sizes.

## Do's and Don'ts

### Do:
- **Do** drive every scroll-linked scene with GSAP ScrollTrigger `scrub: true`, `ease: "none"`, under a Lenis instance at `lerp: 0.1` synced through `gsap.ticker`. Create pinned triggers before the triggers below them.
- **Do** run entrances from an already-visible default: set hidden states in JS only, and ease with expo.out over 1.0–1.2s. Vary the entrance per section: mask rise (hero), rise (intro copy), wipe (stats), clip rise (cases), blur (chips), scrub fill (headlines).
- **Do** keep reduced-motion users on native scroll: no preloader, no pins, no cursor, no scramble, final states visible, counters at their true values.
- **Do** put `scene.background` on the Three.js scene, not only the clear color. The bloom pass restores the clear color outside a render target and double-encodes the night to #1C324D.
- **Do** keep the render loop gated: it runs only while the hero or the summit is on screen and the tab is visible.
- **Do** pass every full-bleed night and daylight change through a horizon limb (the Dawn Rule).
- **Do** keep amber at or under 5% of a resting viewport (the Amber Ration Rule).
- **Do** tag every placeholder with the Pending mono tag until the user supplies the real content.
- **Do** clip sections whose decoration bleeds past the grid (`overflow-x: clip` on the summit, for its copy scrim). A pseudo-element 25% wider than the viewport once pushed the mobile MENU off-screen.
- **Do** keep a physical trace of the mountain in every scene (particles, dot ridge, contours, dot map): the page is one climb, not a stack of type slides.

### Don't:
- **Don't** put an eyebrow or kicker above a heading. UC's "ONE OPERATOR" was deliberately not carried over.
- **Don't** set amber text or thin amber rules on snow.
- **Don't** use box shadows, glass or blur panels, or gradient text at rest.
- **Don't** lift the night into pale blue haze or wash the palette toward pastel. The soft rewrite of 2026-09-29 was rejected for exactly that.
- **Don't** animate layout properties (margin, padding, width, height) outside the FAQ panel height tween. Use transforms, clip-path, opacity, and filter.
- **Don't** tween transforms with GSAP on elements whose position depends on the CSS `translate` property (map chips, 3D chips). GSAP inlines `translate: none`.
- **Don't** invent claims: no client logos, per-case metrics, pricing, certifications, or testimonials.
- **Don't** use mono for prose or uppercase for body text.
- **Don't** fade a horizon limb (the Limb-Never-Fades Rule).
- **Don't** give a card or list item an icon that carries no meaning.

## Motion System

| Token | Value | Use |
|---|---|---|
| `--ui` | cubic-bezier(.445,.05,.55,.95), 0.4s | hover and state colors, borders, opacity (UC's own curve) |
| `--expo` | cubic-bezier(.16,1,.3,1) | entrances, menu wipe, header translate, FAQ icon |
| `--inout` | cubic-bezier(.65,0,.35,1) | the logo fold (0.7s) and choreography |
| GSAP `expo.out` | 1.0–1.4s | hero rig, headline masks, section entrances |
| GSAP `power3.inOut` | 0.3–0.9s | preloader in and out, arc draw |
| GSAP `circ.inOut` | 1.3s | 3D glow rise |
| GSAP `power1.out` | 1s | count-up figures |
| GSAP `none` | scrubbed | hero dive, dawn rise, pinned track, giant drift, ridge rider, headline fill and focus pull, route fill |
| Lenis | lerp 0.1, wheelMultiplier 1 | page scroll |
| Anchor scroll | 1.6s, 1-(1-t)^4 | menu and CTA jumps |
| Cursor | lerp 0.15 per frame | ring follow |
| Scramble | 28ms per tick, 3-tick head start | mono labels |
| Stagger | 0.02 (loader out), 0.035 (service parts), 0.05–0.08 (chips, lines), 0.1–0.12 (cells, stats) | |

## 3D Scene Specification (mountain.ts)

- **Terrain:**
  - The real relief of Mount Zion, Jerusalem (31.7717 N, 35.2286 E; published 765 m), from AWS Terrain Tiles (Terrarium, zoom 15, SRTM-derived, 4.06 m per pixel, public domain). `scripts/build-zion.mjs` fetches and caches the 3×3 tiles in `.impeccable/zion-tiles/`, decodes them, and writes `src/scripts/zion-data.ts` (a 129×97 Uint16 grid in base64, sampled bilinearly by `heightAt`).
  - Axes: x runs east and z runs south, so the camera stands in the Hinnom valley looking north. The Wikipedia summit point is the origin; the highest sample of the western hill is `ZION.peakAt` (0.75, −4), about 280 m north, on the crest of the western hill inside the Old City walls (historically part of Zion).
  - Scale: one world unit is 70 m on the ground. Relief above the valley floor (618 m in the data) is 163 m, drawn at 6.4 units, a vertical exaggeration of ×2.75, the standard relief-map practice that lets a 163 m hill read as a mountain.
  - Processing: a 22 m Gaussian blur removes roof and street noise but keeps every landform wider than about 50 m. A radial skirt (full height to 420 m, zero at 950 m, 1.5× tighter to the north) lets the hill stand alone; inside it, the Hinnom valley on the west and south, and the fall to the Tyropoeon and Kidron on the east, are untouched.
  - Height to metres: `unitsAt(m) = (m − 602) / 163 × 6.4`. The altimeter, the topo contours, and the summit chip all use this one mapping.
  - Sampled every 0.07 units (0.105 on mobile) over ±15 × (−10.5…11.25), about 90k points, with per-point normals from finite differences.
- **Point shader:**
  - Valley glacier (0.08, 0.2, 0.62) blending to snow (0.9, 0.93, 1.0) by height, smoothstep 0.1→0.9. The real crest is broad, so only its top turns white, and per-point alpha rises 0.46 with height (not more), so the plateau never reads as a white blob.
  - Faint contour bands every 1/12 of the height.
  - Rim light is Fresnel-style, `pow(1 - |n·v|, 3)`, tinted glacier low and dawn amber high.
  - One amber altitude contour at the climbed height.
  - Point size is clamped to 2.4 px × DPR. Alpha fades by depth, radius, and front edge.
  - Additive blending, no depth write.
- **Light:**
  - The dawn: an amber-orange glow plane behind the ridge (gain 0.32).
  - The ground glow: a glacier plane on the valley floor (gain 0.2).
  - 1,600 stars.
- **Marks:**
  - Camps: Dallas (−1.5, 4.5), HCMC (2.4, 3.6), and Da Nang (3.4, 2.4), each with an amber dot, a pulsing ring (×1–2.6), and an arc to the summit. The arc head travels at 0.14 cycles/s from ember to amber.
  - The summit (`ZION.peakAt`) has a beacon and an amber chip, "Mount Zion · 765 m".
- **Camera:**
  - Hero: from base camp (−2.5, 5.4, 20 → look −5.2, 3.2, 0) up the south face to the crest (1.4, 9.4, 8 → look 0.4, 5.8, −4), eased with smoothstep and lerped 0.07 per frame.
  - Summit: (0.75, 14.5, 21 → look 0.75, 4.6, −4). The crest sits in the gap between the headline and the brief form, and a night radial scrim (`.summit-head::before`, 88% → 0) keeps the copy clear of the ridge.
  - The pointer adds ±0.9 horizontal and ±0.45 vertical parallax.
  - Mobile has its own stations.
- **Post:** RenderPass, UnrealBloom (0.55 / 0.18 / 0.72), OutputPass.
- **Fallback:** with no WebGL, `.no-webgl` paints a CSS dawn-and-glacier gradient on the night.

## Accessibility

- **Skip link:** the first focusable element is a skip link (amber, slides in on focus).
- **Focus rings:** 2px, offset 3px, Xion Amber on night and Brand Navy on daylight.
- **Hidden decoration:** the 3D canvas, chips layer, cursor, HUD, preloader, giant type, and map canvases are all `aria-hidden`.
- **Real controls:** every city on the map is a real button with its name. The FAQ uses `aria-expanded`, `aria-controls`, and `hidden`. The form has labels and `aria-live` status.
- **Contrast:** body text meets at least 4.5:1 everywhere. Dim headline lines meet at least 3:1 at display sizes.
- **Pronunciation:** screen readers get "said see-on-teks" in the logo's label and the full footer entry as a labelled `dl`; the visual IPA under the logo is hidden from them to avoid reading symbols aloud.
- **Browser surfaces:** selection, caret, scrollbar, and underline offset are themed from the palette.

## File Map

- `src/pages/index.astro`: markup, content arrays, the direction contract comment (first child of `<body>`), and the SVG mark.
- `src/styles/global.css`: every token in `:root`, the `[data-on]` theme contexts, and all components.
- `src/scripts/app.ts`: Lenis, ScrollTrigger scenes, the preloader, cursor, scramble, header, altimeter, clocks, FAQ, and form.
- `src/scripts/mountain.ts`: `heightAt` over the Mount Zion grid, `unitsAt`, and the Three.js mountain, light, camps, arcs, chips, and cameras.
- `src/scripts/zion-data.ts`: the generated Mount Zion relief. Regenerate with `node scripts/build-zion.mjs` (tiles cached in `.impeccable/zion-tiles/`).
- `src/scripts/dots.ts`: dot-matrix icons (vector → 13×13 dots) and the dot world map painter.
- `src/scripts/dotmap-data.ts`: a generated land raster. Regenerate with `node scripts/build-dotmap.mjs`.
- `src/scripts/topo.ts`: marching-squares contours (the intro tile and the cover-fit ascent backdrop), with the amber altitude line.
- `src/scripts/ridge.ts`: the dot-matrix ridge silhouette and the rider over the routes sky.
- `src/scripts/trail.ts`: the ascent trek: Mount Zion in profile, switchback trail, camps and climber.

## Appendix: unitedcarriers.com teardown (2026-09-29)

These are the source measurements behind this system, captured with Playwright (Chromium, SwiftShader WebGL) at 1440×900 and 390×844. The raw frames, code chunks, and contact sheets are in `.impeccable/uc-research/`.

- **Stack:** Webflow markup with a Vite bundle (`united-carriers.netlify.app/main.js`) that code-splits GSAP, ScrollTrigger, Lenis (lerp 0.1 default), Barba page transitions, Swiper, a Three.js globe chunk, a frame-sequence player, and Ocean/Wake scenes.
- **Tokens:** primary #0016CB, secondary #F50, black #111, bg-sf-1 #F4F4F4, border main #1113, border light #1111111A.
  - The root font-size is `0.5787vw`, so 1rem = 10px at 1728px.
  - The container has 16 columns, 4rem padding, and a 2rem gap, with max-width 100vw.
- **Type:** BT Steinhart 700 uppercase headings (80/84px at 1440px). Helvetica Neue body (13.3px). BT Steinhart Mono for buttons and labels.
- **Easing census:**
  - CSS: cubic-bezier(.445,.05,.55,.95) ×26, color, opacity, and transform at .4s.
  - GSAP: `ease:"none"` ×60 (scrub), power2.out ×14, power1.inOut ×11, circ.inOut ×7, expo.out ×4, back.out(1.3) ×3, power3.inOut throughout the loader.
  - Durations: 1s ×71, 1.2s ×22. ScrollTrigger `scrub:true` ×27.
- **Preloader:** a black field, the logo at left, a dot world map in the center with blue city dots, country and service lists in gray mono, and a counter with a dotted spinner. The logo travels to the header and the map scales to 0.
- **Hero:**
  - The globe scales 0.4→1 with xPercent 20→0 (expo.out, 1s). Orange and blue shadows go from blur 20px to 0 (circ.inOut, 1.2s), with back.out(1.3) pops.
  - Globe labels blur in (5px, y 10, stagger .05).
  - Pill CTAs: a white filled pill and an outline pill.
- **Story:**
  1. The globe dives into a blue atmospheric limb and hands off to a white intro with a two-tone headline and count-up stats (power1.out, 1s, top 85%).
  2. A reach-stacker-to-truck frame sequence runs under the giant "OUR SERVICES" type over a black service band, with a KM/H speedometer (velocity/25, max 95, jitter above 500px/s, ease .1 up, .06 down, .15 to zero).
  3. The road turns vertical for "RELIABILITY AT EVERY MILESTONE", with features along it.
  4. A top-down container ship, then clouds and a plane.
  5. Testimonials, then a hairline partner grid with hover cells.
  6. A blue limb into the dark "WHAT'S MOVING" insights.
  7. An FAQ, the black "READY TO MOVE SMARTER?" CTA, and a white footer with a dot map.
- **Hover:**
  - Mono labels shuffle as anagrams.
  - The white pill fills #F50 and the outline border brightens.
  - The cursor hides on buttons.
  - The cursor itself is a 64px (10px rem) ring at 10% white with a progress outline and a 5px dot, blend difference, lerp 0.15, and trail dots on links. The native cursor stays.
- **Header:** a 32px news ticker with mono links, a logo whose letters collapse UNITEDCARRIERS → UC, a four-dot MENU toggle (dots at .24/.5/.7/1), and a WORK WITH US pill.
