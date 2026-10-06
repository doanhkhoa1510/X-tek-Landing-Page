/* XionTechs · subpages. The shared chrome, plus the night head's contour map, the reading-position index, and quiet entrances. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $$, goTo, mountCounters, onAltitude, rtl, syncHeader, twoTone } from "./chrome";
import { mountTopo } from "./topo";

/* ---------- the head: Mount Zion's contours on night; the amber line follows the altitude ---------- */
const topoCanvas = document.querySelector<HTMLCanvasElement>(".page-topo canvas");
if (topoCanvas) {
  const topo = mountTopo(topoCanvas, { minor: "rgba(169, 180, 204, 0.09)", major: "rgba(169, 180, 204, 0.22)", amber: 1.5, cover: true });
  onAltitude((alt) => topo(alt));
}

/* ---------- on-this-page index: the section being read is marked ---------- */
const toc = $$<HTMLAnchorElement>(".doc-toc a[href^='#']");
const marks = toc.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter((h): h is HTMLElement => !!h);
const mark = (i: number) => toc.forEach((a, j) => (j === i ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
marks.forEach((h, i) =>
  ScrollTrigger.create({ trigger: h, start: "top 45%", onEnter: () => mark(i), onLeaveBack: () => mark(i - 1) }),
);

/* ---------- scenes ---------- */
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // the title rises out of the night; the limb rises whole (it never fades)
  gsap.from(".page-title > span", { autoAlpha: 0, yPercent: 24, filter: "blur(8px)", duration: 1.2, ease: "expo.out", stagger: 0.1, delay: 0.05 });
  gsap.from(".page-aside > *", { autoAlpha: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.07, delay: 0.3 });
  gsap.from(".page-topo", { autoAlpha: 0, duration: 1.8, ease: "power2.out" });
  $$(".page-dawn").forEach((limb) => gsap.from(limb, { yPercent: 100, duration: 1.4, ease: "expo.out", delay: 0.15 }));

  $$(".tt").forEach((tt) => !tt.closest(".page-head") && twoTone(tt));

  // cells rise out of their own frames, as on the expedition log
  $$(".cells").forEach((list) =>
    gsap.from($$(".cell", list), { clipPath: "inset(100% 0 0 0)", duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: list, start: "top 82%" } }),
  );
  $$(".figures").forEach((row) =>
    gsap.from($$(".stat", row), { clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: row, start: "top 85%" } }),
  );
  $$(".role-list, .faq-list").forEach((list) =>
    gsap.from(list.children, { autoAlpha: 0, y: 20, duration: 0.9, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: list, start: "top 85%" } }),
  );
  $$(".contact-form").forEach((form) => gsap.from(form, { autoAlpha: 0, y: 40, duration: 1.2, ease: "expo.out", delay: 0.35 }));

  // base camps map: arcs draw, beacons ping while in view
  const map = document.querySelector(".worldmap");
  if (map) {
    ScrollTrigger.create({ trigger: map, start: "top bottom", end: "bottom top", toggleClass: { targets: map, className: "is-in" } });
    gsap.from(".arc-base", { strokeDashoffset: 1, duration: 1.8, ease: "power3.inOut", stagger: 0.25, scrollTrigger: { trigger: map, start: "top 80%" } });
  }
});
mountCounters();

syncHeader();
document.fonts?.ready.then(() => {
  ScrollTrigger.refresh();
  // deep links into a long page (/privacy-policy/#data-retention) land under the header
  const arrival = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  if (arrival) goTo(arrival, true);
});
