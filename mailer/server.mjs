/* XionTechs mailer: turns a brief from the site's form into an email for the team.
   The site's nginx proxies POST /api/contact here, and the mail leaves through the Postfix container (compose.yaml).
   Settings come from the environment; see .env.example. */

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

function send(brief, page) {
  const service = Object.hasOwn(services, brief.subject) ? services[brief.subject] : brief.subject;
  const facts = [["Name", brief.name], ["Email", brief.email], ["Phone", brief.phone], ["Service", service], ["Language", brief.lang], ["Page", page]]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  return transport.sendMail({
    from: MAIL_FROM,
    to: CONTACT_TO,
    replyTo: { name: brief.name, address: brief.email },
    subject: service ? `Brief from ${brief.name}: ${service}` : `Brief from ${brief.name}`,
    text: `${facts.join("\n")}\n\n${brief.msg}\n`,
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
