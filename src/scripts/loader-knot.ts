/* The preloader symbol: the AI as a neuron that grows into a language model, with the three fields round it.
   One amber hub neuron grows a tree of neurons on two shells (tapered, curved dotted dendrites) that turns on a tilted
   axis. Three axons leave the hub for the fields (EdTech top, Healthcare bottom right, Logistics bottom left) and stream
   word-like tokens out to them: neurons fire inside, language flows out. Everything is drawn in dots (DESIGN.md › Dot).
   Drawn in a 520 x 260 design box that scales with the host; p (load progress 0..1) drives the build, t the idle motion.
   Prototype and its review rounds: loader-options/options/55-3d-knot.js, loader-options/iterations/55/. */

import * as THREE from "three";

const D_W = 520, D_H = 260; // design box, px
const FOV = 30;
const HALF = Math.tan((FOV * Math.PI) / 360);
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

// the knot sits below the middle so the ring of fields (top glyph to bottom glyphs) centres in the box
const CY = 154;
const R_IN = 36, R_OUT = 70; // shell radii before the squash
const SQ_X = 1.5, SQ_Y = 0.7; // screen squash: a wide knot whose outline holds steady while it turns
const N_IN = 9, N_OUT = 18, N_CROSS = 8;
const TILT = 0.32, SPIN = 0.14; // axis tilt toward the viewer (rad), turn speed (rad/s)
const SYN_STEP = 6.5; // dendrite dot spacing: gaps between dots, like the mountain
const BEND = 0.09; // dendrite curve: control point offset as a share of the link length
const DEND_PULSES = 10;

const FIELD_SIZE = 56, FIELD_STEP = 3.4, FIELD_STROKE = 1.8; // a dotted outline with gaps; the cap still keeps its tassel
const RING = { rx: 200, ry: 100, start: -90 }; // EdTech top, Healthcare bottom right, Logistics bottom left
// everything runs on p, which the loader counts linearly, so the whole build moves at one steady pace:
// tree 0-0.34, axons from 0.3 (constant speed), glyph births from 0.46, the whole message by 0.88, held to the exit
const AXON_AT = [0.3, 0.36, 0.42]; // p at which each axon sets off
const AXON_SPAN = 0.16; // p an axon takes to reach its field
const BIRTH_SPAN = 0.3, BURST_SPREAD = 0.42; // p a glyph birth takes; the share of it over which its pieces leave (nearest first)
const AXON_STEP = 7, AXON_GAP = 9;
const TOKENS = [[3, 2, 4], [2, 4, 3], [4, 3, 2]]; // per axon: tokens in flight, each a capsule of n x 2 dots
const TOK_STEP = 4.2, TOK_MAX = 4;

const AMBER = "#F8C000", AMBER_HI = "#FFD23D", MIST = "#A9B4CC";

// Lucide icons (ISC licence), 24 x 24 stroke paths
const FIELDS = [
  ["M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z", "M22 10v6", "M6 12.5V16a6 3 0 0 0 12 0v-3.5"], // graduation-cap: EdTech
  ["M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5", "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"], // heart-pulse: Healthcare
  ["M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", "M15 18H9", "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14", "M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"], // truck: Logistics
];

