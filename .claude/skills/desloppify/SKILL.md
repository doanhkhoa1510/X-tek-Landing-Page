---
name: desloppify
description: Rewrite user-facing copy so it does not read as AI-generated slop. Use when the user invokes /desloppify, or asks to de-AI, humanize, or clean up the visible text of the site (headings, paragraphs, buttons, labels, meta descriptions, markdown content). Only text a visitor sees is in scope; code comments and identifiers are not.
user-invocable: true
argument-hint: "[file, page, or section; default is all user-facing text]"
---

Edit the words a visitor reads so they sound like a person at XionTechs wrote them. Keep the meaning and the facts. Change the phrasing.

## Scope

In scope, text that renders to a visitor:

- Text nodes in `src/pages/**/*.astro`, `src/components/**/*.astro`, `src/layouts/**/*.astro`.
- Attributes a visitor or screen reader gets: `alt`, `aria-label`, `title`, `placeholder`, `<meta name="description">`, Open Graph text.
- Strings in `src/data/site.ts`.
- Frontmatter and body of `src/content/**/*.md` (jobs, `support.md`), except the legal docs below.
- Strings in `src/scripts/**/*.ts` that are written into the DOM (labels, chips, counters, button text).

Out of scope: code comments, class names, identifiers, console output, CSS. Leave them as they are, even when they contain an em dash.

Never touch the legal docs: `src/content/docs/privacy-policy.md`, `src/content/docs/terms-of-service.md`, `src/content/docs/cookie-policy.md`. Do not scan, edit, or report on them, not even for dashes. This holds even when the user names one of them as the target: say they are excluded and stop.

If the user passes a target, work only on that target. Otherwise cover everything above.

## Hard rules

### 1. No em dashes or en dashes

Use the keyboard hyphen `-` (U+002D) instead.

- Em dash U+2014, en dash U+2013, and their forms `&mdash;`, `&ndash;`, `&#8212;`, `&#8211;`, `—`, `–` all go.
- A dash that breaks a sentence becomes ` - ` with a space on each side.
- A range becomes a plain hyphen: `9:00 - 18:00`, `Mon - Fri`.
- If the sentence reads better split in two, or with a comma or colon, do that instead.

Bad: `We build the platform — and we run it.`
Good: `We build the platform - and we run it.` or `We build the platform. We run it too.`

### 2. No "not just X, it's Y"

This family sets up a claim nobody made, then knocks it down. Say Y directly.

Variants to catch:

- "It's not just X, it's Y." / "X isn't just A. It's B."
- "Not only X, but also Y."
- "This isn't about X. It's about Y."
- "More than just X."
- "Not X. Not Y. Just Z."

Bad: `It's not just software, it's a partnership.`
Good: `We stay on after launch and run what we built.`

The good version names the concrete thing behind the abstract one. If no concrete thing exists in the source material, cut the sentence. Never invent one.

### 3. No lists of three for rhythm

AI copy reaches for three items because three sounds complete: "fast, secure, and scalable", "We listen. We build. We deliver.", "A provides X, Y, and Z".

- Rhetorical triad (adjectives, verbs, slogans, parallel short sentences): keep the one or two items that carry weight, or replace the set with the concrete thing it stands for.
- Factual set that happens to have three members (three offices, three domains): keep every fact. Do not drop a real item to dodge the rule. Break the cadence instead: put the items in a list or UI element, or split the sentence.
- Do not pad to four to escape the rule either.

Bad: `Our platform is fast, secure, and scalable.`
Good: `The platform runs every school on one shared data layer.`

Bad: `Offices in Plano, Ho Chi Minh City, and Da Nang.`
Good: `Plano is the US base. The Vietnam team works from Ho Chi Minh City and Da Nang.`

## Other tells to fix

Fix these when you see them. They matter less than the hard rules, so judge each one in context.

- Inflated words: delve, seamless, leverage, robust, elevate, unlock, empower, cutting-edge, state-of-the-art, game-changer, transformative, harness, tapestry, landscape, realm, testament, synergy, world-class, best-in-class. Use the plain word or the specific claim.
- Stock openers and closers: "In today's fast-paced world", "Whether you're X or Y", "Ready to take X to the next level?", "Let's dive in", "At the end of the day".
- Reveal tricks: "The result? X.", "Here's the thing:", "The best part?". State X.
- Empty intensifiers: truly, incredibly, deeply, genuinely, truly unique.
- Every paragraph ending on a punchy one-line sentence. Vary it.
- Mirrored sentence pairs ("We don't X. We Y.") used more than once on a page.
- Adjectives standing in for proof. PRODUCT.md's rule is proof over adjectives: a stat or a real event beats praise.

## Do not touch

Read `PRODUCT.md` (Brand Commitments, Evidence on Hand) and `DESIGN.md` before editing. These constraints win over every rule above:

- Brand lines stay verbatim: "Get IT Done", "Where intelligence meets identity", "Get IT done. Make your mark."
- Never add facts. No new stats, customers, logos, testimonials, certifications, or prices. If a rewrite needs a fact the docs do not have, cut the claim or flag it.
- The Two-Tone Rule: every H2 is two statements (`.tt-a` and `.tt-b`). Keep two lines, and keep each line short enough that the headline still fits its column.
- The Symbol Rule and the One-Name Rule from DESIGN.md and PRODUCT.md: Mount Zion is named once, in the story; XionTechs is the only company named.
- The climb and base-camp language is a deliberate metaphor. Keep it, but do not stack it into every sentence.

## Workflow

1. **Resolve the target** from the argument, or take the full scope above.
2. **Scan the mechanical tells** with the Grep tool across the target:
   - Dashes: `[\x{2014}\x{2013}]|&mdash;|&ndash;|&#8212;|&#8211;|\\u2014|\\u2013`
   - Negation reveal: `(?i)not (just|only|merely)|isn't (just|only|about)|more than just`
   - Triad candidates: `\b[\w-]+, [\w-]+,? (and|or) [\w-]+\b`
   - Inflated words: `(?i)\b(delve|seamless|leverag|robust|elevat|unlock|empower|cutting-edge|state-of-the-art|game-chang|transformativ|harness|tapestry|landscape|realm|testament|synerg|world-class|best-in-class)`
   Drop matches that fall in comments or code.
3. **Read the copy in full.** Triads and stock openers often slip past a regex. Read all of the target, labels included.
4. **Rewrite** with the smallest edit that fixes the tell. Keep the tone and the facts, and stay near the original length, since layout depends on it.
5. **Re-scan** with the same patterns. The dash pattern must return nothing inside the scope.
6. **Verify in the browser.** Copy edits in `.astro` files are UI changes, so follow `CLAUDE.md`: run `npx astro dev --port 4400`, open each changed page with the dev-browser skill, and check that headlines still fit and nothing wraps badly.
7. **Report** to the user:
   - Each change as `file:line`, before, after.
   - Findings you left alone (brand lines, items that need a fact you do not have) with the reason.
