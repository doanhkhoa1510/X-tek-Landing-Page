/* XionTechs · The Night Ascent — the chrome every page shares.
   Native scroll, header, altitude, clocks, accordion, and forms; see DESIGN.md › Components.
   The landing page (app.ts) and the subpages (page.ts) both start here. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mountIcons, paintDotMap } from "./dots";
import { ZION } from "./zion-data";

gsap.registerPlugin(ScrollTrigger);

export const root = document.documentElement;
/** Arabic pages run right to left: horizontal scenes travel the other way. */
export const rtl = root.dir === "rtl";
export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------- scroll: the browser's own (no smoothing: the page stops when the hand stops) ---------- */
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

/* the header's ground: the page's own backgrounds (sections, bands, limbs) repainted behind the row, clipped as on the
   page but without its content, so a ground's edge slides through the header in step with the scroll */
const groundHost = $(".hdr-ground");
type Clip = { el: HTMLElement; x: boolean; y: boolean };
type Ground = { el: HTMLElement; image: string[]; color: string; clips: Clip[] };
let grounds: Ground[] | null = null;
const groundTiles: HTMLElement[] = [];
/** "a(b, c), d" → ["a(b, c)", "d"]: background layers split at their top-level commas */
function layers(image: string) {
  const out: string[] = [];
  let depth = 0, from = 0;
  for (let i = 0; i < image.length; i++) {
    const c = image[i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (c === "," && depth === 0) {
      out.push(image.slice(from, i).trim());
      from = i + 1;
    }
  }
  out.push(image.slice(from).trim());
  return out;
}
function readGrounds() {
  return $$("[data-on]:not(.hdr), .horizon, .hero-dawn").flatMap<Ground>((el) => {
    const cs = getComputedStyle(el);
    const image = cs.backgroundImage === "none" ? [] : layers(cs.backgroundImage);
    if (!image.length && cs.backgroundColor === "rgba(0, 0, 0, 0)") return [];
    const clips: Clip[] = [];
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const ac = getComputedStyle(a), x = ac.overflowX !== "visible", y = ac.overflowY !== "visible";
      if (x || y) clips.push({ el: a, x, y });
    }
    return [{ el, image, color: cs.backgroundColor, clips }];
  });
}
function paintGround() {
  grounds ??= readGrounds();
  const h = groundHost.offsetHeight, w = root.clientWidth; // the header ends at the native scrollbar
  // edges on whole device pixels, as the page paints its boxes, so two grounds meet without a seam
  const px = devicePixelRatio, snap = (v: number) => Math.round(v * px) / px;
  const tiles: { g: Ground; x: number; y: number; gw: number; gh: number; t: number; b: number; l: number; rt: number }[] = [];
  for (const g of grounds) {
    const r = g.el.getBoundingClientRect();
    const x = snap(r.left), y = snap(r.top), gw = snap(r.right) - x, gh = snap(r.bottom) - y;
    let t = Math.max(y, 0), b = Math.min(y + gh, h), l = Math.max(x, 0), rt = Math.min(x + gw, w);
    if (b <= t || rt <= l) continue;
    for (const c of g.clips) {
      const cr = c.el.getBoundingClientRect();
      if (c.y) (t = Math.max(t, snap(cr.top))), (b = Math.min(b, snap(cr.bottom)));
      if (c.x) (l = Math.max(l, snap(cr.left))), (rt = Math.min(rt, snap(cr.right)));
    }
    if (b > t && rt > l) tiles.push({ g, x, y, gw, gh, t, b, l, rt });
  }
  // later grounds paint over earlier ones, as on the page
  tiles.forEach(({ g, x, y, gw, gh, t, b, l, rt }, i) => {
    const tile = (groundTiles[i] ??= groundHost.appendChild(document.createElement("i")));
    const size = `${gw}px ${gh}px`, pos = `${x - l}px ${y - t}px`;
    tile.style.cssText =
      `left:${l}px;top:${t}px;width:${rt - l}px;height:${b - t}px;background-color:${g.color};` +
      (g.image.length ? `background-image:${g.image.join(",")};background-size:${g.image.map(() => size).join(",")};background-position:${g.image.map(() => pos).join(",")};` : "");
  });
  for (let i = tiles.length; i < groundTiles.length; i++) groundTiles[i].style.cssText = "display:none";
}

