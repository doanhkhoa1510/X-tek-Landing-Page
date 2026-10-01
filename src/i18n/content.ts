/* Long-form markdown per language: src/content/<collection>/<locale>/<slug>.md. The English files define the slugs;
   a language without its own file for a slug shows the English one, marked lang="en" with a notice. */

import { getCollection } from "astro:content";
import { defaultLocale, localeOf } from "./config";

type LongForm = "docs" | "jobs";
const split = (id: string) => [id.slice(0, id.indexOf("/")), id.slice(id.indexOf("/") + 1)] as const;

/** Every slug of a collection. */
export async function slugs(collection: LongForm) {
  return (await getCollection(collection)).map((e) => split(e.id)).filter(([code]) => code === defaultLocale).map(([, slug]) => slug);
}

/** A slug's entry in a locale, or the English entry; `translated` is false when it fell back. */
export async function entryFor<C extends LongForm>(collection: C, slug: string, locale?: string) {
  const all = await getCollection(collection);
  const own = all.find((e) => e.id === `${localeOf(locale).code}/${slug}`);
  return { entry: own ?? all.find((e) => e.id === `${defaultLocale}/${slug}`)!, slug, translated: !!own };
}

/** Every entry of a collection in a locale, English where a translation is missing. */
export async function entriesFor<C extends LongForm>(collection: C, locale?: string) {
  return Promise.all((await slugs(collection)).map((slug) => entryFor(collection, slug, locale)));
}
