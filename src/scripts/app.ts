/* XionTechs · The Night Ascent — page orchestration.
   Lenis + GSAP ScrollTrigger drive every scroll scene; see DESIGN.md › Motion. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { mountMountain, BASE_M, SUMMIT_M } from "./mountain";
import { mountIcons, paintDotMap } from "./dots";
import { mountTopo } from "./topo";
import { mountRidge } from "./ridge";
import { mountTrail } from "./trail";

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------- smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollPos = () => (lenis ? lenis.scroll : scrollY);
const scrollMax = () => Math.max(1, root.scrollHeight - innerHeight);

/* ---------- scene, icons, maps ---------- */
const scene = mountMountain($<HTMLCanvasElement>("#mountain"), $("#chips"));
if (!scene) root.classList.add("no-webgl");
mountIcons();
$$<HTMLCanvasElement>("canvas[data-dotmap]").forEach((c) => paintDotMap(c, c.dataset.dotmap!));
const topo = mountTopo($<HTMLCanvasElement>(".topo canvas"));
const topoBg = mountTopo($<HTMLCanvasElement>(".ascent-bg canvas"), { minor: "rgba(16, 48, 96, 0.07)", major: "rgba(16, 48, 96, 0.15)", amber: 1.5, amberColor: "rgba(16, 48, 96, 0.34)", cover: true } /* live line in navy: amber would strike through the copy */);
const ride = mountRidge($<HTMLCanvasElement>(".ridge canvas"), $(".rider"));
mountTrail($(".trek-frame"), $(".stages"));

/* ---------- header ---------- */
const hdr = $(".hdr");
const menu = $(".menu");
const toggle = $<HTMLButtonElement>(".menu-toggle");
function setMenu(open: boolean) {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
}
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("is-open")) {
    setMenu(false);
    toggle.focus();
  }
});
document.addEventListener("pointerdown", (e) => {
  if (!menu.contains(e.target as Node)) setMenu(false);
});

let themeQueued = false;
function syncHeader() {
  themeQueued = false;
  const y = scrollPos();
  hdr.classList.toggle("is-scrolled", y > 40);
  hdr.classList.toggle("is-compact", y > 80);
  const probe = document.elementsFromPoint(innerWidth / 2, hdr.classList.contains("is-scrolled") ? 32 : 64);
  const under = probe.find((el) => !el.closest(".hdr, .skip") && el.closest("[data-on]"));
  hdr.dataset.on = under?.closest<HTMLElement>("[data-on]")?.dataset.on ?? "dark";
}
const queueHeader = () => {
  if (!themeQueued) {
    themeQueued = true;
    requestAnimationFrame(syncHeader);
  }
};
lenis ? lenis.on("scroll", queueHeader) : addEventListener("scroll", queueHeader, { passive: true });
addEventListener("resize", queueHeader);

/* anchors: smooth, offset past the horizon bands, focus moved for keyboard users */
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href")!;
    const target = id === "#top" ? null : document.querySelector<HTMLElement>(id);
    if (id !== "#top" && !target) return;
    e.preventDefault();
    setMenu(false);
    const offset = target?.matches(".camps, .summit") ? parseFloat(getComputedStyle(target).paddingTop) - 150 : 0;
    if (lenis) lenis.scrollTo(target ?? 0, { offset, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else scrollTo({ top: target ? target.getBoundingClientRect().top + scrollY + offset : 0 });
    const focusEl = target ?? $("#top");
    focusEl.setAttribute("tabindex", "-1");
    focusEl.focus({ preventScroll: true });
  }),
);

