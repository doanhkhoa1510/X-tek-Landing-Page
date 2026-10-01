import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ZION } from "./zion-data";
import { heightAt, PEAK, SUMMIT_M } from "./relief";

/* ---------- terrain ---------- */

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
/* ---------- places on the mountain ---------- */

// chip words come from the label layer's data-labels, in the page's language
export const CAMPS = [
  { id: "plano", x: -1.5, z: 4.5 },
  { id: "hcmc", x: 2.4, z: 3.6 },
  { id: "danang", x: 3.4, z: 2.4 },
] as const;

type Station = { pos: [number, number, number]; look: [number, number, number] };
// the top of Mount Zion sits at ZION.peakAt (x 0.75, z -4); the dive and the summit frame it, not the origin
const HERO: Station[] = [
  { pos: [-2.5, 5.4, 20], look: [-5.2, 3.2, 0] }, // base camp: the whole hill from the Hinnom valley, right of the headline
  { pos: [1.4, 9.4, 8], look: [0.4, 5.8, -4] }, // the dive: up the south face to the crest
];
const SUMMIT: Station = { pos: [0.75, 14.5, 21], look: [0.75, 4.6, -4] }; // the crest centred in the gap between headline and brief form

export type Rig = { scale: number; shift: number; glow: number; arcs: number };
export type Scene = {
  rig: Rig;
  setHero: (p: number) => void;
  setMode: (m: "hero" | "summit") => void;
  setActive: (on: boolean) => void;
  setFocus: (id: string | null) => void;
  labels: HTMLElement[];
};

