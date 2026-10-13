/* XionTechs · The Night Ascent — landing page orchestration.
   GSAP ScrollTrigger drives every scroll scene on the browser's native scroll; see DESIGN.md › Motion. The shared chrome lives in chrome.ts. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, goTo, hdr, mountCounters, onAltitude, reduce, root, rtl, syncHeader, twoTone } from "./chrome";
import { mountMountain } from "./mountain";
import { mountTopo } from "./topo";
import { mountDial } from "./dial";

/* ---------- scene and maps ---------- */
const scene = mountMountain($<HTMLCanvasElement>("#mountain"), $("#chips"), () => root.classList.add("no-webgl"));
if (!scene) root.classList.add("no-webgl");
const topoBg = mountTopo($<HTMLCanvasElement>(".ascent-bg canvas"), { minor: "rgba(16, 48, 96, 0.07)", major: "rgba(16, 48, 96, 0.15)", amber: 0, cover: true } /* no live line: it shifted on scroll behind the copy */);
mountDial($(".dial-frame"), $(".stages"));

/* ---------- altitude: the log's contour backdrop follows the reading ---------- */
onAltitude((alt) => topoBg(alt));

/* ---------- scene gating: render only while the night is on screen ---------- */
const night = { hero: false, summit: false };
const gate = (key: keyof typeof night, on: boolean) => {
  night[key] = on;
  scene?.setActive(night.hero || night.summit);
};
ScrollTrigger.create({
  trigger: ".hero", start: "top bottom", end: "bottom top",
  onToggle: (s) => gate("hero", s.isActive), onEnter: () => scene?.setMode("hero"), onEnterBack: () => scene?.setMode("hero"),
});
// the base camps fade into the summit scene, so the scene wakes before their last rows leave
ScrollTrigger.create({
  trigger: ".summit", start: "top bottom+=400", end: "bottom top",
  onToggle: (s) => gate("summit", s.isActive), onEnter: () => scene?.setMode("summit"), onEnterBack: () => scene?.setMode("summit"),
});

/* ---------- scroll scenes (created top to bottom; pins first in their section) ---------- */
const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
  const { motion } = ctx.conditions as { motion: boolean };
  if (!motion) {
    scene?.setHero(0);
    return;
  }

  // hero: the dive toward the summit, then dawn hands over to daylight
  gsap.timeline({
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: true, onUpdate: (s) => scene?.setHero(s.progress) },
  })
    .to(".hero-copy", { yPercent: -16, autoAlpha: 0, ease: "none", duration: 0.26 }, 0.16)
    // the second screen is never only decoration: what we do rises as the headline leaves, and stays until the hero ends
    .fromTo(".hero-next", { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.12 }, 0.3)
    // y:0 clears the px offset GSAP parses from the CSS resting transform, so only yPercent drives the rise;
    // the limb is the bottom 90vh of a 200vh box, so it starts hidden at 45%
    .fromTo(".hero-dawn", { y: 0, yPercent: 45 }, { y: 0, yPercent: 0, ease: "none", duration: 0.58 }, 0.42);

  // services: each group's list rises service by service; the cells stay put, so their hairlines never show as a block
  $$(".gear-list").forEach((list) =>
    gsap.from(list.querySelectorAll(".gear-item > *"), { autoAlpha: 0, y: 24, duration: 1.1, ease: "expo.out", stagger: 0.03, scrollTrigger: { trigger: list, start: "top 85%" } }),
  );

  // platform: the chart builds tier by tier, and the spokes draw out from the supervisor
  $$(".tier").forEach((t) => gsap.from(t, { autoAlpha: 0, y: 24, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 95%" } }));
  gsap.fromTo(".spoke", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power3.inOut", stagger: 0.06, delay: 0.1, scrollTrigger: { trigger: ".hub", start: "top 95%" } });

  // two-tone headlines: the ink line fills word by word, dim → glacier → ink
  $$(".tt").forEach(twoTone);

  // the log: the dial fills arc by arc (dial.ts), which wakes each later entry as its arc turns current; the first
  // entry wakes as it rises into view
  const base = $(".stage");
  ScrollTrigger.create({ trigger: base, start: "top 62%", onEnter: () => base.classList.add("is-on"), onLeaveBack: () => base.classList.remove("is-on") });
  // stats wipe in and count; log rows rise out of their rules
  gsap.from(".stats .stat", {
    clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", duration: 1.2, ease: "expo.out", stagger: 0.12,
    scrollTrigger: { trigger: ".stats", start: "top 85%" },
  });
  // why XionTechs: each reason rises with its proof, then the figure counts up
  gsap.from(".reason", { autoAlpha: 0, y: 24, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".reasons", start: "top 85%" } });
  $$(".log").forEach((log) =>
    gsap.from(log.children, { autoAlpha: 0, y: 20, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: log, start: "top 82%" } }),
  );

  // base camps: arcs draw, chips blur in, beacons ping while in view
  const map = $(".worldmap");
  ScrollTrigger.create({ trigger: map, start: "top bottom", end: "bottom top", toggleClass: { targets: map, className: "is-in" } });
  gsap.from(".arc-base", { strokeDashoffset: 1, duration: 1.8, ease: "power3.inOut", stagger: 0.25, scrollTrigger: { trigger: map, start: "top 75%" } });
  // chips keep their CSS translate offsets, so no transform tween here (GSAP would inline translate: none)
  gsap.from(".city-chip", { autoAlpha: 0, filter: "blur(5px)", duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: map, start: "top 70%" } });
  gsap.from(".offices li", { autoAlpha: 0, filter: "blur(6px)", duration: 0.9, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".offices", start: "top 85%" } });

  // summit: the form panel rises from the ridge
  gsap.from(".brief", { autoAlpha: 0, y: 48, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".summit-grid", start: "top 75%" } });
});

