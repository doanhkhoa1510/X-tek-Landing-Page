import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// one file per language: <collection>/<locale>/<slug>.md, with ids kept as "<locale>/<slug>" (src/i18n/content.ts reads them)
const perLocale = (base: string) => glob({ pattern: "*/*.md", base, generateId: ({ entry }) => entry.replace(/\.md$/, "") });

// long-form pages carried over from the old xiontechs.com: legal texts and the support center
const docs = defineCollection({
  loader: perLocale("./src/content/docs"),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    description: z.string(),
    lede: z.string(),
    meta: z.array(z.string()).default([]),
  }),
});

// job posts from the old careers board; the slugs keep their /job/<slug>/ URLs
const jobs = defineCollection({
  loader: perLocale("./src/content/jobs"),
  schema: z.object({
    title: z.string(),
    type: z.string(),
    location: z.string(),
    posted: z.string(),
    validThrough: z.string(),
    category: z.string(),
    status: z.string(),
    summary: z.string(),
  }),
});

export const collections = { docs, jobs };
