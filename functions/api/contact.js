// POST /api/contact — RDCA website forms (Contact + Become an Umpire).
//
// SportsWeb CPaaS convention (same as the other SportsWeb sites):
//   - Delivery is ZeptoMail via the Zoho CPaaS AU endpoint, token read from env, never in code.
//   - FORMS_TEST_MODE defaults to "true". Live sending needs it to be exactly "false" AND a
//     token AND a from address AND a notify address, so a missing variable can never misroute mail.
//   - From stays on our own (rdca.com) domain; the enquirer goes in Reply-To so SPF/DKIM/DMARC stay aligned.
//   - Every valid submission is saved to KV BEFORE any email is attempted, so nothing is lost if
//     ZeptoMail is down, mis-set, or still in test mode.
//
// Env (Pages → Settings → Environment variables):
//   ZEPTOMAIL_SEND_TOKEN  (secret)  — ZeptoMail Send token ("Zoho-enczapikey xxxx" or the raw key)
//   ZEPTOMAIL_FROM_ADDRESS          — a sender verified in ZeptoMail on the rdca.com domain
//   ZEPTOMAIL_FROM_NAME             — defaults to "RDCA Website"
//   FORMS_NOTIFICATION_EMAIL        — where enquiries are delivered (e.g. admin@rdca.com)
//   FORMS_NOTIFICATION_CC           — optional, comma-separated
//   FORMS_TEST_MODE                 — "true" (default) saves only; "false" sends
//   ZEPTOMAIL_REGION | ZEPTOMAIL_API_ENDPOINT — optional (region defaults to cpaas-au)
// Binding: ENQUIRIES (KV).

const ENDPOINTS = {
  "cpaas-au": "https://cpaas.zoho.com.au/v1.1/email",
  cpaas: "https://cpaas.zoho.com/v1.1/email",
  au: "https://api.zeptomail.com.au/v1.1/email",
  com: "https://api.zeptomail.com/v1.1/email",
};
const ALLOWED_HOSTS = new Set(["rdca.com", "www.rdca.com"]);
const RATE_LIMIT = 6;          // submissions per IP per hour
const MAX = { short: 150, long: 5000 };

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
const clean = (v, max) =>
  String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
const hasHeaderInjection = (s) => /[\r\n]/.test(s) || /(^|\s)(bcc|cc|to|content-type):/i.test(s);
const isEmail = (s) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(s) && s.length <= 254;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// [key, label, size, required]
const FIELDS = [
  ["name", "Name", "short", true],
  ["email", "Email", "short", true],
  ["phone", "Phone", "short", false],
  ["experience", "Umpiring experience", "short", false],
  ["message", "Message", "long", false],
  ["subject", "Subject", "short", false],
];

function config(env) {
  const live = String(env.FORMS_TEST_MODE ?? "true").toLowerCase() === "false";
  // Accept the Vercel-style ZEPTO_*/CONTACT_TO names too, so one env config is portable across hosts.
  const token = env.ZEPTO_TOKEN || env.ZEPTOMAIL_SEND_TOKEN || "";
  const from = env.ZEPTO_FROM || env.ZEPTOMAIL_FROM_ADDRESS || "";
  const notify = env.CONTACT_TO || env.FORMS_NOTIFICATION_EMAIL || "";
  const cc = String(env.FORMS_NOTIFICATION_CC || "").split(",").map((x) => x.trim())
    .filter((x) => isEmail(x) && x.toLowerCase() !== notify.toLowerCase());
  const region = String(env.ZEPTOMAIL_REGION || "cpaas-au").toLowerCase();
  return {
    send: live && !!token && !!from && !!notify,
    token, from, notify, cc,
    fromName: env.ZEPTOMAIL_FROM_NAME || "RDCA Website",
    endpoint: (env.ZEPTO_API || env.ZEPTOMAIL_API_ENDPOINT || "").trim() || ENDPOINTS[region] || ENDPOINTS["cpaas-au"],
  };
}

