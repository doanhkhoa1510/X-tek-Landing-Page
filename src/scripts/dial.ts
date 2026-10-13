/* The log as a dial: one ring in four arcs, one per entry, read clockwise from the top. On wide screens the
   panel holds still while the entries scroll past; arc s fills as entry s's title rises to the line where the
   first entry's title stood when the panel settled, and the reading in the middle rolls, like a slot reel, to the
   entry whose arc is filling. Stacked, the dial sits above the entries and fills as it crosses the screen. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SIZE = 320, R = 128, C = SIZE / 2;
const GAP = 16; // degrees of open ring between two arcs
const rad = (deg: number) => ((deg - 90) * Math.PI) / 180; // 0 degrees at the top, clockwise
const pt = (deg: number, r = R) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const;
const arc = (a: number, b: number) => {
  const [x0, y0] = pt(a), [x1, y1] = pt(b);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${b - a > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
const NS = "http://www.w3.org/2000/svg";

export function mountDial(panel: HTMLElement, list: HTMLElement) {
  const svg = panel.querySelector("svg")!;
  const num = panel.querySelector<HTMLElement>(".dial-num")!, name = panel.querySelector<HTMLElement>(".dial-name")!;
  const stages = [...list.querySelectorAll<HTMLElement>(".stage")];
  const last = stages.length - 1, sweep = 360 / stages.length;
  const labels = stages.map((s) => s.dataset.camp ?? "");

  svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
  const fills: SVGPathElement[] = [], tips: SVGPathElement[] = [], chips: HTMLElement[] = [];
  stages.forEach((_, s) => {
    const a = s * sweep + GAP / 2, b = (s + 1) * sweep - GAP / 2, d = arc(a, b);
    const track = document.createElementNS(NS, "path");
    track.setAttribute("class", "dial-track");
    track.setAttribute("d", d);
    const fill = document.createElementNS(NS, "path");
    fill.setAttribute("class", "dial-fill");
    fill.setAttribute("d", d);
    fill.setAttribute("pathLength", "1");
    // the arc ends in a chevron just past its tip, so the ring reads clockwise; it turns amber with the fill
    const [tx, ty] = pt(b + 2.5), tip = document.createElementNS(NS, "path");
    tip.setAttribute("class", "dial-tip");
    tip.setAttribute("d", "M-6 -5L0 0L-6 5");
    tip.setAttribute("transform", `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${(b + 2.5).toFixed(1)})`);
    svg.append(track, fill, tip);
    fills.push(fill);
    tips.push(tip);
    // the entry's name beside its arc, hung off the ring at the arc's middle, pointing away from it
    const mid = (a + b) / 2, [x, y] = pt(mid, R + 22);
    const chip = document.createElement("span");
    chip.className = `dial-chip ${mid < 180 ? "to-right" : "to-left"}`;
    chip.style.left = `${((x / SIZE) * 100).toFixed(2)}%`;
    chip.style.top = `${((y / SIZE) * 100).toFixed(2)}%`;
    chip.innerHTML = `<b>0${s + 1}</b> ${labels[s]}`;
    panel.append(chip);
    chips.push(chip);
  });

  // the reading in the middle: two slot reels, one of numbers and one of names, each a stack of every entry
  // behind a one-line window; a change spins the stack to the new entry and lands with a short bounce
  const reels = [num, name].map((el, k) => {
    const reel = el.querySelector<HTMLElement>(".dial-reel")!;
    reel.innerHTML = labels.map((l, i) => `<i>${k === 0 ? `0${i + 1}` : l}</i>`).join("");
    return reel;
  });
  let shown = -1;
  const spin = (instant: boolean) => {
    for (const reel of reels) {
      const y = -shown * (reel.firstElementChild as HTMLElement).offsetHeight;
      gsap.killTweensOf(reel);
      if (instant) gsap.set(reel, { y });
      else gsap.to(reel, { y, duration: 0.8, ease: "back.out(1.3)" });
    }
  };
  const show = (s: number) => {
    if (s === shown) return;
    const first = shown < 0;
    shown = s;
    chips.forEach((c, i) => c.classList.toggle("is-current", i === s));
    spin(first || matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  // the window's line height follows the viewport: the reels resettle without a spin
  new ResizeObserver(() => shown >= 0 && spin(true)).observe(num);

  // each entry title's centre, measured from the top of the list
  const marks = () => {
    const top = list.getBoundingClientRect().top;
    return stages.map((s) => {
      const r = s.querySelector("h3")!.getBoundingClientRect();
      return r.top + r.height / 2 - top;
    });
  };
  // the dial runs from the first entry's title to the foot of the list, so scroll distance maps one to one onto
  // the entries: the last arc fills over the last entry's own length
  const span = (m = marks()) => Math.max(1, list.getBoundingClientRect().height - m[0]);
  const stacked = matchMedia("(max-width: 991px)");

  // progress is read off the live layout on every scroll, never off a trigger's cached start and end: anything
  // above the section that changes height after a refresh (a pinned band's spacer, a late font) would shift
  // a cached range and put the reading a whole entry ahead of the page
  // wide: 0 when the list's top meets the top of the screen (the first title then holds its line), 1 at its foot
  // stacked: 0 as the dial's top rises past 70% of the screen, 1 as its foot passes 30%
  const progress = () => {
    const vh = innerHeight;
    if (!stacked.matches) return -list.getBoundingClientRect().top / span();
    const r = panel.getBoundingClientRect();
    return (vh * 0.7 - r.top) / (vh * 0.4 + r.height);
  };
  // progress through the log: arc s is empty as entry s's title reaches the line and full as the next one does
  // (the last, as the list runs out); the reading names the entry whose arc is filling
  function walk(p: number) {
    const m = marks(), len = span(m), knots = [...m.map((y) => (y - m[0]) / len), 1];
    let near = last;
    for (let s = 0; s < last; s++)
      if (p < knots[s + 1]) {
        near = s;
        break;
      }
    fills.forEach((f, s) => {
      const gap = knots[s + 1] - knots[s];
      const t = gap > 0 ? Math.max(0, Math.min(1, (p - knots[s]) / gap)) : p >= knots[s] ? 1 : 0;
      f.style.strokeDashoffset = String(1 - t);
      tips[s].classList.toggle("is-full", t > 0.99);
    });
    show(near);
    // each later entry wakes as its arc turns current (app.ts wakes the first as it rises into view)
    stages.slice(1).forEach((st, i) => st.classList.toggle("is-on", i < near));
  }

  show(0);
  const tick = () => walk(Math.max(0, Math.min(1, progress())));
  ScrollTrigger.create({ trigger: panel.closest("section") ?? panel, start: "top bottom", end: "bottom top", onUpdate: tick, onRefresh: tick });
  stacked.addEventListener("change", tick);
}