/* ---------- scramble: the label shuffles its own letters, then locks left to right ---------- */
function scramble(el: HTMLElement) {
  if (el.dataset.busy) return;
  const text = (el.dataset.text ??= el.textContent ?? "");
  const letters = [...text];
  el.dataset.busy = "1";
  el.style.width = `${el.getBoundingClientRect().width}px`;
  let locked = -3;
  const tick = () => {
    if (locked >= letters.length) {
      el.textContent = text;
      el.style.width = "";
      delete el.dataset.busy;
      return;
    }
    const mix = letters.slice();
    for (let i = mix.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mix[i], mix[j]] = [mix[j], mix[i]];
    }
    for (let i = 0; i < locked; i++) mix[i] = letters[i];
    el.textContent = mix.join("");
    locked++;
    setTimeout(tick, 28);
  };
  tick();
}
$$("[data-scramble]").forEach((host) => {
  const label = host.querySelector<HTMLElement>(".scr");
  if (!label) return;
  if (!host.hasAttribute("aria-label") && host.tagName === "A") host.setAttribute("aria-label", label.textContent!.trim());
  if (reduce || !finePointer) return;
  host.addEventListener("pointerenter", () => scramble(label));
});

/* ---------- cursor: ring + dot, blend difference, ring draws the climb ---------- */
if (finePointer && innerWidth > 991 && !reduce) {
  root.classList.add("has-cursor");
  const cur = $(".cursor"), main = $(".cursor-main"), prog = $(".cursor-prog"), label = $(".cursor-label");
  cur.classList.add("is-hidden");
  const at = { x: innerWidth / 2, y: innerHeight / 2 }, to = { ...at };
  let seen = false;
  addEventListener("pointermove", (e) => {
    to.x = e.clientX;
    to.y = e.clientY;
    if (!seen) {
      seen = true;
      Object.assign(at, to);
      cur.classList.remove("is-hidden");
    }
  }, { passive: true });
  const setX = gsap.quickSetter(main, "x", "px"), setY = gsap.quickSetter(main, "y", "px");
  gsap.ticker.add(() => {
    at.x += (to.x - at.x) * 0.15;
    at.y += (to.y - at.y) * 0.15;
    setX(at.x);
    setY(at.y);
    prog.style.strokeDashoffset = (179.07 * (1 - scrollPos() / scrollMax())).toFixed(2);
  });
  document.addEventListener("pointerover", (e) => {
    const t = e.target as Element;
    const tagged = t.closest<HTMLElement>("[data-cursor-label]");
    const control = t.closest("a, button, input, textarea, select, label");
    cur.classList.toggle("is-label", !!tagged);
    cur.classList.toggle("is-hidden", !tagged && !!control);
    if (tagged) label.textContent = tagged.dataset.cursorLabel!;
  });
  root.addEventListener("pointerleave", () => cur.classList.add("is-hidden"));
  root.addEventListener("pointerenter", () => seen && cur.classList.remove("is-hidden"));
}

/* ---------- altimeter: altitude from climb progress, vertical speed from scroll velocity ---------- */
const hud = $(".hud"), hudAlt = $(".hud-alt"), hudVs = $(".hud-vs"), riderAlt = $(".rider-alt");
let vs = 0, lastY = scrollPos(), lastT = performance.now(), shownAlt = "", shownVs = "";
gsap.ticker.add(() => {
  const now = performance.now(), y = scrollPos();
  const alt = Math.round(BASE_M + (y / scrollMax()) * (SUMMIT_M - BASE_M)); // the Hinnom valley floor to the top of Mount Zion
  let target = Math.abs(y - lastY) / (Math.max(1, now - lastT) / 1000) / 40;
  if (target > 12) target += Math.random() * 2 - 1;
  target = Math.min(99, target);
  vs += (target - vs) * (target > vs ? 0.1 : target === 0 ? 0.15 : 0.06);
  if (vs < 0.5 && target === 0) vs = 0;
  lastY = y;
  lastT = now;
  const a = alt.toLocaleString("en-US"), v = String(Math.round(vs)).padStart(2, "0");
  if (a !== shownAlt) {
    shownAlt = a;
    hudAlt.textContent = a;
    riderAlt.textContent = `Alt ${a} m`;
    topo(alt);
    topoBg(alt);
  }
  if (v !== shownVs) hudVs.textContent = shownVs = v;
});

