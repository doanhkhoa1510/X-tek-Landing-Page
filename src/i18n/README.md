# Translating the site

The site speaks seven languages: English (`en`, the source), Vietnamese (`vi`), Simplified Chinese (`zh-Hans`), Japanese (`ja`), Arabic (`ar`), French (`fr`), and Hindi (`hi`). English lives at `/`; every other language lives under its path: `/vi/`, `/zh/`, `/ja/`, `/ar/`, `/fr/`, `/hi/`.

Any text a language does not have yet shows in English, so a page is never empty. Translate in any order.

## Where the words live

| What | English file | Translation |
| --- | --- | --- |
| Page and component copy | `src/i18n/locales/en/<namespace>.json` | `src/i18n/locales/<locale>/<namespace>.json` |
| Legal texts and support | `src/content/docs/en/<slug>.md` | `src/content/docs/<locale>/<slug>.md` |
| Job posts | `src/content/jobs/en/<slug>.md` | `src/content/jobs/<locale>/<slug>.md` |

Each namespace belongs to one component or page. For example, `hero.json` is the landing headline, `footer.json` is the footer, and `site.json` holds the shared names of cities, offices, services, and pages.

## How to translate a namespace

1. Copy `src/i18n/locales/en/hero.json` to `src/i18n/locales/vi/hero.json`.
2. Translate the values. Keep every key as it is.
3. Run `npm run i18n:check`.

You can leave a key out, or leave it as `""`. Either way the English text shows.

## Rules for values

- **Placeholders stay.** `{{phone}}`, `{{brand}}`, and every other `{{name}}` are filled in by the site. Move them where your grammar needs them, but do not translate or delete them.
- **Tags stay.** `<call>…</call>` and `<faqs>…</faqs>` turn the words between them into a link. Translate the words inside the tags, and keep each pair.
- **Lists can change length.** `hero.json › lines` holds one entry per headline line. Split the headline into as many lines as reads well in your language.
- **The name stays.** Write `XionTechs` in Latin letters in every language. The pronunciation `/siː.ɒn.teks/` and the syllables "see · on · techs" are fixed in code and are not translated.
- **The tagline is yours to choose.** "Get IT done." is a key. Keep it in English, or adapt it.
- **Digits stay Latin** (0–9), also in Arabic and Hindi.

## Markdown pages

Copy the English file to the same slug in your language's folder, for example `src/content/docs/en/privacy-policy.md` to `src/content/docs/fr/privacy-policy.md`. Translate the front matter values and the body. Keep the front matter field names, and keep the file name: the URL stays `/fr/privacy-policy/`.

Write links to site pages exactly as English does (`/privacy-policy/`). The site adds the language prefix when it builds (`src/i18n/rehype-localize-links.mjs`), so readers stay in their language.

A page without a translation shows the English text with an "English only" notice.

### Arabic

Arabic pages run right to left, and the layout mirrors on its own. Inside running Arabic text, wrap a phone number or any code made of digits and spaces in `<bdi>…</bdi>`. Without it, the digit groups display in reverse order: `<bdi>+1 469 322 9899</bdi>`.

## Checking

`npm run i18n:check` prints each language's progress, then two kinds of finding:

- **missing**: keys and pages that still show English. These are allowed.
- **broken**: keys English does not have, changed placeholders or tags, or a value of the wrong shape (for example, a string where English has a list). These fail the run.

Run `npm run i18n:check -- --strict` to fail on missing keys and pages too, for example before a language is announced.

## For developers

- **Read copy in a component:** `const t = useT(Astro.currentLocale, "hero")`, then `t("lede")`. One namespace per component. Structure (ids, icons, numbers, links) stays in code and joins the copy by id.
- **Add a namespace:** create `src/i18n/locales/en/<namespace>.json`, then run `npm run i18n:types` so `t()` knows its keys.
- **Copy with links:** `rich(t("more", { phone }), { call: (s) => \`<a href="tel:…">${s}</a>\` })`, rendered with `set:html`.
- **Add a language:**
  1. Add it to `locales` in `src/i18n/config.ts`.
  2. Add its path to the `map` at the top of `nginx.conf` (for its 404 page).
  3. If its script is not Latin, add `src/styles/locales/<locale>.css` with its faces, and a font stack under "type per language" in `src/styles/global.css` (see DESIGN.md › Languages).
