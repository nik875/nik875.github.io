import nodemailer from "npm:nodemailer@6";

const transporter = nodemailer.createTransport({
  host: Deno.env.get("SMTP_HOST"),
  port: 587,
  secure: false,
  auth: {
    user: Deno.env.get("SMTP_USER"),
    pass: Deno.env.get("SMTP_TOKEN"),
  },
});

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record?.email || !record?.confirm_token) {
      return new Response("Invalid payload", { status: 400 });
    }

    // Don't resend if already confirmed (fires on UPDATE too)
    if (record.confirmed === true) {
      return new Response("Already confirmed", { status: 200 });
    }

    const siteUrl = Deno.env.get("SITE_URL") ?? "https://crosscurrents.ink";
    const confirmUrl = `${siteUrl}/confirm/?token=${record.confirm_token}`;

    await transporter.sendMail({
      from: `CrossCurrents <${Deno.env.get("SMTP_USER")}>`,
      to: record.email,
      subject: "Confirm your CrossCurrents subscription",
      text: [
        "Hi,",
        "",
        "Click the link below to confirm your subscription to CrossCurrents:",
        "",
        confirmUrl,
        "",
        "If you didn't sign up, you can ignore this email.",
        "",
        "— Nikhil",
      ].join("\n"),
      html: `
        <p>Hi,</p>
        <p>Click the link below to confirm your subscription to CrossCurrents:</p>
        <p><a href="${confirmUrl}">Confirm my subscription</a></p>
        <p style="color:#888;font-size:0.9em">If you didn't sign up, you can ignore this email.</p>
        <p>— Nikhil</p>
      `,
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("send-confirmation error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
