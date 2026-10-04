/* The 4-D ascent as a trek, drawn in the page's own survey language: Mount Zion's real south profile
   in the dot matrix of the routes sky, a surveyed switchback trail up the dome, camps tagged like the
   hero's chips, and an elevation scale in metres. The panel holds still while the stages scroll past;
   the climb waits until the chart has settled in full view, then the climber reaches camp s as stage s
   rises to the line where base camp stood at that moment. */

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BASE_M, domeAt, PEAK, SUMMIT_M, unitsAt } from "./relief";
import { paintWhenNear } from "./defer";

const X0 = -10, X1 = 11, N = 420; // closer than the routes sky: the dome fills the frame, the west shoulder at its edge
const rand = (k: number) => {
  const s = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// the skyline, seen from the south: the highest ground behind every point on the west-east line
const SIL = new Float32Array(N);
let TOP = 0, PEAK_I = 0;
for (let i = 0; i < N; i++) {
  const x = X0 + ((X1 - X0) * i) / (N - 1);
  let m = 0;
  for (let z = -10; z <= 10; z += 0.2) m = Math.max(m, domeAt(x, z));
  SIL[i] = m;
  if (m > TOP) [TOP, PEAK_I] = [m, i];
}
// the trek tops out on the published summit, so its skyline, camps, and scale all read the same metres
for (let i = 0; i < N; i++) SIL[i] *= PEAK / TOP;
TOP = PEAK;
const metres = (units: number) => Math.round(BASE_M + (units / TOP) * (SUMMIT_M - BASE_M));

export function mountTrail(panel: HTMLElement, list: HTMLElement) {
  const canvas = panel.querySelector("canvas")!, svg = panel.querySelector("svg")!;
  const way = svg.querySelector<SVGPathElement>(".trail-way")!, walked = svg.querySelector<SVGPathElement>(".trail-walked")!;
  const scale = svg.querySelector<SVGGElement>(".trek-scale")!;
  const climber = panel.querySelector<HTMLElement>(".climber")!;
  const stages = [...list.querySelectorAll<HTMLElement>(".stage")];
  const last = stages.length - 1;
  const unit = panel.dataset.unit ?? "m";
  const camps = stages.map((s, i) => {
    const el = document.createElement("div");
    el.className = i === last ? "camp camp-summit" : "camp";
    el.innerHTML = `<i class="camp-dot"></i><span class="camp-tag"><b>0${i + 1}</b> ${s.querySelector(".stage-meta")?.textContent?.trim() ?? ""} · <em></em> ${unit}</span>`;
    panel.insertBefore(el, climber);
    return el;
  });
  const STEP = 2;
  let total = 0, progress = 0, xs = new Float32Array(0), ys = new Float32Array(0);
  let campAt: number[] = []; // trail sample index of each camp

  function build() {
    const w = panel.clientWidth, h = panel.clientHeight;
    if (!w || !h) return;
    const narrow = w < 560;
    const foot = h - 1, sky = narrow ? 30 : 58; // headroom for the summit tag
    const X = (i: number) => (i / (N - 1)) * w, Y = (units: number) => foot - (units / TOP) * (foot - sky);
    const ground = (x: number) => {
      const f = Math.max(0, Math.min(N - 1, (x / w) * (N - 1))), i = Math.floor(f), t = f - i;
      return Y(SIL[i] * (1 - t) + SIL[Math.min(N - 1, i + 1)] * t);
    };

    // the mountain: dot matrix, denser on the skyline, over a knockout that hides the map behind it
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const g = canvas.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    g.strokeStyle = "rgba(16, 48, 96, 0.12)"; // 50 m guides, behind the mountain
    g.setLineDash([2, 5]);
    for (let m = 650; m < SUMMIT_M; m += 50) {
      const y = Math.round(Y(unitsAt(m))) + 0.5;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }
    g.setLineDash([]);
    const shape = new Path2D();
    shape.moveTo(0, foot);
    for (let i = 0; i < N; i++) shape.lineTo(X(i), Y(SIL[i]));
    shape.lineTo(w, foot);
    shape.closePath();
    g.fillStyle = "#ffffff";
    g.fill(shape);
    const step = narrow ? 6 : 7, body = new Path2D(), ridge = new Path2D();
    for (let x = step / 2; x < w; x += step) {
      const edge = ground(x);
      for (let y = foot - step / 2; y > edge; y -= step) {
        const p = y - edge < step * 1.5 ? ridge : body;
        p.moveTo(x + 1.2, y);
        p.arc(x, y, p === ridge ? 1.3 : 1.05, 0, Math.PI * 2);
      }
    }
    g.fillStyle = "rgba(16, 48, 96, 0.2)";
    g.fill(body);
    g.fillStyle = "rgba(16, 48, 96, 0.62)";
    g.fill(ridge);
    // the ground runs on past the frame: fade both edges instead of cropping them
    g.globalCompositeOperation = "destination-out";
    for (const [a, b] of [[0, w * 0.14], [w, w * 0.9]]) {
      const fade = g.createLinearGradient(a, 0, b, 0);
      fade.addColorStop(0, "rgba(0, 0, 0, 1)");
      fade.addColorStop(1, "rgba(0, 0, 0, 0)");
      g.fillStyle = fade;
      g.fillRect(Math.min(a, b), 0, Math.abs(b - a), h);
    }
    g.globalCompositeOperation = "source-over";

    // the elevation scale: 10 m ticks, 50 m labels, on the east edge where the ground has fallen away
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    let ticks = `<path class="trek-axis" d="M${w - 0.5} ${Y(unitsAt(610)).toFixed(1)}V${Y(unitsAt(760)).toFixed(1)}`;
    let labels = "";
    for (let m = 610; m <= 760; m += 10) {
      const y = Y(unitsAt(m)).toFixed(1), major = m % 50 === 0;
      ticks += `M${w - (major ? 9 : 5)} ${y}H${w}`;
      if (major) labels += `<text x="${w - 14}" y="${y}">${m} ${unit}</text>`;
    }
    scale.innerHTML = `${ticks}"/>${labels}`;

    // switchbacks: each hairpin sits inside the ground at its level; legs vary in length, drift toward
    // the summit and tighten as the dome narrows, the way a path is cut into a real slope
    const clear = narrow ? 12 : 20;
    const face = (y: number) => {
      let l = PEAK_I, r = PEAK_I;
      while (l > 0 && Y(SIL[l - 1]) <= y - clear) l--;
      while (r < N - 1 && Y(SIL[r + 1]) <= y - clear) r++;
      return [X(l), X(r)];
    };
    const peak: [number, number] = [X(PEAK_I), Y(SIL[PEAK_I])];
    const legs = Math.max(5, Math.min(8, Math.round((foot - peak[1]) / (narrow ? 36 : 80))));
    const start = foot - (foot - peak[1]) * 0.04, stop = peak[1] + (foot - peak[1]) * 0.1;
    const [l0, r0] = face(start);
    const head: [number, number] = [l0 + (r0 - l0) * 0.4, start];
    const apex: [number, number][] = [head];
    for (let k = 1; k <= legs; k++) {
      const t = Math.pow(k / legs, 0.9), y = start + (stop - start) * t + (rand(k * 3.1) - 0.5) * (foot - peak[1]) * 0.03;
      const [l, r] = face(y), margin = Math.max(10, (r - l) * 0.1);
      const c = head[0] + (peak[0] - head[0]) * t + (rand(k * 5.3) - 0.5) * (r - l) * 0.16; // the line wanders, as trails do
      const half = ((r - l) / 2) * (0.3 + rand(k) * 0.28);
      apex.push([Math.max(l + margin, Math.min(r - margin, k % 2 ? c + half : c - half)), y]);
    }
    apex.push(peak);
    // straight traverses joined by tight semicircle hairpins, as a surveyed switchback is drawn
    const gap = (start - stop) / legs, bend = Math.min(10, gap * 0.28);
    const f = (n: number) => n.toFixed(1);
    let d = `M${f(head[0])} ${f(head[1])}`;
    for (let k = 1; k <= legs; k++) {
      const [x, y] = apex[k], inward = Math.sign(apex[k + 1][0] - x) || 1, cx = x + inward * bend;
      d += `L${f(cx)} ${f(y + bend)}A${f(bend)} ${f(bend)} 0 0 ${inward > 0 ? 1 : 0} ${f(cx)} ${f(y - bend)}`;
    }
    d += `L${f(peak[0])} ${f(peak[1])}`;
    way.setAttribute("d", d);
    walked.setAttribute("d", d);

    total = way.getTotalLength();
    const count = Math.ceil(total / STEP) + 1;
    xs = new Float32Array(count);
    ys = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const p = way.getPointAtLength(Math.min(total, i * STEP));
      xs[i] = p.x;
      ys[i] = p.y;
    }
    walked.style.strokeDasharray = `${total} ${total}`;

    // camps: base camp at the trailhead, the summit at the top, the two between on hairpins
    const nearest = ([x, y]: [number, number]) => {
      let best = 0, bd = Infinity;
      for (let i = 0; i < count; i++) {
        const dd = (xs[i] - x) ** 2 + (ys[i] - y) ** 2;
        if (dd < bd) [best, bd] = [i, dd];
      }
      return best;
    };
    campAt = stages.map((_, s) => (s === 0 ? 0 : s === last ? count - 1 : nearest(apex[Math.round((s * legs) / last)])));
    camps.forEach((el, s) => {
      const k = campAt[s], x = xs[k], y = ys[k];
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      el.querySelector("em")!.textContent = String(s === last ? SUMMIT_M : metres(((foot - y) / (foot - sky)) * TOP));
      // tags point away from the trail (outside the hairpin), or inward when the panel edge is too near
      const outLeft = x < xs[Math.min(count - 1, k + 30)];
      el.classList.toggle("to-left", s !== last && (outLeft ? x > 210 : x > w - 210));
    });
    walk(progress);
  }

  // each stage title's centre, measured from the top of the list
  const marks = () => {
    const top = list.getBoundingClientRect().top;
    return stages.map((s) => {
      const r = s.querySelector("h3")!.getBoundingClientRect();
      return r.top + r.height / 2 - top;
    });
  };
  // the climb runs from base camp's title to the summit's, so scroll distance maps one to one onto the stages
  const span = (m = marks()) => Math.max(1, m[last] - m[0]);
  // the chart has settled in full view once its sticky box pins: wide, the side column pins level with the
  // list's top; stacked, the trek strip pins above the list, so the list's top sits at its foot
  const trek = panel.parentElement!;
  const settle = () => (getComputedStyle(trek).position === "sticky" ? trek.offsetHeight : 0);

  // progress through the climb, remapped so the climber stands on camp s while stage s's title holds base camp's line
  function walk(p: number) {
    progress = p;
    if (!xs.length) return;
    const m = marks(), len = span(m), knots = m.map((y) => (y - m[0]) / len);
    let k = campAt[0], near = 0;
    if (p >= knots[last]) [k, near] = [campAt[last], last];
    else
      for (let s = 0; s < last; s++)
        if (p >= knots[s] && p < knots[s + 1]) {
          const t = (p - knots[s]) / (knots[s + 1] - knots[s]);
          [k, near] = [Math.round(campAt[s] + (campAt[s + 1] - campAt[s]) * t), t < 0.5 ? s : s + 1];
        }
    walked.style.strokeDashoffset = String(total - Math.min(total, k * STEP));
    climber.style.transform = `translate(${xs[k].toFixed(1)}px, ${ys[k].toFixed(1)}px)`;
    camps.forEach((c, s) => {
      c.classList.toggle("is-reached", k >= campAt[s]);
      c.classList.toggle("is-current", s === near);
    });
    // each later entry wakes as its camp turns current (app.ts wakes the first as it rises into view)
    stages.slice(1).forEach((st, i) => st.classList.toggle("is-on", i < near));
  }

  paintWhenNear(panel, build);
  ScrollTrigger.create({
    trigger: list, refreshPriority: -1 /* after the pinned routes above add their spacer */,
    start: () => `top ${settle()}px`, end: () => `+=${span()}`,
    onUpdate: (s) => walk(s.progress), onRefresh: (s) => walk(s.progress),
  });
}
