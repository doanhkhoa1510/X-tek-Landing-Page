import { open } from './pw.mjs';
const out = process.argv[2];
const { browser, page } = await open('http://localhost:4321/');
await page.waitForTimeout(5200); await page.mouse.move(890, 360, { steps: 4 }); await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/desktop-hero.png` });
const y = await page.evaluate(() => document.querySelector('.summit').getBoundingClientRect().top + scrollY + 520);
await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(2200);
await page.screenshot({ path: `${out}/desktop-summit.png` });
await browser.close();