mountCounters();

/* ---------- preloader → hero entrance ---------- */
const loader = document.querySelector<HTMLElement>(".loader");
const heroLines = $$(".hero-title .ln > span");
const heroRest = [$(".hero-lede"), ...$$(".hero .actions .btn")];

function heroEntrance(delay = 0) {
  const tl = gsap.timeline({ delay });
  if (scene) {
    tl.to(scene.rig, { scale: 1, shift: 0, duration: 1.4, ease: "expo.out" }, 0)
      .to(scene.rig, { glow: 1, duration: 1.3, ease: "circ.inOut" }, 0.1)
      .to(scene.rig, { arcs: 1, duration: 0.9, ease: "power2.out" }, 0.55);
  }
  tl.to(heroLines, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.15)
    .to(heroRest, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.06 }, 0.45)
    .add(() => scene?.labels.forEach((el) => (el.style.transitionDelay = "")), 2.4);
  return tl;
}

/* the loader holds the page still: wheel, touch, and scroll keys wait until it folds away (the scrollbar stays put) */
const scrollKeys = new Set([" ", "PageDown", "PageUp", "End", "Home", "ArrowDown", "ArrowUp"]);
const hold = (e: Event) => e.preventDefault();
const holdKeys = (e: KeyboardEvent) => scrollKeys.has(e.key) && e.preventDefault();
function holdScroll(on: boolean) {
  if (on) {
    addEventListener("wheel", hold, { passive: false });
    addEventListener("touchmove", hold, { passive: false });
    addEventListener("keydown", holdKeys);
  } else {
    removeEventListener("wheel", hold);
    removeEventListener("touchmove", hold);
    removeEventListener("keydown", holdKeys);
  }
}

async function boot() {
  syncHeader();
  scene?.labels.forEach((el, i) => (el.style.transitionDelay = `${0.6 + i * 0.07}s`));
  // arriving from a subpage link like /#faq: skip the loader and land on the section
  const arrival = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
  if (reduce || !loader || arrival) {
    loader?.remove();
    hdr.classList.remove("is-waiting");
    if (arrival) document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      goTo(arrival, true);
    });
    return;
  }
  hdr.classList.add("is-waiting");
  holdScroll(true);
  gsap.set(heroLines, { yPercent: (_: number, el: Element) => parseFloat(getComputedStyle(el).getPropertyValue("--ln-from")) || 110 });
  gsap.set(heroRest, { autoAlpha: 0, y: 24 });
  if (scene) Object.assign(scene.rig, { scale: 0.6, shift: 7, glow: 0, arcs: 0 });

  const returning = sessionStorage.getItem("xt-camp") === "1";
  sessionStorage.setItem("xt-camp", "1");
  const num = $(".loader-num"), count = { v: 0 };
  const show = () => (num.textContent = String(Math.round(count.v)));

  gsap.timeline()
    .from(".loader-logo, .loader-count", { autoAlpha: 0, duration: 0.6, ease: "power3.inOut" }, 0)
    .from(".loader-map", { autoAlpha: 0, scale: 0.94, duration: 0.8, ease: "power3.inOut" }, 0.1)
    .from(".loader-left li, .loader-right li", { autoAlpha: 0, y: 6, duration: 0.4, stagger: 0.03, ease: "power3.out" }, 0.2)
    .from(".loader .map-dot", { scale: 0, duration: 0.5, stagger: 0.15, ease: "back.out(2)" }, 0.5);
  const counting = gsap.to(count, { v: 90, duration: returning ? 0.5 : 1.6, ease: "power2.inOut", onUpdate: show });
  await Promise.all([document.fonts?.ready, counting.then(), new Promise((r) => setTimeout(r, returning ? 500 : 1600))]);
  await gsap.to(count, { v: 100, duration: 0.25, ease: "power1.out", onUpdate: show }).then();

  // the loader logo travels into the header; the rest folds away
  const from = $(".loader-logo").getBoundingClientRect(), dest = $(".logo").getBoundingClientRect();
  const out = gsap.timeline({ defaults: { ease: "power3.inOut" } });
  out.to(".loader-left li, .loader-right li", { autoAlpha: 0, y: -6, duration: 0.4, stagger: 0.02 }, 0)
    .to(".loader-count", { autoAlpha: 0, duration: 0.3 }, 0)
    .to(".loader-map", { scale: 0, autoAlpha: 0, duration: 0.5 }, 0.15)
    .to(".loader-logo", { x: dest.left - from.left, y: dest.top - from.top, duration: 0.9 }, 0.2)
    .add(() => {
      hdr.classList.remove("is-waiting");
      gsap.set(".loader-logo", { autoAlpha: 0 });
    }, 1.1)
    .to(loader, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 1.0)
    .add(() => {
      loader.remove();
      holdScroll(false);
      ScrollTrigger.refresh();
    });
  heroEntrance(0.95);
}
boot();
document.fonts?.ready.then(() => ScrollTrigger.refresh());
