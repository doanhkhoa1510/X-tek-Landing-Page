import { open } from './pw.mjs';
const { browser, page } = await open('http://localhost:4321/');
await page.waitForTimeout(5000);
await page.addStyleTag({ content: 'main,header,.hud,.chips,.cursor{visibility:hidden!important}' });
await page.waitForTimeout(300);
const shot = (await page.screenshot()).toString('base64');
const px = await page.evaluate(async (b64) => {
  const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
  const at = (x, y) => '#' + Array.from(g.getImageData(x, y, 1, 1).data.slice(0, 3)).map(v => v.toString(16).padStart(2, '0')).join('');
  return { tl: at(20, 150), mid: at(400, 120), low: at(300, 850), peakSky: at(1200, 120) };
}, shot);
console.log('canvas only:', JSON.stringify(px));
await browser.close();