// dots like the hero mountain's: small, soft-rimmed, with clear gaps between them, so the knot reads as fine dust, not
// solid strokes; the soft rim also lets dots glide instead of snapping pixel to pixel.
// Never under 1.5 device px: a smaller dot keeps 1.5px and fades by its area. aS = sprite diameter in design px at z = 0.
const VS = `
attribute vec3 aCol;
attribute float aA;
attribute float aS;
uniform float uPx;
uniform float uFocal;
uniform float uSpan;
varying vec3 vCol;
varying float vA;
varying float vD;
varying float vBox;
void main() {
  vCol = aCol;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float near = clamp(0.5 - 0.5 * (-mv.z - uFocal) / uSpan, 0.0, 1.0);
  float px = aS * uPx * uFocal / max(-mv.z, 1.0) * (0.85 + 0.3 * near);
  vD = max(px, 1.5);
  vA = aA * (0.4 + 0.6 * near) * min(1.0, (px * px) / (vD * vD));
  vBox = vD;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = vBox;
}`;
const FS_DOT = `
varying vec3 vCol;
varying float vA;
varying float vD;
varying float vBox;
void main() {
  float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
  if (d > 1.0) discard;
  float a = (1.0 - smoothstep(0.4, 1.0, d)) * vA; // a solid core with a soft rim: small and crisp, yet bright without a bloom pass
  gl_FragColor = vec4(vCol, a);
}`;
const FS_SOFT = `
varying vec3 vCol;
varying float vA;
varying float vD;
varying float vBox;
void main() {
  float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
  float a = exp(-d * d * 4.0) * vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vCol, a);
}`;

type V3 = [number, number, number];
type Cloud = { obj: THREE.Points; geo: THREE.BufferGeometry; pos: Float32Array; col: Float32Array; a: Float32Array; s: Float32Array };

const rgb = (hex: string): V3 => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as V3;
const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const out2 = (p: number) => 1 - (1 - p) * (1 - p);
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const bez = (A: V3, C: V3, B: V3, u: number): V3 => {
  const v = 1 - u;
  return [0, 1, 2].map((k) => v * v * A[k] + 2 * u * v * C[k] + u * u * B[k]) as V3;
};

// a stroked icon rasterised at size x size, sampled every `step` px; keeps cells with some ink (a = coverage)
function iconDots(paths: string[], size: number, step: number, stroke: number) {
  const c = document.createElement("canvas");
  c.width = c.height = Math.ceil(size);
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.scale(size / 24, size / 24);
  Object.assign(g, { lineWidth: stroke, lineCap: "round", lineJoin: "round", strokeStyle: "#000" });
  for (const d of paths) g.stroke(new Path2D(d));
  const W = c.width, data = g.getImageData(0, 0, W, W).data, out: { x: number; y: number; a: number }[] = [];
  const n = Math.ceil(size / step - 1e-9);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const x0 = i * step, y0 = j * step, x1 = Math.min(size, x0 + step), y1 = Math.min(size, y0 + step);
      let sum = 0, cnt = 0;
      for (let y = Math.floor(y0); y < Math.max(Math.floor(y0) + 1, Math.floor(y1)); y++)
        for (let x = Math.floor(x0); x < Math.max(Math.floor(x0) + 1, Math.floor(x1)); x++) {
          sum += data[(y * W + x) * 4 + 3];
          cnt++;
        }
      const a = sum / (cnt * 255);
      if (a > 0.15) out.push({ x: (x0 + x1) / 2, y: (y0 + y1) / 2, a });
    }
  return out;
}

function cloud(mat: THREE.Material, n: number): Cloud {
  const attr = (size: number) => new THREE.BufferAttribute(new Float32Array(n * size), size).setUsage(THREE.DynamicDrawUsage);
  const geo = new THREE.BufferGeometry();
  const at = { position: attr(3), aCol: attr(3), aA: attr(1), aS: attr(1) };
  for (const [k, v] of Object.entries(at)) geo.setAttribute(k, v);
  const obj = new THREE.Points(geo, mat);
  obj.frustumCulled = false;
  return { obj, geo, pos: at.position.array as Float32Array, col: at.aCol.array as Float32Array, a: at.aA.array as Float32Array, s: at.aS.array as Float32Array };
}
const put = (c: Cloud, i: number, x: number, y: number, z: number) => c.pos.set([x, y, z], 3 * i);
const paint = (c: Cloud, i: number, col: V3, a: number, s: number) => {
  c.col.set(col, 3 * i);
  c.a[i] = a;
  c.s[i] = s;
};
const flush = (c: Cloud) => {
  for (const k of ["position", "aCol", "aA", "aS"]) c.geo.attributes[k].needsUpdate = true;
};

