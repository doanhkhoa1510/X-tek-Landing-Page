/* Mount Zion's relief as numbers: no Three.js here, so the contour maps on the subpages load without the 3D scene. */

import { LIFT, ZION } from "./zion-data";

/* The real relief of Mount Zion, Jerusalem (SRTM, see scripts/build-zion.mjs): x runs east, z runs south,
   so the camera stands in the Hinnom valley and looks north up the hill. The Wikipedia summit point sits at the origin. */
const LIFT_H = (() => {
  const bin = atob(LIFT), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Uint16Array(bytes.buffer);
})();

export const PEAK = ZION.peak;
export const BASE_M = ZION.baseM, SUMMIT_M = ZION.summitM;
/** metres above sea level to world height */
export const unitsAt = (m: number) => ((m - BASE_M) / (SUMMIT_M - BASE_M)) * PEAK;

export function heightAt(x: number, z: number) {
  const fx = (x - ZION.x0) / ZION.step, fz = (z - ZION.z0) / ZION.step;
  if (fx < 0 || fz < 0 || fx >= ZION.cols - 1 || fz >= ZION.rows - 1) return 0;
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, k = j * ZION.cols + i;
  const a = LIFT_H[k], b = LIFT_H[k + 1], c = LIFT_H[k + ZION.cols], d = LIFT_H[k + ZION.cols + 1];
  return ((a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v) * (PEAK / 65535);
}
