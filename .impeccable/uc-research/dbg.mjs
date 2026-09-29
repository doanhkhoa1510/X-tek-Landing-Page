import { open } from './pw.mjs';
const { browser, page } = await open('http://localhost:4321/', { w: 390, h: 844, mobile: true });
await page.waitForTimeout(5200);
console.log(await page.evaluate(() => {
  const q = (s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `${s}: ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} disp=${cs.display} op=${cs.opacity} vis=${cs.visibility}`; };
  return ['.hdr', '.hdr-row', '.logo', '.menu', '.menu-toggle', '.hdr-cta'].map(q).join('\n') + '\nhdr class=' + document.querySelector('.hdr').className;
}));
await browser.close();
