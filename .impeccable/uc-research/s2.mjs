import { open } from './pw.mjs';
const { browser, page } = await open('https://unitedcarriers.com/');
await page.waitForTimeout(6500);
await page.mouse.move(700, 450);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('docH', H);
const sections = await page.evaluate(() => [...document.querySelectorAll('section, [class*="section"]')].filter(e => e.offsetHeight > 200).slice(0, 40).map(e => { const r = e.getBoundingClientRect(); return `${e.tagName}.${e.className.toString().split(' ').slice(0,3).join('.')} top=${Math.round(r.top + scrollY)} h=${Math.round(r.height)} pos=${getComputedStyle(e).position}`; }));
console.log(sections.join('\n'));
let i = 0, last = -1;
while (i < 60) {
  await page.mouse.wheel(0, 540);
  await page.waitForTimeout(1100);
  const y = await page.evaluate(() => Math.round(window.lenis?.scroll ?? scrollY));
  await page.screenshot({ path: `scroll/s${String(i).padStart(2, '0')}-${y}.png` });
  if (y === last) break;
  last = y; i++;
}
console.log('frames', i);
await browser.close();
