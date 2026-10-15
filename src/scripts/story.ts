/* XionTech · the story of Xion and the seven core values, on About us (moved off the landing page, #36).
   The topo tile's amber contour and the ridge rider follow the altimeter; the value track pins under the giant type. */

import { gsap } from "gsap";
import { $, onAltitude, rtl } from "./chrome";
import { mountTopo } from "./topo";
import { mountRidge } from "./ridge";

/** Call before the page's other scroll scenes: the value track pins, and pins come first. */
export function mountStory() {
  const topo = mountTopo($<HTMLCanvasElement>(".topo canvas"));
  const ride = mountRidge($<HTMLCanvasElement>(".ridge canvas"), $(".rider"));
  const riderAlt = $(".rider-alt"), riderTpl = riderAlt.dataset.tpl ?? "{n}";
  onAltitude((alt, shown) => {
    riderAlt.textContent = riderTpl.replace("{n}", shown);
    topo(alt);
  });

  const mm = gsap.matchMedia();
  mm.add({ wide: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
    const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean };
    if (!motion) return;

    // mindset: the story rises, then the mission
    gsap.from(".intro-right .lede, .mission, .intro-right .btn", {
      autoAlpha: 0, y: 28, duration: 1.1, ease: "expo.out", stagger: 0.08,
      scrollTrigger: { trigger: ".intro-right", start: "top 80%" },
    });
    gsap.from(".topo", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".topo", start: "top 85%" } });

    // core values: pinned; the value track slides past while the giant type drifts behind
    const track = $(".track"), giant = $(".giant");
    if (wide) {
      const clip = track.parentElement!;
      const dist = () => Math.max(0, track.scrollWidth - clip.clientWidth);
      gsap.timeline({
        scrollTrigger: { trigger: ".routes", start: "top top", end: () => `+=${Math.max(innerHeight * 0.8, dist() * 1.15)}`, pin: true, scrub: true, invalidateOnRefresh: true, onUpdate: (s) => ride(s.progress) },
      })
        .to(track, { x: () => (rtl ? dist() : -dist()), ease: "none" }, 0)
        .to(giant, { x: () => (rtl ? 1 : -1) * Math.max(0, giant.scrollWidth - innerWidth * 0.9), ease: "none" }, 0);
    } else {
      gsap.to(giant, { xPercent: rtl ? 45 : -45, ease: "none", scrollTrigger: { trigger: ".routes", start: "top bottom", end: "bottom top", scrub: true, onUpdate: (s) => ride(s.progress) } });
    }
    gsap.from(".svc > *", {
      autoAlpha: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.035,
      scrollTrigger: { trigger: ".routes-band", start: wide ? "top 70%" : "top 85%" },
    });
  });
}
