/* XionTech mailer: turns a brief from the site's form into an email for the team.
   The site's nginx proxies POST /api/contact here, and the mail leaves through the Postfix container (compose.yaml).
   Settings come from the environment; see .env.example. */

import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import nodemailer from "nodemailer";

const env = process.env;
const PORT = Number(env.PORT || 3000);
const { CONTACT_TO, MAIL_FROM } = env;
if (!CONTACT_TO || !MAIL_FROM) {
  console.error("[mailer] CONTACT_TO and MAIL_FROM must be set");
  process.exit(1);
}

// in compose the hop to Postfix is plain SMTP on the private network; a server that needs a login gets TLS
const smtpPort = Number(env.SMTP_PORT || 587);
const auth = env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined;
const transport = nodemailer.createTransport({
  host: env.SMTP_HOST || "postfix",
  port: smtpPort,
  secure: smtpPort === 465,
  auth,
  ignoreTLS: !auth,
  requireTLS: !!auth && smtpPort !== 465,
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

// the ids the form's subject list sends (src/data/site.ts), named as in src/i18n/locales/en/site.json
const services = {
  engineering: "Digital product engineering",
  insights: "Digital insights and analytics",
  robotics: "Embedded and AI robotics",
  cocreation: "Co-creation development",
  managed: "Application managed services",
};

// the same rule the browser applies to type="email", so the form and the mailer agree
const emailRule = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MAX_BODY = 32 * 1024;

const text = (v) => (typeof v === "string" ? v.trim() : "");
const line = (v) => text(v).replace(/\s+/g, " ");

/** The brief's fields, or the names of the ones that fail. */
function readBrief(body) {
  const brief = {
    name: line(body.name),
    email: text(body.email),
    phone: line(body.phone),
    subject: line(body.subject),
    msg: text(body.msg).replace(/\r\n?/g, "\n"),
    lang: line(body.lang),
  };
  const bad = [];
  if (!brief.name || brief.name.length > 200) bad.push("name");
  if (brief.email.length > 254 || !emailRule.test(brief.email)) bad.push("email");
  if (brief.phone.length > 50) bad.push("phone");
  if (brief.subject.length > 60) bad.push("subject");
  if (!brief.msg || brief.msg.length > 5000) bad.push("msg");
  if (!/^[A-Za-z-]{0,20}$/.test(brief.lang)) bad.push("lang");
  return bad.length ? { bad } : { brief };
}

const escapeHtml = (v) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function languageName(code) {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(code);
  } catch {
    return code;
  }
}

const art = ["summit.jpg", "lockup.png", "wordmark.png"].map((filename) => ({
  filename,
  content: readFileSync(new URL(`./assets/${filename}`, import.meta.url)),
  cid: `${filename.split(".")[0]}@xiontechs`,
}));

const font = {
  display: "'Saira','Arial Narrow',Arial,sans-serif",
  body: "'Host Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",
  mono: "'Martian Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
  ipa: "'Noto Sans Mono','Martian Mono',ui-monospace,Menlo,monospace",
};
const mono = (size, color) => `font-family:${font.mono};font-size:${size}px;font-weight:500;line-height:1.3;letter-spacing:.04em;text-transform:uppercase;color:${color}`;
const clock = (timeZone, at) => new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(at);
const link = (href, v) => `<a href="${escapeHtml(href)}" style="color:#103060;text-decoration:underline">${escapeHtml(v)}</a>`;
const pill = (href, label, filled) =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;${filled ? "background:#103060;color:#FFFFFF;padding:16px 26px" : "border:1px solid #B1B6BE;color:#0B1A33;padding:15px 25px"};border-radius:999px;font-family:${font.mono};font-size:12px;font-weight:500;line-height:12px;letter-spacing:.03em;text-transform:uppercase;text-decoration:none;white-space:nowrap">${escapeHtml(label)}</a>`;

function briefHtml(brief, facts, chips, at) {
  const rows = facts
    .map(
      ([k, v, href]) => `<tr>
<td class="k" style="padding:14px 16px 14px 0;border-bottom:1px solid #E2E4E7;width:128px;vertical-align:top;${mono(11, "#4A5670")};line-height:20px">${k}</td>
<td class="v" style="padding:12px 0;border-bottom:1px solid #E2E4E7;vertical-align:top;font-family:${font.body};font-size:16px;line-height:24px;color:#0B1A33;word-break:break-word">${href ? link(href, v) : escapeHtml(v)}</td>
</tr>`,
    )
    .join("");
  const chipRow = chips
    .map(([v, amber]) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:5px 8px;border-radius:2px;background:${amber ? "#F8C000" : "#07101F"};${mono(10, amber ? "#0B1A33" : "#A9B4CC")};line-height:12px;letter-spacing:.05em">${escapeHtml(v)}</span>`)
    .join("");
  const actions = [pill(`mailto:${brief.email}?subject=${encodeURIComponent("Re: your project brief")}`, "Reply by email", true)];
  if (brief.phone) actions.push(pill(`tel:${brief.phone.replace(/[^\d+]/g, "")}`, `Call ${brief.phone}`, false));
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>New project brief</title>
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;600&family=Martian+Mono:wght@400;500&family=Noto+Sans+Mono&family=Saira:wdth,wght@125,700..800&display=swap" rel="stylesheet">
<style>
@media (max-width:620px){
.frame{padding:0!important}
.px{padding-left:24px!important;padding-right:24px!important}
.h1{font-size:30px!important}
.k,.v{display:block!important;width:auto!important}
.k{padding:14px 0 2px!important;border-bottom:0!important}
.v{padding:0 0 14px!important}
.cta a{margin-bottom:8px!important}
}
</style>
</head>
<body style="margin:0;padding:0;background:#F3F5F9">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapeHtml(brief.msg.replace(/\s+/g, " ").slice(0, 140))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F5F9">
<tr><td class="frame" align="center" style="padding:32px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF">
<tr><td class="px" style="background:#030813;padding:10px 40px;border-bottom:1px solid #21262F;${mono(10, "#76839F")};letter-spacing:.05em">Plano <span style="color:#FFFFFF">${clock("America/Chicago", at)}</span> CT &nbsp;·&nbsp; HCMC <span style="color:#FFFFFF">${clock("Asia/Ho_Chi_Minh", at)}</span> ICT</td></tr>
<tr><td class="px" style="background:#030813;padding:22px 40px 0"><img src="cid:lockup@xiontechs" width="150" height="43" alt="XionTech" style="display:block;border:0;width:150px;height:43px;font-family:${font.display};font-size:17px;font-weight:bold;color:#FFFFFF"></td></tr>
<tr><td class="px" style="background:#030813;padding:44px 40px 0">
<h1 class="h1" style="margin:0;font-family:${font.display};font-stretch:125%;font-size:40px;font-weight:760;line-height:.94;letter-spacing:-.01em;text-transform:uppercase;word-break:break-word"><span style="display:block;color:#76839F">New project brief</span><span style="display:block;color:#FFFFFF">${escapeHtml(brief.name)}</span></h1>
${chipRow ? `<div style="padding-top:20px">${chipRow}</div>` : ""}
</td></tr>
<tr><td style="background:#030813;padding:0;line-height:0;font-size:0"><img src="cid:summit@xiontechs" width="600" alt="" style="display:block;border:0;width:100%;max-width:600px;height:auto"></td></tr>
<tr><td class="px" style="padding:8px 40px 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E2E4E7">${rows}</table>
</td></tr>
<tr><td class="px" style="padding:36px 40px 0">
<div style="${mono(11, "#4A5670")};padding-bottom:10px">Message</div>
<div style="background:#F3F5F9;padding:20px 22px;font-family:${font.body};font-size:16px;line-height:1.6;color:#0B1A33;white-space:pre-wrap;word-break:break-word">${escapeHtml(brief.msg)}</div>
</td></tr>
<tr><td class="px cta" style="padding:28px 40px 0">${actions.join(" ")}</td></tr>
<tr><td class="px" style="padding:16px 40px 0;font-family:${font.body};font-size:15px;line-height:1.5;color:#4A5670">Replying to this email answers ${escapeHtml(brief.name)} directly.</td></tr>
<tr><td class="px" style="padding:56px 40px 0"><div style="border-top:1px solid #E2E4E7;padding-top:28px"><img src="cid:wordmark@xiontechs" width="473" alt="XionTech" style="display:block;border:0;width:100%;max-width:473px;height:auto;font-family:${font.display};font-size:40px;font-weight:bold;color:#103060"></div></td></tr>
<tr><td class="px" style="padding:22px 40px 0">
<div><span style="font-family:${font.display};font-stretch:125%;font-size:22px;font-weight:700;line-height:1.04;color:#103060">Xi·on·tech</span>&nbsp;&nbsp;<span style="font-family:${font.ipa};font-size:16px;letter-spacing:.02em;color:#0B1A33">/siː.ɒn.tek/</span>&nbsp;&nbsp;<span style="${mono(10, "#4A5670")};letter-spacing:.05em">noun</span></div>
<div style="padding-top:8px;${mono(11, "#4A5670")}">Say it: <b style="color:#0B1A33;font-weight:600">see</b> · <b style="color:#0B1A33;font-weight:600">on</b> · <b style="color:#0B1A33;font-weight:600">tech</b></div>
<div style="padding-top:10px;max-width:46ch;font-family:${font.body};font-size:15px;line-height:1.5;color:#4A5670">Inspired by a mountain. The team that takes a product from base camp to summit.</div>
</td></tr>
<tr><td class="px" style="padding:32px 40px 32px"><div style="border-top:1px solid #E2E4E7;padding-top:14px;${mono(10, "#4A5670")};letter-spacing:.05em">© ${at.getFullYear()} XionTech · Get IT done. Make your mark.</div></td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function send(brief, page) {
  const service = Object.hasOwn(services, brief.subject) ? services[brief.subject] : brief.subject;
  const facts = [
    ["Name", brief.name],
    ["Email", brief.email, `mailto:${brief.email}`],
    ["Phone", brief.phone, brief.phone && `tel:${brief.phone.replace(/[^\d+]/g, "")}`],
    ["Service", service],
    ["Language", brief.lang && languageName(brief.lang)],
    ["Submitted from", page, page],
  ].filter(([, v]) => v);
  const width = Math.max(...facts.map(([k]) => k.length)) + 2;
  const chips = [[service, true], [brief.lang && languageName(brief.lang), false]].filter(([v]) => v);
  return transport.sendMail({
    from: MAIL_FROM,
    to: CONTACT_TO,
    replyTo: { name: brief.name, address: brief.email },
    subject: service ? `New project brief: ${brief.name} | ${service}` : `New project brief: ${brief.name}`,
    text: `New project brief\n\n${facts.map(([k, v]) => k.padEnd(width) + v).join("\n")}\n\nMessage\n\n${brief.msg}\n\nReply to this email to answer ${brief.name} directly.\n`,
    html: briefHtml(brief, facts.filter(([k]) => !["Name", "Service", "Language"].includes(k)), chips, new Date()),
    attachments: art,
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size <= MAX_BODY) chunks.push(c);
    });
    req.on("end", () => (size > MAX_BODY ? reject(Object.assign(new Error("too large"), { status: 413 })) : resolve(Buffer.concat(chunks).toString("utf8"))));
    req.on("error", reject);
  });
}

