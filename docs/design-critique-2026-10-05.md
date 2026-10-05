⚠️ DEGRADED: single-context (run inside a worker agent that may not spawn sub-agents; Assessment A was written before the detector output was read)

# Design critique · landing page and About us · 2026-10-05

Target: `src/pages/[...lang]/index.astro` and `about-us.astro`, on the branch stack up to #49 (plain words, Why XionTechs, hero contrast, offices, About figures). Against: DESIGN.md v2.3. Issue: #50 ("looks AI, anyone can do this. Color isn't eye-catching enough").
Screenshots: `pr-evidence` branch, `50/crit-{d,m}-{top,platform,work,why,faq,camps,summit,footer,about}.png` (d = 1440 × 900, m = 390 × 844).

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Header marks the current section; form states are clear. No progress cue for the long page except the native scrollbar. |
| 2 | Match system / real world | 3 | Headings are plain since #42; climbing words remain in the 3D chips and trail elevations (decoration). |
| 3 | User control and freedom | 3 | Anchors, Back to top, Esc closes menus. |
| 4 | Consistency and standards | 3 | One system everywhere; figures now match across pages (#44). |
| 5 | Error prevention | 3 | Required fields, email check before send. |
| 6 | Recognition rather than recall | 3 | Section names in the header row; office list in one order. |
| 7 | Flexibility and efficiency | n/a | Persuade surface (landing page). |
| 8 | Aesthetic and minimalist design | 2 | Every daylight section repeats one formula (see Priority 1); large empty areas beside sticky heads. |
| 9 | Error recovery | 3 | Failed send offers the phone number. |
| 10 | Help and documentation | n/a | Persuade surface. |
| **Total** | | **23/32 (72%)** | **Good** |

## Design specificity verdict

**Assessment A.** The night half is authored: the particle mountain, the dawn limb, the trail chart, and the day bar belong to this company and nobody else. The daylight half is category-interchangeable. Platform, Work, Why, FAQ, and About all use the same frame: a giant two-tone uppercase Saira heading (grey line + ink line) at the left, a paragraph at the right, then a hairline list or grid on white or ice. Swap the words and it is any AI-agency template. Brand navy #103060 appears only as button fill; amber appears only in the hero line and the chips. The logo mark lives only at 40px in the header and in the footer wordmark. Nothing in daylight says XionTechs before you read it.

**Assessment B (detector).** `node .claude/skills/impeccable/scripts/detect.mjs --json src/pages src/components src/layouts` → `[]` (0 findings, exit 0). Browser overlay injection was not run (no `[Human]` tab in this worker). The detector's pattern list does not cover "same section formula repeated", which is the main finding here, so A and B do not conflict; B simply has nothing to add.

## Overall impression

Strong night, generic day. The single biggest opportunity: give the daylight sections the brand's own colour and mark, in one or two places, so the second half of the page reads as XionTechs and not as a template.

## What's working

- **The hero and the contact night** (`crit-d-top`, `crit-d-summit`): real terrain, real offices on it, the amber dawn. Nobody else can ship this.
- **The trail chart in Work** (`crit-d-work`): a data figure in the brand's own language that also carries the four steps.
- **Hairline discipline**: rules, Micro labels, and the mono/display pairing are consistent on every page, so the site feels engineered, which suits an engineering vendor.

## Priority issues

- **[P1] One section formula, five times.** Why it matters: UAT P2 said "anyone can do this"; the sameness is what reads as generated. Fix: break the formula in two places with brand colour and the mark (this PR: change 1 and change 2), then let the owner decide whether to go further. Suggested command: /impeccable bolder.
- **[P1] Brand colour only as ink.** Navy #103060 is never a ground in daylight; amber is rationed to the hero. Fix: one Brand Navy band where the proof lives (Why XionTechs, change 1). Suggested command: /impeccable colorize.
- **[P2] No real people or places.** Every visual is generated (particles, contours, dot maps). Fix: the trust layer (#48): owner photos of the team and the HCMC delivery center. Suggested command: none; needs owner assets.
- **[P2] Empty halves beside sticky heads.** FAQ and Work leave 40–50% of the viewport blank on desktop (`crit-d-faq`). Fix: hold the logo mark there (change 2) or shorten the column. Suggested command: /impeccable layout.
- **[P3] Grey first line of every heading.** The two-tone grey (#858FA1) first line is the same on every section, which adds to the template feel. Fix: keep it, but vary its colour once (e.g. navy on the brand band). Suggested command: /impeccable typeset.

## Persona red flags

**First-time B2B buyer (CTO comparing vendors):** reads the hero, then meets four white sections that look alike; the reasons to pick XionTechs are on the same white as everything else, so they do not stand out as the answer to "why you?".
**Procurement checker:** looks for faces and places to judge legitimacy; finds initials tiles (#48 pending) and generated imagery only.

## Minor observations

- The 3D chip "Beacon · 765 m" and Da Nang chip sit on the Contact headline at 1440 (pre-existing).
- Mobile: the Why section is long (one reason per screen); the numbers are the visual, so it holds, but the section adds about 1.5 screens.

## Copy scan (/desloppify, English landing + About; report only, no edits)

No em or en dashes. Sentence-shape tells, for the owner's copy pass:
- `values.items.quality.text`: stock "committed to excellence … reliability and professionalism that bring lasting value".
- `values.items.client.text`: stock "striving to exceed expectations through exceptional service".
- `values.items.integrity.text`, `values.items.innovation.text`: mirrored pairs ("ethical decisions and responsible actions", "solve problems and create value").
- `mindset.mission.text`: five-verb rhythm list ("solve … empower … foster … create"), "cutting-edge", "positive, sustainable impact".
- `mindset.story[1]`: grand closer "to advance humanity".
- `about.description`, `about.lede`: triad "its people, processes, and technology" plus "distinguishes itself".
- `about.why.lede`: "bring product ideas to life", "integrated solutions".
- `work.done.text`: "from custom applications and system integration to scalable cloud solutions".
The values and mission are the owner's own published words (newxion.com), so they are left as written until the owner approves a rewrite.

## Questions to consider

- What would the daylight half look like if one section per page were in brand navy instead of white?
- Does the giant two-tone heading need to open every section, or could Why and FAQ lead with their content?
- Which single real photo would most change a buyer's first impression: the team, the HCMC office, or the October 2025 visit?

## Changes in this PR (each its own commit, owner approves each)

1. **Brand Navy band for the reasons** (`Why.astro`, `.reasons-band`): the four proofs on #103060 with a 2px amber rule each.
2. **XT mark at section scale in the FAQ head** (`Faq.astro`, `.faq-mark`): fills the empty half on desktop; hidden below 992px.

Questions skipped: this critique runs inside an automated PR; the owner answers in the PR review.
