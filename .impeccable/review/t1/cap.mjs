import { open } from "../../uc-research/pw.mjs";
const mobile = process.argv[2] === "m", dir = new URL(".", import.meta.url).pathname + (mobile ? "m-" : "d-");
const { browser, page } = await open("http://localhost:4321/", mobile ? { w: 390, h: 844, mobile: true } : {});
const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
await page.waitForTimeout(6500);
const top = await page.evaluate(() => document.querySelector(".route").getBoundingClientRect().top + scrollY);
const hgt = await page.evaluate(() => document.querySelector(".route").offsetHeight);
const H = await page.evaluate(() => innerHeight);
for (const [f, n] of [[0.08, "a"], [0.45, "b"], [0.97, "c"]]) {
  await page.evaluate((y) => window.scrollTo(0, y), top + hgt * f - H / 2);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: dir + n + ".png" });
}
console.log(JSON.stringify({ errs, hgt }));
await browser.close();
