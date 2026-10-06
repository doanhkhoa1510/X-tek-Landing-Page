/* UI check: screenshots and element facts for every component, on every page, at three widths.
   Runs inside dev-browser (QuickJS sandbox, not Node). Do not run directly: use `npm run ui:check`,
   which fills the config line below and copies the output to .ui-check/. */

const CFG = __CFG__; // { base, only, widths }

const VIEWPORTS = { desktop: [1440, 900], tablet: [834, 1112], mobile: [390, 844] };
const SECTIONS = ["top", "platform", "work", "why", "faq", "camps", "summit"];
// sections further down a subpage, shot like the landing sections (About us holds the story and the values since #36)
const PAGE_SECTIONS = { "/about-us/": ["mindset", "values", "team"] };
const PAGES = ["/about-us/", "/careers/", "/contact-us/", "/faqs/", "/support/", "/privacy-policy/", "/ar/"];
// fixed or shared chrome, captured as single elements
const PARTS = { header: ".hdr", footer: "footer" };
const SETTLE = 3000; // headless paint lags behind scroll

const wanted = (name) => !CFG.only || name.includes(CFG.only);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const report = [];

// facts that pixels hide: size, visibility, colors, theme
const facts = (page, sel) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return {
      rect: [r.x, r.y, r.width, r.height].map(Math.round),
      opacity: s.opacity, visibility: s.visibility, display: s.display,
      color: s.color, background: s.backgroundColor, theme: el.dataset.on || null,
      overflowX: document.documentElement.scrollWidth > innerWidth,
    };
  }, sel);

async function shoot(page, name, el) {
  const buf = el ? await page.locator(el).first().screenshot() : await page.screenshot();
  await saveScreenshot(buf, `ui-check/${name}.png`);
}

const page = await browser.newPage();
for (const vp of CFG.widths) {
  const [w, h] = VIEWPORTS[vp];
  await page.setViewportSize({ width: w, height: h });

  // landing: one viewport shot per section, scrolled to its top
  await page.goto(CFG.base + "/", { waitUntil: "networkidle" });
  await wait(SETTLE); // loader
  for (const id of SECTIONS) {
    const name = `${vp}/landing-${id}`;
    if (!wanted(name)) continue;
    await page.evaluate((id) => window.scrollTo(0, document.getElementById(id).getBoundingClientRect().top + scrollY), id);
    await wait(SETTLE);
    await shoot(page, name);
    report.push({ name, ...(await facts(page, `#${id}`)), header: await facts(page, ".hdr") });
  }
  for (const [part, sel] of Object.entries(PARTS)) {
    const name = `${vp}/part-${part}`;
    if (!wanted(name)) continue;
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: "center" }), sel);
    await wait(SETTLE);
    if (await page.locator(sel).count()) await shoot(page, name, sel);
    report.push({ name, ...(await facts(page, sel)) });
  }

  // subpages: top of each page
  for (const path of PAGES) {
    const name = `${vp}/page${path.replace(/\/$/, "").replace(/\//g, "-")}`;
    if (!wanted(name)) continue;
    await page.goto(CFG.base + path, { waitUntil: "networkidle" });
    await wait(SETTLE);
    await shoot(page, name);
    report.push({ name, ...(await facts(page, "main")), header: await facts(page, ".hdr") });
    for (const id of PAGE_SECTIONS[path] ?? []) {
      await page.evaluate((id) => window.scrollTo(0, document.getElementById(id).getBoundingClientRect().top + scrollY), id);
      await wait(SETTLE);
      await shoot(page, `${name}-${id}`);
      report.push({ name: `${name}-${id}`, ...(await facts(page, `#${id}`)) });
    }
    // the closing ask band, shared by subpages
    if (await page.locator(".page-cta").count()) {
      await page.evaluate(() => document.querySelector(".page-cta").scrollIntoView({ block: "center" }));
      await wait(SETTLE);
      await shoot(page, `${name}-cta`, ".page-cta");
      report.push({ name: `${name}-cta`, ...(await facts(page, ".page-cta")) });
    }
  }
}

await writeFile("ui-check/report.json", JSON.stringify(report, null, 2));
for (const r of report) {
  const warn = [r.opacity === "0" && "hidden", r.overflowX && "x-overflow", !r.rect && "missing"].filter(Boolean);
  console.log(`${warn.length ? "WARN" : "ok  "} ${r.name}${warn.length ? "  " + warn.join(", ") : ""}`);
}
