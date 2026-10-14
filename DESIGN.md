---
name: XionTechs
description: The Night Ascent. A B2B landing page for an AI-powered IT services and products team, built as a climb from base camp to summit, with unitedcarriers.com-grade motion on the XionTechs navy and amber.
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
    fontSize: "clamp(2.2rem, 11.2vw, 3.4rem)"
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
  value-column:
    backgroundColor: "{colors.night-band}"
    textColor: "{colors.snow}"
    typography: "{typography.title}"
    width: "clamp(270px, 23vw, 340px)"
    padding: "32px clamp(24px, 2.4vw, 36px)"
  log-row:
    backgroundColor: "transparent"
    textColor: "{colors.navy-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "18px 0 20px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.navy-ink}"
    typography: "{typography.micro}"
    rounded: "{rounded.chip}"
    padding: "5px 8px"
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
  dial-chip:
    backgroundColor: "{colors.snow}"
    textColor: "{colors.slate}"
    typography: "{typography.micro}"
    rounded: "{rounded.chip}"
    padding: "4px 7px"
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

<!-- v2.3 · 2026-09-30 · v2.3 adds the Symbol Rule: the mountain is a symbol and a goal, Mount Zion is named once in the story and in no label. v2.2 re-lays the landing page on newxion.com content: Main, Mindset and core values, The log (achieved, done, products, customers), FAQ, Contact (base camps, then the brief), Footer. v2.1 swapped the procedural massif for the real relief of Mount Zion and added the pronunciation. Recorded from the built page (src/pages/index.astro, src/styles/global.css, src/scripts/*.ts). Tokens here are normative; global.css :root mirrors them one to one. v1 was the pre-build target extracted from unitedcarriers.com. -->

# Design System: XionTechs

## Overview

**Creative North Star: "The Night Ascent"**

The mountain is XionTechs' symbol and goal, and the landing page is a climb up it. The name is inspired by Mount Zion, but the page is not about that place (the Symbol Rule: the story names Mount Zion once as the inspiration; no label, caption, chip, reading, or coordinate names it, and the copy carries no religious text). It opens at night at base camp: a Three.js mountain made of white particle dots under stars. The shape is not invented; the relief data is the real SRTM ground of Mount Zion (see the 3D spec), used as form only. An amber dawn glows behind the ridge and a glacier-blue rim light catches the lower slopes. Chips mark the camps where the team lives, Plano, TX and Ho Chi Minh City. As the visitor scrolls, the camera climbs toward the summit and dawn breaks. A curved atmospheric limb, glacier blue with an amber sunrise line, hands the page to snow-white daylight. From there the page reads in daylight: the story of Xion, the seven core values on a night band, and the log of the climb so far. The last night opens on the two base camps and ends on the summit, where the visitor names their project. The footer closes in daylight with the wordmark at mountain scale.

The mechanics come from unitedcarriers.com (Awwwards Site of the Day, teardown in the appendix), because the user named it as the quality bar:
- GSAP ScrollTrigger scenes scrubbed to scroll. UC's Lenis smooth scroll is not used: its 0.8s glide after each wheel step read as lag (UAT round 1, #40), so the page runs on the browser's native scroll.
- A preloader with a dot world map and a counter.
- Mono button labels that shuffle their own letters on hover.
- Two-tone uppercase headlines whose ink line fills word by word.
- A giant background type band over a dark service track.
- Hairline grids, dot-matrix icons, and a strict dark and light rhythm joined by atmospheric horizons.

Only the story and the palette are XionTechs': the globe becomes the mountain, freight lanes become routes to the summit, the KM/H speedometer becomes a climb altitude (read by the ridge rider and the contour maps), and UC's electric blue and orange become the logo navy and amber.

The mood is heavy, exact, and confident. It is not soft; a pale-haze, rounded, sentence-case rewrite was tried and rejected. Density is low: sections run tall, type runs big, and a lot of the screen is left empty.

**Key Characteristics:**
- One continuous story: night, dawn, daylight, dusk, summit, daylight.
- One mountain, a symbol: the same relief in 3D, as contours, and as the ridge silhouette, never labeled with a place name. The page's altitude reads its metres, from the 765 m summit down to 0.
- The name teaches itself: /siː.ɒn.teks/ hangs under the wordmark, and the footer closes with a dictionary entry.
- Saira at 125% width, uppercase, carries every heading. Host Grotesk carries prose. Martian Mono carries every control, label, and reading.
- Flat surfaces and 1px hairlines. No shadows, no cards with depth, no glass.
- Pills for controls, a 2px radius for chips, square for everything else.
- Motion is scrubbed to scroll or answers a gesture. The only things that loop are the 3D scene, the map beacons, and the route arcs, and only while on screen.
- Every interactive element answers the pointer: an amber fill or a cell tint. The pointer is the system's own.

## Colors

The palette is the two logo colors, brand navy and Xion amber, stretched across a full night-to-snow value range. Glacier blue, derived from the navy hue, adds light. It works as a strict rhythm of dark and light fields, not accents scattered on one ground.

### Primary
- **Brand Navy** (#103060): the logo navy.
  - The filled button on daylight, the ink of the footer wordmark and the logo mark, the contour lines of the topo tile (at 34% and 72% alpha), and the dot icons of the log.
  - It is also the focus-ring color on daylight surfaces.
- **Xion Amber** (#F8C000): the logo swoosh.
  - Always: the "GET IT DONE." hero line, the dial's filled arcs and current chip, the 3D beacons and arcs, the map beacons and arcs, office phone links on night, and the altitude's amber contour on the topo tile.
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
- **Night Band** (#07101F): dark fields inside the flow: the value track, the brief form panel, and map chips.
- **Navy Ink** (#0B1A33): primary text on snow and ice (17.4:1 on white), and the text on any amber fill (10.4:1).
- **Snow** (#FFFFFF): daylight sections (mindset, values sky, the log, footer).
- **Ice** (#F3F5F9): the FAQ field, subpage cell hovers, and the sky of the base camps' dusk limb.
- **Mist** (#A9B4CC): secondary text on night (9.6:1).
- **Slate** (#4A5670): secondary text and captions on snow (7.4:1).
- **Dim Ink** (#858FA1): the dim first line of two-tone headlines on daylight (3.3:1, display sizes only).
- **Dim Night** (#76839F): the dim first line on night, plus the loader lists and the day-bar axis (5.2:1, so it passes at micro sizes too).
- **Giant Ink** (#E6EBF3): background type on snow. It is atmosphere, never the only carrier of meaning.
- **Map Dot Night / Loader / Snow** (#1F3566, #2A3B63, #C9D2E3): the land dots of the world map on night, in the preloader, and in the footer. The map is always quieter than its amber beacons.
- **Error** (#FF9A7A): form error text and invalid field rule on night (8.7:1).
- **Hairlines:** `rgba(255,255,255,.12)` on night, `rgba(11,26,51,.12)` on daylight.

### Named Rules
**The Dawn Rule.** Full-bleed night and daylight never meet at a straight edge. Night to daylight goes through a dawn limb (a snow dome rising from below, glacier band, amber sunrise). Daylight to night goes through a dusk limb (a night dome rising under a white or ice sky). Bands inside a section, like the value track under the giant type, may cut hard: they are ground, not sky. Night to night needs no limb: the base camps' ground fades over its last 220px into the WebGL night of the summit.

**The Limb-Never-Fades Rule.** A horizon moves; it never fades. Snow faded over night at partial opacity reads as grey mud (measured #252933 → #D8D9DB on the first build). A limb rises or sets as a whole (the hero dawn is `yPercent 100 → 0` at full opacity) so the saturated glacier band always leads.

**The Amber Ration Rule.** At rest, amber covers at most about 5% of any viewport: one headline line, beacons, a route, a few links. It floods a surface only as a response: the hover fill of a filled button, or the focus fill of a chip.

**The No-Amber-On-Snow Rule.** Amber is never text or a thin rule on white (1.6:1). On daylight, amber appears only in these forms:
- As a fill that carries navy ink.
- As a 2px graphic line inside a bounded figure (the intro topo tile's altitude contour).
- As the dial's filled arcs.

A live line that crosses copy is navy.

**The One-Office-List Rule.** The offices are always Plano, Ho Chi Minh City, Da Nang, in that order, and every count matches the list ("Three offices. One team."). Plano carries an amber "US contact point" tag on the landing offices and on Contact us, because US buyers look for it first (UAT round 1, #43).

**The Plain-Words Rule.** The mountain is the picture, not the vocabulary. Every heading, button, link, and nav label says what the section is or does in business words, so a visitor who never reads the story still knows what XionTechs sells ("Our work.", "Questions before you start.", "Start a project.", "Back to top"). Climbing words may stay in decoration only: the 3D chips, the rider reading, and the footer's dictionary entry (UAT round 1, #42).

**The No-Placeholder Rule.** Visitors never see an internal note. Anything the user must still supply (customer names, quotes) stays off the page and is tracked as a GitHub issue (#20); an entry shows only the facts on hand. A placeholder that looks finished is a fabrication, and one that says "pending" tells a buyer we have nothing to show (UAT round 1, #37).

## Typography

**Display Font:** Saira Variable, `font-stretch: 125%` (wdth 125), weights 700–800 (fallback: Saira, Arial Narrow, sans-serif)
**Body Font:** Host Grotesk Variable, weight 400 (fallback: Helvetica Neue, Arial, sans-serif)
**Label/Mono Font:** Martian Mono Variable, weights 400–500 (fallback: ui-monospace, SFMono-Regular, monospace)

**IPA Font:** Noto Sans Mono Variable, weight 400, used only for the pronunciation `/siː.ɒn.teks/` (token `--ipa`, falling back to the mono stack).

All four are self-hosted through Fontsource (OFL): `@fontsource-variable/saira/wdth.css`, `@fontsource-variable/martian-mono/wdth.css`, `@fontsource-variable/host-grotesk`, `@fontsource-variable/noto-sans-mono`. Saira ships a Vietnamese subset, so office addresses set correctly.

**Character:** Saira at 125% width has the squared, rounded-corner forms of the XIONTECH wordmark, so the headings speak in the logo's voice. It does the job UC gives to BT Steinhart. Host Grotesk is a quiet Helvetica-class body that never competes. Martian Mono is wide and technical, like BT Steinhart Mono at UC, and it is the voice of the machine: buttons, clocks, coordinates, altitude, counters.

### Hierarchy
- **Display** (760, clamp(3rem, 6.2vw, 6rem), 0.92, -0.012em, uppercase): the hero H1 only, four lines: WHERE / INTELLIGENCE / MEETS IDENTITY. / GET IT DONE. The last line is amber. Mobile uses **Display SM** (clamp(2.2rem, 11.2vw, 3.4rem)), sized so INTELLIGENCE holds one line down to 320px; MEETS IDENTITY. may wrap there.
- **Giant** (800, clamp(7rem, 21vw, 21rem), 0.74, -0.02em, uppercase, Giant Ink): the background type band over the value track. It is `aria-hidden`, and a real H2 carries the heading.
- **Headline** (760, clamp(2.25rem, 4.4vw, 4.25rem), 0.94, -0.01em, uppercase, balanced): every section H2, always two-tone. On ≥768px the intro H2 is sticky at `bottom: 60px`. **Headline Compact** (clamp(1.75rem, 2.8vw, 2.75rem)) is the same role inside the value band.
- **Figure** (760, clamp(3.5rem, 7vw, 6rem), 0.9, -0.02em, tabular): count-up statistics. In the log's three-up row it runs at clamp(2.75rem, 4.6vw, 4.5rem).
- **Stage** (760, clamp(1.5rem, 2.4vw, 2.25rem), 1.04, uppercase): the four log entries.
- **Title LG** (700, clamp(1.25rem, 1.8vw, 1.625rem)) and **Title** (700, clamp(1.125rem, 1.5vw, 1.375rem)), uppercase: the footer headword, then value names, log rows, the mission head, office names, and FAQ questions.
- **Logo** (760, 17px, 0.02em, uppercase): the header and preloader wordmark.
- **Quote** (400, clamp(20px, 1.9vw, 26px), 1.4, pretty wrap): testimonials. Reserved: no quote ships until the user supplies one.
- **Lede** (400, clamp(17px, 1.35vw, 19px), 1.5, max 44–46ch): the hero and story paragraphs.
- **Body** (400, 17px, 1.5, max 40–60ch) and **Body Small** (400, 15px, 1.5, max 30ch in value columns): prose.
- **Button** (Martian Mono 500, 12px, 0.03em, uppercase): every pill and the menu toggle.
- **Label** (Martian Mono 500, 11px, 0.04em, uppercase): stat labels, the trailing camp name of a log entry, footer column heads. A label never sits above a heading. Form labels and office roles (500), the top-bar CALL and WhatsApp links and the footer language switcher (400) are 12px, the accessibility floor for contact details and form labels (UAT #84).
- **Micro** (Martian Mono 400–500, 10–10.5px, 0.05em, uppercase): the ticker clocks, chips, domain tags, the rider reading, captions, and the legal line. 10px is the floor on every breakpoint.

- **IPA** (Noto Sans Mono 400, 11px under the wordmark, 17px in the footer entry, 0.02em, never uppercase): the pronunciation only.

### Named Rules
**The Two-Tone Rule.** Every H2 is two statements: a dim line (`.tt-a`) and an ink line (`.tt-b`), each `display:block`.
- On daylight (and inside the value band), each word of the ink line passes from dim through Glacier to ink, stepping 0.14 per word, scrubbed between `top 85%` and `top 40%`.
- On full night sections (base camps, summit), the ink words pull into focus instead: blur 10px→0 and opacity 0.15→1, stagger 0.12, scrubbed `top 85%`→`top 45%`. It reads like a summit coming out of cloud.
- Without JS or with reduced motion, the final colors show at once.

**The Mono-Means-Machine Rule.** Mono is only for what you press or read as data: buttons, the menu, chips, clocks, coordinates, altitude, counters' labels, legal tags. Paragraphs are never mono.

**The Uppercase-Is-Display Rule.** Uppercase belongs to Saira headings and mono labels. Body text is always sentence case.

**The IPA-Needs-Its-Own-Face Rule.** Saira, Host Grotesk, and Martian Mono all lack ɒ (U+0252) and ː (U+02D0); measured in the browser, both fall back to a system face. The pronunciation is therefore set whole in Noto Sans Mono, never glyph by glyph, so the string keeps one rhythm. IPA is phonetic data: it is never uppercased and never letter-spaced beyond 0.02em.

**The Tabular Rule.** Every number that changes in place (clocks, altitude, figures, the loader counter) uses `font-variant-numeric: tabular-nums` so digits never jitter.

## Layout

- **Grid:** 12 columns, `repeat(12, minmax(0, 1fr))`, gap 20px, full bleed with a side gutter of clamp(20px, 2.8vw, 40px). The page has no max width, like UC (whose container is 100vw).
- **Recurring spans:**
  - Headings take 1/7 or 1/8.
  - Copy takes 8/13 or 9/13.
  - Sticky side heads (ascent, FAQ) take 1/6 against content at 7/13 or 8/13.
  - The header row is logo, middle, CTA (`1fr auto 1fr` from 1280px, so the section links sit at the true centre; below that the menu toggle sits next to the CTA).
- **Vertical rhythm:**
  - Section padding is clamp(120px, 12vw, 190px).
  - Sections that open or close on a horizon pad with min(60vh, 560px) so the limb has room.
  - Headings get more space above than below.
- **Section order and fields:**
  1. Main: hero `#top` (night, 210vh with a sticky 100svh stage)
  2. Services `#services` (snow): what a buyer can hire XionTechs for: the digital product engineering services (#35)
  3. Platform `#platform` (snow): the smart-school product as one architecture chart, four tiers on a y-axis
  4. The log `#work` (snow, sticky head and dial): achieved, done, products, customers
  5. Why XionTechs `#why` (snow): four reasons, each led by its proof
  6. FAQ `#faq` (ice)
  7. Contact, one night: base camps `#camps` (night, dusk-ice limb in, fading out into the scene), then the summit `#summit` (transparent over the WebGL night, dawn limb out)
  8. Footer (snow)
  - The story of Xion (`#mindset`) and the core values (`#values`) live on About us since #36: on the landing page they stood between the hero and what XionTechs does, and buyers lost the thread. The hero carries no buttons (#107): its "Talk to our experts" pill repeated the header CTA ("Start a project", to the brief), and the mindset pill told a buyer nothing.
- **Class names keep the mountain vocabulary** (`.intro`, `.routes`, `.gear`, `.strata`, `.ascent`, `.camps`, `.summit`); ids carry the content names.
- **Breakpoints:** desktop ≥ 992px. Tablet 768–991px: headings and copy stack to full width, sticky heads go static, and the route strip moves to columns 1/3. Mobile ≤ 767px:
  - The header becomes a flex row (logo left, menu right), and the CTA, the ticker phones, and the 3D camp chips hide.
  - The hero shortens to 170vh, the values stack vertically with no pin, the route strip narrows to 36px, and the map bleeds to the viewport edge.
- **Header geometry:** a 32px ticker plus a 64px row (96px total). After 40px of scroll the whole header translates up 32px, so the ticker slides away with a transform, not a layout change.

### Subpages

The landing page is for a new buyer and stays lean. Everything else from the old xiontechs.com lives on subpages at its old URL, because app store listings link to `/support/` and `/privacy-policy/`.
- **Pages:** `/about-us/`, `/faqs/`, `/careers/` plus five closed `/job/<slug>/` posts, `/contact-us/`, `/support/`, `/privacy-policy/`, `/terms-of-service/`, `/cookie-policy/`, and a 404. Long texts are Markdown in `src/content/` (collections in `src/content.config.ts`).
- **Head (night):** `layouts/Sub.astro`. The H1 is a two-tone Headline at 1/9, and the lede and meta chips sit at 9/13 on the baseline. Mount Zion's contour map (the intro tile, recoloured for night, `cover`) fills the right side under a radial mask, and its amber contour follows the altitude. A dawn limb (`clamp(200px, 30vh, 320px)`) rises whole on load, which is the Dawn Rule, and the first daylight band starts close under it. Contact has no limb; it stays on night down to its own dawn above the footer.
- **Bands (daylight):** hairline cell grids (`.cells`; the 1px gaps are the rules), a sticky side head against a body at 8/13 (`.split`), and figure rows (`.figures`). Long texts use a sticky "On this page" index at 1/4 (mono, a navy square marks the section being read,) against prose at 5/12, max 68ch.
- **Closing ask:** an ice band (`components/Cta.astro`) before the footer on About, FAQs, Careers, and jobs. Legal texts end on their own content.
- **Menu:** landing sections, a hairline, then About us, Careers, and Support, in a flat panel (Night Band or Snow) so ten links never sit on the headline. Subpages link to landing sections as `/#id`. An arrival with a hash skips the preloader and lands on the section.
- **Footer:** map 1/4, then base camps, reach us, explore, and company columns. A row of languages sits above the legal row, which carries the three legal links.
- **Scripts:** `chrome.ts` is shared (scroll, header, altitude, clocks, accordion, forms). `app.ts` is the landing page and `page.ts` is the subpages; `story.ts` drives the story and the value track on About us. Terrain math lives in `relief.ts`, so subpages never load Three.js (about 183 KB of JS against 690 KB).

## Languages

Seven languages, one design: English (`en`, the source, at `/`), Vietnamese, Simplified Chinese, Japanese, Arabic, French, and Hindi, each under its path (`/vi/`, `/zh/`, `/ja/`, `/ar/`, `/fr/`, `/hi/`). The words live in `src/i18n/locales/<locale>/<namespace>.json`, one namespace per component, read through i18next; a missing key shows the English copy. `src/i18n/README.md` is the translators' guide.

### Language switch
- **Ticker:** the current code (`EN ▾`, Micro, Fg) ends the ticker on every breakpoint. It opens a flat panel like the menu (Night Band or Snow, hairline, clip-path wipe, Esc or an outside click closes, and it closes when the ticker scrolls away).
- **List:** each language named in itself (English, Tiếng Việt, 中文, 日本語, العربية, Français, हिन्दी) with its code in Micro to the right; the current one is Fg with an amber code. Each link opens the same page in that language.
- **Footer:** the same names in a row above the legal line.
- **Face:** names are set in Noto Sans Mono, because Martian Mono lacks the Vietnamese marks. Chinese, Japanese, Arabic, and Hindi names take the system face, so no script face loads for four words.

### Type per language
Each script face follows the brand face in the stack, so Latin words, numbers, and the name keep their brand type. A language's faces load only on its own pages (`src/styles/locales/<locale>.css`, linked by `Base.astro`).

| Language | Display | Body | Mono |
| --- | --- | --- | --- |
| en, fr | Saira | Host Grotesk | Martian Mono |
| vi | Saira (has the marks) | Be Vietnam Pro 400–600 | Noto Sans Mono |
| zh-Hans | Saira → Noto Sans SC | Host Grotesk → Noto Sans SC | Martian Mono → Noto Sans SC |
| ja | Saira → Noto Sans JP | Host Grotesk → Noto Sans JP | Martian Mono → Noto Sans JP |
| ar | Saira → Noto Kufi Arabic | Host Grotesk → Noto Sans Arabic | Martian Mono → Noto Sans Arabic, with the word space from Noto Sans Arabic |
| hi | Saira → Noto Sans Devanagari | Host Grotesk → Noto Sans Devanagari | Martian Mono → Noto Sans Devanagari, with the word space from Noto Sans Devanagari |

**The Whole-Role Rule.** Vietnamese swaps whole roles instead of falling back glyph by glyph: Host Grotesk and Martian Mono have the base letters but not the tone marks, and a per-glyph fallback would set "ế" in another face than "e".

**The Open-Line Rule.** Saira's caps sit inside a 0.92 line. Vietnamese capitals stack marks above and below, and Han and kana fill the em, so Display and Headline open to 1.12 in vi, zh, and ja. Arabic and Devanagari marks rise and fall further: 1.32 for Display and Headline, 1.3 for titles, and 1.7 for body copy. The menu label's rolling window grows to 1.5em in vi, ar, and hi.

**The Whole-Mark Rule.** No clip ever cuts a mark.
- **Hero lines:** each line's reveal clip reaches 0.6em above and beside the line, so the marks stacked over Vietnamese capitals stay whole. Arabic and Devanagari lines get a 0.2em floor for what hangs below.
- **Hero rise:** lines in every language but English rise from 130% instead of 110%, so no mark shows before its line.
- **Giant type:** it stands higher by what its script hangs below the baseline. It also sets smaller where its ink is taller than Latin capitals (`--ink`, the height from the highest mark to the lowest), so the whole word fits inside the sky band.

**The No-Tracking-In-Arabic Rule.** Arabic letters join, and any letter-spacing pulls a word apart, so Arabic text never takes letter-spacing.

### Right to left (Arabic)
- **Mirror:** the layout mirrors through logical properties and grid and flex order. The headline and copy sit on the right, and the menu and CTA on the left. The mountain's camera moves to the other side of the summit (`mountain.ts`), so the hill rises on the left without flipping the terrain.
- **Motion:** the value track, the giant type, the ridge and its rider, and the stat wipes run right to left; the track's fade moves to its exit edge.
- **Kept left to right:** the lockups of mark and name, the world map, the platform chart, the dial, and the 24-hour day bar keep their drawing. Text inside them still reads right to left (`unicode-bidi: plaintext`).
- **Digits:** Latin digits everywhere. Phone numbers carry LTR isolates in `site.ts`, and postal lines render in `<bdi>`, so their digit groups never reverse.
- **Fallback English:** copy that falls back to English on an Arabic page is isolated left to right, so its full stop stays at its own end. Long-form pages without an Arabic file render the English text with `dir="ltr"`, and the title stays anchored to the right edge.

## Elevation & Depth

The system is flat. Depth comes from light and from layers sliding over each other, never from box shadows. The layers:
- The 3D scene: bloom strength 0.55, radius 0.18, and threshold 0.72, so only rims, beacons, and arcs glow.
- The horizon limbs.
- Sticky stages (hero, pinned routes, sticky heads) that later sections pass over.
- The fixed layers, from back to front: canvas (z 0), 3D chips (1), main (2), header (60), preloader (150), skip link (200).

**The No-Shadow Rule.** No element casts a box shadow. To lift, a surface changes field (snow to ice, night to night band) or gains a hairline. The one box-shadow in the system is a 1px amber underline on a focused field, and it is a rule, not a shadow.

**The Light-Is-Depth Rule.** Glow belongs to light sources in the world: the dawn behind the ridge, the glacier limb, the beacons. It is never a halo around a UI element.

## Shapes

- **Pill** (999px): every button, the only rounded control.
- **Chip** (2px): 3D chips, map chips, and the dial chips. Hard, nearly square, like survey tags.
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
- **Diamond:** the ridge rider is a 14px amber square rotated 45°. It is the only rotated shape.

## Components

### Buttons
Character: heavy pills with a machine voice. The fill answers the pointer.
- **Shape:** pill (999px), 44px tall, padding 0 26px, Button type, no wrap.
- **Filled on night:** Snow with Navy Ink text. **Filled on daylight:** Brand Navy with Snow text. The theme comes from the nearest `[data-on]` ancestor.
- **Hover / focus-visible:** fill → Xion Amber with Navy Ink text over 0.4s `cubic-bezier(.445,.05,.55,.95)`. Labels never animate their letters. **Active:** Amber Hi. **Disabled:** 45% opacity, no pointer events.
- **Outline:** transparent, 1px border at 32% of the text color, going to 100% on hover.
- The system pointer stays; no element follows the mouse.

### Pointer and scrollbar
- **Pointer:** the system pointer on every page. No custom cursor and nothing that trails the mouse: a trailing ring covered the text people wanted to read or click (UAT round 1, #39).
- **Scrollbar:** the browser's native scrollbar shows, themed with `scrollbar-color: var(--dim-night) var(--night)`. Where it takes space (Windows, macOS "always show"), the fixed header and its ground end at its edge (`root.clientWidth`).

### Altitude (no HUD)
- **Reading:** metres above sea level, linear in page progress from the published summit (765 m, `ZION.summitM`) at the top of the page down to 0 at the bottom, rounded to 1 m. Scrolling down is the descent. `chrome.ts` computes it and calls `onAltitude` watchers.
- **Readouts:** only in the flow of the page: the rider chip over the routes sky and the amber/navy contour on the topo tiles. The page never shows two different altitudes.
- **No fixed HUD:** the bottom-corner altimeter (`ALT · V/S · BEACON`) was removed (UAT round 1, #41): it printed over headings and chart labels, and the readings meant nothing to a buyer. No fixed element may sit over page content.

### Header
- **Ticker (32px, Micro):**
  - Left: live clocks, `PLANO, TX 08:15 CT · HO CHI MINH CITY 20:15 ICT`. They update on the minute, and mobile uses short names.
  - Right: the phone and WhatsApp links, then the language toggle (see Languages).
  - A hairline sits under it.
- **Row (64px):**
  - The logo: the mark plus XIONTECHS, with the pronunciation subtitle under the word (see Pronunciation subtitle). After 80px of scroll, "ION" and "ECHS" collapse through `grid-template-columns: 1fr → 0fr` over 0.7s, leaving **XT**, like UC's UNITEDCARRIERS → UC.
  - The `•••• MENU` toggle: four 3px squares at opacity .24/.5/.7/1. On hover they go to 1 and the odd dots hop 2px. On open, MENU rolls up and CLOSE rolls in.
  - From 1280px, the six section links (Services to Offices, Micro-sized Button type, Fg Soft) sit in the row, centred, with `COMPANY ▾` last; that toggle opens the same panel holding only About us, Careers, and Support. Contact stays with the CTA. Below 1280px the `•••• MENU` toggle sits next to the CTA and opens the full list.
  - **Active marker:** the link of the section under the header takes Fg and a 2px amber rule that grows from the start (0.5s expo). On a company page, `COMPANY` carries the rule.
  - The `START A PROJECT` filled pill.
- **Theme:** on every scroll frame, the header probes the section under its row with `elementsFromPoint` and takes that section's `data-on` (dark/light). Text colors cross-fade in 0.4s. Each limb's flip (`--flip`, between glacier and limb-mid) is where its ground turns, and around it the soft link ink goes full (`.is-mid`) so the links hold contrast over the mid blue. Once scrolled, the header's ground (`.hdr-ground`) repaints the page's own backgrounds (sections, bands, limbs, clipped as on the page, on whole device pixels) behind the row, without their content, in the scroll frame itself; it fades out over 36px below the row. So a night/snow edge slides through the header exactly with the scroll, nothing ghosts behind the links, and no line, shadow, or tint parts the header from the page.

### Navigation (menu)
- **Layout:** a dropdown under the toggle, a mono uppercase list of seven anchors (Services, Platform, Work, Why us, FAQ, Offices, Contact). From 1280px the anchors live in the header row and the dropdown holds only the company pages.
- **Open:** a clip-path wipe (0.6s expo). Links drop in 8px with a 0.04s stagger.
- **Close:** Esc (focus returns to the toggle), an outside click, or following a link.
- **Anchors:** native `scrollTo` with `behavior: "smooth"` (instant for reduced motion and arrivals from another page). The target gets focus with `preventScroll`. Night sections with a top limb scroll past the limb, so the heading lands under the header.

### Preloader
- **Layout:**
  - Night field.
  - Row 1: the logo lockup at left; the counter (0→100, tabular) with an 8-dot spinner at right (steps(8), 1.1s).
  - Row 2: a mono list of the three offices at left, the dot world map (max 520px) with amber city dots in the center, and the five service lines right-aligned at right.
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
- **Headline:** lines rise from masks (yPercent 110→0, 1.1s expo.out, stagger 0.08). The lede rises 24px and fades in.
- **The dive** (scrubbed over the 210vh hero):
  - The camera climbs from the Hinnom valley up the south face to the crest of Mount Zion.
  - The amber altitude contour climbs the hill.
  - The headline block holds until 16%, then drifts up 16% and fades by 42% progress.
  - **What we do** (`.hero-next`) rises from 30% to 42% and stays to the end: a Micro label, the five service lines as Titles, and an outline pill to the log. It sits high on the night (top `clamp(120px, 17vh, 170px)`), above the rising dawn, so no screen of the hero is only decoration (#38).
  - **Copy night:** the headline and the second-screen block each carry their own soft night field (`::before`, `rgba(3,8,19,.92)`, blur 56px, 9% wider and 14% taller than the copy). It follows the copy's real size in every language, so the white ridge never runs through the text. Measured: at least 4.5:1 at the brightest pixel behind every headline line, the lede, and the service lines, in all 7 languages at 1440, 834, and 390 (min 8.6:1 for the headline).
  - The dawn limb rises (at full opacity, never a fade) from 42% to 100%, ending in pure snow that meets the next section. GSAP's `fromTo` zeroes `y` so it does not stack on the CSS resting `translateY(100%)`.
  - The limb is the bottom 90vh of a 200vh box (`yPercent 45 → 0`), so the box's top edge stays above the stage, which clips it. With a 90vh box that edge crossed the night mid-rise, and a GPU drew it as a 1px white line at 25% (#35). The gradients are sized in vh from the box's bottom, and `--flip`/`--mid` are fractions of the 200vh box.

### Two-tone headline
Two block spans in one H2, following the Two-Tone Rule. On night the fill runs Dim Night → Glacier → Snow. On daylight it runs Dim Ink → Glacier → Navy Ink. Words come from `Intl.Segmenter`, so Chinese and Japanese lines fill word by word, and punctuation rides with the word before it.

### Stat
The figure (count-up from 0, 1s power1.out at `top 85%`, once) sits over a Label, with a top hairline. The row wipes in with clip-path from the left (1.2s expo, stagger 0.12). It sits three-up in the first log entry. The figures are real: 25+ years in software engineering, 5 pillars of delivery excellence, 3 offices.

### Gear (services)
What a buyer can hire XionTechs for, straight under the hero, so the first daylight answers "what do you sell" (#35). Content from newxion.com/services: the Digital product engineering group only. Digital insights and analytics and Odoo ERP stay off (owner's call, 2026-10-07), and the source's third-party quotes are not carried over.
- **Head:** a two-tone H2 at 1/8 ("Our services. / Engineering, data, and AI.") with a one-line intro at 8/13 on its baseline, like Why XionTechs.
- **Group:** Digital product engineering (seven services), as one row: at 1/5 a top hairline, the group name (Title LG, max 14ch) and one Body Small line in Slate, sticky at `top: 130px` beside its list on desktop; the list at 5/13.
- **List:** a hairline cell grid, two up (the 1px gaps are the rules, as in the subpage cells). A cell holds its index (`01`, Micro mono, Slate, tabular) in a 3ch column beside a Title (h4, max 22ch) over Body Small in Slate (max 46ch). The last service of an odd count spans the row. Hover tints Ice. Product co-creation carries its five steps as tags.
- **No icons:** the source's icons say nothing a name does not, so the index is the only mark (Don't: an icon with no meaning). The index sits beside the name, never above it (no eyebrows).
- **Breakpoints:** under 992px the group head stacks above its list and goes static; under 768px the list is one column and bleeds to the viewport edge, its text kept on the gutter.
- **Spacing:** the section has no bottom padding; the platform that follows pads one section, so the two daylight sections share one gap.
- **Motion:** each list's contents rise 24px (1.1s expo, stagger 0.03) at `top 85%`. The cells themselves stay put, so their hairline ground never shows as a grey block while the text is still hidden.

### Why XionTechs (reasons)
- **Layout:** a two-tone H2 at 1/8 ("Why XionTechs. / Four reasons, each with proof.") with a one-line intro at 8/13 on its baseline; under it a four-up row (two-up on tablet, one-up on mobile). Each reason is a Stat (the proof figure over its Micro label), a Title, Body Small in Slate (max 36ch), and an optional Micro link with a navy underline to the section that shows the proof.
- **Content:** every figure is in PRODUCT.md › Evidence on Hand: 3 offices (US contact, Vietnam build team, both time zones), 25+ years, 5 pillars (Agile + BMAD-METHOD + V-Model, metric-driven), 2 products (the AI-powered development platform and our own AI products). No reason without a proof; no comparison table until the owner approves each claim (#47).
- **Motion:** reasons rise 24px (1.1s expo, stagger 0.1) at `top 85%` of the row; figures count up like every Stat.

### Case studies (`/work/<slug>/`)
- **Source:** `src/content/cases/<locale>/<slug>.md` (template in its README). A case builds its page and its card only when `approved` and `ndaChecked` are both true; today none are, so nothing shows (#49).
- **Card:** in the log's Customers entry, under the domain tags, up to three hairline rows: client (Label), the title (Title), the result (Body Small, Slate), and a "Read the case study" Micro link.
- **Page:** the job-post layout: project facts at the side (client, team, duration, stack) and Problem, What we built, Result, then the body, in the prose column; the closing ask band at the end.

### Leadership (on About us)
- **Layout:** a split head ("Leadership. / The people you talk to.") over a hairline row of people (two-up on desktop, one-up on mobile). Each person: a 112px square face, the name as a Title, the role in Label (Slate), and a LinkedIn link in Label when the owner supplies one.
- **Faces:** only the owner's photos (`leaders[].photo`, files in `public/team/`). Until then the square is Brand Navy with the initials in Saira 760 Snow. Never a stock portrait or a generated face (#48).
- **Reply promise:** `reply` in `site.ts` adds one line under every brief form ("{who} replies to every brief within {days} business days."). It stays off until the owner gives both values.

### Story and mission (mindset, on About us)
- **Layout:** the topo tile and the sticky two-tone H2 at 1/7; the story at 8/13 as three Lede paragraphs. The H2 reads "Starting with a story. / A mountain is our symbol." The first paragraph names Mount Zion once, as the inspiration for the name; this is the only place the page names it (the Symbol Rule). XionTechs is the only company named (the One-Name Rule: no parent group, no sister company, anywhere on the page). The mission sits under a hairline: a Title head ("Our mission") over Body in Slate, max 46ch. One outline pill leads to the core values.
- **Entrance:** paragraphs, mission, and button rise 28px (1.1s expo, stagger 0.08).

### Value column (core values, on About us)
The section follows the story on About us (`story.ts`, called from `page.ts` before the page's other scenes, because it pins). Its pill leads to `/contact-us/`.
- **Layout:** a 270–340px column on the night band with a 1px left hairline. It holds a 44px dot icon that names the value (check, rocket, target, shield, spark, flag, people), a Title (max 12ch), the motto in Snow, and the promise in Body Small in Mist.
- **Motion:** on desktop the seven columns ride a horizontal track pinned under the giant type ("Seven core values").
  - The track clip is `.track-wrap` with overflow hidden, so columns never slide over the intro copy.
  - The clip's left 48px fades through a mask, so no card is guillotined mid-word.
  - On mobile the track is `width: 100%`, so hairlines run edge to edge.
- **Entrance:** the children rise 24px with a 0.035 stagger.

### Strata (platform)
The AI-powered platform for smart schools (from the newxion.com/solutions diagram), drawn as one architecture chart you read at a glance, not as steps. It speaks the page's survey language, never the source's yellow and black boxes.
- **Head:** the two-tone H2 ("AI-powered platform / for smart schools.") at 1/8; a Lede and a Body paragraph in Slate at 8/13, bottom-aligned. XionTechs stays the only company named ("We built it").
- **Frame:** one bounded figure with a 1px hairline and padding clamp(20px, 2.4vw, 36px), on survey paper: Brand Navy dots at 12%, 1px, on a 16px pitch, quieter than any block. A Micro caption sits under it.
- **Y-axis:** a hairline runs down the whole chart. The four tier names (Users and apps, Services, Infrastructure and data, Devices) sit left of it in a 128px column in mono Label, Slate, each with a 6px navy dot on the axis. Under 992px the names head their tiers in Navy Ink with the dot in front, so they outrank the group names.
- **Blocks:** square, snow over the paper, a 1px Brand Navy outline at 20%, Host Grotesk 500 at 14px in Navy Ink; hover tints Ice. Roles are Title h4 centred over their column of app blocks, whose names centre too. Tiers stand 36px apart.
- **Frames:** each group (AI services, Agents, App services, Infrastructure and connectivity, Modern data platform) sits in a hairline frame at the block outline tone, 12px in, its name inside at the top left in Micro mono, Slate. Roles and devices stay unframed.
- **Wires:** Brand Navy at 35%, the dial's leader tone. A wire only stands for a real link and always runs frame to frame across the 20px gap, with a 5px navy node centred on each frame's border, drawn over the frames so nothing covers an end. No decorative wires between tiers. AI and app services link into the agents from either side (from below the agents under 1200px), and the two infrastructure frames link to each other (one over the other on mobile). From 1200px a trunk drops from the agents frame to the middle of that link: both sit on the chart's centre line. From 1360px the data platform runs as one row with a wire through its gaps: a pipeline.
- **Hub:** the supervisor (Night Band, the one dark field) at the centre of a 3×3 grid with "Routes each request" under it; Policy, Buddy, and Academic reports above, Wellbeing and More agents below. Spokes are SVG lines in percent coordinates from the centre to each cell centre (`pathLength="1"`; no viewBox, so no non-scaling-stroke, which breaks the dash maths). Hover on an agent lights its spoke amber at 2px, and hover on the supervisor lights them all: a 2px amber line inside a bounded figure, so the No-Amber-On-Snow Rule holds. On mobile the hub folds into the supervisor, its note, and the agents two up, without spokes.
- **Breakpoints:** services run AI | Agents | App at 2:5:2 from 1200px, then Agents over AI and App. Roles and devices run five-up, then two-up with the fifth spanning on mobile; device icons stack over their names from 768 to 1199px.
- **Spacing:** the strata and the log are both daylight, so they share one gap: the strata section has no bottom padding, and the log that follows pads clamp(64px, 6vw, 96px) on top (its sticky head already sits 140px down), or one full section under 992px, where that head is static.
- **Entrance:** once per tier, no scroll-scrubbed states: each tier rises 24px (1.1s expo) with its frames and links, and the spokes draw out from the supervisor (dashoffset 1→0, 0.9s, stagger 0.06).

### The dial (the log)
The record of the climb so far: four entries, one arc each. Drawn in the page's survey language (hairlines, mono chips, amber as the one live accent), never as an illustration: no tents, flags, casings or filled discs.
- **Panel:** the ring stays in view in the left half (sticky, 100vh) while the stages scroll past on the right. On tablet and mobile it is a static dial (34svh + 28px) above the entries and scrolls away with the page: it never pins, so it never covers their text (#46). Code: `dial.ts` (arcs, chips, reading); CSS under "the dial" in `global.css`.
- **Reading:** a big Saira 800 number (01..04, clamp(4rem, 22cqw, 7rem)) over a mono label naming the entry, in the middle of the ring. Each is a slot reel: a one-line window over a stack of every entry; a change spins the stack to the new entry over 0.8s and lands with a short bounce (back.out 1.3).
- **Arcs:** one ring of four amber-filled arcs (3px stroke, round caps, 16 degree gaps), one per entry, read clockwise from the top. Each arc ends in a chevron tip in the leader tone (rgba(16,48,96,0.4)) that turns amber once its arc is full. Arc s is empty as entry s's title reaches the line and full as the next title does; the last is full a fifth of a screen (at least 160px) before the list's foot unpins the side, so the ring completes and rests while the panel still holds still.
- **Chips:** each arc has a chip hung off its middle with the entry's number and name, styled like the hero and map chips (Martian Mono 10px uppercase, 2px radius). The chip in view turns amber. Chips hide on phones.
- **Fill:** on wide screens the first entry opens level with the middle of the dial (padding-top 50vh + 80px), so the first fill starts there; the stage list keeps calc(32vh - 160px) below so the dial completes in view before the side unpins. Tablet and mobile: every entry shows at full opacity.
- **Entries:** 32% opacity, then full: the first as its top passes `top 62%`, each later one as its arc turns current. Each entry, in order: a dot icon, a Stage title, Body, and its payload. No label trails the entry: the camp name lives in `data-camp`, and `dial.ts` reads it for the chips and the reading (a lone label under an entry read as a stray, #37).
  1. **What we have achieved** (clock): the three-up stat row.
  2. **What we have done** (code): five log rows, one per service line.
  3. **Products** (box): two log rows.
  4. **Customers** (linked rings): three domain tags (the October 2025 visit is in its body), then one log row per client (#20): the client as a Title over one Body Small line, and its projects in a list set in from a 1px hairline. Each project is its name (Body Small 600, ink) over an optional line (Body Small, Slate, max 44ch); a project without public detail shows its name only.
- **Log row:** a hairline list; each row is a Title (h4) over Body Small in Slate, max 46ch, padding 18px 0 20px. Rows rise 20px out of their rules (1s expo, stagger 0.06).
- **Tag:** a 2px chip with a 32% ink border, Micro, no fill.

### Contour backdrop (ascent)
- **Layout:** a sticky, full-viewport canvas (`position: sticky; top: 0; height: 100vh; margin-bottom: -100vh`) behind the ascent.
- **Content:** Mount Zion as marching-squares contours at real 10 m intervals (610–760 m), in Brand Navy at 7% (minor) and 15% (index contours at every 50 m: 650, 700, 750).
- **Extent:** a 5:3 excerpt of the ground, x −9…9 and z −7.4…3.4 world units (1.26 × 0.76 km): the hill, the Hinnom bend, and the Kidron edge. The intro tile shows the same excerpt, captioned "Our symbol · a contour map".
- **Fit:** cover-fit, so the hill never distorts on portrait screens.
- **Live line:** a 1.5px Brand Navy contour at 34% sits at the page's current altitude. It is navy, not amber, because it crosses copy, and an amber line through text reads as a strike-through. Between the hero and the summit, this is where the mountain stays physically present.

### Ridge and rider (routes sky, signature)
UC's truck on its road, rebuilt as a climber on a ridge.
- **Ridge:** Mount Zion's silhouette seen from the south (the max `heightAt` over z, for x −14…14): the west shoulder across the Hinnom, the Hinnom saddle, then the dome. It is drawn as a dot grid (7px pitch, 6px on mobile) standing on the value band. The body is Brand Navy at 16%; the ridge line is 62%. It sits in front of the giant type.
- **Rider:** the amber diamond (14px, rotated 45°) plus a climber chip with the live altitude.
- **Motion:** the rider climbs from the west base (6% across), over the shoulder and through the saddle, to the top of the dome (`ZION.peakAt`, 52% across), driven by the pinned track's scroll progress. On mobile it is driven by the section's pass. The same diamond then carries on down the ascent rail.

### Dot world map (base camps)
- **Map:** a canvas raster in #1F3566 on night (#2A3B63 in the loader, #C9D2E3 on snow in the footer), with an SVG overlay in the same 180:68 space.
- **Placement:** the base camps open the contact night, straight after the FAQ; the section's ground fades into the summit scene.
- **Arcs:** each has a 30% amber base arc that draws in (1.8s power3.inOut) and a 2px amber head that travels on a loop (3.6s Plano→HCMC, 1.6s HCMC→Da Nang) while the map is on screen.
- **Cities:** 10px amber dots with a ping ring, and Night Band chips with live local time. Hover or focus fills a chip amber.
- **Chip offsets:** chips keep their CSS `translate` offsets. Never tween them with GSAP transforms, because GSAP writes an inline `translate: none`.
- **Below the map:** an offices row in three columns (Plano base camp, HCMC base camp, Da Nang base camp), each with a Title and the place as a Label in Dim Night. Only Plano shows a street address (in Mist); the Vietnam base camps carry none. Contact lines live in the summit, next to the brief. There are no icons; a glyph with no meaning is decoration. The row blurs in (6px, stagger 0.1).

### Day bar
Two 12px rows on a shared 24h UTC track with hourly ticks. The work window is 08:00–17:00 local: Plano in amber, Vietnam in glacier. A 1px snow "NOW" rule marks the current UTC time.

### Contact lines (summit)
Under the summit copy: phone, WhatsApp, and email as Button-type links in Xion Amber on night, stacked 10px apart. They are the fallback when the brief does not send.

### Inputs / Fields
- **Label:** mono 12px in Mist, stacked above the field (UAT #84).
- **Field:** Body 17px Snow text on transparent, with a single 1px bottom rule at 28% white (55% on hover). No box, no radius.
- **Focus:** the rule turns Xion Amber, plus a 1px amber underline.
- **Error:** `aria-invalid` turns the rule Error, and a mono status names the problem and the fix.
- **Submit:**
  - The form POSTs JSON to `data-endpoint` (`/api/contact`, the mailer behind nginx), shows "Sending your brief…" with the button disabled, then either "Brief sent. We reply by email." or an error with a phone fallback. It claims receipt only on a 2xx, and a failure keeps the fields filled.
  - A hidden trap field (`.brief-trap`, `name="website"`) catches bots: no person or screen reader meets it, and the mailer drops any brief that fills it.
  - Status text is amber on success. An inline link in a status is Snow with an amber underline.

### FAQ accordion
- **Layout:** an Ice field with hairline rows. The question is a Title in a full-width button; the answer is Body in Slate, max 56ch.
- **Icon:** a 14px plus built from two 2px bars, rotating 45° into a cross (0.5s expo).
- **Motion:** the height tweens 0↔auto (0.5s/0.45s power2.inOut), using the `hidden` attribute plus `aria-expanded` and `aria-controls`.

### Footer
- **Top:** a snow field with a light dot map (columns 1–4) and four columns (Offices, Reach us, Explore, Company) with Label heads. Reach us holds the phone, WhatsApp, and email (may wrap).
- **Wordmark:** the mark plus XIONTECHS at 11.4vw (10.2vw on mobile), Saira 800 125% in Brand Navy.
- **Dictionary entry:** directly under the wordmark (see below).
- **Legal:** a hairline row with © and "AI-powered IT services and products", the line "Get IT done. Make your mark.", the legal links, and "Back to base camp".

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
- **Row:** headword **Xi·on·techs** (Saira 700 125%, Title LG, Brand Navy, mixed case like a real headword); IPA `/siː.ɒn.teks/` at 17px in Navy Ink with a `NOUN` part-of-speech tag (Micro, Slate); under it the sound-out **Say it: see · on · teks** (Label, Slate, syllables in Navy Ink 600); at the right, the definition (Body Small, max 46ch): "Inspired by a mountain. The team that takes a product from base camp to summit."
- **Grid:** `auto auto 1fr minmax(0, 46ch)`, baseline-aligned, gap 10px 32px. On mobile it stacks in one column.
- **Color:** no amber on snow. Every tag uses Slate, not Dim Ink, because Dim Ink fails 4.5:1 at these sizes.

## Do's and Don'ts

### Do:
- **Do** drive every scroll-linked scene with GSAP ScrollTrigger `scrub: true`, `ease: "none"`, on the browser's native scroll (no smoothing library: the page stops when the wheel stops). Create pinned triggers before the triggers below them.
- **Do** run entrances from an already-visible default: set hidden states in JS only, and ease with expo.out over 1.0–1.2s. Vary the entrance per section: mask rise (hero), rise (intro copy), wipe (stats), clip rise (cases), blur (chips), scrub fill (headlines).
- **Do** keep reduced-motion users on native scroll: no preloader, no pins, final states visible, counters at their true values.
- **Do** put `scene.background` on the Three.js scene, not only the clear color. The bloom pass restores the clear color outside a render target and double-encodes the night to #1C324D.
- **Do** keep the render loop gated: it runs only while the hero or the summit is on screen and the tab is visible. The summit gate opens 400px early, because the base camps fade into the scene.
- **Do** pass every full-bleed night and daylight change through a horizon limb (the Dawn Rule).
- **Do** keep amber at or under 5% of a resting viewport (the Amber Ration Rule).
- **Do** leave missing content off the page (the No-Placeholder Rule); track it in an issue.
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
| Native scroll | browser default, no smoothing | page scroll |
| Anchor scroll | native `behavior: "smooth"` | menu and CTA jumps |
| Stagger | 0.02 (loader out), 0.035 (value parts), 0.05–0.08 (chips, lines), 0.1–0.12 (cells, stats) | |

## 3D Scene Specification (mountain.ts)

- **Terrain:**
  - The real relief of Mount Zion, Jerusalem (31.7717 N, 35.2286 E; published 765 m), from AWS Terrain Tiles (Terrarium, zoom 15, SRTM-derived, 4.06 m per pixel, public domain). `scripts/build-zion.mjs` fetches and caches the 3×3 tiles in `.impeccable/zion-tiles/`, decodes them, and writes `src/scripts/zion-data.ts` (a 129×97 Uint16 grid in base64, sampled bilinearly by `heightAt`).
  - Axes: x runs east and z runs south, so the camera stands in the Hinnom valley looking north. The Wikipedia summit point is the origin; the highest sample of the western hill is `ZION.peakAt` (0.75, −4), about 280 m north, on the crest of the western hill inside the Old City walls (historically part of Zion).
  - Scale: one world unit is 70 m on the ground. Relief above the valley floor (618 m in the data) is 163 m, drawn at 6.4 units, a vertical exaggeration of ×2.75, the standard relief-map practice that lets a 163 m hill read as a mountain.
  - Processing: a 22 m Gaussian blur removes roof and street noise but keeps every landform wider than about 50 m. A radial skirt (full height to 420 m, zero at 950 m, 1.5× tighter to the north) lets the hill stand alone; inside it, the Hinnom valley on the west and south, and the fall to the Tyropoeon and Kidron on the east, are untouched.
  - Height to metres: `unitsAt(m) = (m − 602) / 163 × 6.4`. The altitude, the topo contours, and the summit chip all use this one mapping.
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
  - Camps: Plano (3, 3.5) on the south face right of the headline, Ho Chi Minh City (8.8, −7.45), and Da Nang (−5.4, −4.1), each with an amber dot, a pulsing ring (×1–2.6), and an arc to the summit. The arc head travels at 0.14 cycles/s from ember to amber.
  - The summit (`ZION.peakAt`) has a beacon and an amber chip, "Summit · 765 m".
- **Camera:**
  - Hero: from base camp (−2.5, 5.4, 20 → look −5.2, 3.2, 0) up the south face to the crest (1.4, 9.4, 8 → look 0.4, 5.8, −4), eased with smoothstep and lerped 0.07 per frame.
  - Summit: (0.75, 14.5, 21 → look 0.75, 4.6, −4). The crest sits in the gap between the headline and the brief form, and a night radial scrim (`.summit-head::before`, 88% → 0) keeps the copy clear of the ridge.
  - A change of mode (hero ↔ summit) snaps the camera to its station; the two are never on screen together, so the visitor never sees a swing.
  - The pointer adds ±0.9 horizontal and ±0.45 vertical parallax.
  - Mobile has its own stations.
- **Post:** RenderPass, UnrealBloom (0.55 / 0.18 / 0.72), OutputPass.
- **Fallback:** with no WebGL, `.no-webgl` paints a CSS dawn-and-glacier gradient on the night.

## Accessibility

- **Skip link:** the first focusable element is a skip link (amber, slides in on focus).
- **Focus rings:** 2px, offset 3px, Xion Amber on night and Brand Navy on daylight.
- **Hidden decoration:** the 3D canvas, chips layer, preloader, giant type, and map canvases are all `aria-hidden`.
- **Real controls:** every city on the map is a real button with its name. The FAQ uses `aria-expanded`, `aria-controls`, and `hidden`. The form has labels and `aria-live` status.
- **Contrast:** body text meets at least 4.5:1 everywhere. Dim headline lines meet at least 3:1 at display sizes.
- **Pronunciation:** screen readers get "said see-on-teks" in the logo's label and the full footer entry as a labelled `dl`; the visual IPA under the logo is hidden from them to avoid reading symbols aloud.
- **Browser surfaces:** selection, caret, scrollbar, and underline offset are themed from the palette.

## File Map

- `src/pages/index.astro`: markup, content arrays, and the direction contract comment (first child of `<body>`).
- `src/data/site.ts`: shared facts (offices, contact lines, service lines, sections) and the SVG mark.
- `src/styles/global.css`: every token in `:root`, the `[data-on]` theme contexts, and all components.
- `src/scripts/app.ts`: ScrollTrigger scenes, the preloader, header, altitude, clocks, FAQ, and form.
- `src/scripts/mountain.ts`: `heightAt` over the Mount Zion grid, `unitsAt`, and the Three.js mountain, light, camps, arcs, chips, and cameras.
- `src/scripts/zion-data.ts`: the generated Mount Zion relief. Regenerate with `node scripts/build-zion.mjs` (tiles cached in `.impeccable/zion-tiles/`).
- `src/scripts/dots.ts`: dot-matrix icons (vector → 13×13 dots) and the dot world map painter.
- `src/scripts/dotmap-data.ts`: a generated land raster. Regenerate with `node scripts/build-dotmap.mjs`.
- `src/scripts/topo.ts`: marching-squares contours (the intro tile and the cover-fit ascent backdrop), with the amber altitude line.
- `src/scripts/ridge.ts`: the dot-matrix ridge silhouette and the rider over the routes sky.
- `src/scripts/dial.ts`: the log dial: four arcs, their chips, and the reading.

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
