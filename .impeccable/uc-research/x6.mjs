import { open } from './pw.mjs';
const out = process.argv[2]; const W = +process.argv[3], H = +process.argv[4];
const { browser, page } = await open('http://localhost:4321/', { w: W, h: H, mobile: W < 600 });
await page.waitForTimeout(5200);
const y = await page.evaluate(() => document.querySelector('.ascent').getBoundingClientRect().top + scrollY + 500);
await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(1500); await page.screenshot({ path: `${out}/05-ascent.png` });
await browser.close();
