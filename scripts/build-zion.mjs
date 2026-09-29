// Generates src/scripts/zion-data.ts: the real relief of Mount Zion, Jerusalem (31.7717 N, 35.2286 E, 765 m).
// Source: AWS Terrain Tiles (Terrarium encoding, zoom 15; SRTM-derived, public domain), cached in .impeccable/zion-tiles/.
// Usage: node scripts/build-zion.mjs
import fs from "node:fs";
import { inflateSync } from "node:zlib";

const LAT = 31.7717, LON = 35.2286, SUMMIT_M = 765; // Wikipedia / PeakVisor published elevation
const Z = 15, TILE = 256, CACHE = ".impeccable/zion-tiles";
const M_PER_UNIT = 70; // horizontal scale: one world unit = 70 m on the ground
const X_RANGE = [-16, 16], Z_RANGE = [-12, 12], STEP = 0.25; // world grid (x = east, z = south)
const PEAK_UNITS = 6.4; // the hero's summit height; the vertical exaggeration follows from it
const BLUR_M = 22; // soften SRTM roof-and-street noise; keeps every landform wider than ~50 m
const MASK = { near: 420, far: 950, north: 1.5 }; // the hill stands alone: neighbours beyond the valleys taper away

/* tiles */
const n = 2 ** Z, rad = (LAT * Math.PI) / 180;
const fx = ((LON + 180) / 360) * n, fy = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
const tx0 = Math.floor(fx) - 1, ty0 = Math.floor(fy) - 1, NT = 3, W = TILE * NT;
const mPerPx = (40075016.686 * Math.cos(rad)) / n / TILE;
fs.mkdirSync(CACHE, { recursive: true });

function png(buf) {
  let p = 8, w = 0, h = 0, ct = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString("ascii", p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") [w, h, ct] = [d.readUInt32BE(0), d.readUInt32BE(4), d[9]];
    if (type === "IDAT") idat.push(d);
    p += 12 + len;
  }
  const bpp = ct === 6 ? 4 : 3, stride = w * bpp, raw = inflateSync(Buffer.concat(idat)), out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], row = y * stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? out[row + i - bpp] : 0, b = y ? out[row - stride + i] : 0, c = y && i >= bpp ? out[row - stride + i - bpp] : 0;
      let v = raw[y * (stride + 1) + 1 + i];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[row + i] = v & 255;
    }
  }
  return { data: out, bpp };
}

const dem = new Float32Array(W * W);
for (let i = 0; i < NT; i++)
  for (let j = 0; j < NT; j++) {
    const file = `${CACHE}/${Z}_${tx0 + i}_${ty0 + j}.png`;
    if (!fs.existsSync(file)) {
      const res = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx0 + i}/${ty0 + j}.png`);
      if (!res.ok) throw new Error(`tile ${i},${j}: HTTP ${res.status}`);
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    const { data, bpp } = png(fs.readFileSync(file));
    for (let y = 0; y < TILE; y++)
      for (let x = 0; x < TILE; x++) {
        const k = (y * TILE + x) * bpp;
        dem[(j * TILE + y) * W + i * TILE + x] = data[k] * 256 + data[k + 1] + data[k + 2] / 256 - 32768;
      }
  }

/* separable gaussian */
const sigma = BLUR_M / mPerPx, r = Math.ceil(sigma * 3);
const kern = Array.from({ length: 2 * r + 1 }, (_, k) => Math.exp(-((k - r) ** 2) / (2 * sigma * sigma)));
const ks = kern.reduce((a, b) => a + b);
function blur(src, dx, dy) {
  const out = new Float32Array(W * W);
  for (let y = 0; y < W; y++)
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let k = -r; k <= r; k++) {
        const xx = Math.min(W - 1, Math.max(0, x + k * dx)), yy = Math.min(W - 1, Math.max(0, y + k * dy));
        s += src[yy * W + xx] * kern[k + r];
      }
      out[y * W + x] = s / ks;
    }
  return out;
}
const smooth = blur(blur(dem, 1, 0), 0, 1);

/* sample the world grid */
const cx = (fx - tx0) * TILE, cy = (fy - ty0) * TILE;
function elev(mx, my) {
  const px = cx + mx / mPerPx, py = cy + my / mPerPx;
  const x0 = Math.floor(px), y0 = Math.floor(py), u = px - x0, v = py - y0, at = (x, y) => smooth[y * W + x];
  return at(x0, y0) * (1 - u) * (1 - v) + at(x0 + 1, y0) * u * (1 - v) + at(x0, y0 + 1) * (1 - u) * v + at(x0 + 1, y0 + 1) * u * v;
}
const ss = (a, b, t) => {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return k * k * (3 - 2 * k);
};
const cols = Math.round((X_RANGE[1] - X_RANGE[0]) / STEP) + 1, rows = Math.round((Z_RANGE[1] - Z_RANGE[0]) / STEP) + 1;
let floor = Infinity;
for (let my = -700; my <= 700; my += 10)
  for (let mx = -700; mx <= 700; mx += 10) if (Math.hypot(mx, my) <= 700) floor = Math.min(floor, elev(mx, my));
const lift = new Float32Array(cols * rows);
let top = 0, topAt = [0, 0];
for (let j = 0; j < rows; j++)
  for (let i = 0; i < cols; i++) {
    const x = X_RANGE[0] + i * STEP, z = Z_RANGE[0] + j * STEP, mx = x * M_PER_UNIT, my = z * M_PER_UNIT;
    const d = Math.hypot(mx, my < 0 ? my * MASK.north : my);
    const h = Math.max(0, elev(mx, my) - floor) * (1 - ss(MASK.near, MASK.far, d));
    lift[j * cols + i] = h;
    if (h > top) [top, topAt] = [h, [x, z]];
  }
const vex = PEAK_UNITS / (top / M_PER_UNIT);
const q = new Uint16Array(cols * rows);
for (let k = 0; k < q.length; k++) q[k] = Math.round((lift[k] / top) * 65535);
const demSummit = elev(0, 0);
const baseM = Math.round(SUMMIT_M - top); // the summit reads the published 765 m; everything below keeps its real drop

fs.writeFileSync(
  "src/scripts/zion-data.ts",
  `// Generated by scripts/build-zion.mjs from AWS Terrain Tiles (Terrarium z${Z}, SRTM-derived, public domain). Do not edit.
// Mount Zion, Jerusalem: ${LAT} N, ${LON} E. One world unit = ${M_PER_UNIT} m; vertical exaggeration x${vex.toFixed(2)}.
export const ZION = {
  cols: ${cols}, rows: ${rows}, x0: ${X_RANGE[0]}, z0: ${Z_RANGE[0]}, step: ${STEP},
  peak: ${PEAK_UNITS}, peakAt: [${topAt[0]}, ${topAt[1]}] as const,
  metersPerUnit: ${M_PER_UNIT}, exaggeration: ${vex.toFixed(4)},
  baseM: ${baseM}, summitM: ${SUMMIT_M},
} as const;
export const LIFT = "${Buffer.from(q.buffer).toString("base64")}";
`,
);
console.log({ mPerPx: mPerPx.toFixed(3), floor: floor.toFixed(1), demSummit: demSummit.toFixed(1), reliefM: top.toFixed(1), topAt, vex: vex.toFixed(2), baseM, cols, rows });
