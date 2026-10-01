---
name: desloppify
description: Rework the sentence structure of user-facing copy so it does not read as AI-generated slop. Use when the user invokes /desloppify, or asks to de-AI, humanize, or clean up the visible text of the site (headings, paragraphs, buttons, labels, meta descriptions, markdown content). Covers the English copy in src/i18n/locales/en/*.json and the English markdown; translations and legal docs are excluded. Only text a visitor sees is in scope; code comments and identifiers are not.
user-invocable: true
argument-hint: "[file, page, or section; default is all user-facing text]"
---

Edit the copy a visitor reads so it does not carry the sentence shapes of AI writing. The target is structure, not vocabulary. Keep the meaning, the facts, the words, and the voice. Change how the sentence is built.

## Structure, not vocabulary

AI copy gives itself away through its shapes: three-item lists, "not just X" setups, mirrored pairs, punchy one-line closers, dashes. A rich word on its own is not slop.

- Fix a flagged sentence by restructuring it: merge two clauses, split one sentence into two, subordinate one item to another, reorder, or drop a padded item. Reuse the original words.
- Do not swap words for plainer synonyms. "Leverage", "foster", "cutting-edge", "transformative" stay when they are used once and the sentence carries them. A lavish word is fine.
- Change a word only when it is one of these:
  - Repeated: the same showy word or phrase appears more than once on a page. Keep the strongest use and rework the others.
  - Abused: a stock collocation that now reads as filler, such as "seamless integration", "unlock your potential", "elevate your experience", "in today's fast-paced world".
  - A strong AI marker: delve, tapestry, testament to, realm, multifaceted, ever-evolving, navigate the complexities, a symphony of.
- Even then, prefer a structural fix over a synonym.

Bad: `We embrace creativity, leverage emerging technologies, and continuously explore better ways to solve problems.` to `We embrace creativity, use emerging technologies, and ...` (word swapped, triad left in place)
Good: `We embrace creativity and leverage emerging technologies, always looking for better ways to solve problems.` (same words, the third verb becomes a trailing clause)

## Keep the meaning and the voice

- Only edit a sentence that matches a hard rule or a listed tell. If a sentence trips nothing, leave it alone, even if you would have written it differently.
- Keep the meaning. Do not narrow, widen, or reinterpret a claim.
- Keep idioms, metaphors, and figures of speech ("stay ahead of the curve", "rope team", "name your summit") as written. Do not turn a figurative line into a literal one, or the other way round.
- Short mottos, slogans, and headlines change only when they contain a hard-rule violation.
- If the only fix you can find changes the meaning or the voice, leave the sentence and list it in the report.

Bad: `Stay ahead of the curve.` to `We try new technology early.` (no rule broken; idiom flattened)
Good: leave it.

## Scope

The site is translated (see `src/i18n/README.md`). English is the source; the other six languages are drafts that translators replace. Desloppify English only.

In scope, English text that renders to a visitor:

- Values in `src/i18n/locales/en/*.json`. Almost all page and component copy lives here, one namespace per component or page (`hero.json`, `work.json`, `site.json`, and so on). Each component reads its namespace with `t("key")`.
- Frontmatter values and body of `src/content/jobs/en/*.md` and `src/content/docs/en/support.md`.
- Visible text still written directly in `src/pages/**/*.astro`, `src/components/**/*.astro`, `src/layouts/**/*.astro`: text nodes and the attributes a visitor or screen reader gets (`alt`, `aria-label`, `title`, `placeholder`, `<meta name="description">`, Open Graph text). Most of it now comes from `t()`, so edit the JSON value, not the call.
- Strings in `src/scripts/**/*.ts` that are written into the DOM (labels, chips, counters, button text). Most scripts now read their words from the markup, so check the JSON first.

Out of scope:

- Code comments, class names, identifiers, console output, CSS, and JSON keys. Leave them as they are, even when they contain an em dash.
- `src/data/site.ts`: it holds structure (ids, places, numbers, links) and the brand constants; its words live in `src/i18n/locales/en/site.json`.
- Every non-English locale: `src/i18n/locales/<locale>/` and `src/content/{docs,jobs}/<locale>/` for `vi`, `zh-Hans`, `ja`, `ar`, `fr`, `hi`. The rules below describe English sentence shapes, and dash conventions differ by language. Do not edit, scan, or report on them; translators update them from the changed English.

Never touch the legal docs, in any language: `src/content/docs/*/privacy-policy.md`, `src/content/docs/*/terms-of-service.md`, `src/content/docs/*/cookie-policy.md`. Do not scan, edit, or report on them, not even for dashes. Exclude them from every Grep (`glob` such as `!**/docs/*/{privacy-policy,terms-of-service,cookie-policy}.md`). This holds even when the user names one of them as the target: say they are excluded and stop.

If the user passes a target, work only on that target. A page or section name maps to its namespace, for example "the log" to `work.json` and "the footer" to `footer.json`. Otherwise cover everything above.

## Editing the JSON

The copy files feed i18next and the typed `t()` keys, so a rewrite must keep their shape:

- Change values only. Never rename, add, remove, or reorder keys.
- Keep every placeholder (`{{phone}}`, `{{brand}}`, `{{type}}`) exactly as written. Move it within the sentence if the rewrite needs that.
- Keep every tag pair (`<call>...</call>`, `<faqs>...</faqs>`) and the words that make the link meaningful.
- Keep the value type: a string stays a string, a list stays a list. A list such as `hero.json › lines` may change length only if the headline still fits.
- Two-tone headlines are stored as `{ "a": "...", "b": "..." }` under `title`. Keep both halves.
- Keep the typographic quotes (`“Get IT Done”`) and the JSON escaping valid.

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

This family sets up a claim nobody made, then knocks it down. Say Y directly, in its own words.

Variants to catch:

- "It's not just X, it's Y." / "X isn't just A. It's B."
- "Not only X, but also Y."
- "This isn't about X. It's about Y."
- "More than just X."
- "Not X. Not Y. Just Z."

Bad: `It's not just software, it's a partnership.`
Good: `We build the software as a partnership.`

If X carries real information, fold it into the sentence as a plain clause. Never invent a concrete detail to replace it.

### 3. No lists of three for rhythm

AI copy reaches for three items because three sounds complete: "fast, secure, and scalable", "We listen. We build. We deliver.", "A provides X, Y, and Z".

- Rhetorical triad (adjectives, verbs, nouns, parallel short sentences): break the even cadence. Pair two items and hang the third off them as a clause, move one item into its own sentence, or drop an item that only pads the rhythm. Keep the words of the items you keep.
- Factual set that happens to have three members (three offices, three domains): keep every fact. Do not drop a real item to dodge the rule. Break the cadence instead: put the items in a list or UI element, or split the sentence.
- Do not pad to four to escape the rule either.
- A list already set as bullets or chips is a list, not a triad. Leave it.

Bad: `Our platform is fast, secure, and scalable.`
Good: `Our platform is fast and secure, and it scales as you grow.`

Bad: `Offices in Plano, Ho Chi Minh City, and Da Nang.`
Good: `Offices in Plano, Texas, and in Vietnam at Ho Chi Minh City and Da Nang.`

## Other tells to fix

Fix these when you see them. They matter less than the hard rules, so judge each one in context.

- Stock openers and closers: "In today's fast-paced world", "Whether you're X or Y", "Ready to take X to the next level?", "Let's dive in", "At the end of the day".
- Reveal tricks: "The result? X.", "Here's the thing:", "The best part?". State X.
- Empty intensifiers stacked on a claim: truly, incredibly, deeply, genuinely.
- Every paragraph ending on a punchy one-line sentence. Vary it.
- Mirrored sentence pairs ("We don't X. We Y.") used more than once on a page.
- Several sentences in a row with the same shape (same opener, same length, same clause pattern). Vary the build.
- Repeated, abused, or strong-marker words, as defined in "Structure, not vocabulary".

## Do not touch

Read `PRODUCT.md` (Brand Commitments, Evidence on Hand) and `DESIGN.md` before editing. These constraints win over every rule above:

- Brand lines stay verbatim: "Get IT Done", "Where intelligence meets identity", "Get IT done. Make your mark." In the copy files they sit in `hero.json › lines` (the headline split one line per entry) and `hero.json › accent`, `footer.json › tagline`, `home.json › title`, and the “Get IT Done” attitude in `about.json`, `values.json`, `careers.json`, and `faqs.json`.
- Never add facts. No new stats, customers, logos, testimonials, certifications, or prices. If a rewrite needs a fact the docs do not have, cut the claim or flag it.
- The Two-Tone Rule: every H2 is two statements (`.tt-a` and `.tt-b`). Keep two lines, and keep each line short enough that the headline still fits its column.
- The Symbol Rule and the One-Name Rule from DESIGN.md and PRODUCT.md: Mount Zion is named once, in the story; XionTechs is the only company named.
- The climb and base-camp language is a deliberate metaphor. Keep it, but do not stack it into every sentence.

## Workflow

1. **Resolve the target** from the argument, or take the full scope above.
2. **Scan the mechanical tells** with the Grep tool across the target, which by default is `src/i18n/locales/en/`, `src/content/jobs/en/`, `src/content/docs/en/support.md`, and the `.astro` and script files above:
   - Dashes: `[\x{2014}\x{2013}]|&mdash;|&ndash;|&#8212;|&#8211;|\\u2014|\\u2013`
   - Negation reveal: `(?i)not (just|only|merely)|isn't (just|only|about)|more than just`
   - Triad candidates: `\b[\w-]+, [\w-]+,? (and|or) [\w-]+\b`
   - Strong AI markers: `(?i)\b(delve|tapestry|testament to|realm|multifaceted|ever-evolving|navigat\w* the complexit|symphony of|seamless(ly)? integrat|unlock your|elevate your)`
   Drop matches that fall in comments or code.
3. **Read the copy in full.** Triads, repeated words, and same-shape runs slip past a regex. Read all of the target, labels included, page by page.
4. **Edit** each flagged sentence by restructuring it, following "Structure, not vocabulary" and "Keep the meaning and the voice". Stay near the original length, since layout depends on it.
5. **Re-scan** with the same patterns. The dash pattern must return nothing inside the scope.
6. **Check the copy files** with `npm run i18n:check`. It must report 0 broken; a broken finding means a key, placeholder, tag, or value shape changed. Fix the English file, not the check.
7. **Verify in the browser.** Copy edits in the JSON, markdown, and `.astro` files are UI changes, so follow `CLAUDE.md`: run `npx astro dev --port 4400`, open each changed English page with the dev-browser skill, and check that headlines still fit and nothing wraps badly.
8. **Report** to the user:
   - Each change as `file:line`, before, after.
   - Findings you left alone (brand lines, items that need a fact you do not have, fixes that would change meaning) with the reason.
   - The changed keys per namespace (for example `work.json › achieved.text`) and the changed markdown files, as the list translators need. `i18n:check` does not flag a translation whose English source changed, so this list is the only record.
