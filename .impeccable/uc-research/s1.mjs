import { open } from './pw.mjs';
const { browser, page } = await open('https://unitedcarriers.com/');
for (const t of [300, 1200, 2500, 4500]) { await page.waitForTimeout(t === 300 ? 300 : t - [300,1200,2500,4500][[300,1200,2500,4500].indexOf(t)-1]); await page.screenshot({ path: `intro-${t}.png` }); }
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const g = {};
  for (const k of ['gsap','ScrollTrigger','Lenis','lenis','THREE','barba','Swup','LocomotiveScroll','Splitting','SplitText','anime','Webflow','__NEXT_DATA__','__NUXT__','Alpine','Vue','React','Rive','Lottie','lottie']) g[k] = typeof window[k] !== 'undefined';
  const scripts = [...document.scripts].map(s => s.src || ('inline:' + s.textContent.slice(0, 80)));
  const links = [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href);
  const fonts = [...document.fonts].map(f => `${f.family} ${f.weight} ${f.style} ${f.status}`);
  const root = getComputedStyle(document.documentElement);
  const vars = {};
  for (const sheet of document.styleSheets) { try { for (const r of sheet.cssRules) { if (r.selectorText === ':root' || r.selectorText === 'html' ) { for (const p of r.style) if (p.startsWith('--')) vars[p] = r.style.getPropertyValue(p).trim(); } } } catch (e) {} }
  const cs = (sel) => { const el = document.querySelector(sel); if (!el) return null; const s = getComputedStyle(el); return { tag: el.tagName, cls: el.className?.toString().slice(0,80), text: el.textContent.trim().slice(0, 80), font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lh: s.lineHeight, ls: s.letterSpacing, tt: s.textTransform, color: s.color, bg: s.backgroundColor, stretch: s.fontStretch }; };
  return { title: document.title, g, scripts, links, fonts, vars, body: cs('body'), h1: cs('h1'), h2: cs('h2'), h3: cs('h3'), p: cs('p'), a: cs('nav a') || cs('header a'), btn: cs('button') , docH: document.documentElement.scrollHeight, htmlCls: document.documentElement.className, bodyCls: document.body.className };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
