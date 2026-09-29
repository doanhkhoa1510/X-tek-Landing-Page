import { open } from './pw.mjs';
const { browser, page } = await open('http://localhost:4321/');
await page.waitForTimeout(5000);
const r = await page.evaluate(async () => {
  const c = document.getElementById('mountain');
  const bmp = await createImageBitmap(c);
  const o = new OffscreenCanvas(bmp.width, bmp.height); const g = o.getContext('2d'); g.drawImage(bmp, 0, 0);
  const at = (x, y) => Array.from(g.getImageData(x * bmp.width, y * bmp.height, 1, 1).data.slice(0, 3));
  return { size: [bmp.width, bmp.height], topLeft: at(0.02, 0.2), topMid: at(0.3, 0.15), gl: (() => { const gl = c.getContext('webgl2'); return gl ? gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info')?.UNMASKED_RENDERER_WEBGL ?? gl.RENDERER) : 'n/a'; })() };
});
console.log(JSON.stringify(r));
await browser.close();