/* ---------- clocks and the shared day bar ---------- */
const hm = (zone: string) => new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit" }).format(new Date());
function offsetHours(zone: string) {
  const d = new Date();
  return (new Date(d.toLocaleString("en-US", { timeZone: zone })).getTime() - new Date(d.toLocaleString("en-US", { timeZone: "UTC" })).getTime()) / 3.6e6;
}
function tickClocks() {
  $$("[data-clock]").forEach((el) => (el.textContent = hm(el.dataset.clock!)));
  $$(".work[data-zone]").forEach((el) => {
    const start = (((8 - offsetHours(el.dataset.zone!)) % 24) + 24) % 24; // 08:00 local, in UTC hours
    el.style.setProperty("--start", String(start / 24));
    el.style.setProperty("--len", String(Math.min(9, 24 - start) / 24));
  });
  const n = new Date();
  $(".now").style.setProperty("--now", String((n.getUTCHours() + n.getUTCMinutes() / 60) / 24));
}
tickClocks();
setTimeout(() => {
  tickClocks();
  setInterval(tickClocks, 60_000);
}, (60 - new Date().getSeconds()) * 1000);

/* ---------- FAQ accordion ---------- */
$$<HTMLButtonElement>(".qa button").forEach((btn) => {
  const panel = document.getElementById(btn.getAttribute("aria-controls")!)!;
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    gsap.killTweensOf(panel);
    if (open) {
      panel.hidden = false;
      gsap.fromTo(panel, { height: 0 }, { height: "auto", duration: reduce ? 0 : 0.5, ease: "power2.inOut", onComplete: () => ScrollTrigger.refresh() });
    } else {
      gsap.to(panel, { height: 0, duration: reduce ? 0 : 0.45, ease: "power2.inOut", onComplete: () => {
        panel.hidden = true;
        ScrollTrigger.refresh();
      } });
    }
  });
});

