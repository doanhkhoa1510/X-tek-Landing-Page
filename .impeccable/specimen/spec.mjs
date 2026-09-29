import { chromium } from '/Users/persiedacoder/.dev-browser/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const nm = '/Users/persiedacoder/coding/xt-landing-page/node_modules/@fontsource-variable';
const f = (p) => 'data:font/woff2;base64,' + fs.readFileSync(p).toString('base64');
const pick = (dir, re) => `${nm}/${dir}/files/` + fs.readdirSync(`${nm}/${dir}/files`).find((x) => re.test(x));
const saira = pick('saira', /saira-latin-wdth-normal\.woff2$/), mart = pick('martian-mono', /martian-mono-latin-wdth-normal\.woff2$/), host = pick('host-grotesk', /host-grotesk-latin-wght-normal\.woff2$/), arch = pick('archivo', /archivo-latin-wdth-normal\.woff2$/);
const logo = 'data:image/png;base64,' + fs.readFileSync('/private/tmp/claude-502/-Users-persiedacoder-coding-xt-landing-page/261f1f7d-953d-4e4a-a3f8-0ef6f0586f13/images/1.png').toString('base64');
const html = `<style>
@font-face{font-family:S;src:url(${f(saira)});font-weight:100 900;font-stretch:50% 125%}
@font-face{font-family:M;src:url(${f(mart)});font-weight:100 800;font-stretch:75% 112.5%}
@font-face{font-family:H;src:url(${f(host)});font-weight:300 800}
@font-face{font-family:A;src:url(${f(arch)});font-weight:100 900;font-stretch:62% 125%}
body{margin:0;background:#030813;color:#fff;padding:30px;display:grid;grid-template-columns:1fr 300px;gap:30px}
h1{margin:0 0 6px;text-transform:uppercase;line-height:.92;letter-spacing:-.01em;font-size:84px}
.s{font-family:S;font-weight:760;font-stretch:125%} .s2{font-family:S;font-weight:700;font-stretch:112%} .a{font-family:A;font-weight:800;font-stretch:125%}
.m{font-family:M;font-stretch:100%;font-size:12px;letter-spacing:.02em;text-transform:uppercase;color:#aab} p{font-family:H;font-size:17px;max-width:46ch;color:#c8cfdd}
.w{background:#fff;color:#0b1526;padding:24px} .w h1{color:#0b1526} .g{color:#a7adb8} .pill{display:inline-block;font-family:M;font-size:12px;text-transform:uppercase;padding:13px 26px;border-radius:99px;background:#fff;color:#0b1526;margin-right:8px}.pill.o{background:none;border:1px solid #fff5;color:#fff}
</style><div><div class=m>Saira 125% / 760</div><h1 class=s>Every product<br>is a climb.</h1>
<div class=m>Saira 112% / 700</div><h1 class=s2>Every product<br>is a climb.</h1>
<div class=m>Archivo 125% / 800 (current)</div><h1 class=a>Every product<br>is a climb.</h1>
<p>XionTechs engineers digital products from first sketch to launch. Product engineering, AI, low-code, and cloud, from one team in Texas and Vietnam.</p>
<span class=pill>Talk with us</span><span class="pill o">Our services</span>
<div class="m" style="margin-top:14px">Dallas, TX · 09:41 CT &nbsp; Ho Chi Minh City · 21:41 ICT &nbsp; ALT 2,140 M</div>
<div class=w style="margin-top:20px"><h1 class=s style="font-size:56px"><span class=g>Tech made simple.</span><br>Solutions made powerful.</h1><p style="color:#35405a">One accountable team from first sketch to launch.</p></div></div>
<div><img src="${logo}" width=300></div>`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 1100 } });
await p.setContent(html); await p.waitForTimeout(400); await p.screenshot({ path: '.impeccable/specimen/type.png', fullPage: true }); await b.close();
