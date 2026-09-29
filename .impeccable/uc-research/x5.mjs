import { open } from './pw.mjs';
const out = process.argv[2]; const W = +process.argv[3], H = +process.argv[4];
const { browser, page } = await open('http://localhost:4321/', { w: W, h: H, mobile: W < 600 });
await page.waitForTimeout(5200);
for (const [n, y] of [['02-dawn', Math.round(H * 0.85)], ['02b-dawn-late', Math.round(H * 1.08)]]) {
  await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(1300); await page.screenshot({ path: `${out}/${n}.png` });
}
await browser.close();
