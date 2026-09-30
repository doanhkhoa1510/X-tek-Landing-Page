/* XionTechs · The Night Ascent — landing page orchestration.
   Lenis + GSAP ScrollTrigger drive every scroll scene; see DESIGN.md › Motion. The shared chrome lives in chrome.ts. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, goTo, hdr, hud, lenis, mountCounters, onAltitude, reduce, root, syncHeader, twoTone } from "./chrome";
import { mountMountain } from "./mountain";
import { mountTopo } from "./topo";
import { mountRidge } from "./ridge";
import { mountTrail } from "./trail";

/* ---------- scene and maps ---------- */
const scene = mountMountain($<HTMLCanvasElement>("#mountain"), $("#chips"));
if (!scene) root.classList.add("no-webgl");
const topo = mountTopo($<HTMLCanvasElement>(".topo canvas"));
const topoBg = mountTopo($<HTMLCanvasElement>(".ascent-bg canvas"), { minor: "rgba(16, 48, 96, 0.07)", major: "rgba(16, 48, 96, 0.15)", amber: 1.5, amberColor: "rgba(16, 48, 96, 0.34)", cover: true } /* live line in navy: amber would strike through the copy */);
const ride = mountRidge($<HTMLCanvasElement>(".ridge canvas"), $(".rider"));
mountTrail($(".trek-frame"), $(".stages"));

/* ---------- altimeter: the rider and both contour maps follow the reading ---------- */
const riderAlt = $(".rider-alt");
onAltitude((alt, shown) => {
  riderAlt.textContent = `Alt ${shown} m`;
  topo(alt);
  topoBg(alt);
});

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
mm.add({ wide: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
  const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean };
  if (!motion) {
    scene?.setHero(0);
    return;
  }

  // hero: the dive toward the summit, then dawn hands over to daylight
  gsap.timeline({
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: true, onUpdate: (s) => scene?.setHero(s.progress) },
  })
    .to(".hero-copy", { yPercent: -16, autoAlpha: 0, ease: "none", duration: 0.42 }, 0)
    // y:0 clears the px offset GSAP parses from the CSS resting transform, so only yPercent drives the rise
    .fromTo(".hero-dawn", { y: 0, yPercent: 100 }, { y: 0, yPercent: 0, ease: "none", duration: 0.58 }, 0.42);

  // mindset: the story rises, then the mission
  gsap.from(".intro-right .lede, .mission, .intro-right .btn", {
    autoAlpha: 0, y: 28, duration: 1.1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".intro-right", start: "top 80%" },
  });
  gsap.from(".topo", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".topo", start: "top 85%" } });

  // core values: pinned; the value track slides past while the giant type drifts behind
  const track = $(".track"), giant = $(".giant");
  if (wide) {
    const clip = track.parentElement!;
    const dist = () => Math.max(0, track.scrollWidth - clip.clientWidth);
    gsap.timeline({
      scrollTrigger: { trigger: ".routes", start: "top top", end: () => `+=${Math.max(innerHeight * 0.8, dist() * 1.15)}`, pin: true, scrub: true, invalidateOnRefresh: true, onUpdate: (s) => ride(s.progress) },
    })
      .to(track, { x: () => -dist(), ease: "none" }, 0)
      .to(giant, { x: () => -Math.max(0, giant.scrollWidth - innerWidth * 0.9), ease: "none" }, 0);
  } else {
    gsap.to(giant, { xPercent: -45, ease: "none", scrollTrigger: { trigger: ".routes", start: "top bottom", end: "bottom top", scrub: true, onUpdate: (s) => ride(s.progress) } });
  }
  gsap.from(".svc > *", {
    autoAlpha: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.035,
    scrollTrigger: { trigger: ".routes-band", start: wide ? "top 70%" : "top 85%" },
  });

  // two-tone headlines: the ink line fills word by word, dim → glacier → ink
  $$(".tt").forEach(twoTone);

  // the log: the climber walks the trail up Mount Zion (trail.ts); each camp's entry wakes as it nears the centre
  $$(".stage").forEach((s) =>
    ScrollTrigger.create({ trigger: s, start: "top 62%", onEnter: () => s.classList.add("is-on"), onLeaveBack: () => s.classList.remove("is-on") }),
  );
  // stats wipe in and count; log rows rise out of their rules
  gsap.from(".stat", {
    clipPath: "inset(0 100% 0 0)", duration: 1.2, ease: "expo.out", stagger: 0.12,
    scrollTrigger: { trigger: ".stats", start: "top 85%" },
  });
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

  // the altimeter steps aside for the footer's legal row
  ScrollTrigger.create({ trigger: ".foot-word", start: "top bottom", onEnter: () => hud.classList.add("is-off"), onLeaveBack: () => hud.classList.remove("is-off") });

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
    .add(() => hud.classList.add("is-ready"), 0.9)
    .add(() => scene?.labels.forEach((el) => (el.style.transitionDelay = "")), 2.4);
  return tl;
}

async function boot() {
  syncHeader();
  scene?.labels.forEach((el, i) => (el.style.transitionDelay = `${0.6 + i * 0.07}s`));
  // arriving from a subpage link like /#faq: skip the loader and land on the section
  const arrival = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
  if (reduce || !loader || arrival) {
    loader?.remove();
    hdr.classList.remove("is-waiting");
    hud.classList.add("is-ready");
    if (arrival) document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      goTo(arrival, true);
    });
    return;
  }
  hdr.classList.add("is-waiting");
  lenis?.stop();
  gsap.set(heroLines, { yPercent: 110 });
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
      lenis?.start();
      ScrollTrigger.refresh();
    });
  heroEntrance(0.95);
}
boot();
document.fonts?.ready.then(() => ScrollTrigger.refresh());