/** Mounts the symbol in `host` (a box with a 2:1 aspect) and runs it until destroy(). getP returns load progress 0..1.
 *  Returns null when WebGL is missing (the loader then shows only its lists and counter). */
export function mountLoaderKnot(host: HTMLElement, getP: () => number) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch {
    return null;
  }
  host.appendChild(canvas);
  renderer.setClearColor(0x000000, 0);
  const rand = rng(55);
  const amber = rgb(AMBER), amberHi = rgb(AMBER_HI), mist = rgb(MIST);

  const scene = new THREE.Scene();
  const focal = D_H / 2 / HALF; // 1 world unit = 1 design px on the z = 0 plane
  const camera = new THREE.PerspectiveCamera(FOV, D_W / D_H, 1, 4000);
  camera.position.z = focal;
  const uniforms = { uPx: { value: 1 }, uFocal: { value: focal }, uSpan: { value: R_OUT * 1.1 } };
  const matDot = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS_DOT, uniforms, transparent: true, depthWrite: false });
  // the amber knot adds light like the mountain's dust: where its dots crowd, the core glows; the field glyphs blend normally
  const matGlow = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS_DOT, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const matSoft = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS_SOFT, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  // full device resolution, never lowered (DESIGN.md: performance never trades away quality)
  const fit = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uPx.value = devicePixelRatio * (h / D_H);
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(host);
  const cx = D_W / 2, oy = D_H / 2 - CY;

  /* ---------- the neuron tree (local space, before the squash) ---------- */
  type Node = { p: V3; parent: number; at: number; size: number };
  const nodes: Node[] = [{ p: [0, 0, 0], parent: -1, at: 0, size: 13 }];
  const shell = (count: number, rad: number) =>
    Array.from({ length: count }, (_, i): V3 => {
      const y = 1 - (2 * (i + 0.5)) / count, rr = Math.sqrt(1 - y * y), th = i * GOLDEN + 0.6 * rand();
      const s = rad * (0.9 + 0.2 * rand());
      return [Math.cos(th) * rr * s, y * s * 0.9, Math.sin(th) * rr * s];
    });
  const d2 = (a: V3, b: V3) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  shell(N_IN, R_IN).forEach((q, i) => nodes.push({ p: q, parent: 0, at: 0.05 + (i / N_IN) * 0.1, size: 7 }));
  shell(N_OUT, R_OUT).forEach((q, j) => {
    let best = 1;
    for (let i = 2; i <= N_IN; i++) if (d2(q, nodes[i].p) < d2(q, nodes[best].p)) best = i;
    nodes.push({ p: q, parent: best, at: 0.14 + (j / N_OUT) * 0.14, size: 4.8 });
  });
  const N = nodes.length;

  // links: the tree (parent -> child) plus a few short cross links between outer neighbours
  type Link = { a: number; b: number; C: V3; L: number; at: number; dur: number; tree: boolean };
  const links: Link[] = [];
  const curve = (A: V3, B: V3, side: number) => {
    const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d);
    // bend sideways: perpendicular to the link and to the vertical axis (x when the link is vertical)
    const nl = Math.hypot(d[2], d[0]), n: V3 = nl < 1e-3 ? [1, 0, 0] : [d[2] / nl, 0, -d[0] / nl];
    return { C: [0, 1, 2].map((k) => (A[k] + B[k]) / 2 + n[k] * L * BEND * side) as V3, L };
  };
  for (let i = 1; i < N; i++) links.push({ a: nodes[i].parent, b: i, ...curve(nodes[nodes[i].parent].p, nodes[i].p, i % 2 ? 1 : -1), at: nodes[i].at, dur: 0.1, tree: true });
  const pairs: { i: number; j: number; d: number }[] = [];
  for (let i = 1 + N_IN; i < N; i++) for (let j = i + 1; j < N; j++) if (nodes[j].parent !== nodes[i].parent) pairs.push({ i, j, d: d2(nodes[i].p, nodes[j].p) });
  pairs.sort((u, v) => u.d - v.d);
  pairs.filter((q) => q.d < (R_OUT * 0.7) ** 2).slice(0, N_CROSS).forEach(({ i, j }, k) =>
    links.push({ a: i, b: j, ...curve(nodes[i].p, nodes[j].p, k % 2 ? 1 : -1), at: 0.3 + k * 0.01, dur: 0.08, tree: false })
  );
  const syn: { li: number; u: number }[] = [];
  links.forEach((l, li) => {
    const m = Math.max(3, Math.round(l.L / SYN_STEP));
    for (let k = 1; k < m; k++) syn.push({ li, u: k / m });
  });
  const treeLinks = links.filter((l) => l.tree);
  const dpulse = Array.from({ length: DEND_PULSES }, (_, k) => ({ l: treeLinks[Math.floor(rand() * treeLinks.length)], off: k / DEND_PULSES + 0.05 * rand(), sp: 0.55 + 0.25 * rand() }));

  const haloC = cloud(matSoft, 1 + N_IN), nodeC = cloud(matGlow, N), synC = cloud(matGlow, syn.length), dpC = cloud(matGlow, DEND_PULSES);
  // squash outside, tilt, then spin inside: the outline stays steady while the knot turns
  const squash = new THREE.Group(), tilt = new THREE.Group(), spin = new THREE.Group();
  squash.scale.set(SQ_X, SQ_Y, SQ_X);
  squash.position.set(0, oy, 0);
  tilt.rotation.x = TILT;
  spin.add(haloC.obj, synC.obj, nodeC.obj, dpC.obj);
  tilt.add(spin);
  squash.add(tilt);
  scene.add(squash);
  nodes.forEach((n, i) => put(nodeC, i, ...n.p));
  for (let i = 0; i <= N_IN; i++) put(haloC, i, ...nodes[i].p);
  syn.forEach((s, j) => put(synC, j, ...bez(nodes[links[s.li].a].p, links[s.li].C, nodes[links[s.li].b].p, s.u)));

  /* ---------- fields round the knot, axons from the hub ---------- */
  const toScene = (x: number, y: number): V3 => [x - cx, D_H / 2 - y, 0];
  const ring = [0, 1, 2].map((i) => {
    const a = ((RING.start + i * 120) * Math.PI) / 180;
    return { x: cx + Math.cos(a) * RING.rx, y: CY + Math.sin(a) * RING.ry };
  });
  const fPt: { x: number; y: number; full: boolean; f: number }[] = [];
  FIELDS.forEach((paths, f) =>
    iconDots(paths, FIELD_SIZE, FIELD_STEP, FIELD_STROKE).forEach((q) =>
      fPt.push({ x: ring[f].x - FIELD_SIZE / 2 + q.x, y: ring[f].y - FIELD_SIZE / 2 + q.y, full: q.a >= 0.6, f })
    )
  );
  const fieldC = cloud(matDot, fPt.length + 9); // glyph dots + a 3-dot amber accent per field
  fPt.forEach((q, k) => put(fieldC, k, ...toScene(q.x, q.y)));
  const hub = [cx, CY];
  const axons = ring.map((f) => {
    const dx = f.x - hub[0], dy = f.y - hub[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const box = FIELD_SIZE / 2 / Math.max(Math.abs(ux), Math.abs(uy)); // centre to glyph box edge along the ray
    const end = [f.x - ux * (box + AXON_GAP), f.y - uy * (box + AXON_GAP)];
    const len = L - box - AXON_GAP, C = [(hub[0] + end[0]) / 2 - uy * len * 0.08, (hub[1] + end[1]) / 2 + ux * len * 0.08];
    const at = (u: number): [number, number] => {
      const v = 1 - u;
      return [v * v * hub[0] + 2 * u * v * C[0] + u * u * end[0], v * v * hub[1] + 2 * u * v * C[1] + u * u * end[1]];
    };
    const n = Math.round(len / AXON_STEP);
    const pts = Array.from({ length: n }, (_, k) => {
      const [x, y] = at((k + 1) / n);
      return { x, y, u: (k + 1) / n };
    });
    const acc = [-1, 0, 1].map((k) => toScene(f.x - ux * (box + 5) - uy * k * 5, f.y - uy * (box + 5) + ux * k * 5));
    return { pts, acc, ux, uy, len, at, end };
  });
  axons.forEach((ax, i) => ax.acc.forEach((q, k) => put(fieldC, fPt.length + 3 * i + k, ...q)));
  const nAxon = axons.reduce((s, a) => s + a.pts.length, 0);
  const axC = cloud(matGlow, nAxon + 9 * TOK_MAX * 2);
  let ai = 0;
  axons.forEach((ax) => ax.pts.forEach((q) => put(axC, ai++, ...toScene(q.x, q.y))));
  scene.add(axC.obj, fieldC.obj);
  // each glyph is born at its axon's tip: its dots leave that point nearest first, scatter a little, and settle into the glyph
  const birth = fPt.map((q) => {
    const o = axons[q.f].end, a = rand() * Math.PI * 2, s = 4 + 7 * rand();
    return { ox: o[0], oy: o[1], d: Math.hypot(q.x - o[0], q.y - o[1]), sx: Math.cos(a) * s, sy: Math.sin(a) * s, delay: 0 };
  });
  const dMax = [0, 1, 2].map((f) => Math.max(...birth.filter((_, k) => fPt[k].f === f).map((b) => b.d)));
  birth.forEach((b, k) => (b.delay = BURST_SPREAD * (0.8 * (b.d / dMax[fPt[k].f]) + 0.2 * rand())));
  const col: V3 = [0, 0, 0];
  // the knot's screen radius toward a direction: axon dots inside it stay faint, so each axon reads as leaving the knot
  const rim = (ux: number, uy: number) => 1 / Math.hypot(ux / (R_OUT * SQ_X), uy / (R_OUT * SQ_Y));

  function frame(t: number, p: number) {
    // neurons pop in as their dendrite arrives; the hub breathes
    const grown = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const g = i === 0 ? seg(p, 0, 0.06) : seg(p, nodes[i].at + 0.06, nodes[i].at + 0.11);
      grown[i] = g;
      // neurons grow in without overshoot (an overshoot read as a wobble); the hub breathes gently
      const breathe = i === 0 ? 1 + 0.03 * Math.sin(t * 1.6) : 1;
      paint(nodeC, i, i === 0 ? amberHi : amber, Math.min(1, g * 1.4), nodes[i].size * out2(g) * breathe);
    }
    paint(haloC, 0, amber, 0.13 * grown[0] * (1 + 0.08 * Math.sin(t * 1.6)), 56);
    for (let i = 1; i <= N_IN; i++) paint(haloC, i, amber, 0.07 * grown[i], 18);
    // dendrites grow from parent to child and taper: thick and bright at the hub, thinner toward the tips
    syn.forEach((s, j) => {
      const l = links[s.li], vis = clamp((seg(p, l.at, l.at + l.dur) - s.u) * 8 + 1);
      const root = l.a === 0 ? 1 : 0.72;
      paint(synC, j, amber, (l.tree ? 0.6 + 0.25 * root - 0.15 * s.u : 0.35) * vis, l.tree ? (2.1 - 0.6 * s.u) * root + 0.3 : 1.4);
    });
    const pOn = seg(p, 0.7, 0.85);
    dpulse.forEach((d, k) => {
      const h = (t * d.sp + d.off) % 1;
      put(dpC, k, ...bez(nodes[d.l.a].p, d.l.C, nodes[d.l.b].p, h));
      paint(dpC, k, amberHi, pOn * Math.sin(Math.PI * h), 3);
    });
    // axons grow at a constant speed, one after another; dots inside the knot stay faint
    let j = 0;
    const birthP = axons.map((_, i) => seg(p, AXON_AT[i] + AXON_SPAN, AXON_AT[i] + AXON_SPAN + BIRTH_SPAN));
    axons.forEach((ax, i) => {
      const g = seg(p, AXON_AT[i], AXON_AT[i] + AXON_SPAN), r = rim(ax.ux, ax.uy);
      for (const q of ax.pts) {
        const inside = 0.12 + 0.5 * smooth(r * 0.75, r * 1.1, Math.hypot(q.x - hub[0], q.y - hub[1]));
        paint(axC, j++, amber, inside * 1.3 * clamp((g - q.u) * 10 + 1), 1.9);
      }
    });
    // tokens: word-like capsules (n x 2 dots) stream out along each axon: the model's output
    axons.forEach((ax, i) => {
      const nx = -ax.uy * (TOK_STEP / 2), ny = ax.ux * (TOK_STEP / 2);
      const on = smooth(0.6, 1, birthP[i]); // tokens flow once the glyph has mostly formed
      for (let k = 0; k < 3; k++) {
        const h = (t * 0.32 + k / 3 + i * 0.17) % 1, a = on * Math.sin(Math.PI * h) * smooth(0.12, 0.32, h);
        for (let d = 0; d < TOK_MAX; d++) {
          const [x, y] = ax.at(clamp(h - (d * TOK_STEP) / ax.len));
          for (let r = 0; r < 2; r++) {
            const idx = nAxon + ((i * 3 + k) * TOK_MAX + d) * 2 + r, sgn = r ? 1 : -1;
            put(axC, idx, ...toScene(x + nx * sgn, y + ny * sgn));
            paint(axC, idx, amberHi, d < TOKENS[i][k] ? a : 0, 2.5);
          }
        }
      }
    });
    // glyph birth: the axon's tip flashes, bursts into small amber pieces that fly out, scatter, and settle into the glyph as Mist
    fPt.forEach((q, k) => {
      const b = birth[k], u = clamp((birthP[q.f] - b.delay) / (1 - BURST_SPREAD)), e = out2(u), arc = Math.sin(Math.PI * u);
      put(fieldC, k, ...toScene(b.ox + (q.x - b.ox) * e + b.sx * arc, b.oy + (q.y - b.oy) * e + b.sy * arc));
      const m = smooth(0.45, 1, u);
      for (let c = 0; c < 3; c++) col[c] = amberHi[c] + (mist[c] - amberHi[c]) * m;
      paint(fieldC, k, col, smooth(0, 0.12, u) * (q.full ? 1 : 0.6) * (1 + 0.25 * (1 - m)), 1.7 + 0.9 * smooth(0.55, 1, u));
    });
    for (let i = 0; i < 3; i++) {
      const b = birthP[i], flash = 1 + 0.7 * (1 - smooth(0, 0.45, b));
      for (let k = 0; k < 3; k++) paint(fieldC, fPt.length + 3 * i + k, amber, seg(b, 0, 0.06) * (k === 1 ? 1 : 0.75), (k === 1 ? 3.6 : 2.8) * flash);
    }

    spin.rotation.y = 0.6 + t * SPIN;
    [nodeC, haloC, synC, dpC, axC, fieldC].forEach(flush);
    renderer.render(scene, camera);
  }

  // runs only while mounted; destroy() frees the GPU context before the hero needs it
  const t0 = performance.now();
  let raf = requestAnimationFrame(function tick(now) {
    frame((now - t0) / 1000, clamp(getP()));
    raf = requestAnimationFrame(tick);
  });
  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      [haloC, nodeC, synC, dpC, axC, fieldC].forEach((c) => c.geo.dispose());
      matDot.dispose();
      matGlow.dispose();
      matSoft.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