const reply = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
};

const server = createServer(async (req, res) => {
  const path = (req.url ?? "").split("?")[0];
  if (path === "/healthz") return reply(res, 200, { ok: true });
  if (path !== "/api/contact") return reply(res, 404, { error: "not_found" });
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, { error: "method_not_allowed" });
  }
  if (!/^application\/json\b/i.test(req.headers["content-type"] ?? "")) return reply(res, 415, { error: "json_only" });

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch (e) {
    return reply(res, e.status ?? 400, { error: e.status === 413 ? "too_large" : "bad_json" });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply(res, 400, { error: "bad_json" });

  // a field people never see; whatever fills it is a bot, and it gets the same answer as a person
  if (text(body.website)) return reply(res, 200, { ok: true });

  const { brief, bad } = readBrief(body);
  if (bad) return reply(res, 400, { error: "invalid", fields: bad });

  try {
    const info = await send(brief, line(req.headers.referer).slice(0, 300));
    console.log(`[mailer] brief queued: ${info.messageId}`);
    reply(res, 200, { ok: true });
  } catch (e) {
    console.error(`[mailer] send failed: ${e.message}`);
    reply(res, 502, { error: "send_failed" });
  }
});

server.listen(PORT, () => {
  console.log(`[mailer] listening on :${PORT}, briefs go to ${CONTACT_TO}`);
  transport.verify().then(
    () => console.log("[mailer] SMTP server ready"),
    (e) => console.warn(`[mailer] SMTP server not ready yet: ${e.message}`),
  );
});

// node as PID 1 gets no default signal handlers: stop cleanly on docker stop
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => server.close(() => process.exit(0)));
