import { open } from './pw.mjs';
const { browser, page } = await open('https://unitedcarriers.com/');
await page.waitForTimeout(6500);
await page.mouse.move(200, 300);
await page.screenshot({ path: 'hover/top-header.png', clip: { x: 0, y: 0, width: 1440, height: 110 } });
const hov = async (sel, name, pad = 40) => {
  const el = page.locator(sel).first(); const bb = await el.boundingBox(); if (!bb) return console.log('no', sel);
  const clip = { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y - pad), width: bb.width + pad * 2, height: bb.height + pad * 2 };
  await page.screenshot({ path: `hover/${name}-0.png`, clip });
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 6 });
  for (const t of [120, 300, 700]) { await page.waitForTimeout(t === 120 ? 120 : t === 300 ? 180 : 400); await page.screenshot({ path: `hover/${name}-${t}.png`, clip }); }
  const st = await el.evaluate(e => { const s = getComputedStyle(e); return { bg: s.backgroundColor, c: s.color, tr: s.transition, r: s.borderRadius, h: e.offsetHeight, inner: e.innerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '<svg/>').slice(0, 700) }; });
  console.log(name, JSON.stringify(st));
  await page.mouse.move(200, 300, { steps: 4 }); await page.waitForTimeout(600);
};
await hov('a:has-text("TALK WITH US")', 'talk');
await hov('a:has-text("OUR SERVICES")', 'svc');
await hov('a:has-text("WORK WITH US")', 'work');
await hov('[data-link-random]', 'shuffle', 10);
// menu open
await page.locator('.header-menu-toggle').click(); await page.waitForTimeout(250);
await page.screenshot({ path: 'hover/menu-250.png', clip: { x: 300, y: 0, width: 800, height: 480 } });
await page.waitForTimeout(900);
await page.screenshot({ path: 'hover/menu-open.png', clip: { x: 300, y: 0, width: 800, height: 480 } });
await hov('.header-menu-list a >> nth=1', 'menu-link', 20);
await page.locator('.header-menu-toggle').click(); await page.waitForTimeout(900);
// scroll down then up to see header behavior
await page.mouse.wheel(0, 2500); await page.waitForTimeout(1500);
await page.screenshot({ path: 'hover/hdr-down.png', clip: { x: 0, y: 0, width: 1440, height: 120 } });
await page.mouse.wheel(0, -300); await page.waitForTimeout(1200);
await page.screenshot({ path: 'hover/hdr-up.png', clip: { x: 0, y: 0, width: 1440, height: 120 } });
const hs = await page.evaluate(() => { const h = document.querySelector('.header'); const s = getComputedStyle(h); return { cls: h.className, op: s.opacity, tf: s.transform, bg: s.backgroundColor, bd: s.backdropFilter }; });
console.log('hdr', JSON.stringify(hs));
await browser.close();
