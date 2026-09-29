/* The intro tile: a top-down contour map of Mount Zion, the same relief the hero renders in 3D.
   Real 10 m contours in navy (index contour every 50 m); one amber contour follows the altimeter. */

import { BASE_M, heightAt, PEAK, SUMMIT_M, unitsAt } from "./mountain";

// a 5:3 excerpt of the real ground: Mount Zion, the Hinnom bend, and the Kidron edge (1.26 km x 0.76 km)
const NX = 130, NY = 78, X0 = -9, X1 = 9, Z0 = -7.4, Z1 = 3.4;
type Edge = 0 | 1 | 2 | 3; // top, right, bottom, left
const CASES: Record<number, [Edge, Edge][]> = {
  1: [[3, 2]], 2: [[2, 1]], 3: [[3, 1]], 4: [[0, 1]], 5: [[3, 0], [2, 1]], 6: [[0, 2]], 7: [[3, 0]],
  8: [[3, 0]], 9: [[0, 2]], 10: [[0, 1], [3, 2]], 11: [[0, 1]], 12: [[3, 1]], 13: [[2, 1]], 14: [[3, 2]],
};

type TopoStyle = { minor: string; major: string; amber: number; amberColor?: string; cover?: boolean };
const TILE: TopoStyle = { minor: "rgba(16, 48, 96, 0.34)", major: "rgba(16, 48, 96, 0.72)", amber: 2 };

export function mountTopo(canvas: HTMLCanvasElement, style: TopoStyle = TILE) {
  const grid = new Float32Array(NX * NY);
  for (let j = 0; j < NY; j++)
    for (let i = 0; i < NX; i++) grid[j * NX + i] = heightAt(X0 + ((X1 - X0) * i) / (NX - 1), Z0 + ((Z1 - Z0) * j) / (NY - 1));

  const base = document.createElement("canvas");
  let w = 0, h = 0, dpr = 1, last = -1, sx = 1, sy = 1, ox = 0, oy = 0;

  function trace(g: CanvasRenderingContext2D, level: number) {
    g.beginPath();
    for (let j = 0; j < NY - 1; j++) {
      for (let i = 0; i < NX - 1; i++) {
        const a = grid[j * NX + i], b = grid[j * NX + i + 1], c = grid[(j + 1) * NX + i + 1], d = grid[(j + 1) * NX + i];
        const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        const segs = CASES[idx];
        if (!segs) continue;
        const at = (e: Edge): [number, number] => {
          if (e === 0) return [i + (level - a) / (b - a), j];
          if (e === 1) return [i + 1, j + (level - b) / (c - b)];
          if (e === 2) return [i + (level - d) / (c - d), j + 1];
          return [i, j + (level - a) / (d - a)];
        };
        for (const [e1, e2] of segs) {
          const p = at(e1), q = at(e2);
          g.moveTo(ox + p[0] * sx, oy + p[1] * sy);
          g.lineTo(ox + q[0] * sx, oy + q[1] * sy);
        }
      }
    }
    g.stroke();
  }

  function paintBase() {
    dpr = Math.min(devicePixelRatio, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return false;
    // the tile stretches to its own 5:3 box; a backdrop covers its box without distorting the massif
    sx = w / (NX - 1);
    sy = h / (NY - 1);
    if (style.cover) {
      sx = sy = Math.max(sx, sy);
      ox = (w - sx * (NX - 1)) / 2;
      oy = (h - sy * (NY - 1)) / 2;
    }
    for (const c of [canvas, base]) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    const g = base.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.lineWidth = 1;
    for (let m = Math.ceil(BASE_M / 10 + 0.5) * 10; m < SUMMIT_M; m += 10) {
      g.strokeStyle = m % 50 === 0 ? style.major : style.minor;
      trace(g, unitsAt(m));
    }
    return true;
  }

  function draw(altitude: number) {
    const level = Math.max(0.05, Math.min(PEAK - 0.08, unitsAt(altitude)));
    if (Math.abs(level - last) < 0.01) return;
    last = level;
    const g = canvas.getContext("2d")!;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.drawImage(base, 0, 0);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.strokeStyle = style.amberColor ?? "#f8c000";
    g.lineWidth = style.amber;
    trace(g, level);
  }

  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  new ResizeObserver(() => {
    if (paintBase()) {
      last = -1;
      draw(pending);
    }
  }).observe(canvas);
  let pending = 0;
  return (altitude: number) => {
    pending = altitude;
    if (visible && w) draw(altitude);
  };
}
