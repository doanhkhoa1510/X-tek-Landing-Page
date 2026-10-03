/* XionTechs · The Night Ascent — the chrome every page shares.
   Smooth scroll, header, scramble, cursor, altimeter, clocks, accordion, and forms; see DESIGN.md › Components.
   The landing page (app.ts) and the subpages (page.ts) both start here. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { mountIcons, paintDotMap } from "./dots";
import { ZION } from "./zion-data";

gsap.registerPlugin(ScrollTrigger);

export const root = document.documentElement;
/** Arabic pages run right to left: horizontal scenes travel the other way. */
export const rtl = root.dir === "rtl";
export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
export const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------- smooth scroll ---------- */
export const lenis = reduce ? null : new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
export const scrollPos = () => (lenis ? lenis.scroll : scrollY);
const scrollMax = () => Math.max(1, root.scrollHeight - innerHeight);

/* ---------- icons, maps ---------- */
mountIcons();
$$<HTMLCanvasElement>("canvas[data-dotmap]").forEach((c) => paintDotMap(c, c.dataset.dotmap!));

/* ---------- header: the menu and the language list open from a toggle; Escape or a press outside closes them ---------- */
export const hdr = $(".hdr");
function popover(host: HTMLElement, button: HTMLButtonElement) {
  const set = (open: boolean) => {
    host.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
  };
  button.addEventListener("click", () => set(!host.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && host.classList.contains("is-open")) {
      set(false);
      button.focus();
    }
  });
  document.addEventListener("pointerdown", (e) => {
    if (!host.contains(e.target as Node)) set(false);
  });
  return set;
}
const setMenu = popover($(".menu"), $<HTMLButtonElement>(".menu-toggle"));
const setLang = popover($(".lang"), $<HTMLButtonElement>(".lang-toggle"));

let themeQueued = false;
export function syncHeader() {
  themeQueued = false;
  const y = scrollPos();
  hdr.classList.toggle("is-scrolled", y > 40);
  if (y > 40) setLang(false); // the list leaves with the ticker
  hdr.classList.toggle("is-compact", y > 80);
  const py = hdr.classList.contains("is-scrolled") ? 32 : 64;
  const probe = document.elementsFromPoint(innerWidth / 2, py);
  const under = probe.find((el) => !el.closest(".hdr, .skip") && el.closest("[data-on]"));
  const host = under?.closest<HTMLElement>("[data-on]");
  let on = host?.dataset.on ?? "dark";
  // a limb is the other field at one end: a dawn's snow lies in its lower part, a dusk's sky in its upper part
  host?.querySelectorAll<HTMLElement>(":scope > .horizon").forEach((limb) => {
    const r = limb.getBoundingClientRect();
    if (py < r.top || py > r.bottom) return;
    const t = (py - r.top) / r.height;
    if (limb.classList.contains("dawn") ? t > 0.6 : t < 0.35) on = on === "dark" ? "light" : "dark";
  });
  hdr.dataset.on = on;
}
const queueHeader = () => {
  if (!themeQueued) {
    themeQueued = true;
    requestAnimationFrame(syncHeader);
  }
};
lenis ? lenis.on("scroll", queueHeader) : addEventListener("scroll", queueHeader, { passive: true });
addEventListener("resize", queueHeader);

/* anchors: smooth, offset past the horizon bands and the header, focus moved for keyboard users */
export function goTo(target: HTMLElement | null, immediate = false) {
  const offset = target?.matches(".camps, .summit") ? parseFloat(getComputedStyle(target).paddingTop) - 150 : target?.matches("h2, h3") ? -110 : 0;
  if (lenis) lenis.scrollTo(target ?? 0, { offset, immediate, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else scrollTo({ top: target ? target.getBoundingClientRect().top + scrollY + offset : 0 });
  const focusEl = target ?? $("#top");
  focusEl.setAttribute("tabindex", "-1");
  focusEl.focus({ preventScroll: true });
}
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href")!;
    const target = id === "#top" ? null : document.querySelector<HTMLElement>(id);
    if (id !== "#top" && !target) return;
    e.preventDefault();
    setMenu(false);
    goTo(target);
  }),
);

