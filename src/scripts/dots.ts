/* Dot-matrix icons and the dot world map.
   Icons are authored as 24×24 stroke vectors, then sampled onto a 13×13 dot grid,
   the same pixel-dot grammar as the map and the particle mountain. */

import { LAND, MAP } from "./dotmap-data";
import { paintWhenNear } from "./defer";

export const ICONS: Record<string, string> = {
  // services
  product: "M12 2.5 20.5 7.2v9.6L12 21.5 3.5 16.8V7.2Z M3.5 7.2 12 12l8.5-4.8 M12 12v9.5",
  analytics: "M3 21h18 M6 21v-7 M11 21V9 M16 21v-5 M21 21V4 M5 10l5-5 5 5 6-6",
  cocreate: "M9 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0 M15 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0",
  staffing: "M9 8m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0 M2.5 21c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5 M17 9m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0 M16.5 14.2c2.8.3 5 2.6 5 5.8",
  apps: "M2.5 4.5h19v15h-19Z M2.5 9h19 M9.5 12.5l-2.5 2.5 2.5 2.5 M14.5 12.5l2.5 2.5-2.5 2.5",
  lowcode: "M3 3h7.5v7.5H3Z M13.5 3H21v7.5h-7.5Z M3 13.5h7.5V21H3Z M17.25 13.5V21 M13.5 17.25H21",
  ai: "M12 2.5l2.2 7.3 7.3 2.2-7.3 2.2-2.2 7.3-2.2-7.3L2.5 12l7.3-2.2Z",
  cloud: "M7 19h10.5a4.5 4.5 0 0 0 .6-8.96A6.5 6.5 0 0 0 5.6 9.3 5 5 0 0 0 7 19Z",
  // 4-D stages
  discovery: "M11 11m-7.5 0a7.5 7.5 0 1 0 15 0a7.5 7.5 0 1 0-15 0 M16.5 16.5 21.5 21.5",
  design: "M3 21l3.5-1 12-12-2.5-2.5-12 12Z M14.5 6.5 17 9 M3 21h18",
  development: "M8 6 2.5 12 8 18 M16 6l5.5 6-5.5 6 M13.5 4l-3 16",
  deployment: "M5 21.5V2.5 M5 3.5h13l-3 4.5 3 4.5H5",
  // base camps
  phone: "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2",
  clock: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 7v5l3.5 2.5",
  tower: "M4 21.5h16 M6 21.5V3h12v18.5 M9.5 7h1.5 M13 7h1.5 M9.5 11h1.5 M13 11h1.5 M9.5 15h1.5 M13 15h1.5",
  // core values and careers
  rocket: "M12 2.5c3.2 2.4 4.8 5.8 4.8 9.8L14.6 16H9.4l-2.2-3.7c0-4 1.6-7.4 4.8-9.8Z M12 9.5m-1.8 0a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0 M9.4 16 6 19.5 7.5 14 M14.6 16l3.4 3.5-1.5-5.5 M12 18.5v3",
  target: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M12 12m-1.3 0a1.3 1.3 0 1 0 2.6 0a1.3 1.3 0 1 0-2.6 0",
  shield: "M12 2.5 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6Z M8.5 12l2.5 2.5 4.5-5",
  check: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M7.5 12.5l3 3 6-7",
  home: "M2.5 11 12 3.5l9.5 7.5 M5.5 9v12h13V9 M10 21v-6h4v6",
  // smart-school platform: the devices at the edge
  // drawn on the dot-cell centres (24 / 13 apart) so the eyes land on single dots
  robot: "M4.62 6.46h14.76v12.92H4.62Z M12 6.46V2.77 M8.31 10.15h.01 M15.69 10.15h.01 M10.15 15.69h3.7 M1 10.15v5.54 M23 10.15v5.54",
  screens: "M2.5 4.5h13v9.5h-13Z M1 18h16 M17.5 8.5h5v12h-5Z",
  watch: "M7 7h10v10H7Z M9 7l1-4.5h4L15 7 M9 17l1 4.5h4l1-4.5 M12 9.5V12l2 1.5",
  camera: "M2.5 7h4l1.5-2.5h8L17.5 7h4v12.5h-19Z M12 13m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0",
  sensor: "M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M7.8 9.8a6 6 0 0 0 0 8.4 M16.2 9.8a6 6 0 0 1 0 8.4 M4.6 6.6a10.5 10.5 0 0 0 0 14.8 M19.4 6.6a10.5 10.5 0 0 1 0 14.8",
};

