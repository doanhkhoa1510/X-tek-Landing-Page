import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ZION } from "./zion-data";
import { heightAt, PEAK, SUMMIT_M } from "./relief";

/* ---------- terrain ---------- */

// the picture is drawn against the window's height, not CSS pixels: browser zoom changes CSS pixels, and dots or a glow
// sized in them crowded and brightened the ridge on zoom in, thinned and dimmed it on zoom out
const REF_H = 960; // a 1080p screen at 100% zoom, the size the look is tuned at
// the glow works at twice that height, the detail a Retina laptop gave it: fine enough to light lone dots, so the
// whole slope wears a soft haze around a bright crest, not a thin lit line
const BLOOM_H = REF_H * 2;

/** bloom whose blur runs at a fixed height, so the glow spreads over the same share of the picture at any size */
class SteadyBloom extends UnrealBloomPass {
  private read = { uStep: { value: new THREE.Vector2() }, uTaps: { value: 1 } };
  constructor(...args: ConstructorParameters<typeof UnrealBloomPass>) {
    super(...args);
    // a sharp screen holds more pixels than the glow reads: one sample per glow pixel caught a lone dot on some frames
    // and missed it on others, so dots flashed with a halo. The glow reads the average of every pixel it covers
    Object.assign(this.highPassUniforms, this.read);
    this.materialHighPassFilter.fragmentShader = /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform vec3 defaultColor;
      uniform float defaultOpacity, luminosityThreshold, smoothWidth;
      uniform vec2 uStep;
      uniform int uTaps;
      varying vec2 vUv;
      void main() {
        vec4 texel = vec4(0.0);
        for (int i = 0; i < 4; i++) {
          if (i >= uTaps) break;
          for (int j = 0; j < 4; j++) {
            if (j >= uTaps) break;
            // each tap falls between four pixels, so the filter averages them
            texel += texture2D(tDiffuse, vUv + vec2(float(2 * i + 1 - uTaps), float(2 * j + 1 - uTaps)) * uStep);
          }
        }
        texel /= float(uTaps * uTaps);
        float alpha = smoothstep(luminosityThreshold, luminosityThreshold + smoothWidth, luminance(texel.xyz));
        gl_FragColor = mix(vec4(defaultColor.rgb, defaultOpacity), texel, alpha);
      }`;
    // each blur reaches a fifth further than three.js's 3, 5, 7, 9, 11 pixels: a wider glow at the same strength
    this.separableBlurMaterials.forEach((m, i) => {
      const r = [3, 5, 7, 9, 11][i] * 1.2, n = Math.ceil(r);
      m.defines.KERNEL_RADIUS = n;
      m.uniforms.gaussianCoefficients.value = Array.from({ length: n }, (_, x) => Math.exp((-0.5 * x * x) / (r * r)));
      m.needsUpdate = true;
    });
  }
  setSize(width: number, height: number) {
    super.setSize(Math.round((width / height) * BLOOM_H), BLOOM_H);
    this.read.uStep.value.set(1 / width, 1 / height);
    this.read.uTaps.value = Math.min(4, Math.max(1, Math.ceil(height / BLOOM_H)));
  }
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
/* ---------- places on the mountain ---------- */

// chip words come from the label layer's data-labels, in the page's language
// three teams, three ways up, one summit: Plano straight up the south face from the Hinnom valley, Da Nang from the
// north-west (the plateau by Jaffa Gate), Ho Chi Minh City from the north-east (the slope over the Kidron)
// Plano stands right of the headline, not on the south-west ridge: the headline grows upward with its language
// (Vietnamese, Japanese, Hindi run taller than English) and would cover a camp on its side; right to left, the mirror keeps it clear too
export const CAMPS = [
  { id: "plano", x: 3, z: 3.5 },
  { id: "hcmc", x: 8.8, z: -7.45 },
  { id: "danang", x: -5.4, z: -4.1 },
] as const;

type Station = { pos: [number, number, number]; look: [number, number, number] };
// the top of Mount Zion sits at ZION.peakAt (the origin); the plateau behind it runs on north, higher
const HERO: Station[] = [
  { pos: [-2.5, 5.4, 20], look: [-5.2, 3.2, 0] }, // base camp: the whole hill from the Hinnom valley, right of the headline
  { pos: [1.4, 9.4, 8], look: [0.4, 5.8, -4] }, // the dive: up the south face to the crest
];
const SUMMIT: Station = { pos: [0, 14.5, 21], look: [0, 4.6, -4] }; // the crest centred in the gap between headline and brief form

export type Rig = { scale: number; shift: number; glow: number; arcs: number };
export type Scene = {
  rig: Rig;
  setHero: (p: number) => void;
  setMode: (m: "hero" | "summit") => void;
  setActive: (on: boolean) => void;
  setFocus: (id: string | null) => void;
  labels: HTMLElement[];
};

/** onFail runs if the browser refuses a WebGL context when the scene first needs one. */
export function mountMountain(canvas: HTMLCanvasElement, labelLayer: HTMLElement, onFail: () => void): Scene | null {
  if (!("WebGLRenderingContext" in window)) return null;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 768;
  if (small) {
    HERO[0] = { pos: [-12, 7, 12], look: [-1, 0, -4] }; // from the south-west the three camps line up in depth, above the headline
    HERO[1] = { pos: [1.1, 9.8, 9], look: [0.7, 5.4, -4] };
    SUMMIT.pos = [2.6, 10, 16];
    SUMMIT.look = [1.1, 6.2, -4];
  }
  // the camps are placed for a 1.9:1 window; narrower ones pan the hero east so Ho Chi Minh City stays in frame
  const pan = small ? 0 : Math.max(0, (1.9 - innerWidth / innerHeight) * 4.5);
  HERO[0].pos[0] += pan;
  HERO[0].look[0] += pan;
  // right to left, the headline sits on the right: the whole scene mirrors across the summit (the camera here, the massif
  // in the frame loop), so the hill rises on the left and every camp keeps its place in the picture
  const flip = document.documentElement.dir === "rtl" ? -1 : 1;
  if (flip < 0) {
    for (const s of [...HERO, SUMMIT]) {
      s.pos[0] = 2 * ZION.peakAt[0] - s.pos[0];
      s.look[0] = 2 * ZION.peakAt[0] - s.look[0];
    }
  }
  const ratio = () => Math.min(devicePixelRatio, small ? 1.5 : 2);

  const scene = new THREE.Scene();
  // background (not only the clear color): the bloom pass restores the clear color outside a render target,
  // which double-encodes it to #1c324d; a scene background is cleared in the right color space every frame
  scene.background = new THREE.Color(0x030813);
  scene.fog = new THREE.FogExp2(0x030813, 0.035);
  const camera = new THREE.PerspectiveCamera(small ? 62 : 40, innerWidth / innerHeight, 0.1, 200);
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
      if (Math.hypot(jx, jz) > 15) continue; // past the shader's radial fade: invisible
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
  // a dot keeps the same share of the on-screen gap to its neighbors at any zoom, window, or camera: the dot cover,
  // and with it the ridge's brightness, stays put (the gap a step of terrain makes at one unit away, in drawing pixels)
  const gap = (fov: number, step: number, height: number) => (step * height) / (2 * Math.tan((fov * Math.PI) / 360));
  const dotScale = () => gap(camera.fov, STEP, innerHeight * ratio()) / gap(40, 0.07, REF_H);
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
      uDot: { value: dotScale() },
      uClimb: { value: -1 },
      uFade: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute float h;
      uniform float uTime, uDot, uClimb, uFade;
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
        // the plateau north of the summit runs higher than Mount Zion: it never grows past the summit's dots, and haze takes it
        float hc = min(h, 1.0);
        gl_PointSize = min((0.65 + hc * 1.35) * uDot * (14.0 / -mv.z), 2.4 * uDot);
        vAlpha = uFade * smoothstep(36.0, 12.0, -mv.z) * smoothstep(1.2, 5.0, -mv.z) * (0.3 + hc * 0.46 + rim * 0.45 + line * 0.6)
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
  const title = document.getElementById("hero-title");
  // the headline's text runs, not its blocks: right-aligned and short lines leave room beside them
  // a run's client rect is the font's whole ascent-to-descent box, far above the capitals it paints: trim each run
  // to its inked glyphs, or a tag sitting just over the first line (short windows) is taken for a collision
  const titleRuns: { range: Range; node: Text; top: number; bottom: number }[] = [];
  if (title) {
    const it = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    for (let n = it.nextNode(); n; n = it.nextNode()) {
      if (!n.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      titleRuns.push({ range, node: n as Text, top: 0, bottom: 0 });
    }
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      document.fonts.ready.then(() => {
        for (const run of titleRuns) {
          const s = getComputedStyle(run.node.parentElement!);
          ctx.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
          const text = run.node.textContent!.trim();
          const m = ctx.measureText(s.textTransform === "uppercase" ? text.toLocaleUpperCase(document.documentElement.lang) : text);
          run.top = Math.max(0, m.fontBoundingBoxAscent - m.actualBoundingBoxAscent);
          run.bottom = Math.max(0, m.fontBoundingBoxDescent - m.actualBoundingBoxDescent);
        }
      });
    }
  }
  const words: Record<string, string> = JSON.parse(labelLayer.dataset.labels ?? "{}");
  const anchors: { el: HTMLElement; pos: THREE.Vector3; id: string; kind: "camp" | "summit"; w: number; dx: number }[] = [];
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
    anchors.push({ el: chip(words[c.id] ?? c.id, "camp", c.id), pos, id: c.id, kind: "camp", w: 0, dx: 0 });
  });
  beacon(summit, "summit");
  anchors.push({ el: chip(words.summit ?? `${SUMMIT_M} m`, "summit", "summit"), pos: summit, id: "summit", kind: "summit", w: 0, dx: 0 });

  /* a chip box never runs off the screen: it keeps EDGE px inside the label layer, its tag sliding sideways (--nudge)
     while the leader stays on the point it marks. Widths are read here (mount, fonts, resize), never per frame. */
  const EDGE = 8;
  let layerW = 0;
  function measureChips() {
    layerW = labelLayer.clientWidth;
    for (const a of anchors) a.w = a.el.offsetWidth;
  }
  measureChips();
  document.fonts.ready.then(measureChips);

  /* quiet oval (#38): behind the headline the frame fades toward the night before the bloom, the way a mask over the
     finished picture would, so the words keep their contrast and no glow forms under them; full brightness outside */
  const quietU = {
    tDiffuse: { value: null },
    uQuiet: { value: new THREE.Vector4(0, 0, 1, 1) },
    uOn: { value: 0 },
    uView: { value: new THREE.Vector2(innerWidth, innerHeight) },
    uSky: { value: new THREE.Color(0x030813) },
  };
  const quietPass = () =>
    new ShaderPass(new THREE.ShaderMaterial({
      uniforms: quietU,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform vec4 uQuiet;
        uniform float uOn;
        uniform vec2 uView;
        uniform vec3 uSky;
        varying vec2 vUv;
        void main() {
          vec4 c = texture2D(tDiffuse, vUv);
          float q = length((vec2(vUv.x, 1.0 - vUv.y) * uView - uQuiet.xy) / uQuiet.zw);
          float k = mix(1.0, q < 0.55 ? mix(0.4, 0.55, q / 0.55) : mix(0.55, 1.0, min(1.0, (q - 0.55) / 0.45)), uOn);
          // the eye sees light capped at white: cap it, then fade toward the night in display light, not linear light
          vec3 seen = mix(c.rgb, min(c.rgb, vec3(1.0)), smoothstep(1.0, 0.55, k));
          gl_FragColor = vec4(mix(uSky, seen, pow(k, 2.2)), c.a);
        }`,
    }));

  /* gpu: the renderer and its post chain hold hundreds of MB of GPU memory, so they exist only while the scene can be
     seen. A tab opened in the background builds nothing; a hidden tab frees them after RELEASE_MS. Scrolling away from
     the night keeps them: a rebuild costs ~0.1 s of main thread, a stall mid-scroll. The scene graph above stays in
     memory and uploads again on the next build. */
  type Gpu = { renderer: THREE.WebGLRenderer; composer: EffectComposer; quiet: ShaderPass; ready: boolean };
  const RELEASE_MS = 10_000;
  let gpu: Gpu | null = null, failed = false, releaseTimer = 0;
  function build() {
    let renderer: THREE.WebGLRenderer;
    try {
      // no antialias: the composer draws into its own targets, so an MSAA canvas buffer would only hold memory;
      // the default GPU: "high-performance" wakes the discrete GPU on dual-GPU laptops for every open tab
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    } catch {
      failed = true;
      onFail();
      return;
    }
    renderer.setPixelRatio(ratio());
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.setClearColor(0x030813, 1);
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const quiet = quietPass();
    composer.addPass(quiet);
    // tight radius and a high threshold: glow on the rim, the beacons, and the arcs only, never a sky-wide haze
    composer.addPass(new SteadyBloom(new THREE.Vector2(innerWidth, innerHeight), small ? 0.48 : 0.52, 0.18, 0.72));
    composer.addPass(new OutputPass());
    const g: Gpu = (gpu = { renderer, composer, quiet, ready: false });
    // the browser may take the context back (too many tabs): free ours, and build again when the scene is wanted
    canvas.addEventListener("webglcontextlost", () => {
      if (gpu !== g) return;
      release();
      sync();
    }, { once: true });
    // shaders compile off the main thread where the browser can, so a rebuild mid-scroll does not stall a frame
    renderer.compileAsync(scene, camera).then(() => {
      if (gpu !== g) return;
      g.ready = true;
      kick();
    });
  }
  function release() {
    if (!gpu) return;
    const { renderer, composer } = gpu;
    gpu = null;
    composer.passes.forEach((p) => p.dispose());
    composer.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    // a lost context never comes back on its canvas: the next build draws on a fresh one
    const fresh = canvas.cloneNode() as HTMLCanvasElement;
    canvas.replaceWith(fresh);
    canvas = fresh;
  }
  // every landing tab that comes into view tells the others; a hidden tab frees its GPU as soon as two have been shown
  // since it hid, so clicking through twenty tabs holds two scenes at most, and flipping between two never rebuilds
  const peers = "BroadcastChannel" in window ? new BroadcastChannel("xt-hero") : null;
  let shownSince = 0;
  peers?.addEventListener("message", () => {
    if (!document.hidden || !gpu || ++shownSince < 2) return;
    clearTimeout(releaseTimer);
    releaseTimer = 0;
    release();
  });
  function sync() {
    if (!document.hidden) {
      clearTimeout(releaseTimer);
      releaseTimer = 0;
      if (!gpu && !failed) build();
      kick();
    } else if (gpu && !releaseTimer) {
      releaseTimer = window.setTimeout(() => {
        releaseTimer = 0;
        release();
      }, RELEASE_MS);
    }
  }

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
    if (!active || document.hidden || !gpu?.ready) return;
    const t = reduceMotion ? 0 : clock.getElapsedTime();
    target();
    const k = reduceMotion ? 1 : 0.07;
    pos.lerp(tPos, k);
    look.lerp(tLook, k);
    camera.position.set(pos.x + mouse.x * (reduceMotion ? 0 : 0.9), pos.y - mouse.y * (reduceMotion ? 0 : 0.45), pos.z);
    camera.lookAt(look);

    massif.scale.set(rig.scale * flip, rig.scale, rig.scale);
    massif.position.x = rig.shift * flip;
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
    const head = titleRuns.flatMap((run) =>
      [...run.range.getClientRects()].map((r) => ({ left: r.left, right: r.right, top: r.top + run.top, bottom: r.bottom - run.bottom })),
    );
    // the quiet oval sits on the headline's ink wherever the layout puts it, and fades out with it (hero 0.16 to 0.42, app.ts)
    let qL = Infinity, qR = -Infinity, qT = Infinity, qB = -Infinity;
    for (const r of head) {
      qL = Math.min(qL, r.left);
      qR = Math.max(qR, r.right);
      qT = Math.min(qT, r.top);
      qB = Math.max(qB, r.bottom);
    }
    quietU.uOn.value = head.length && mode === "hero" ? 1 - Math.min(1, Math.max(0, (hero - 0.16) / 0.26)) : 0;
    if (head.length) quietU.uQuiet.value.set((qL + qR) / 2, (qT + qB) / 2, Math.max((qR - qL) * 0.76, 1), Math.max((qB - qT) * 0.92, h * 0.2));
    quietU.uView.value.set(w, h);
    gpu.quiet.enabled = quietU.uOn.value > 0; // past the first screen and at the summit the pass costs nothing
    massif.updateMatrixWorld();
    for (const a of anchors) {
      v.copy(a.pos).applyMatrix4(massif.matrixWorld).project(camera);
      const onScreen = v.z < 1 && Math.abs(v.x) < 0.98 && Math.abs(v.y) < 0.95;
      let show = onScreen && rig.arcs > 0.5;
      if (a.kind === "camp") show &&= mode === "hero" ? hero < 0.35 : true;
      // a tag never sits on the headline (some languages start it higher): the beacon and its arc stay, the tag steps aside
      if (show && a.kind === "camp" && head.length) {
        const x = ((v.x + 1) / 2) * w, y = ((1 - v.y) / 2) * h, half = a.el.offsetWidth / 2, top = y - 8 - a.el.offsetHeight;
        show = !head.some((r) => x + half > r.left && x - half < r.right && y - 8 > r.top && top < r.bottom);
      }
      if (a.kind === "summit") show &&= mode === "summit" || hero > 0.45;
      a.el.classList.toggle("is-on", show);
      a.el.classList.toggle("is-focus", focus === a.id);
      const sx = ((v.x + 1) / 2) * w, sy = ((1 - v.y) / 2) * h;
      let dx = 0;
      if (a.w) {
        const left = sx - a.w / 2;
        if (left < EDGE) dx = EDGE - left;
        else if (left + a.w > layerW - EDGE) dx = layerW - EDGE - (left + a.w);
      }
      if (dx !== a.dx) {
        a.dx = dx;
        a.el.style.setProperty("--nudge", `${dx.toFixed(1)}px`);
      }
      a.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
    }

    gpu.composer.render();
    raf = requestAnimationFrame(frame);
  }
  const kick = () => {
    if (!raf && active && !document.hidden && gpu?.ready) raf = requestAnimationFrame(frame);
  };
  const onVisibility = () => {
    if (!document.hidden) {
      shownSince = 0;
      peers?.postMessage("shown");
    }
    sync();
  };
  document.addEventListener("visibilitychange", onVisibility);
  onVisibility();

  function fit() {
    measureChips();
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    terrainMat.uniforms.uDot.value = dotScale();
    gpu?.renderer.setPixelRatio(ratio());
    gpu?.renderer.setSize(innerWidth, innerHeight, false);
    gpu?.composer.setPixelRatio(ratio());
    gpu?.composer.setSize(innerWidth, innerHeight);
  }
  addEventListener("resize", fit);
  // browser zoom, or a move to another screen, changes the pixel ratio, and not always with a resize
  const watchRatio = () =>
    matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener("change", () => {
      fit();
      watchRatio();
    }, { once: true });
  watchRatio();

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
      sync();
    },
    setFocus: (id) => (focus = id),
  };
}
