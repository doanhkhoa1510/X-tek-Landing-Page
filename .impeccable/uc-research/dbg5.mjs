import { open } from './pw.mjs';
const { browser, page } = await open('http://localhost:4321/');
await page.waitForTimeout(5200);
for (const y of [600, 900, 1100]) {
  await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(1200);
  console.log(y, await page.evaluate(() => { const d = document.querySelector('.hero-dawn'); const r = d.getBoundingClientRect(); const cs = getComputedStyle(d); const st = document.querySelector('.hero-stage').getBoundingClientRect(); return `dawn top=${Math.round(r.top)} h=${Math.round(r.height)} tf=${cs.transform} op=${cs.opacity} vis=${cs.visibility} | stage top=${Math.round(st.top)} bottom=${Math.round(st.bottom)} | inline=${d.getAttribute('style')}`; }));
}
await browser.close();
