/* The site's languages. English is the default and keeps the unprefixed URLs (/about-us/); every other language
   lives under its own path (/vi/about-us/). astro.config.mjs builds Astro's i18n routing from this list. */

export const locales = [
  { code: "en", path: "en", short: "EN", name: "English", dir: "ltr" },
  { code: "vi", path: "vi", short: "VI", name: "Tiếng Việt", dir: "ltr" },
  { code: "zh-Hans", path: "zh", short: "ZH", name: "中文", dir: "ltr" },
  { code: "ja", path: "ja", short: "JA", name: "日本語", dir: "ltr" },
  { code: "ar", path: "ar", short: "AR", name: "العربية", dir: "rtl" },
  { code: "fr", path: "fr", short: "FR", name: "Français", dir: "ltr" },
  { code: "hi", path: "hi", short: "HI", name: "हिन्दी", dir: "ltr" },
] as const;

export type Locale = (typeof locales)[number]["code"];
export type LocaleInfo = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** The locale entry for a code (Astro.currentLocale); unknown or missing codes fall back to English. */
export const localeOf = (code?: string): LocaleInfo => locales.find((l) => l.code === code) ?? locales[0];

/** A site path in a locale: localize("/about-us/", "vi") → "/vi/about-us/". In-page anchors and other schemes pass through. */
export function localize(path: string, code?: string) {
  const l = localeOf(code);
  if (!path.startsWith("/") || l.code === defaultLocale) return path;
  return `/${l.path}${path}`;
}

/** The locale-free form of a pathname: "/vi/about-us/" → "/about-us/". */
export function unlocalize(pathname: string) {
  const [, first, ...rest] = pathname.split("/");
  return locales.some((l) => l.code !== defaultLocale && l.path === first) ? `/${rest.join("/")}` : pathname;
}

/** getStaticPaths entries for the [...lang] routes: no segment for English, the locale path for the rest. */
export const localePaths = () => locales.map((l) => ({ params: { lang: l.code === defaultLocale ? undefined : l.path }, props: { locale: l.code } }));
