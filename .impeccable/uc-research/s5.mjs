import { open } from './pw.mjs';
{ const { browser, page } = await open('https://unitedcarriers.com/');
  await page.waitForTimeout(2600);
  for (let i = 0; i < 16; i++) { await page.screenshot({ path: `burst/b${String(i).padStart(2,'0')}.png`, clip: { x: 380, y: 380, width: 600, height: 500 } }); await page.waitForTimeout(130); }
  // intro text scrub: go to home-intro and capture mid reveal
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 1300); await page.waitForTimeout(1200);
  await page.screenshot({ path: 'burst/intro-a.png' });
  await page.mouse.wheel(0, 220); await page.waitForTimeout(900);
  await page.screenshot({ path: 'burst/intro-b.png' });
  await browser.close(); }
{ const { browser, page } = await open('https://unitedcarriers.com/', { w: 390, h: 844, mobile: true });
  await page.waitForTimeout(7000);
  await page.screenshot({ path: 'mobile/m00.png' });
  for (let i = 1; i < 9; i++) { await page.evaluate((y) => window.scrollBy(0, y), 1400); await page.waitForTimeout(900); await page.screenshot({ path: `mobile/m${String(i).padStart(2,'0')}.png` }); }
  await browser.close(); }
