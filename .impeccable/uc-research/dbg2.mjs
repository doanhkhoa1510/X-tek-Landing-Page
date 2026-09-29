import { open } from './pw.mjs';
const { browser, page } = await open('http://localhost:4321/', { w: 390, h: 844, mobile: true });
await page.waitForTimeout(5200);
console.log(await page.evaluate(() => {
  const out = [];
  for (const e of document.querySelectorAll('body *')) {
    const r = e.getBoundingClientRect();
    if (r.right > 392 && r.width > 0) {
      let p = e.parentElement, clipped = false;
      while (p) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip') { clipped = true; break; } p = p.parentElement; }
      if (!clipped) out.push(`${e.tagName}.${(e.className?.baseVal ?? e.className).toString().slice(0, 40)} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
    }
  }
  return `docW=${document.documentElement.scrollWidth}\n` + out.slice(0, 15).join('\n');
}));
await browser.close();
