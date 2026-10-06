# Round 2: making the headline easier to read

Starting point: round 1 option 8, now live in `src/styles/global.css`. Every option below is added on top of it, except the "before" reference.

## How these were shot

- Same method as round 1: one page load per size, the mountain frozen, each option's CSS added in turn. Only the headline area differs (and the mountain itself in options 5-8).
- `laptop/` 1536x730 (the ridge runs through WHERE and INTELLIGENCE), `mobile/` 390x844.
- `compare-laptop.png`, `compare-mobile.png`: all options side by side. `detail-laptop.png`: the ridge crossing WHERE, enlarged.
- No source file was changed for these shots.

## Measured: how clear the letter edges are

The background in a thin band (1-4 px) just outside the white letters, against the white text. The number is the contrast of the brightest 1% of that band: higher means the letter edges stand out more. 4.5 is the usual minimum for readable text.

| | Option | Laptop | Mobile |
|---|---|---|---|
| - | Before: no glow | 3.56 | 9.49 |
| 0 | Now: round 1 option 8 | 5.62 | 11.11 |
| 1 | Sharper edge | 7.35 | 11.84 |
| 2 | Deeper glow | 9.03 | 14.08 |
| 3 | Thin dark outline | 6.37 | 11.19 |
| 4 | Bolder letters | 5.89 | 10.8 |
| 5 | Quieter mountain behind the words | 10.88 | 16.02 |
| 6 | Frosted glass behind the words | 11.25 | 17.39 |
| 7 | Sharper edge + quieter mountain | 12.75 | 16.62 |
| 8 | Sharper edge + bolder + quieter mountain | 13.31 | 16.76 |

## Options

### Option 0: Now: round 1 option 8

What is on the site now: a soft dark glow around the headline.

### Option 1: Sharper edge

Adds a second, tighter dark glow right at the letter edges. Looks the same from afar, edges read cleaner over the bright ridge.

```css
.hero-title { filter: drop-shadow(0 0 0.04em rgba(3, 8, 19, .75)) drop-shadow(0 0 0.14em rgba(3, 8, 19, .55)); }
```

### Option 2: Deeper glow

The same glow, darker and a bit wider. Separates more; on a bright ridge you start to sense a soft shade around the words.

```css
.hero-title { filter: drop-shadow(0 0 0.12em rgba(3, 8, 19, .8)) drop-shadow(0 0 0.3em rgba(3, 8, 19, .5)); }
```

### Option 3: Thin dark outline

A thin dark line painted under the edge of each letter, plus the current glow. Letters keep their weight.

```css
.hero-title .ln > span { -webkit-text-stroke: 0.04em rgba(3, 8, 19, .6); paint-order: stroke fill; }
```

### Option 4: Bolder letters

Heavier headline weight (860 instead of 760) with the current glow. Thicker strokes are easier to read over dots; changes the look of the type.

```css
.hero-title { font-weight: 860; }
```

### Option 5: Quieter mountain behind the words

The mountain fades to about half brightness in a soft oval behind the headline, and back to full outside it. The words are untouched.

```css
#mountain { -webkit-mask-image: var(--q); mask-image: var(--q); --q: radial-gradient(36% 34% at 26% 46%, rgba(0,0,0,.4) 0%, rgba(0,0,0,.55) 55%, #000 100%); }
@media (max-width: 767px) { #mountain { --q: radial-gradient(70% 20% at 50% 53%, rgba(0,0,0,.4) 0%, rgba(0,0,0,.55) 55%, #000 100%); } }
```

### Option 6: Frosted glass behind the words

The dots behind the headline are softly blurred and darkened. Strong, but the blurred patch is visible as haze.

```css
.hero-copy::before { content: ""; position: absolute; z-index: -1; inset: -10% -8% 38% -8%; pointer-events: none;
  -webkit-backdrop-filter: blur(4px) brightness(0.6); backdrop-filter: blur(4px) brightness(0.6);
  -webkit-mask-image: radial-gradient(closest-side, #000 50%, transparent); mask-image: radial-gradient(closest-side, #000 50%, transparent); }
```

### Option 7: Sharper edge + quieter mountain

Options 1 and 5 together.

```css
.hero-title { filter: drop-shadow(0 0 0.04em rgba(3, 8, 19, .75)) drop-shadow(0 0 0.14em rgba(3, 8, 19, .55)); }
#mountain { -webkit-mask-image: var(--q); mask-image: var(--q); --q: radial-gradient(36% 34% at 26% 46%, rgba(0,0,0,.4) 0%, rgba(0,0,0,.55) 55%, #000 100%); }
@media (max-width: 767px) { #mountain { --q: radial-gradient(70% 20% at 50% 53%, rgba(0,0,0,.4) 0%, rgba(0,0,0,.55) 55%, #000 100%); } }
```

### Option 8: Sharper edge + bolder + quieter mountain

Options 1, 4 and 5 together. The strongest.

```css
.hero-title { filter: drop-shadow(0 0 0.04em rgba(3, 8, 19, .75)) drop-shadow(0 0 0.14em rgba(3, 8, 19, .55)); }
.hero-title { font-weight: 860; }
#mountain { -webkit-mask-image: var(--q); mask-image: var(--q); --q: radial-gradient(36% 34% at 26% 46%, rgba(0,0,0,.4) 0%, rgba(0,0,0,.55) 55%, #000 100%); }
@media (max-width: 767px) { #mountain { --q: radial-gradient(70% 20% at 50% 53%, rgba(0,0,0,.4) 0%, rgba(0,0,0,.55) 55%, #000 100%); } }
```

## Notes

- Options 5, 7 and 8 dim the mountain where the headline sits on the left. In Arabic the headline sits on the right, so the oval needs a mirrored position there (`[dir="rtl"]`). As shot, this uses a CSS mask on the mountain canvas; it could also be done inside the mountain's own drawing code.
- Option 4 changes the headline weight, which is part of the design system (DESIGN.md).
- Option 6 shows as a soft blurred patch over the ridge.
