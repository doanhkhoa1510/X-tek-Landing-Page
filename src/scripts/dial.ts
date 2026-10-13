/* The log as a dial: one ring in four arcs, one per entry, read clockwise from the top. On wide screens the
   panel holds still while the entries scroll past; arc s fills as entry s's title rises to the line where the
   first entry's title stood when the panel settled, and the reading in the middle flips to the entry nearest
   that line. Stacked, the dial sits above the entries and fills as it crosses the screen. */

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
  // each arc ends in a chevron, so the ring reads clockwise
  svg.innerHTML = `<defs><marker id="dial-tip" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M2 1L7 5L2 9" class="dial-tip"/></marker></defs>`;
  const fills: SVGPathElement[] = [], chips: HTMLElement[] = [];
  stages.forEach((_, s) => {
    const a = s * sweep + GAP / 2, b = (s + 1) * sweep - GAP / 2, d = arc(a, b);
    const track = document.createElementNS(NS, "path");
    track.setAttribute("class", "dial-track");
    track.setAttribute("d", d);
    track.setAttribute("marker-end", "url(#dial-tip)");
    const fill = document.createElementNS(NS, "path");
    fill.setAttribute("class", "dial-fill");
    fill.setAttribute("d", d);
    fill.setAttribute("pathLength", "1");
    svg.append(track, fill);
    fills.push(fill);
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

  // the reading in the middle: the old one lifts out and fades, the new one rises in under it
  let shown = -1, flip: gsap.core.Timeline | undefined;
  const core = [num, name];
  const show = (s: number) => {
    if (s === shown) return;
    const first = shown < 0;
    shown = s;
    chips.forEach((c, i) => c.classList.toggle("is-current", i === s));
    const set = () => {
      num.textContent = `0${s + 1}`;
      name.textContent = labels[s];
    };
    flip?.kill();
    if (first || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set();
      gsap.set(core, { y: 0, autoAlpha: 1 });
      return;
    }
    flip = gsap
      .timeline()
      .to(core, { y: -16, autoAlpha: 0, duration: 0.22, ease: "power2.in", stagger: 0.03 })
      .add(set)
      .fromTo(core, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out", stagger: 0.04 });
  };

  // each entry title's centre, measured from the top of the list
  const marks = () => {
    const top = list.getBoundingClientRect().top;
    return stages.map((s) => {
      const r = s.querySelector("h3")!.getBoundingClientRect();
      return r.top + r.height / 2 - top;
    });
  };
  // the dial runs from the first entry's title to the last's, so scroll distance maps one to one onto the entries
  const span = (m = marks()) => Math.max(1, m[last] - m[0]);
  const stacked = matchMedia("(max-width: 991px)");
  stacked.addEventListener("change", () => ScrollTrigger.refresh());

  // progress through the log: arc s fills while entry s approaches the line, full once its title holds it
  function walk(p: number) {
    const m = marks(), len = span(m), knots = m.map((y) => (y - m[0]) / len);
    let near = last;
    for (let s = 0; s < last; s++)
      if (p < knots[s + 1]) {
        near = (p - knots[s]) / (knots[s + 1] - knots[s]) < 0.5 ? s : s + 1;
        break;
      }
    fills.forEach((f, s) => {
      const gap = s === 0 ? 0 : knots[s] - knots[s - 1];
      const t = s === 0 ? 1 : gap > 0 ? Math.max(0, Math.min(1, (p - knots[s - 1]) / gap)) : p >= knots[s] ? 1 : 0;
      f.style.strokeDashoffset = String(1 - t);
    });
    show(near);
    // each later entry wakes as its arc turns current (app.ts wakes the first as it rises into view)
    stages.slice(1).forEach((st, i) => st.classList.toggle("is-on", i < near));
  }

  show(0);
  ScrollTrigger.create({
    trigger: list, refreshPriority: -1 /* after the pinned routes above add their spacer */,
    start: "top top", end: () => `+=${span()}`,
    onUpdate: (s) => !stacked.matches && walk(s.progress), onRefresh: (s) => !stacked.matches && walk(s.progress),
  });
  // stacked: the dial fills while it crosses the middle of the screen
  ScrollTrigger.create({
    trigger: panel, refreshPriority: -1, start: "top 70%", end: "bottom 30%",
    onUpdate: (s) => stacked.matches && walk(s.progress), onRefresh: (s) => stacked.matches && walk(s.progress),
  });
}