export function mountMountain(canvas: HTMLCanvasElement, labelLayer: HTMLElement): Scene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 768;
  if (small) {
    HERO[0] = { pos: [0, 6.8, 25], look: [0, 1.6, 0] };
    HERO[1] = { pos: [1.1, 9.8, 9], look: [0.7, 5.4, -4] };
    SUMMIT.pos = [2.6, 10, 16];
    SUMMIT.look = [1.1, 6.2, -4];
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(0x030813, 1);

  const scene = new THREE.Scene();
  // background (not only the clear color): the bloom pass restores the clear color outside a render target,
  // which double-encodes it to #1c324d; a scene background is cleared in the right color space every frame
  scene.background = new THREE.Color(0x030813);
  scene.fog = new THREE.FogExp2(0x030813, 0.035);
  const camera = new THREE.PerspectiveCamera(small ? 54 : 40, innerWidth / innerHeight, 0.1, 200);
  const massif = new THREE.Group();
  scene.add(massif);

  /* points terrain: snow-white dots, glacier-blue in the valleys */
  const positions: number[] = [];
  const heights: number[] = [];
  const normals: number[] = [];
  const STEP = small ? 0.105 : 0.07;
  const EXT = 15;
  for (let x = -EXT; x <= EXT; x += STEP) {
    for (let z = -EXT * 0.7; z <= EXT * 0.75; z += STEP) {
      const jx = x + (hash(x, z) - 0.5) * STEP;
      const jz = z + (hash(z, x) - 0.5) * STEP;
      const h = heightAt(jx, jz);
      if (h < 0.05 && hash(jx * 3, jz * 7) > 0.06) continue;
      positions.push(jx, h, jz);
      heights.push(h / PEAK);
      const e = 0.12;
      const nx = heightAt(jx - e, jz) - heightAt(jx + e, jz), nz = heightAt(jx, jz - e) - heightAt(jx, jz + e);
      const len = Math.hypot(nx, 2 * e, nz);
      normals.push(nx / len, (2 * e) / len, nz / len);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("h", new THREE.Float32BufferAttribute(heights, 1));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

  const terrainMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixel: { value: renderer.getPixelRatio() },
      uClimb: { value: -1 },
      uFade: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute float h;
      uniform float uTime, uPixel, uClimb, uFade;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec3 valley = vec3(0.08, 0.2, 0.62);
        vec3 snow = vec3(0.9, 0.93, 1.0);
        vec3 c = mix(valley, snow, smoothstep(0.1, 0.9, h));

        // rim light: slopes seen edge-on catch the dawn (high) or the glacier glow (low)
        vec4 mvp = modelViewMatrix * vec4(position, 1.0);
        vec3 nv = normalize(normalMatrix * normal);
        float rim = pow(1.0 - abs(dot(nv, normalize(-mvp.xyz))), 3.0);
        vec3 rimCol = mix(vec3(0.16, 0.42, 1.0), vec3(1.0, 0.62, 0.16), smoothstep(0.35, 0.8, h));
        c += rimCol * rim * 1.1;

        // faint contour bands
        float band = abs(fract(h * 12.0) - 0.5);
        c += vec3(0.16, 0.26, 0.6) * smoothstep(0.05, 0.0, band - 0.45) * step(0.05, h);

        // the altitude line: one amber contour at the height the visitor has climbed
        float line = smoothstep(0.018, 0.0, abs(h - uClimb));
        c = mix(c, vec3(1.0, 0.76, 0.0) * 1.25, line);

        vColor = c;
        vec3 p = position;
        p.y += sin(uTime * 0.35 + position.x * 0.6) * 0.018;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = min((0.65 + h * 1.35) * uPixel * (14.0 / -mv.z), 2.4 * uPixel);
        vAlpha = uFade * smoothstep(44.0, 8.0, -mv.z) * smoothstep(1.2, 5.0, -mv.z) * (0.3 + h * 0.46 + rim * 0.45 + line * 0.6)
          * smoothstep(15.0, 10.5, length(position.xz)) * smoothstep(11.2, 7.5, position.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(vColor, (1.0 - d * 2.0) * vAlpha);
      }`,
  });
  massif.add(new THREE.Points(geo, terrainMat));

  /* light: amber dawn behind the ridge, glacier rim along the valley floor */
  const glowMat = (color: THREE.Color, cx: number, cy: number, sx: number, sy: number, power: number) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uGain: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform float uGain; varying vec2 vUv; void main(){
        vec2 p = (vUv - vec2(${cx.toFixed(2)}, ${cy.toFixed(2)})) * vec2(${sx.toFixed(2)}, ${sy.toFixed(2)});
        float edge = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) * smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
        float g = exp(-dot(p, p) * ${power.toFixed(2)}) * edge * uGain;
        gl_FragColor = vec4(vec3(${color.r.toFixed(3)}, ${color.g.toFixed(3)}, ${color.b.toFixed(3)}) * g, g);
      }`,
    });
  const dawnMat = glowMat(new THREE.Color(1.0, 0.5, 0.08), 0.5, 0.42, 1.5, 3.4, 7.0);
  const dawn = new THREE.Mesh(new THREE.PlaneGeometry(40, 18), dawnMat);
  dawn.position.set(0.5, 4.6, -9);
  massif.add(dawn);
  const rimMat = glowMat(new THREE.Color(0.12, 0.34, 1.0), 0.5, 0.5, 1.2, 5.0, 6.0);
  const rim = new THREE.Mesh(new THREE.PlaneGeometry(50, 16), rimMat);
  rim.rotation.x = -Math.PI / 2;
  rim.position.set(0, -0.3, -1);
  massif.add(rim);

  /* stars */
  const starPos: number[] = [];
  for (let i = 0; i < 1600; i++) starPos.push((hash(i, 1) - 0.5) * 150, hash(i, 2) * 50 + 4, -hash(i, 3) * 70 - 12);
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xc6d2f0, size: 0.08, transparent: true, opacity: 0.6, depthWrite: false }));
  scene.add(stars);

  /* routes to the summit */
  const [sx, sz] = ZION.peakAt;
  const summit = new THREE.Vector3(sx, heightAt(sx, sz) + 0.12, sz);
  const arcMat = (gain: number) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uGain: { value: 0 }, uBase: { value: gain }, uLean: { value: new THREE.Vector2() } },
      vertexShader: `attribute float t; attribute float offset; uniform vec2 uLean; varying float vT; varying float vO;
        void main(){
          vT = t; vO = offset;
          vec3 p = position;
          float bend = sin(t * 3.14159);
          p.x += uLean.x * bend * 1.2;
          p.y -= uLean.y * bend * 0.7;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `uniform float uTime, uGain, uBase; varying float vT; varying float vO;
        void main(){
          float head = fract(uTime * 0.14 + vO);
          float trail = smoothstep(head - 0.28, head, vT) * step(vT, head);
          vec3 col = mix(vec3(1.0, 0.42, 0.1), vec3(0.97, 0.75, 0.0), trail);
          gl_FragColor = vec4(col, (0.14 + trail) * uGain * uBase);
        }`,
    });
  const campArcs = arcMat(1);
  function addArc(start: THREE.Vector3, lift: number, offset: number, mat: THREE.ShaderMaterial) {
    const mid = start.clone().lerp(summit, 0.5);
    mid.y += lift;
    const pts = new THREE.QuadraticBezierCurve3(start, mid, summit).getPoints(160);
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setAttribute("t", new THREE.Float32BufferAttribute(pts.map((_, k) => k / 160), 1));
    g.setAttribute("offset", new THREE.Float32BufferAttribute(pts.map(() => offset), 1));
    massif.add(new THREE.Line(g, mat));
  }

  /* camps: amber beacon, pulsing ring, chip label */
  const labels: HTMLElement[] = [];
  const words: Record<string, string> = JSON.parse(labelLayer.dataset.labels ?? "{}");
  const anchors: { el: HTMLElement; pos: THREE.Vector3; id: string; kind: "camp" | "summit" }[] = [];
  function chip(text: string, kind: string, id: string) {
    const el = document.createElement("div");
    el.className = `chip chip-${kind}`;
    el.dataset.id = id;
    el.innerHTML = "<span></span><i></i>";
    el.firstElementChild!.textContent = text;
    labelLayer.appendChild(el);
    labels.push(el);
    return el;
  }
  const beacons = new Map<string, THREE.Mesh>();
  const ringGeo = new THREE.RingGeometry(0.2, 0.25, 48);
  const beaconMat = () => new THREE.MeshBasicMaterial({ color: 0xf8c000, side: THREE.DoubleSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  function beacon(pos: THREE.Vector3, id: string) {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), beaconMat());
    const ring = new THREE.Mesh(ringGeo, beaconMat());
    for (const m of [dot, ring]) {
      m.rotation.x = -Math.PI / 2;
      m.position.copy(pos).add(new THREE.Vector3(0, 0.03, 0));
      massif.add(m);
    }
    beacons.set(id, ring);
  }
  CAMPS.forEach((c, i) => {
    const pos = new THREE.Vector3(c.x, heightAt(c.x, c.z) + 0.05, c.z);
    beacon(pos, c.id);
    addArc(pos, 1.6 + i * 0.5, i / 3 + 0.1, campArcs);
    anchors.push({ el: chip(words[c.id] ?? c.id, "camp", c.id), pos, id: c.id, kind: "camp" });
  });
  beacon(summit, "summit");
  anchors.push({ el: chip(words.summit ?? `${SUMMIT_M} m`, "summit", "summit"), pos: summit, id: "summit", kind: "summit" });

  /* post */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // tight radius and a high threshold: glow on the rim, the beacons, and the arcs only, never a sky-wide haze
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), small ? 0.5 : 0.55, 0.18, 0.72);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* state */
  const rig: Rig = { scale: 1, shift: 0, glow: 1, arcs: 1 };
  let hero = 0, mode: "hero" | "summit" = "hero", focus: string | null = null, active = true;
  const mouse = new THREE.Vector2(), lean = new THREE.Vector2();
  addEventListener("pointermove", (e) => mouse.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5), { passive: true });

  const pos = new THREE.Vector3(), look = new THREE.Vector3(), tPos = new THREE.Vector3(), tLook = new THREE.Vector3(), v = new THREE.Vector3();
  function target() {
    if (mode === "summit") {
      tPos.fromArray(SUMMIT.pos);
      tLook.fromArray(SUMMIT.look);
      return;
    }
    const e = hero * hero * (3 - 2 * hero);
    tPos.fromArray(HERO[0].pos).lerp(v.fromArray(HERO[1].pos), e);
    tLook.fromArray(HERO[0].look).lerp(v.fromArray(HERO[1].look), e);
  }
  target();
  pos.copy(tPos);
  look.copy(tLook);

  const clock = new THREE.Clock();
  let raf = 0;
  function frame() {
    raf = 0;
    if (!active || document.hidden) return;
    const t = reduceMotion ? 0 : clock.getElapsedTime();
    target();
    const k = reduceMotion ? 1 : 0.07;
    pos.lerp(tPos, k);
    look.lerp(tLook, k);
    camera.position.set(pos.x + mouse.x * (reduceMotion ? 0 : 0.9), pos.y - mouse.y * (reduceMotion ? 0 : 0.45), pos.z);
    camera.lookAt(look);

    massif.scale.setScalar(rig.scale);
    massif.position.x = rig.shift;
    dawnMat.uniforms.uGain.value = 0.32 * rig.glow;
    rimMat.uniforms.uGain.value = 0.2 * rig.glow;
    terrainMat.uniforms.uTime.value = t;
    terrainMat.uniforms.uClimb.value = mode === "summit" ? 0.985 : hero > 0.02 ? 0.04 + hero * 0.94 : -1;
    lean.lerp(mouse, reduceMotion ? 0 : 0.03);
    for (const m of [campArcs]) {
      m.uniforms.uTime.value = t;
      m.uniforms.uGain.value = rig.arcs * (mode === "summit" ? 0.8 : 1 - hero * 0.6);
      m.uniforms.uLean.value.set(lean.x, lean.y);
    }
    beacons.forEach((ring, id) => {
      const on = focus === id;
      const pulse = reduceMotion ? 0.4 : (t * 0.8 + (id.length % 3) * 0.33) % 1;
      ring.scale.setScalar((1 + pulse * 1.6) * (on ? 1.5 : 1));
      (ring.material as THREE.MeshBasicMaterial).opacity = (on ? 1 : 1 - pulse) * rig.arcs;
    });

    const w = innerWidth, h = innerHeight;
    for (const a of anchors) {
      v.copy(a.pos).multiplyScalar(rig.scale);
      v.x += rig.shift;
      v.project(camera);
      const onScreen = v.z < 1 && Math.abs(v.x) < 0.98 && Math.abs(v.y) < 0.95;
      let show = onScreen && rig.arcs > 0.5;
      if (a.kind === "camp") show &&= mode === "hero" ? hero < 0.35 : true;
      if (a.kind === "summit") show &&= mode === "summit" || hero > 0.45;
      a.el.classList.toggle("is-on", show);
      a.el.classList.toggle("is-focus", focus === a.id);
      a.el.style.transform = `translate3d(${(((v.x + 1) / 2) * w).toFixed(1)}px, ${(((1 - v.y) / 2) * h).toFixed(1)}px, 0)`;
    }

    composer.render();
    raf = requestAnimationFrame(frame);
  }
  const kick = () => {
    if (!raf && active && !document.hidden) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("visibilitychange", kick);
  kick();

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
    composer.setSize(innerWidth, innerHeight);
  });

  return {
    rig,
    labels,
    setHero: (p) => (hero = Math.max(0, Math.min(1, p))),
    // hero and summit are never on screen together, so the camera changes station unseen: no swing on arrival
    setMode: (m) => {
      if (m === mode) return;
      mode = m;
      target();
      pos.copy(tPos);
      look.copy(tLook);
    },
    setActive: (on) => {
      active = on;
      labelLayer.classList.toggle("is-hidden", !on);
      kick();
    },
    setFocus: (id) => (focus = id),
  };
}
