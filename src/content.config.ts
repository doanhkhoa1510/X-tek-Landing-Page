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

// client case studies (#49): one per project from #20. A case is published only once the owner approved every fact
// and the client's NDA allows it; until both flags are true it builds no page and no landing card
const cases = defineCollection({
  loader: perLocale("./src/content/cases"),
  schema: z.object({
    client: z.string(),
    title: z.string(),
    summary: z.string(),
    problem: z.string(),
    built: z.string(),
    stack: z.array(z.string()),
    team: z.string(),
    duration: z.string(),
    result: z.string(),
    approved: z.boolean().default(false),
    ndaChecked: z.boolean().default(false),
  }),
});

export const collections = { docs, jobs, cases };
