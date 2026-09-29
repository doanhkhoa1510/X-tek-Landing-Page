import { open } from './pw.mjs';
const out = process.argv[2]; const W = +process.argv[3] || 1440, H = +process.argv[4] || 900; const mobile = W < 600;
const { browser, page } = await open('http://localhost:4321/', { w: W, h: H, mobile });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.waitForTimeout(5200);
if (!mobile) await page.mouse.move(W * 0.62, H * 0.4, { steps: 4 });
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/00-hero.png` });
const marks = await page.evaluate(() => {
  const top = (s) => { const el = document.querySelector(s); return el ? Math.round(el.getBoundingClientRect().top + scrollY) : 0; };
  return { heroMid: Math.round(innerHeight * 0.55), dawn: Math.round(innerHeight * 1.0), intro: top('.intro') + 120, routes: top('.routes'), ascent: top('.ascent'), camps: top('.camps'), proof: top('.proof'), faq: top('.faq'), summit: top('.summit'), foot: top('.foot') };
});
const shots = [['01-dive', marks.heroMid], ['02-dawn', marks.dawn], ['03-intro', marks.intro], ['04-routes', marks.routes + W * 0.3], ['05-ascent', marks.ascent + 500], ['06-dusk', marks.camps - 200], ['07-camps', marks.camps + 420], ['08-map', marks.camps + 900], ['09-proof', marks.proof + 60], ['10-faq', marks.faq], ['11-summit', marks.summit + 520], ['12-foot', marks.foot + 200]];
for (const [n, y] of shots) {
  await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(1300);
  await page.screenshot({ path: `${out}/${n}.png` });
}
console.log(JSON.stringify(marks), errs.join(' | ') || 'no errors');
await browser.close();