/* ---------- brief form: client-side states until a backend exists ---------- */
const form = $<HTMLFormElement>(".brief");
const status = $(".form-status", form);
form.addEventListener("input", (e) => (e.target as HTMLElement).removeAttribute("aria-invalid"));
form.addEventListener("submit", (e) => {
  e.preventDefault();
  $$<HTMLInputElement>("input, textarea", form).forEach((f) => f.toggleAttribute("aria-invalid", !f.checkValidity()));
  if (!form.checkValidity()) {
    const bad = $<HTMLInputElement>(":invalid", form);
    status.dataset.state = "error";
    status.textContent = bad.type === "email" && bad.value ? "That email looks incomplete. Check it and send again." : "Fill in all three fields so we know where to start.";
    bad.focus();
    return;
  }
  const endpoint = form.dataset.endpoint;
  const btn = $<HTMLButtonElement>("button[type=submit]", form);
  if (!endpoint) {
    // no inbox configured yet: say plainly that nothing was sent, and hand over the phone line
    status.dataset.state = "info";
    status.innerHTML = 'Not sent yet: online sending is not live. Call <a href="tel:+14693229899">+1 469 322 9899</a> and we start from your brief.';
    return;
  }
  btn.disabled = true;
  status.dataset.state = "";
  status.textContent = "Sending your brief…";
  fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) })
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      status.dataset.state = "ok";
      status.textContent = "Brief sent. We reply by email.";
      form.reset();
    })
    .catch(() => {
      status.dataset.state = "error";
      status.innerHTML = 'The brief did not send. Try again, or call <a href="tel:+14693229899">+1 469 322 9899</a>.';
    })
    .finally(() => (btn.disabled = false));
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
ScrollTrigger.create({
  trigger: ".summit", start: "top bottom", end: "bottom top",
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

  // intro: paragraphs rise, stats wipe in and count
  gsap.from(".intro-right .lede, .intro-right .btn", {
    autoAlpha: 0, y: 28, duration: 1.1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".intro-right", start: "top 80%" },
  });
  gsap.from(".topo", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".topo", start: "top 85%" } });
  gsap.from(".stat", {
    clipPath: "inset(0 100% 0 0)", duration: 1.2, ease: "expo.out", stagger: 0.12,
    scrollTrigger: { trigger: ".stats", start: "top 85%" },
  });

  // routes: pinned; the service track slides past while the giant type drifts behind
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
  $$(".tt").forEach((tt) => {
    const b = tt.querySelector(".tt-b")!;
    const words = b.textContent!.trim().split(/\s+/);
    b.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    const spans = $$(".w", b);
    const dark = tt.closest("[data-on]")?.getAttribute("data-on") === "dark";
    if (dark && !tt.closest(".routes")) {
      // night headlines come into focus, like a summit out of cloud
      gsap.fromTo(spans, { filter: "blur(10px)", autoAlpha: 0.15 }, { filter: "blur(0px)", autoAlpha: 1, ease: "none", stagger: 0.12, scrollTrigger: { trigger: tt, start: "top 85%", end: "top 45%", scrub: true } });
      return;
    }
    const from = dark ? "#76839f" : "#858fa1", mid = "#2e6bf0", to = dark ? "#ffffff" : "#0b1a33";
    gsap.set(spans, { color: from });
    const tl = gsap.timeline({ scrollTrigger: { trigger: tt, start: "top 85%", end: "top 40%", scrub: true } });
    spans.forEach((w, i) => tl.to(w, { color: mid, duration: 0.3, ease: "none" }, i * 0.14).to(w, { color: to, duration: 0.3, ease: "none" }, i * 0.14 + 0.3));
  });

  // ascent: the climber walks the trail up Mount Zion (trail.ts); each stage wakes as it nears the centre
  $$(".stage").forEach((s) =>
    ScrollTrigger.create({ trigger: s, start: "top 62%", onEnter: () => s.classList.add("is-on"), onLeaveBack: () => s.classList.remove("is-on") }),
  );

  // base camps: arcs draw, chips blur in, beacons ping while in view
  const map = $(".worldmap");
  ScrollTrigger.create({ trigger: map, start: "top bottom", end: "bottom top", toggleClass: { targets: map, className: "is-in" } });
  gsap.from(".arc-base", { strokeDashoffset: 1, duration: 1.8, ease: "power3.inOut", stagger: 0.25, scrollTrigger: { trigger: map, start: "top 75%" } });
  // chips keep their CSS translate offsets, so no transform tween here (GSAP would inline translate: none)
  gsap.from(".city-chip", { autoAlpha: 0, filter: "blur(5px)", duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: map, start: "top 70%" } });
  gsap.from(".offices li", { autoAlpha: 0, filter: "blur(6px)", duration: 0.9, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".offices", start: "top 85%" } });

  // expedition log: cells rise out of their own frames
  gsap.from(".case", { clipPath: "inset(100% 0 0 0)", duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".cases", start: "top 80%" } });
  gsap.from(".quote", { autoAlpha: 0, y: 30, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".quote", start: "top 95%" } });

  // the altimeter steps aside for the footer's legal row
  ScrollTrigger.create({ trigger: ".foot-word", start: "top bottom", onEnter: () => hud.classList.add("is-off"), onLeaveBack: () => hud.classList.remove("is-off") });

  // summit: the form panel rises from the ridge
  gsap.from(".brief", { autoAlpha: 0, y: 48, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".summit-grid", start: "top 75%" } });
});

/* count-up figures (power1.out, 1s, at top 85%) */
$$("[data-count]").forEach((el) => {
  const end = Number(el.dataset.count);
  if (reduce) return;
  const o = { v: 0 };
  el.textContent = "0";
  gsap.to(o, {
    v: end, duration: 1, ease: "power1.out",
    scrollTrigger: { trigger: el.closest(".stat")!, start: "top 85%", once: true },
    onUpdate: () => (el.textContent = String(Math.round(o.v))),
  });
});

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
  if (reduce || !loader) {
    loader?.remove();
    hdr.classList.remove("is-waiting");
    hud.classList.add("is-ready");
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
