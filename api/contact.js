/* RDCA contact form -> ZeptoMail transactional send.
   Requires these Vercel environment variables (never commit them):
     ZEPTO_TOKEN     - ZeptoMail Send Mail token, e.g. "Zoho-enczapikey xxxxx"
     ZEPTO_FROM      - verified sender address on the ZeptoMail domain
     CONTACT_TO      - destination inbox, e.g. admin@rdca.com
   Optional:
     ZEPTO_API       - defaults to the AU/global endpoint below
     CONTACT_TO_NAME - display name for the destination                       */
const API = process.env.ZEPTO_API || "https://api.zeptomail.com/v1.1/email";
const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  const { ZEPTO_TOKEN, ZEPTO_FROM, CONTACT_TO } = process.env;
  if (!ZEPTO_TOKEN || !ZEPTO_FROM || !CONTACT_TO) {
    console.error("contact: missing ZEPTO_TOKEN / ZEPTO_FROM / CONTACT_TO");
    return res.status(503).json({ error: "The contact form is not configured yet. Please email the Association directly." });
  }
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};

  if (b.website) return res.status(200).json({ ok: true });          // honeypot: silently accept

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
  if (errors.length) return res.status(400).json({ error: "Please check these fields: " + errors.join(", ") });

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
        to: [{ email_address: { address: CONTACT_TO, name: process.env.CONTACT_TO_NAME || "RDCA" } }],
        reply_to: [{ address: email, name }],
        subject: `[RDCA website] ${subject}`,
        htmlbody: html
      })
    });
    if (!r.ok) {
      console.error("zeptomail", r.status, (await r.text()).slice(0, 300));
      return res.status(502).json({ error: "We couldn't send that just now. Please try again shortly." });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("zeptomail exception", e && e.message);
    return res.status(502).json({ error: "We couldn't send that just now. Please try again shortly." });
  }
};
