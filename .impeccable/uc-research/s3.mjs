import { open } from './pw.mjs';
const { browser, page } = await open('https://unitedcarriers.com/');
await page.waitForTimeout(6500);
await page.mouse.move(300, 300);
const nav = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('header, nav, [class*="nav"], [class*="menu"], [class*="cursor"], [class*="header"]')) {
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    if (r.width === 0 && r.height === 0) continue;
    out.push(`${el.tagName}.${el.className.toString().slice(0, 60)} [${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}] pos=${s.position} op=${s.opacity} vis=${s.visibility} z=${s.zIndex} mix=${s.mixBlendMode} txt="${el.innerText?.replace(/\s+/g, ' ').slice(0, 70)}"`);
  }
  return out.slice(0, 40);
});
console.log(nav.join('\n'));
// hover buttons in hero
const btns = await page.$$('a, button');
const vis = [];
for (const b of btns) { const bb = await b.boundingBox(); if (bb && bb.y > 0 && bb.y < 900 && bb.width > 40) vis.push({ b, bb, t: (await b.innerText()).trim().slice(0, 30) }); }
console.log('visible links:', vis.map(v => `${v.t}@${Math.round(v.bb.x)},${Math.round(v.bb.y)} ${Math.round(v.bb.width)}x${Math.round(v.bb.height)}`).join(' | '));
for (const [i, v] of vis.slice(0, 6).entries()) {
  const clip = { x: Math.max(0, v.bb.x - 30), y: Math.max(0, v.bb.y - 30), width: v.bb.width + 60, height: v.bb.height + 60 };
  const before = await v.b.evaluate(e => { const s = getComputedStyle(e); return { bg: s.backgroundColor, c: s.color, bc: s.borderColor, tr: s.transition, tf: s.transform, r: s.borderRadius, pad: s.padding, font: s.fontFamily + ' ' + s.fontSize + ' ' + s.letterSpacing }; });
  await page.screenshot({ path: `hover/h${i}-a.png`, clip });
  await page.mouse.move(v.bb.x + v.bb.width / 2, v.bb.y + v.bb.height / 2, { steps: 8 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `hover/h${i}-b.png`, clip });
  const html = await v.b.evaluate(e => e.outerHTML.slice(0, 600));
  console.log(`\n#${i} ${v.t}\n before=${JSON.stringify(before)}\n html=${html}`);
  await page.mouse.move(700, 800, { steps: 4 }); await page.waitForTimeout(500);
}
// cursor element
const cur = await page.evaluate(() => { const c = [...document.querySelectorAll('*')].filter(e => /cursor/i.test(e.className?.toString?.() || '')).slice(0, 6); return c.map(e => e.tagName + '.' + e.className + ' :: ' + e.outerHTML.slice(0, 400)); });
console.log('\nCURSOR', cur.join('\n'));
await browser.close();
