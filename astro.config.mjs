import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { defaultLocale, locales } from "./src/i18n/config.ts";
import rehypeEmailOff from "./src/i18n/rehype-email-off.mjs";
import rehypeLocalizeLinks from "./src/i18n/rehype-localize-links.mjs";

// the public origin, for canonical and hreflang links; set SITE_URL in .env (see .env.example) or as a Docker build arg
const SITE_URL = process.env.SITE_URL || loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "").SITE_URL;
if (!SITE_URL) console.warn("[xiontechs] SITE_URL is not set: pages build without canonical and hreflang links.");

export default defineConfig({
  site: SITE_URL || undefined,
  i18n: {
    defaultLocale,
    locales: locales.map((l) => (l.code === l.path ? l.code : { path: l.path, codes: [l.code] })),
    routing: { prefixDefaultLocale: false },
  },
  markdown: { rehypePlugins: [[rehypeLocalizeLinks, { locales, defaultLocale }], rehypeEmailOff] },
  // in astro dev the brief form posts to a mailer started from mailer/ (npm start); in Docker, nginx does this
  vite: { server: { proxy: { "/api": "http://localhost:3000" } } },
});
