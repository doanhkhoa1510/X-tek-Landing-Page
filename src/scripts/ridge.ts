/* The routes sky: the massif's silhouette in dots, standing on the service band like
   UC's truck stands on its road. The amber climber rides the ridge from the left base
   to the summit while the service track slides past, then carries on down the ascent rail. */

import { domeAt } from "./relief";
import { paintWhenNear } from "./defer";

const X0 = -14, X1 = 14, N = 280;

export function mountRidge(canvas: HTMLCanvasElement, rider: HTMLElement) {
  const sil = new Float32Array(N);
  let top = 0, topI = 0;
  for (let i = 0; i < N; i++) {
    const x = X0 + ((X1 - X0) * i) / (N - 1);
    let m = 0;
    for (let z = -10; z <= 10; z += 0.25) m = Math.max(m, domeAt(x, z));
    sil[i] = m;
    if (m > top) [top, topI] = [m, i];
  }
  const TOP_U = topI / (N - 1);
  const at = (u: number) => {
    const f = Math.max(0, Math.min(1, u)) * (N - 1), i = Math.floor(f), t = f - i;
    return sil[i] * (1 - t) + sil[Math.min(N - 1, i + 1)] * t;
  };
  let w = 0, h = 0, last = 0;
  const yOf = (height: number) => h - (height / (top * 1.06)) * h;

  function draw() {
    const dpr = Math.min(devicePixelRatio, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const g = canvas.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const step = w < 768 ? 6 : 7;
    const body = new Path2D(), ridge = new Path2D();
    for (let x = step / 2; x < w; x += step) {
      const edge = yOf(at(x / w));
      for (let y = h - step / 2; y > edge; y -= step) {
        const p = y - edge < step * 1.5 ? ridge : body;
        p.moveTo(x + 1.2, y);
        p.arc(x, y, p === ridge ? 1.3 : 1.05, 0, Math.PI * 2);
      }
    }
    g.fillStyle = "rgba(16, 48, 96, 0.16)";
    g.fill(body);
    g.fillStyle = "rgba(16, 48, 96, 0.62)";
    g.fill(ridge);
    place(last);
  }

  /** t: 0 at the left base, 1 on the summit. */
  function place(t: number) {
    last = t;
    if (!w) return;
    const u = 0.06 + t * (TOP_U - 0.06); // from the west shoulder, across the Hinnom valley, to the top of Mount Zion
    const y = Math.min(yOf(at(u)), h - 12); // keep the diamond clear of the band edge at the base
    rider.style.transform = `translate3d(${(u * w).toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }

  paintWhenNear(canvas, draw);
  return place;
}
