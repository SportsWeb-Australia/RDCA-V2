/* RDCA contact form -> ZeptoMail — Cloudflare Pages Function (POST /api/contact).
   Vercel ignores functions/ (it uses api/contact.js); Cloudflare Pages uses this.
   Set these as Pages environment variables (Settings -> Environment variables),
   never commit them:
     ZEPTO_TOKEN     - ZeptoMail Send Mail token, e.g. "Zoho-enczapikey xxxxx"
     ZEPTO_FROM      - verified sender address on the ZeptoMail domain
     CONTACT_TO      - destination inbox, e.g. admin@rdca.com
   Optional: ZEPTO_API (defaults below), CONTACT_TO_NAME.                        */
const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (obj, status) =>
  new Response(JSON.stringify(obj), { status: status || 200, headers: { "Content-Type": "application/json" } });

export async function onRequestPost(context) {
  const { request, env } = context;
  const API = env.ZEPTO_API || "https://api.zeptomail.com/v1.1/email";
  const { ZEPTO_TOKEN, ZEPTO_FROM, CONTACT_TO } = env;
  if (!ZEPTO_TOKEN || !ZEPTO_FROM || !CONTACT_TO) {
    return json({ error: "The contact form is not configured yet. Please email the Association directly." }, 503);
  }

  let b = {};
  try { b = await request.json(); } catch (e) { b = {}; }
  b = b || {};

  if (b.website) return json({ ok: true });                          // honeypot

  const name = String(b.name || "").trim();
  const email = String(b.email || "").trim();
  const subject = String(b.subject || "").trim() || "Website enquiry";
  const message = String(b.message || "").trim();
  const phone = String(b.phone || "").trim();

  const errors = [];
  if (name.length < 2) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push("email");
  if (message.length < 10) errors.push("message");
  if (message.length > 5000) errors.push("message too long");
  if (errors.length) return json({ error: "Please check these fields: " + errors.join(", ") }, 400);

  const html =
    `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>` +
    (phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : "") +
    `<p><strong>Subject:</strong> ${esc(subject)}</p><hr>` +
    `<p>${esc(message).replace(/\n/g, "<br>")}</p><hr>` +
    `<p style="color:#666;font-size:12px">Sent from the RDCA website contact form.</p>`;

  try {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: ZEPTO_TOKEN },
      body: JSON.stringify({
        from: { address: ZEPTO_FROM, name: "RDCA Website" },
        to: [{ email_address: { address: CONTACT_TO, name: env.CONTACT_TO_NAME || "RDCA" } }],
        reply_to: [{ address: email, name }],
        subject: `[RDCA website] ${subject}`,
        htmlbody: html
      })
    });
    if (!r.ok) return json({ error: "We couldn't send that just now. Please try again shortly." }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: "We couldn't send that just now. Please try again shortly." }, 502);
  }
}
