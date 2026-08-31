import nodemailer from "nodemailer";

function envFlag(value?: string) {
  return String(value || "").toLowerCase() === "true";
}

export function mailFrom() {
  return process.env.EMAIL_FROM || process.env.SMTP_FROM || "jimmyhometextile@loopingbinary.com";
}

export function mailerConfigured() {
  return Boolean(process.env.SMTP_PASS || process.env.RESEND_API_KEY);
}

function smtpOptions() {
  const port = Number(process.env.SMTP_PORT || 465);
  return {
    host: process.env.SMTP_HOST || "smtp.resend.com",
    port,
    secure: process.env.SMTP_SECURE ? envFlag(process.env.SMTP_SECURE) : port === 465,
    auth: {
      user: process.env.SMTP_USER || "resend",
      pass: process.env.SMTP_PASS || "",
    },
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 12_000,
  };
}

async function sendViaSmtp(input: { to: string; subject: string; html: string; text: string }) {
  const pass = process.env.SMTP_PASS;
  if (!pass) throw new Error("SMTP_PASS is not configured");
  const transporter = nodemailer.createTransport(smtpOptions());
  await transporter.sendMail({
    from: `Jimmy Home Textile <${mailFrom()}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}

async function sendViaResendApi(input: { to: string; subject: string; html: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS || "";
  if (!apiKey.startsWith("re_")) {
    throw new Error("Resend API key is not configured");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Jimmy Home Textile <${mailFrom()}>`,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { message?: string; error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message || json.message || "Resend rejected the email");
  }
}

export async function sendEmail(input: { to: string; subject: string; html: string; text: string }) {
  if (!mailerConfigured()) {
    throw new Error("Email delivery is not configured");
  }
  try {
    await sendViaSmtp(input);
  } catch (smtpError) {
    try {
      await sendViaResendApi(input);
    } catch {
      throw smtpError instanceof Error ? smtpError : new Error("Unable to send email");
    }
  }
}

export async function sendSignInOtpEmail(to: string, code: string) {
  const subject = "Your Jimmy Home Textile sign-in code";
  const text = `Your sign-in code is ${code}. It expires in about an hour. If you did not request this, you can ignore this email.`;
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f1e8;font-family:Georgia,serif;color:#1a1612;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fbf7f0;border:1px solid #e7d9c4;">
            <tr>
              <td style="padding:28px 28px 8px;letter-spacing:0.28em;text-transform:uppercase;font-size:11px;color:#6f675e;font-family:system-ui,sans-serif;">
                Jimmy Home Textile
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 8px;font-size:28px;">Your sign-in code</td>
            </tr>
            <tr>
              <td style="padding:0 28px 20px;font-size:15px;line-height:1.6;color:#6f675e;">
                Use this code to enter the atelier. No password is required.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 28px 28px;">
                <div style="display:inline-block;letter-spacing:0.4em;font-size:32px;background:#2c3a32;color:#fbf7f0;padding:14px 22px;">
                  ${code}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;font-size:13px;color:#6f675e;font-family:system-ui,sans-serif;">
                This code expires in about an hour. If you did not ask to sign in, you can ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  await sendEmail({ to, subject, html, text });
}

export async function sendAdminInviteEmail(
  to: string,
  input: { code: string; loginUrl: string }
) {
  const subject = "You are an admin at Jimmy Home Textile";
  const text = `You have been given admin access to the Jimmy Home Textile atelier.

Sign in here: ${input.loginUrl}

Your one-time code is ${input.code}. It expires in about an hour.

On the login page, enter this email and the code. If the code expires, request a new one on that same page.

If you did not expect this, you can ignore this email.`;
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f1e8;font-family:Georgia,serif;color:#1a1612;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fbf7f0;border:1px solid #e7d9c4;">
            <tr>
              <td style="padding:28px 28px 8px;letter-spacing:0.28em;text-transform:uppercase;font-size:11px;color:#6f675e;font-family:system-ui,sans-serif;">
                Jimmy Home Textile
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 8px;font-size:28px;">You are an admin</td>
            </tr>
            <tr>
              <td style="padding:0 28px 20px;font-size:15px;line-height:1.6;color:#6f675e;">
                The house has given this email access to the atelier. Use the link and the one-time code below to sign in. No password is required.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:4px 28px 20px;">
                <a href="${input.loginUrl}" style="display:inline-block;background:#2c3a32;color:#fbf7f0;text-decoration:none;letter-spacing:0.18em;text-transform:uppercase;font-size:11px;padding:14px 22px;font-family:system-ui,sans-serif;">
                  Open atelier login
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 28px 28px;">
                <div style="display:inline-block;letter-spacing:0.4em;font-size:32px;background:#2c3a32;color:#fbf7f0;padding:14px 22px;">
                  ${input.code}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;font-size:13px;color:#6f675e;font-family:system-ui,sans-serif;">
                This code expires in about an hour. If it has expired, open the login page and request a new code with this email. If you did not expect this, you can ignore this message.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  await sendEmail({ to, subject, html, text });
}
