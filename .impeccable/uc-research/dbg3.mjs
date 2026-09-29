import { open } from './pw.mjs';
const { browser, page } = await open('http://localhost:4321/', { w: 390, h: 844, mobile: true });
await page.waitForTimeout(5200);
console.log(await page.evaluate(() => {
  const fixedAnc = (e) => { for (let p = e; p; p = p.parentElement) if (getComputedStyle(p).position === 'fixed') return true; return false; };
  const out = [];
  for (const e of document.querySelectorAll('main *, footer *, main, footer')) {
    if (fixedAnc(e)) continue;
    const r = e.getBoundingClientRect();
    out.push([Math.round(r.right), `${e.tagName}.${(e.className?.baseVal ?? e.className).toString().slice(0, 30)} w=${Math.round(r.width)} white-space=${getComputedStyle(e).whiteSpace}`]);
  }
  out.sort((a, b) => b[0] - a[0]);
  return out.slice(0, 12).map((x) => x.join(' ')).join('\n');
}));
await browser.close();
