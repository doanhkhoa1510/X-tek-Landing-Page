import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/* ---------- terrain ---------- */

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function ridged(x: number, y: number) {
  let sum = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 5; i++) {
    const n = 1 - Math.abs(noise(x * freq, y * freq) * 2 - 1);
    sum += n * n * amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum;
}

const PEAK = 6.4;
export function heightAt(x: number, z: number) {
  const r = Math.hypot(x, z * 1.2);
  const massif = Math.exp(-(r * r) / 17) * PEAK;
  const shoulders =
    Math.exp(-((x + 4.6) ** 2 + (z - 0.8) ** 2) / 5.5) * 2.7 +
    Math.exp(-((x - 5.2) ** 2 + (z + 1.6) ** 2) / 7.5) * 2.3 +
    Math.exp(-((x - 1.5) ** 2 + (z + 5) ** 2) / 9) * 1.8;
  const detail = ridged(x * 0.34 + 10, z * 0.34 + 3);
  return Math.max(0, (massif + shoulders) * (0.68 + detail * 0.45) - 0.15);
}

/* ---------- places on the mountain ---------- */

export const CAMPS = [
  { id: "dallas", name: "Dallas, Texas", coord: "32.78°N 96.80°W", x: -6.2, z: 6.2, primary: true },
  { id: "hcmc", name: "Ho Chi Minh City", coord: "10.78°N 106.69°E", x: 4.6, z: 7.2, primary: true },
  { id: "danang", name: "Da Nang", coord: "16.05°N 108.21°E", x: 7.4, z: 3.6, primary: false },
] as const;

export const ROUTES = [
  { name: "Product Engineering", x: -6.5, z: 6.2 },
  { name: "AI-Driven Analytics", x: 5.6, z: 6.8 },
  { name: "Product Co-Creation", x: -3.2, z: 8.4 },
  { name: "Staffing", x: 3, z: 8.8 },
  { name: "Custom Apps", x: -10.4, z: 0.6 },
  { name: "Low-code", x: 11, z: 2.4 },
  { name: "AI Solutions", x: -0.4, z: 9.8 },
  { name: "Cloud Computing", x: 8.8, z: 8.2 },
];

/** Camera stations, one per page section, in order. */
const STATIONS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [-2.5, 5.4, 20], look: [-5.2, 3.2, 0] }, // hero — whole massif
  { pos: [0.4, 7, 27], look: [0.4, -2.2, 4] }, // base camps — low, wide across both camps
  { pos: [-11, 7.5, 12], look: [0, 2.5, 2] }, // routes — flank view, all arcs visible
  { pos: [-6.5, 8.2, 6.5], look: [0, 4.6, 0] }, // ascent — on the ridge
  { pos: [5.5, 10, 7], look: [0, 5.8, 0] }, // proof — high traverse
  { pos: [1.6, 11.5, 4.2], look: [0, 6.4, 0] }, // summit — contact
];

export type Scene = {
  setStation: (value: number) => void;
  setFocus: (campId: string | null) => void;
  labels: { el: HTMLElement; pos: THREE.Vector3; kind: "camp" | "route" | "summit"; id: string }[];
};

