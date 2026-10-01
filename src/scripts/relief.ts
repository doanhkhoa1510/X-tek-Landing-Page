/* Mount Zion's relief as numbers: no Three.js here, so the contour maps on the subpages load without the 3D scene. */

import { LIFT, ZION } from "./zion-data";

/* The real relief of Mount Zion, Jerusalem (SRTM, see scripts/build-zion.mjs): x runs east, z runs south,
   so the camera stands in the Hinnom valley and looks north up the hill. The Wikipedia summit point sits at the origin;
   the Western Hill's plateau runs on north of it, higher than the summit. */
const LIFT_H = (() => {
  const bin = atob(LIFT), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Uint16Array(bytes.buffer);
})();

export const PEAK = ZION.peak;
export const BASE_M = ZION.baseM, SUMMIT_M = ZION.summitM;
/** the highest ground on the grid, in metres */
export const TOP_M = BASE_M + (ZION.top / PEAK) * (SUMMIT_M - BASE_M);
/** metres above sea level to world height */
export const unitsAt = (m: number) => ((m - BASE_M) / (SUMMIT_M - BASE_M)) * PEAK;

export function heightAt(x: number, z: number) {
  const fx = (x - ZION.x0) / ZION.step, fz = (z - ZION.z0) / ZION.step;
  if (fx < 0 || fz < 0 || fx >= ZION.cols - 1 || fz >= ZION.rows - 1) return 0;
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, k = j * ZION.cols + i;
  const a = LIFT_H[k], b = LIFT_H[k + 1], c = LIFT_H[k + ZION.cols], d = LIFT_H[k + ZION.cols + 1];
  return ((a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v) * (ZION.top / 65535);
}

const smooth = (a: number, b: number, t: number) => {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return k * k * (3 - 2 * k);
};
/** The 2-D skylines' hill: the real relief, with the plateau and the far valley sides tapered away
    so Mount Zion stands alone on the routes band and the trek. The hero and the contour maps use heightAt. */
export function domeAt(x: number, z: number) {
  const mx = x * ZION.metersPerUnit, mz = z * ZION.metersPerUnit;
  return heightAt(x, z) * (1 - smooth(420, 950, Math.hypot(mx, mz < 0 ? mz * 1.5 : mz)));
}
