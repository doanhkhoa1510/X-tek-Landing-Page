/* Shared brand data for the landing page and the subpages. */

import { project } from "../scripts/dots";

// the XT mark traced as SVG (viewBox 0 30 294 162); navy parts follow currentColor, the amber swoosh never changes
export const mark = `<path fill="currentColor" d="M8 188C37 177 78 150 120 110L168 152Q171 157 165 157L148 157L120 132C92 156 47 179 8 188Z"/><path fill="#F8C000" d="M91 74L117 74L140 99C168 75 205 54 249 44C214 59 178 85 140 123Z"/><path fill="currentColor" d="M216 62L239 58L239 155Q239 158 236 158L219 158Q216 158 216 155Z"/><path fill="currentColor" d="M193 79C216 58 253 41 294 37C265 44 244 54 236 61L216 66C207 70 200 74 193 79Z"/>`;

export const cities = [
  { id: "dallas", name: "Dallas, TX", zone: "America/Chicago", abbr: "CT", ...project(32.78, -96.8) },
  { id: "hcmc", name: "Ho Chi Minh City", zone: "Asia/Ho_Chi_Minh", abbr: "ICT", ...project(10.78, 106.69) },
  { id: "danang", name: "Da Nang", zone: "Asia/Ho_Chi_Minh", abbr: "ICT", ...project(16.05, 108.21) },
];
export type City = (typeof cities)[number];
export const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

// route arcs between camps, drawn in the dot map's own 1000-wide space
export const MAP_W = 1000, MAP_H = 1000 / (180 / 68);
export const arc = (a: City, b: City, lift: number) =>
  `M${(a.x * MAP_W).toFixed(1)} ${(a.y * MAP_H).toFixed(1)} Q${(((a.x + b.x) / 2) * MAP_W).toFixed(1)} ${(Math.min(a.y, b.y) * MAP_H - lift).toFixed(1)} ${(b.x * MAP_W).toFixed(1)} ${(b.y * MAP_H).toFixed(1)}`;

export const phones = {
  us: { href: "tel:+14693229899", label: "+1 469 322 9899" },
  vn: { href: "tel:+84908107552", label: "+84 908 107 552" },
};
export const email = "contact@xiontechs.com";

// landing sections; subpages reach them through "/"
export const sections = [
  ["routes", "Services"],
  ["ascent", "Process"],
  ["camps", "Base camps"],
  ["proof", "Work"],
  ["faq", "FAQ"],
  ["summit", "Contact"],
] as const;

export const company = [
  ["/about-us/", "About us"],
  ["/careers/", "Careers"],
  ["/faqs/", "FAQs"],
  ["/support/", "Support"],
  ["/contact-us/", "Contact us"],
] as const;

export const legal = [
  ["/privacy-policy/", "Privacy policy"],
  ["/terms-of-service/", "Terms of service"],
  ["/cookie-policy/", "Cookie policy"],
] as const;
