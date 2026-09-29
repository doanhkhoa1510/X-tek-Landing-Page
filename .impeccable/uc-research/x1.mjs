import { open } from './pw.mjs';
const out = '/Users/persiedacoder/coding/xt-landing-page/.impeccable/review/r1';
const { browser, page } = await open('http://localhost:4321/');
const errs = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
await page.waitForTimeout(700); await page.screenshot({ path: `${out}/a-loader.png` });
await page.waitForTimeout(1700); await page.screenshot({ path: `${out}/b-exit.png` });
await page.waitForTimeout(2600); await page.mouse.move(820, 420, { steps: 5 }); await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/c-hero.png` });
let i = 0, last = -1;
while (i < 70) {
  await page.mouse.wheel(0, 600); await page.waitForTimeout(900);
  const y = await page.evaluate(() => Math.round(scrollY));
  await page.screenshot({ path: `${out}/s${String(i).padStart(2, '0')}-${y}.png` });
  if (y === last) break; last = y; i++;
}
console.log('frames', i, 'docH', await page.evaluate(() => document.documentElement.scrollHeight));
console.log(errs.slice(0, 20).join('\n') || 'no console errors');
await browser.close();