/* ---------- text in any script: graphemes (a letter with its marks) and words (CJK has no spaces) ---------- */
const segmenter = (granularity: "grapheme" | "word") => ("Segmenter" in Intl ? new Intl.Segmenter(root.lang, { granularity }) : null);
const graphemeSeg = segmenter("grapheme"), wordSeg = segmenter("word");
const graphemes = (s: string) => (graphemeSeg ? [...graphemeSeg.segment(s)].map((g) => g.segment) : [...s]);
/** Words with their punctuation, and the spaces between them as their own parts. */
function words(s: string) {
  if (!wordSeg) return s.split(/(\s+)/).filter(Boolean);
  const parts: string[] = [];
  const space = (p?: string) => !!p && /^\s+$/.test(p);
  for (const { segment, isWordLike } of wordSeg.segment(s)) {
    if (!space(segment) && !isWordLike && parts.length && !space(parts[parts.length - 1])) parts[parts.length - 1] += segment;
    else parts.push(segment);
  }
  return parts;
}

/* ---------- scramble: the label shuffles its own letters, then locks in reading order ---------- */
function scramble(el: HTMLElement) {
  if (el.dataset.busy) return;
  const text = (el.dataset.text ??= el.textContent ?? "");
  // whole graphemes, so no mark leaves its letter; bidi isolates around phone numbers stay where they are
  const letters = graphemes(text);
  const free = letters.flatMap((g, i) => (/\p{Cf}/u.test(g) ? [] : [i]));
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
    const mix = letters.slice(), pool = free.map((i) => letters[i]);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    free.forEach((i, k) => (mix[i] = pool[k]));
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
    const control = t.closest("a, button, input, textarea, select, label, summary");
    cur.classList.toggle("is-label", !!tagged);
    cur.classList.toggle("is-hidden", !tagged && !!control);
    if (tagged) label.textContent = tagged.dataset.cursorLabel!;
  });
  root.addEventListener("pointerleave", () => cur.classList.add("is-hidden"));
  root.addEventListener("pointerenter", () => seen && cur.classList.remove("is-hidden"));
}

/* ---------- altimeter: altitude from descent progress, vertical speed from scroll velocity ---------- */
export const hud = $(".hud");
const hudAlt = $(".hud-alt"), hudVs = $(".hud-vs");
const altWatchers: ((alt: number, shown: string) => void)[] = [];
/** Runs whenever the altimeter reading changes (metres, and the formatted reading). */
export const onAltitude = (fn: (alt: number, shown: string) => void) => altWatchers.push(fn);
let vs = 0, lastY = scrollPos(), lastT = performance.now(), shownAlt = "", shownVs = "";
gsap.ticker.add(() => {
  const now = performance.now(), y = scrollPos();
  const alt = Math.round(ZION.summitM * (1 - Math.min(1, y / scrollMax()))); // the top of Mount Zion down to sea level
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
    altWatchers.forEach((fn) => fn(alt, a));
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
  document.querySelector<HTMLElement>(".now")?.style.setProperty("--now", String((n.getUTCHours() + n.getUTCMinutes() / 60) / 24));
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

/* ---------- brief forms: client-side states until a backend exists; the words come from data-status (BriefForm.astro) ---------- */
$$<HTMLFormElement>(".brief").forEach((form) => {
  const status = $(".form-status", form);
  const say: Record<"badEmail" | "required" | "notLive" | "sending" | "sent" | "failed", string> = JSON.parse(form.dataset.status!);
  form.addEventListener("input", (e) => (e.target as HTMLElement).removeAttribute("aria-invalid"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    $$<HTMLInputElement>("input, textarea, select", form).forEach((f) => f.toggleAttribute("aria-invalid", !f.checkValidity()));
    if (!form.checkValidity()) {
      const bad = $<HTMLInputElement>(":invalid", form);
      status.dataset.state = "error";
      status.textContent = bad.type === "email" && bad.value ? say.badEmail : say.required;
      bad.focus();
      return;
    }
    const endpoint = form.dataset.endpoint;
    const btn = $<HTMLButtonElement>("button[type=submit]", form);
    if (!endpoint) {
      // no inbox configured yet: say plainly that nothing was sent, and hand over the phone line
      status.dataset.state = "info";
      status.innerHTML = say.notLive;
      return;
    }
    btn.disabled = true;
    status.dataset.state = "";
    status.textContent = say.sending;
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        status.dataset.state = "ok";
        status.textContent = say.sent;
        form.reset();
      })
      .catch(() => {
        status.dataset.state = "error";
        status.innerHTML = say.failed;
      })
      .finally(() => (btn.disabled = false));
  });
});

/* ---------- two-tone headlines: the ink line fills word by word, dim → glacier → ink ---------- */
export function twoTone(tt: HTMLElement) {
  const b = tt.querySelector(".tt-b")!;
  b.replaceChildren(...words(b.textContent!.trim()).map((w) => (/^\s+$/.test(w) ? document.createTextNode(w) : Object.assign(document.createElement("span"), { className: "w", textContent: w }))));
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
}

/* count-up figures (power1.out, 1s, at top 85%) */
export function mountCounters() {
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
}
