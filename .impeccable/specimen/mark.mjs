import { chromium } from '/Users/persiedacoder/.dev-browser/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const logo = 'data:image/png;base64,' + fs.readFileSync('/private/tmp/claude-502/-Users-persiedacoder-coding-xt-landing-page/261f1f7d-953d-4e4a-a3f8-0ef6f0586f13/images/1.png').toString('base64');
const mark = fs.readFileSync('src/components/mark.svg.txt', 'utf8');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1240, height: 460 } });
await p.setContent(`<body style="margin:0;display:flex;gap:20px;background:#fff;padding:10px">
<div style="width:600px;height:330px;overflow:hidden;position:relative"><img src="${logo}" style="position:absolute;width:600px;left:0;top:-61px"></div>
<div style="width:600px;height:330px;position:relative;color:#103060"><svg viewBox="0 30 294 162" width=600 style="position:absolute;top:0;left:0">${mark}</svg>
<img src="${logo}" style="position:absolute;width:600px;left:0;top:-61px;opacity:.35;mix-blend-mode:multiply"></div></body>`);
await p.screenshot({ path: '.impeccable/specimen/mark-cmp.png' }); await b.close();
