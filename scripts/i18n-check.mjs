/* Reports, for every language, what its translators still owe and what they broke, against the English files.
   npm run i18n:check            missing keys and pages are listed; only broken ones fail the run
   npm run i18n:check -- --strict   missing keys and pages fail the run too
   Broken: a key English does not have, a {{placeholder}} or <tag> that differs from English, a value of the wrong shape. */

import { existsSync, readdirSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const strict = process.argv.includes("--strict");

// the locale codes from src/i18n/config.ts (English first, the source)
const config = readFileSync(new URL("src/i18n/config.ts", root), "utf8");
const codes = [...config.matchAll(/code: "([^"]+)"/g)].map((m) => m[1]);
const [source, ...targets] = codes;

const dir = (code) => new URL(`src/i18n/locales/${code}/`, root);
const json = (url) => JSON.parse(readFileSync(url, "utf8"));
const namespaces = readdirSync(dir(source)).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort();

/** Every leaf of a namespace as [dotted key, value]; arrays are one leaf (a list the translator may lengthen). */
function leaves(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? leaves(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]],
  );
}
// the {{placeholders}} and <tags> of a value (a list counts as one text: its lines may be regrouped)
const marks = (v) => [...(Array.isArray(v) ? v.join(" ") : String(v)).matchAll(/\{\{\s*\w+\s*\}\}|<\/?\w+>/g)].map((m) => m[0].replace(/\s/g, "")).sort().join(" ");
const shown = (v) => marks(v).replace(/<\/\w+> ?/g, "").trim() || "no placeholders";
const empty = (v) => v === "" || (Array.isArray(v) && (v.length === 0 || v.some((s) => typeof s !== "string" || s === "")));

const markdown = ["docs", "jobs"].map((collection) => {
  const base = new URL(`src/content/${collection}/`, root);
  return { collection, base, slugs: readdirSync(new URL(`${source}/`, base)).filter((f) => f.endsWith(".md")) };
});

let broken = 0, missingTotal = 0;
for (const code of targets) {
  const missing = [], errors = [], sizes = {};
  let total = 0, done = 0;
  for (const ns of namespaces) {
    const en = new Map(leaves(json(new URL(`${ns}.json`, dir(source)))));
    const file = new URL(`${ns}.json`, dir(code));
    const own = existsSync(file) ? new Map(leaves(json(file))) : new Map();
    total += en.size;
    sizes[ns] = en.size;
    for (const [key, value] of en) {
      const t = own.get(key);
      if (t === undefined || empty(t)) { missing.push(`${ns}:${key}`); continue; }
      if (Array.isArray(value) !== Array.isArray(t) || (!Array.isArray(t) && typeof t !== "string")) errors.push(`${ns}:${key} should be ${Array.isArray(value) ? "a list of strings" : "a string"}`);
      else if (marks(value) !== marks(t)) errors.push(`${ns}:${key} has ${shown(t)}, English has ${shown(value)}`);
      else done++;
    }
    for (const key of own.keys()) if (!en.has(key)) errors.push(`${ns}:${key} is not an English key`);
  }
  if (existsSync(dir(code))) {
    for (const f of readdirSync(dir(code))) if (f.endsWith(".json") && !namespaces.includes(f.slice(0, -5))) errors.push(`${f} is not an English namespace`);
  }
  const pages = markdown.flatMap(({ collection, base, slugs }) => slugs.filter((s) => !existsSync(new URL(`${code}/${s}`, base))).map((s) => `${collection}/${code}/${s}`));

  const pct = Math.round((done / total) * 100);
  console.log(`\n${code}: ${done}/${total} keys (${pct}%), ${pages.length} English-only page${pages.length === 1 ? "" : "s"}${errors.length ? `, ${errors.length} broken` : ""}`);
  for (const e of errors) console.log(`  broken   ${e}`);
  if (missing.length) {
    const byNs = Object.entries(Object.groupBy(missing, (k) => k.split(":")[0]));
    const whole = byNs.filter(([ns, keys]) => keys.length === sizes[ns]).map(([ns]) => ns);
    if (whole.length) console.log(`  missing  whole namespaces: ${whole.join(", ")}`);
    for (const [ns, keys] of byNs.filter(([ns]) => !whole.includes(ns))) console.log(`  missing  ${ns} (${keys.length}): ${keys.slice(0, 4).map((k) => k.split(":")[1]).join(", ")}${keys.length > 4 ? ", …" : ""}`);
  }
  if (pages.length) console.log(`  missing  markdown: ${pages.length === markdown.reduce((n, m) => n + m.slugs.length, 0) ? "all" : pages.join(", ")}`);
  broken += errors.length;
  missingTotal += missing.length + pages.length;
}

console.log(`\n${broken} broken, ${missingTotal} missing (missing keys show the English copy).`);
process.exit(broken > 0 || (strict && missingTotal > 0) ? 1 : 0);