const GRID = 13;
const cache = new Map<string, string>();

/** Rasterises a vector icon onto a dot grid and returns an SVG string. */
export function dotIcon(name: string): string {
  const hit = cache.get(name);
  if (hit) return hit;
  const S = 104; // 8px per dot cell
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.scale(S / 24, S / 24);
  g.lineWidth = 2.1;
  g.lineCap = g.lineJoin = "round";
  g.strokeStyle = "#000";
  g.stroke(new Path2D(ICONS[name]));
  const data = g.getImageData(0, 0, S, S).data;
  const cell = S / GRID;
  let dots = "";
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      let sum = 0, n = 0;
      for (let yy = Math.floor(y * cell); yy < Math.floor((y + 1) * cell); yy++) {
        for (let xx = Math.floor(x * cell); xx < Math.floor((x + 1) * cell); xx++) {
          sum += data[(yy * S + xx) * 4 + 3];
          n++;
        }
      }
      const a = sum / n / 255;
      if (a > 0.16) dots += `<circle cx="${x + 0.5}" cy="${y + 0.5}" r="${a > 0.5 ? 0.36 : 0.3}" opacity="${a > 0.5 ? 1 : 0.55}"/>`;
    }
  }
  const svg = `<svg viewBox="0 0 ${GRID} ${GRID}" aria-hidden="true" focusable="false" fill="currentColor">${dots}</svg>`;
  cache.set(name, svg);
  return svg;
}

export function mountIcons(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-icon]").forEach((el) => {
    el.innerHTML = dotIcon(el.dataset.icon!);
  });
}

/* ---------- dot world map ---------- */

let bits: Uint8Array | null = null;
function landBits() {
  if (bits) return bits;
  bits = new Uint8Array(MAP.cols * MAP.rows);
  LAND.forEach((row, r) => {
    let v = 0n;
    for (const ch of row) v = v * 36n + BigInt(parseInt(ch, 36));
    for (let c = MAP.cols - 1; c >= 0; c--) {
      bits![r * MAP.cols + c] = Number(v & 1n);
      v >>= 1n;
    }
  });
  return bits;
}

/** Map-space position (0..1, 0..1) of a latitude/longitude, same crop as the dot grid. */
export function project(lat: number, lon: number) {
  const lat1 = MAP.lat0 - MAP.rows * MAP.step;
  return { x: (lon - MAP.lon0) / 360, y: (MAP.lat0 - lat) / (MAP.lat0 - lat1) };
}

export const MAP_ASPECT = MAP.cols / MAP.rows;

/** Paints the land dots into a canvas that fills its CSS box. */
export function paintDotMap(canvas: HTMLCanvasElement, color: string, radius = 0.32) {
  const land = landBits();
  const draw = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const g = canvas.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    g.fillStyle = color;
    const cw = w / MAP.cols, ch = h / MAP.rows;
    const r = Math.max(0.6, Math.min(cw, ch) * radius);
    g.beginPath();
    for (let y = 0; y < MAP.rows; y++) {
      for (let x = 0; x < MAP.cols; x++) {
        if (!land[y * MAP.cols + x]) continue;
        const px = (x + 0.5) * cw, py = (y + 0.5) * ch;
        g.moveTo(px + r, py);
        g.arc(px, py, r, 0, Math.PI * 2);
      }
    }
    g.fill();
  };
  paintWhenNear(canvas, draw);
}
