/* Copy for every page, in every language, through i18next. Each component reads one namespace:
   src/i18n/locales/<locale>/<namespace>.json. English is complete; a key another language lacks falls back to English. */

import i18next, { type Namespace } from "i18next";
import { defaultLocale, localeOf, locales } from "./config";

const files = import.meta.glob<{ default: Record<string, unknown> }>("./locales/*/*.json", { eager: true });
const resources: Record<string, Record<string, Record<string, unknown>>> = {};
for (const [file, mod] of Object.entries(files)) {
  const [, code, ns] = file.match(/\/locales\/([^/]+)\/([^/]+)\.json$/)!;
  (resources[code] ??= {})[ns] = mod.default;
}

await i18next.init({
  resources,
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  supportedLngs: locales.map((l) => l.code),
  load: "currentOnly",
  ns: Object.keys(resources[defaultLocale]),
  defaultNS: "common",
  initAsync: false,
  returnEmptyString: false, // a key left empty in a translation shows the English copy
  interpolation: { escapeValue: false }, // Astro escapes on output; rich() escapes for set:html
});

/** The translate function of one namespace in one locale (pass Astro.currentLocale). */
export const useT = <N extends Namespace>(locale: string | undefined, ns: N) => i18next.getFixedT(localeOf(locale).code, ns);

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Markup for a translation that wraps words in named tags, for set:html.
    rich("Read <faqs>all FAQs</faqs>.", { faqs: (s) => `<a href="/faqs/">${s}</a>` }); the text is escaped, and only the named tags become markup. */
export function rich(text: string, tags: Record<string, (inner: string) => string>) {
  return escape(text).replace(/&lt;(\w+)&gt;(.*?)&lt;\/\1&gt;/g, (_, tag: string, inner: string) => tags[tag]?.(inner) ?? inner);
}
