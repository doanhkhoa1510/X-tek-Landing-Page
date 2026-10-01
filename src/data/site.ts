/* Shared brand data for the landing page and the subpages.
   Content follows newxion.com (source of truth since 2026-09-30), kept to what is XionTechs' own: no other company is named. */

import { project } from "../scripts/dots";

// the XT mark traced as SVG (viewBox 0 30 294 162); navy parts follow currentColor, the amber swoosh never changes
export const mark = `<path fill="currentColor" d="M8 188C37 177 78 150 120 110L168 152Q171 157 165 157L148 157L120 132C92 156 47 179 8 188Z"/><path fill="#F8C000" d="M91 74L117 74L140 99C168 75 205 54 249 44C214 59 178 85 140 123Z"/><path fill="currentColor" d="M216 62L239 58L239 155Q239 158 236 158L219 158Q216 158 216 155Z"/><path fill="currentColor" d="M193 79C216 58 253 41 294 37C265 44 244 54 236 61L216 66C207 70 200 74 193 79Z"/>`;

export const cities = [
  { id: "plano", name: "Plano, TX", zone: "America/Chicago", abbr: "CT", ...project(33.08, -96.82) },
  { id: "hcmc", name: "Ho Chi Minh City", zone: "Asia/Ho_Chi_Minh", abbr: "ICT", ...project(10.78, 106.67) },
  { id: "danang", name: "Da Nang", zone: "Asia/Ho_Chi_Minh", abbr: "ICT", ...project(16.05, 108.21) },
];
export type City = (typeof cities)[number];
export const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

// route arcs between camps, drawn in the dot map's own 1000-wide space
export const MAP_W = 1000, MAP_H = 1000 / (180 / 68);
export const arc = (a: City, b: City, lift: number) =>
  `M${(a.x * MAP_W).toFixed(1)} ${(a.y * MAP_H).toFixed(1)} Q${(((a.x + b.x) / 2) * MAP_W).toFixed(1)} ${(Math.min(a.y, b.y) * MAP_H - lift).toFixed(1)} ${(b.x * MAP_W).toFixed(1)} ${(b.y * MAP_H).toFixed(1)}`;

export const offices = [
  { id: "plano", name: "Plano base camp", role: "Texas, USA", lines: ["7950 Legacy Drive, Suite 400", "Plano, Texas 75024, USA"] },
  // the Vietnam base camps carry no street address (owner's call, 2026-09-30)
  { id: "hcmc", name: "HCMC base camp", role: "Ho Chi Minh City, Vietnam", lines: [] as string[] },
  { id: "danang", name: "Da Nang base camp", role: "Da Nang, Vietnam", lines: [] as string[] },
];

export const phones = {
  us: { href: "tel:+14693229899", label: "+1 469 322 9899" },
  wa: { href: "https://wa.me/14694399345", label: "+1 469 439 9345" },
};
export const email = "vinni.tran@xiontechs.com";

// the five software engineering lines
export const services = [
  ["Digital product engineering", "UX/UI design, product engineering and re-engineering, low-code apps, testing, sustenance, and DevOps/DevSecOps."],
  ["Digital insights and analytics", "Agentic AI systems, business intelligence, process modeling, data engineering, and analytics platforms."],
  ["Embedded and AI robotics", "AI for edge devices, health wearables, home sensors, smart cameras, and factory robots."],
  ["Co-creation development", "Ideation, experience design, rapid prototypes and MVPs, launch, and product digital marketing."],
  ["Application managed services", "Monitoring, troubleshooting, enhancement, optimization, database administration, and CI/CD release management."],
] as const;

// landing sections; subpages reach them through "/"
export const sections = [
  ["mindset", "Mindset"],
  ["values", "Core values"],
  ["platform", "Platform"],
  ["work", "Work"],
  ["faq", "FAQ"],
  ["camps", "Base camps"],
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
