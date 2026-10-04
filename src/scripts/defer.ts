/* Offscreen canvases paint after the first load, not inside it: twenty tabs opened at once all boot together. */

/** Calls paint once el nears the viewport or the main thread goes idle, whichever comes first, then on every resize.
    A ResizeObserver reports the first size itself, so paint runs once at the start, not twice. */
export function paintWhenNear(el: Element, paint: () => void) {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    near.disconnect();
    new ResizeObserver(paint).observe(el);
  };
  const near = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && start(), { rootMargin: "100% 0px" });
  near.observe(el);
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 4000 });
  else setTimeout(start, 2000);
}