async function sendViaZeptoMail(cfg, { subject, html, text, replyTo }, withCc = true) {
  const payload = {
    from: { address: cfg.from, name: cfg.fromName },
    to: [{ email_address: { address: cfg.notify } }],
    subject, htmlbody: html, textbody: text,
    reply_to: [{ address: replyTo }],
  };
  if (withCc && cfg.cc.length) payload.cc = cfg.cc.map((address) => ({ email_address: { address } }));
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: cfg.token.startsWith("Zoho-enczapikey") ? cfg.token : `Zoho-enczapikey ${cfg.token}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`ZeptoMail ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
}

export async function onRequestPost({ request, env, waitUntil }) {
  const origin = request.headers.get("Origin");
  if (origin) {
    const h = new URL(origin).hostname;
    if (!ALLOWED_HOSTS.has(h) && !h.endsWith(".pages.dev") && h !== "localhost") return json({ ok: false, error: "forbidden" }, 403);
  }

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: "Please check your details and try again." }, 400); }

  if (clean(body.website, 50)) return json({ ok: true });           // honeypot — pretend success

  const data = {};
  const problems = [];
  for (const [key, label, size, required] of FIELDS) {
    const v = clean(body[key], MAX[size]);
    if (required && !v) problems.push(label);
    if (hasHeaderInjection(v) && size === "short") problems.push(label);
    data[key] = v;
  }
  if (data.email && !isEmail(data.email)) problems.push("Email");
  // A general enquiry (Contact form) needs a message; the Umpire "register interest" form doesn't.
  const umpireOrRegister = /umpire|register|interest/i.test(data.subject);
  if (!umpireOrRegister && data.message.length < 10) problems.push("Message");
  if (problems.length) return json({ ok: false, error: "Please check: " + [...new Set(problems)].join(", ") + "." }, 422);

  // Light per-IP rate limit (shared KV).
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const bucket = `rl:${ip}:${new Date().toISOString().slice(0, 13)}`;
  let used = 0;
  try { used = Number((await env.ENQUIRIES.get(bucket)) || 0); } catch { /* KV optional in dev */ }
  if (used >= RATE_LIMIT) return json({ ok: false, error: "Too many submissions. Please try again later or email the Association directly." }, 429);
  try { await env.ENQUIRIES.put(bucket, String(used + 1), { expirationTtl: 3700 }); } catch { /* noop */ }

  const kind = data.subject || "Website enquiry";
  const id = `enq:${new Date().toISOString()}:${crypto.randomUUID().slice(0, 8)}`;
  const record = { id, received: new Date().toISOString(), delivery: "pending", ...data };
  try { await env.ENQUIRIES.put(id, JSON.stringify(record)); } catch { /* noop */ }

  const rows = FIELDS.filter(([k]) => data[k] && k !== "subject");
  const text = `New RDCA website enquiry — ${kind}\n\n` + rows.map(([k, l]) => `${l}: ${data[k]}`).join("\n") + `\n\nReceived ${record.received}`;
  const html =
    `<h2 style="font-family:Arial,sans-serif;color:#0d1f3c">New RDCA enquiry: ${esc(kind)}</h2>` +
    `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    rows.map(([k, l]) => `<tr><td style="padding:6px 14px 6px 0;color:#555;vertical-align:top"><b>${esc(l)}</b></td><td style="padding:6px 0;white-space:pre-wrap">${esc(data[k])}</td></tr>`).join("") +
    `</table><p style="font-family:Arial,sans-serif;font-size:12px;color:#777">Reply to this email to reach ${esc(data.name)} directly.</p>`;

  const cfg = config(env);
  try {
    if (cfg.send) {
      const msg = { subject: `[RDCA website] ${kind} — ${data.name}`, html, text, replyTo: data.email };
      try { await sendViaZeptoMail(cfg, msg); record.delivery = "emailed"; }
      catch (e) {
        if (!cfg.cc.length) throw e;              // a bad CC must never cost the enquiry
        record.ccError = String(e.message || e).slice(0, 300);
        await sendViaZeptoMail(cfg, msg, false);
        record.delivery = "emailed (cc failed)";
      }
    } else {
      record.delivery = "saved-only (test mode)";
    }
  } catch (err) {
    record.delivery = "email-failed";
    record.error = String(err.message || err).slice(0, 400);
  }
  try { await env.ENQUIRIES.put(id, JSON.stringify(record)); } catch { /* noop */ }

  return json({ ok: true });
}

export const onRequest = () => json({ ok: false, error: "Method not allowed" }, 405);
