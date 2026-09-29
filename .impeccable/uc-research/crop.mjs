import { chromium } from '/Users/persiedacoder/.dev-browser/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [src, out, x, y, w, h, s = '2'] = process.argv.slice(2); const k = +s;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w * k, height: +h * k } });
await p.setContent(`<body style="margin:0;overflow:hidden"><img style="transform-origin:0 0;transform:scale(${k}) translate(-${x}px,-${y}px);image-rendering:pixelated" src="data:image/png;base64,${fs.readFileSync(src).toString('base64')}">`);
await p.waitForTimeout(200); await p.screenshot({ path: out }); await b.close();
