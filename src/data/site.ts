/* Shared brand data for the landing page and the subpages.
   Content follows newxion.com (source of truth since 2026-09-30), kept to what is XionTechs' own: no other company is named.
   Structure lives here (ids, places, numbers, links); the words live in src/i18n/locales/<locale>/site.json under the same ids. */

import { project } from "../scripts/dots";

// the name and how it is said read the same in every language: constants, never translation keys
export const brand = { name: "XionTechs", ipa: "/siː.ɒn.teks/", say: "see-on-techs", syllables: ["see", "on", "techs"], dict: "Xi·on·techs" } as const;

// the XT mark traced as SVG (viewBox 0 30 294 162); navy parts follow currentColor, the amber swoosh never changes
export const mark = `<path fill="currentColor" d="M8 188C37 177 78 150 120 110L168 152Q171 157 165 157L148 157L120 132C92 156 47 179 8 188Z"/><path fill="#F8C000" d="M91 74L117 74L140 99C168 75 205 54 249 44C214 59 178 85 140 123Z"/><path fill="currentColor" d="M216 62L239 58L239 155Q239 158 236 158L219 158Q216 158 216 155Z"/><path fill="currentColor" d="M193 79C216 58 253 41 294 37C265 44 244 54 236 61L216 66C207 70 200 74 193 79Z"/>`;

// the seven core values, as the landing page shows them; the words live in values.json under the same ids
export const values = [
  ["quality", "check"],
  ["startup", "rocket"],
  ["client", "target"],
  ["integrity", "shield"],
  ["innovation", "ai"],
  ["done", "deployment"],
  ["people", "staffing"],
] as const;

export const cities = [
  { id: "plano", zone: "America/Chicago", abbr: "CT", ...project(33.08, -96.82) },
  { id: "hcmc", zone: "Asia/Ho_Chi_Minh", abbr: "ICT", ...project(10.78, 106.67) },
  { id: "danang", zone: "Asia/Ho_Chi_Minh", abbr: "ICT", ...project(16.05, 108.21) },
] as const;
export type City = (typeof cities)[number];
export const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

// route arcs between camps, drawn in the dot map's own 1000-wide space
export const MAP_W = 1000, MAP_H = 1000 / (180 / 68);
export const arc = (a: City, b: City, lift: number) =>
  `M${(a.x * MAP_W).toFixed(1)} ${(a.y * MAP_H).toFixed(1)} Q${(((a.x + b.x) / 2) * MAP_W).toFixed(1)} ${(Math.min(a.y, b.y) * MAP_H - lift).toFixed(1)} ${(b.x * MAP_W).toFixed(1)} ${(b.y * MAP_H).toFixed(1)}`;

// postal lines stay as written for the post, in every language (rendered in <bdi>, so they read left to right in Arabic too)
export const offices = [
  // Plano comes first everywhere (chips, offices, footer, Contact us): it is the US contact point (#43)
  { id: "plano", lines: ["7950 Legacy Drive, Suite 400", "Plano, Texas 75024, USA"], us: true },
  // the Vietnam base camps carry no street address (owner's call, 2026-09-30)
  { id: "hcmc", lines: [] as string[], us: false },
  { id: "danang", lines: [] as string[], us: false },
] as const;

// a phone number reads left to right even inside Arabic text: the isolates (LRI … PDI) stop the groups from reversing
const ltr = (s: string) => `\u2066${s}\u2069`;
export const phones = {
  us: { href: "tel:+14693229899", label: ltr("+1 469 322 9899") },
  wa: { href: "https://wa.me/14694399345", label: ltr("+1 469 439 9345") },
};
export const email = "vinni.tran@xiontechs.com";

// the people a buyer talks to (PRODUCT.md › Evidence on Hand); names read the same in every language.
// photo (a file in public/team/) and linkedin stay null until the owner supplies and approves them (#48): never a stock face
export const leaders = [
  { id: "vinni", name: "Vinni Vu Tran", photo: null as string | null, linkedin: null as string | null },
  { id: "thea", name: "Thea Thu Nguyen", photo: null as string | null, linkedin: null as string | null },
] as const;
// what happens after a brief is sent: shown under the form only once the owner gives who replies and in how many business days (#48)
export const reply = null as null | { who: string; days: number };
export const recruit = "recruit@xiontechs.com";

// the five software engineering lines
export const services = ["engineering", "insights", "robotics", "cocreation", "managed"] as const;

// landing sections; subpages reach them through "/"
export const sections = ["platform", "work", "why", "faq", "camps", "summit"] as const;

export const company = [
  ["/about-us/", "about"],
  ["/careers/", "careers"],
  ["/faqs/", "faqs"],
  ["/support/", "support"],
  ["/contact-us/", "contact"],
] as const;

export const legal = [
  ["/privacy-policy/", "privacy"],
  ["/terms-of-service/", "terms"],
  ["/cookie-policy/", "cookies"],
] as const;
