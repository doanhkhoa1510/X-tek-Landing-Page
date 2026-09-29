// usage: node sheet.mjs <dir> <prefix-out> [cols] [perSheet] [thumbW]
import { chromium } from '/Users/persiedacoder/.dev-browser/node_modules/playwright/index.mjs';
import fs from 'node:fs'; import path from 'node:path';
const [dir, out, cols = 3, per = 9, tw = 520] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
const b = await chromium.launch(); const p = await b.newPage();
for (let s = 0; s * per < files.length; s++) {
  const chunk = files.slice(s * per, s * per + per);
  const html = `<body style="margin:0;background:#888;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:4px;font:12px monospace">` +
    chunk.map(f => `<figure style="margin:0;position:relative"><img style="width:${tw}px;display:block" src="data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}"><figcaption style="position:absolute;top:0;left:0;background:#ff0;padding:2px 4px">${f}</figcaption></figure>`).join('') + '</body>';
  await p.setContent(html); await p.setViewportSize({ width: cols * tw + (cols - 1) * 4, height: 400 });
  await p.screenshot({ path: `${out}-${s}.png`, fullPage: true });
}
await b.close(); console.log('sheets', Math.ceil(files.length / per));
