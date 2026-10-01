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

const isolate = (v: unknown): unknown =>
  typeof v === "string" ? `\u2066${v}\u2069` : Array.isArray(v) ? v.map(isolate) : v;

/** The translate function of one namespace in one locale (pass Astro.currentLocale).
    On a right-to-left page, copy that fell back to English is isolated left to right (LRI … PDI), so its full stop
    stays at its own end instead of jumping to the start. */
export function useT<N extends Namespace>(locale: string | undefined, ns: N) {
  const l = localeOf(locale);
  const t = i18next.getFixedT(l.code, ns);
  if (l.dir !== "rtl") return t;
  return ((key: string, options?: object) => {
    const value = (t as (k: string, o?: object) => unknown)(key, options);
    const own = i18next.getResource(l.code, ns as string, key);
    return own === undefined || own === "" ? isolate(value) : value;
  }) as unknown as typeof t;
}

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Markup for a translation that wraps words in named tags, for set:html.
    rich("Read <faqs>all FAQs</faqs>.", { faqs: (s) => `<a href="/faqs/">${s}</a>` }); the text is escaped, and only the named tags become markup. */
export function rich(text: string, tags: Record<string, (inner: string) => string>) {
  return escape(text).replace(/&lt;(\w+)&gt;(.*?)&lt;\/\1&gt;/g, (_, tag: string, inner: string) => tags[tag]?.(inner) ?? inner);
}