const navLinks = $$<HTMLAnchorElement>('.hdr-nav a[href^="#"]');
let themeQueued = false;
export function syncHeader() {
  themeQueued = false;
  const y = scrollY;
  hdr.classList.toggle("is-scrolled", y > 40);
  if (y > 40) setLang(false); // the list leaves with the ticker
  hdr.classList.toggle("is-compact", y > 80);
  paintGround();
  const py = hdr.classList.contains("is-scrolled") ? 32 : 64;
  const probe = document.elementsFromPoint(innerWidth / 2, py);
  const under = probe.find((el) => !el.closest(".hdr, .hdr-ground, .skip") && el.closest("[data-on]"));
  const host = under?.closest<HTMLElement>("[data-on]");
  let on = host?.dataset.on ?? "dark", mid = false;
  // a limb is the other field at one end: a dawn's snow lies in its lower part, a dusk's sky in its upper part;
  // its --flip is the depth where its ground turns, and around it (mid-blue) the soft ink is too faint, so all ink goes full
  host?.querySelectorAll<HTMLElement>(":scope > .horizon, .hero-dawn").forEach((limb) => {
    const r = limb.getBoundingClientRect();
    if (py < r.top || py > r.bottom) return;
    const cs = getComputedStyle(limb), t = (py - r.top) / r.height, flip = parseFloat(cs.getPropertyValue("--flip"));
    if (limb.matches(".dawn, .hero-dawn") ? t > flip : t < flip) on = on === "dark" ? "light" : "dark";
    if (Math.abs(t - flip) < (parseFloat(cs.getPropertyValue("--mid")) || 0.06)) mid = true;
  });
  hdr.dataset.on = on;
  hdr.classList.toggle("is-mid", mid);
  // on the landing page the row marks the section under the header
  const here = under?.closest<HTMLElement>("section[id]")?.id;
  for (const a of navLinks) a.classList.toggle("is-here", a.dataset.section === here);
}
const queueHeader = () => {
  if (!themeQueued) {
    themeQueued = true;
    requestAnimationFrame(syncHeader);
  }
};
// in the scroll frame's animation callback: ScrollTrigger has already moved the pins and limbs in its own scroll
// listener, and the frame has not painted yet, so the ground never trails the page
addEventListener("scroll", queueHeader, { passive: true });
addEventListener("resize", () => {
  grounds = null;
  queueHeader();
});

/* anchors: smooth, offset past the horizon bands and the header, focus moved for keyboard users */
export function goTo(target: HTMLElement | null, immediate = false) {
  const offset = target?.matches(".camps, .summit") ? parseFloat(getComputedStyle(target).paddingTop) - 150 : target?.matches("h2, h3") ? -110 : 0;
  scrollTo({ top: target ? target.getBoundingClientRect().top + scrollY + offset : 0, behavior: immediate || reduce ? "instant" : "smooth" });
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

/* ---------- text in any script: words (CJK has no spaces) ---------- */
const wordSeg = "Segmenter" in Intl ? new Intl.Segmenter(root.lang, { granularity: "word" }) : null;
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

/* ---------- altitude: from descent progress; the contour maps and the ridge rider read it ---------- */
const altWatchers: ((alt: number, shown: string) => void)[] = [];
/** Runs whenever the altitude reading changes (metres, and the formatted reading). */
export const onAltitude = (fn: (alt: number, shown: string) => void) => altWatchers.push(fn);
let shownAlt = "";
gsap.ticker.add(() => {
  const alt = Math.round(ZION.summitM * (1 - Math.min(1, scrollY / scrollMax()))); // the top of Mount Zion down to sea level
  const a = alt.toLocaleString("en-US");
  if (a !== shownAlt) {
    shownAlt = a;
    altWatchers.forEach((fn) => fn(alt, a));
  }
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

/* ---------- brief forms: posted as JSON to the mailer (data-endpoint); the words come from data-status (BriefForm.astro) ---------- */
$$<HTMLFormElement>(".brief").forEach((form) => {
  const status = $(".form-status", form);
  const say: Record<"badEmail" | "required" | "sending" | "sent" | "failed", string> = JSON.parse(form.dataset.status!);
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
    const btn = $<HTMLButtonElement>("button[type=submit]", form);
    btn.disabled = true;
    status.dataset.state = "";
    status.textContent = say.sending;
    // the page's language rides along, so the reply can come in it
    const brief = { ...Object.fromEntries(new FormData(form)), lang: root.lang };
    fetch(form.dataset.endpoint!, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(brief) })
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