export function mountMountain(canvas: HTMLCanvasElement, labelLayer: HTMLElement): Scene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 760;

  if (small) {
    // portrait: centre the massif in the upper half, above the headline
    STATIONS[0] = { pos: [0, 6.5, 24], look: [0, 0.8, 0] };
    STATIONS[1] = { pos: [0.4, 9, 32], look: [0.4, -3.5, 4] };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(0x0b1a36, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b1a36, 0.03);
  const camera = new THREE.PerspectiveCamera(small ? 52 : 40, innerWidth / innerHeight, 0.1, 200);

  /* points terrain */
  const positions: number[] = [];
  const heights: number[] = [];
  const STEP = small ? 0.11 : 0.072;
  const EXT = 15;
  for (let x = -EXT; x <= EXT; x += STEP) {
    for (let z = -EXT * 0.7; z <= EXT * 0.75; z += STEP) {
      const jx = x + (hash(x, z) - 0.5) * STEP;
      const jz = z + (hash(z, x) - 0.5) * STEP;
      const h = heightAt(jx, jz);
      if (h < 0.05 && hash(jx * 3, jz * 7) > 0.07) continue;
      positions.push(jx, h, jz);
      heights.push(h / PEAK);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("h", new THREE.Float32BufferAttribute(heights, 1));

  const terrainMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixel: { value: renderer.getPixelRatio() },
      uClimb: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float h;
      uniform float uTime, uPixel, uClimb;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec3 low = vec3(0.16, 0.26, 0.52);
        vec3 mid = vec3(0.55, 0.62, 0.9);
        vec3 snow = vec3(0.98, 0.92, 0.84);
        vec3 amber = vec3(0.97, 0.75, 0.0);
        vec3 c = h < 0.45 ? mix(low, mid, h / 0.45) : mix(mid, snow, (h - 0.45) / 0.55);

        // topographic contour lines — every altitude band glows faintly
        float band = abs(fract(h * 14.0) - 0.5);
        c += vec3(0.12, 0.13, 0.2) * smoothstep(0.06, 0.0, band - 0.44) * step(0.04, h);

        // climbed altitude turns amber as the visitor scrolls up the page
        float climbed = smoothstep(uClimb + 0.02, uClimb - 0.02, h) * step(0.04, h);
        c = mix(c, mix(c, amber, 0.6), climbed * 0.6);

        // slow breathing instead of a scan sweep
        c *= 0.92 + 0.08 * sin(uTime * 0.4 + position.x * 0.3 + position.z * 0.2);

        vColor = c;
        vec3 p = position;
        p.y += sin(uTime * 0.35 + position.x * 0.6) * 0.02;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = min((0.7 + h * 1.5) * uPixel * (14.0 / -mv.z), 2.6 * uPixel);
        vAlpha = smoothstep(42.0, 8.0, -mv.z) * smoothstep(1.5, 6.0, -mv.z) * (0.36 + h * 0.55) * smoothstep(15.0, 10.5, length(position.xz)) * smoothstep(11.2, 7.5, position.z);
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
  scene.add(new THREE.Points(geo, terrainMat));

  /* atmosphere behind the peak */
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(48, 24),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec2 vUv; void main(){
        vec2 p = (vUv - vec2(0.5, 0.3)) * vec2(1.8, 1.0);
        float edge = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x) * smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
        float g = exp(-dot(p, p) * 4.0) * 0.3 * edge;
        vec3 c = mix(vec3(0.96, 0.72, 0.58), vec3(0.2, 0.3, 0.62), smoothstep(0.15, 0.7, vUv.y));
        gl_FragColor = vec4(c * g, g);
      }`,
    }),
  );
  halo.position.set(0, 3.5, -10);
  scene.add(halo);

  /* stars */
  const starPos: number[] = [];
  for (let i = 0; i < 1400; i++) starPos.push((hash(i, 1) - 0.5) * 140, hash(i, 2) * 45 + 6, -hash(i, 3) * 70 - 12);
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x8fa3d6, size: 0.09, transparent: true, opacity: 0.55 })));

  /* soft glow sprite shared by every marker */
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.25, "rgba(255,255,255,0.55)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const glow = (color: number, size: number, opacity = 1) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
    sp.scale.setScalar(size);
    return sp;
  };

  /* summit, camps, routes */
  const summit = new THREE.Vector3(0, heightAt(0, 0) + 0.18, 0);
  const labels: Scene["labels"] = [];

  const arcMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uGain: { value: 0.35 }, uLean: { value: new THREE.Vector2() } },
    vertexShader: `attribute float t; attribute float offset; uniform vec2 uLean; varying float vT; varying float vO;
      void main(){
        vT = t; vO = offset;
        vec3 p = position;
        float bend = sin(t * 3.14159);          // ends stay anchored, the middle flexes
        p.x += uLean.x * bend * 1.4;
        p.y -= uLean.y * bend * 0.8;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `uniform float uTime, uGain; varying float vT; varying float vO;
      void main(){
        float head = fract(uTime * 0.07 + vO);
        float trail = smoothstep(head - 0.45, head, vT) * smoothstep(head + 0.05, head, vT);
        vec3 col = mix(vec3(0.96, 0.9, 0.81), vec3(0.97, 0.75, 0.0), vT);
        gl_FragColor = vec4(col, (0.08 + trail * 0.6) * uGain);
      }`,
  });

  function addArc(start: THREE.Vector3, lift: number, offset: number) {
    const mid = start.clone().lerp(summit, 0.5);
    mid.y += lift;
    const pts = new THREE.QuadraticBezierCurve3(start, mid, summit).getPoints(140);
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setAttribute("t", new THREE.Float32BufferAttribute(pts.map((_, k) => k / 140), 1));
    g.setAttribute("offset", new THREE.Float32BufferAttribute(pts.map(() => offset), 1));
    scene.add(new THREE.Line(g, arcMat));
  }

  function makeLabel(text: string, cls: string, sub?: string) {
    const el = document.createElement("div");
    el.className = `pin pin-${cls}`;
    el.innerHTML = sub ? `<b>${text}</b><span>${sub}</span>` : `<b>${text}</b>`;
    el.setAttribute("aria-hidden", "true");
    labelLayer.appendChild(el);
    return el;
  }

  ROUTES.forEach((r, i) => {
    const start = new THREE.Vector3(r.x, heightAt(r.x, r.z) + 0.05, r.z);
    addArc(start, 2.6 + i * 0.28, i / ROUTES.length);
    const dot = glow(0xf6e7cf, 0.5, 0.8);
    dot.position.copy(start);
    scene.add(dot);
    labels.push({ el: makeLabel(r.name, "route"), pos: start, kind: "route", id: r.name });
  });

  const campBeacons = new Map<string, THREE.Mesh>();
  const beams: THREE.Mesh[] = [];
  CAMPS.forEach((c) => {
    const pos = new THREE.Vector3(c.x, heightAt(c.x, c.z) + 0.05, c.z);
    const beam = glow(0xf8c000, 1.4, 0.9);
    beam.position.copy(pos).add(new THREE.Vector3(0, 0.25, 0));
    scene.add(beam);
    beams.push(beam);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.34, 64),
      new THREE.MeshBasicMaterial({ color: 0xf8c000, side: THREE.DoubleSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(pos).add(new THREE.Vector3(0, 0.03, 0));
    scene.add(ring);
    campBeacons.set(c.id, ring);
    labels.push({ el: makeLabel(c.name, "camp", c.coord), pos: pos.clone().add(new THREE.Vector3(0, 1.4, 0)), kind: "camp", id: c.id });
  });

  const summitMark = glow(0xf8c000, 1.6, 0.9);
  summitMark.position.copy(summit);
  scene.add(summitMark);
  labels.push({ el: makeLabel("Xion summit", "summit", "Get IT done"), pos: summit.clone().add(new THREE.Vector3(0, 0.5, 0)), kind: "summit", id: "summit" });

  /* post */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), small ? 0.45 : 0.55, 0.8, 0.45);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* camera state */
  let station = 0, smooth = 0;
  let focus: string | null = null;
  const mouse = new THREE.Vector2();
  const lean = new THREE.Vector2();
  addEventListener("pointermove", (e) => mouse.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5), { passive: true });

  const a = new THREE.Vector3(), b = new THREE.Vector3(), look = new THREE.Vector3(), v = new THREE.Vector3();
  function stationAt(t: number) {
    const i = Math.min(STATIONS.length - 2, Math.floor(t));
    const f = t - i;
    const e = f * f * (3 - 2 * f);
    a.fromArray(STATIONS[i].pos).lerp(b.fromArray(STATIONS[i + 1].pos), e);
    const la = new THREE.Vector3().fromArray(STATIONS[i].look);
    look.copy(la).lerp(new THREE.Vector3().fromArray(STATIONS[i + 1].look), e);
    return a;
  }

  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  function frame() {
    if (!running) return;
    const t = reduceMotion ? 0 : clock.getElapsedTime();
    smooth += (station - smooth) * (reduceMotion ? 1 : 0.04);

    const p = stationAt(Math.min(smooth, STATIONS.length - 1.0001));
    camera.position.set(p.x + mouse.x * (reduceMotion ? 0 : 1.1), p.y - mouse.y * (reduceMotion ? 0 : 0.5), p.z);
    camera.lookAt(look);

    terrainMat.uniforms.uTime.value = t;
    terrainMat.uniforms.uClimb.value = Math.max(0, (smooth - 2) / 3);
    arcMat.uniforms.uTime.value = t;
    arcMat.uniforms.uGain.value = THREE.MathUtils.lerp(0.12, 1, THREE.MathUtils.clamp(1 - Math.abs(smooth - 2), 0, 1)) ;
    summitMark.scale.setScalar(1.6 * (1 + Math.sin(t * 1.2) * 0.12));
    lean.lerp(mouse, reduceMotion ? 0 : 0.03);
    arcMat.uniforms.uLean.value.set(lean.x, lean.y);

    const campVis = THREE.MathUtils.clamp(1 - Math.abs(smooth - 1) * 1.6, 0, 1);
    beams.forEach((bm) => ((bm.material as THREE.SpriteMaterial).opacity = 0.9 * campVis));
    campBeacons.forEach((ring, id) => {
      const on = focus === id;
      const pulse = reduceMotion ? 1 : 1 + ((t * 0.22) % 1) * 3;
      ring.scale.setScalar(on ? pulse * 1.4 : pulse);
      (ring.material as THREE.MeshBasicMaterial).opacity = (on ? 0.9 : 0.6) * (1 - ((t * 0.22) % 1)) * campVis;
    });

    for (const l of labels) {
      v.copy(l.pos).project(camera);
      const onScreen = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      let show = onScreen;
      if (l.kind === "route") show &&= Math.abs(smooth - 2) < 0.6;
      if (l.kind === "camp") show &&= (smooth > 0.55 && smooth < 1.6) || l.id === focus;
      if (l.kind === "summit") show &&= smooth > 2.5 && (smooth < 3.6 || smooth > 4.6);
      l.el.style.opacity = show ? "1" : "0";
      l.el.classList.toggle("is-focus", l.id === focus);
      l.el.style.transform = `translate(${((v.x + 1) / 2) * innerWidth}px, ${((1 - v.y) / 2) * innerHeight}px)`;
    }

    composer.render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
    composer.setSize(innerWidth, innerHeight);
  });

  return {
    setStation: (value) => (station = Math.max(0, Math.min(STATIONS.length - 1, value))),
    setFocus: (id) => (focus = id),
    labels,
  };
}
