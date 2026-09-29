import { open } from "../../uc-research/pw.mjs";
const kind = process.argv[2] ?? "d", mobile = kind === "m";
const size = { m: { w: 390, h: 844, mobile: true }, x: { w: 1920, h: 1080 }, d: { w: 1600, h: 1000 }, t: { w: 900, h: 1100 } }[kind];
const dir = new URL(".", import.meta.url).pathname + kind + "-";
const { browser, page } = await open("http://localhost:4321/", size);
const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
await page.waitForTimeout(6500);
const top = await page.evaluate(() => document.querySelector("#ascent").getBoundingClientRect().top + scrollY);
const hgt = await page.evaluate(() => document.querySelector("#ascent").offsetHeight);
const H = await page.evaluate(() => innerHeight);
let i = 0;
for (const f of [0.05, 0.3, 0.52, 0.72, 0.9]) {
  await page.evaluate((y) => window.scrollTo(0, y), top + (hgt - H) * f);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: dir + i++ + ".png" });
}
console.log(JSON.stringify({ kind, errs, hgt }));
await browser.close();
