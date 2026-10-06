# Hero headline shadow options

Ten ways to separate the white headline lines ("Where intelligence meets identity.") from the mountain, kept subtle enough that the shadow itself does not read as a shadow.

Every shadow uses the night sky color `rgb(3, 8, 19)` (`#030813`): on the plain sky it is invisible, it only shows where the ridge passes behind a letter.

## How these were shot

- One page load per size, scene frozen after the entrance, then each option's CSS injected in turn. Only the headline area differs between shots; the mountain is the same frame.
- No source file was changed. The CSS below is what would go into `src/styles/global.css`.
- `laptop/` 1536x730: a 1920x1080 screen at 125% scaling, minus the browser bar. The ridge runs through WHERE and INTELLIGENCE (worst contrast today 1.0:1).
- `mobile/` 390x844: dots behind WHERE (worst contrast today 2.85:1).
- 1440x900 is not included: there the ridge sits above the headline and every option looks the same as none.
- `option-0-none.png` is the current page, for reference.
- `compare-laptop.png`, `compare-mobile.png`: all options side by side, headline enlarged. `detail-laptop.png`: the ridge crossing WHERE, enlarged 3x.

## Measured (laptop)

Ridge darkening: average drop in brightness (0-255) of the lit ridge pixels around each line. Higher means more separation.
Sky change: the same on plain sky around "MEETS IDENTITY.". Under 1-2 levels is not visible.

| Option | Ridge near WHERE | Ridge near INTELLIGENCE | Sky change |
|---|---|---|---|
| 1 Hairline | 2.1 | 1.3 | 0.29 |
| 2 Close halo | 2.9 | 1.6 | 0.44 |
| 3 Soft halo | 4.9 | 2.6 | 0.86 |
| 4 Stacked halo | 4.5 | 2.5 | 0.8 |
| 5 Lift | 5.0 | 2.3 | 1.09 |
| 6 Night outline | 3.3 | 2.0 | 0.36 |
| 7 Stroke behind | 6.2 | 3.1 | 0.54 |
| 8 Atmosphere | 11.4 | 7.0 | 1.59 |
| 9 Double atmosphere | 12.5 | 8.5 | 2.16 |
| 10 Halo + atmosphere | 12.6 | 7.9 | 2.05 |

## Options

### Option 1: Hairline

Applies to: white lines. 1px and 2px night edge. The least you can add; separates letter edges from single dots.

```css
.hero-title .ln > span:not(.accent) { text-shadow: 0 0 0.015em rgba(3, 8, 19, .7), 0 0 0.03em rgba(3, 8, 19, .45); }
```

### Option 2: Close halo

Applies to: white lines. One 0.05em night halo hugging the letters.

```css
.hero-title .ln > span:not(.accent) { text-shadow: 0 0 0.05em rgba(3, 8, 19, .6); }
```

### Option 3: Soft halo

Applies to: white lines. One wider 0.1em halo. Clear gap between letters and ridge, still no visible shadow on the sky.

```css
.hero-title .ln > span:not(.accent) { text-shadow: 0 0 0.1em rgba(3, 8, 19, .5); }
```

### Option 4: Stacked halo

Applies to: white lines. Three layers, tight to loose. Crisp edge plus a soft falloff.

```css
.hero-title .ln > span:not(.accent) { text-shadow: 0 0 0.015em rgba(3, 8, 19, .5), 0 0 0.04em rgba(3, 8, 19, .4), 0 0 0.09em rgba(3, 8, 19, .3); }
```

### Option 5: Lift

Applies to: white lines. Shadow falls slightly down, like a light from above. Strongest under the letters.

```css
.hero-title .ln > span:not(.accent) { text-shadow: 0 0.02em 0.03em rgba(0, 0, 0, .45), 0 0.03em 0.08em rgba(3, 8, 19, .35); }
```

### Option 6: Night outline

Applies to: white lines. Four 0.012em offsets plus a small halo: a thin outline in the sky color.

```css
.hero-title .ln > span:not(.accent) { text-shadow: 0.012em 0 0 rgba(3, 8, 19, .35), -0.012em 0 0 rgba(3, 8, 19, .35), 0 0.012em 0 rgba(3, 8, 19, .35), 0 -0.012em 0 rgba(3, 8, 19, .35), 0 0 0.04em rgba(3, 8, 19, .3); }
```

### Option 7: Stroke behind

Applies to: white lines. A 0.05em night stroke painted under the fill (paint-order), so letters keep their weight.

```css
.hero-title .ln > span:not(.accent) { -webkit-text-stroke: 0.05em rgba(3, 8, 19, .5); paint-order: stroke fill; }
```

### Option 8: Atmosphere

Applies to: whole title, incl. GET IT DONE.. One soft 0.14em drop-shadow filter on the headline.

```css
.hero-title { filter: drop-shadow(0 0 0.14em rgba(3, 8, 19, .55)); }
```

### Option 9: Double atmosphere

Applies to: whole title, incl. GET IT DONE.. Tight 0.03em plus wide 0.25em drop-shadow filters.

```css
.hero-title { filter: drop-shadow(0 0 0.03em rgba(3, 8, 19, .5)) drop-shadow(0 0 0.25em rgba(3, 8, 19, .4)); }
```

### Option 10: Halo + atmosphere

Applies to: white lines + whole title. Close halo on the white lines plus a soft, slightly lowered drop-shadow on the headline.

```css
.hero-title .ln > span:not(.accent) { text-shadow: 0 0 0.02em rgba(3, 8, 19, .55), 0 0 0.06em rgba(3, 8, 19, .35); }
.hero-title { filter: drop-shadow(0 0.04em 0.2em rgba(3, 8, 19, .45)); }
```

## Notes

- Options 1-7 put `text-shadow` on `.hero-title .ln > span:not(.accent)`, so the yellow GET IT DONE. line is untouched. Each `.ln` clips its bottom edge for the entrance animation; at these sizes the shadows fade out before that edge (checked, no hard cut).
- Options 8-10 use `filter: drop-shadow()` on `.hero-title`, which is not clipped by the lines, but it also reaches GET IT DONE.
- All sizes are in `em`, so the shadow scales with the headline on every screen and language.
