import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6";

const SITE_URL = "https://crosscurrents.ink";

function htmlPage(title: string, body: string, status = 200): Response {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — CrossCurrents</title>
  <style>
    body { font-family: Georgia, serif; max-width: 600px; margin: 4rem auto; padding: 0 1rem; color: #333; }
    h1 { margin-bottom: 0.5rem; }
    p { color: #555; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${body}
  <p style="margin-top:2rem"><a href="${SITE_URL}">&larr; CrossCurrents</a></p>
</body>
</html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get("token");

  if (!token) {
    return htmlPage("Invalid Link", "<p>No token provided.</p>", 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("DB_SECRET_KEY")!
  );

  const { data: notification, error } = await supabase
    .from("pending_notifications")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !notification) {
    return htmlPage("Invalid Link", "<p>This link is invalid or has expired.</p>", 404);
  }

  if (notification.sent_at) {
    return htmlPage(
      "Already Sent",
      `<p>Notifications for <strong>${notification.post_title}</strong> were already sent on ${new Date(notification.sent_at).toLocaleDateString()}.`
    );
  }

  if (new Date(notification.expires_at) < new Date()) {
    return htmlPage("Link Expired", "<p>This link expired 30 days after the post was published. Subscribe from the homepage to notify manually.</p>", 410);
  }

  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .eq("confirmed", true);

  if (subError) {
    console.error("Failed to fetch subscribers:", subError);
    return htmlPage("Error", `<p>Failed to fetch subscribers: ${subError.message}</p>`, 500);
  }

  const count = subscribers?.length ?? 0;

  if (count === 0) {
    return htmlPage("No Subscribers", "<p>No confirmed subscribers to notify.</p>");
  }

  const transporter = nodemailer.createTransport({
    host: Deno.env.get("SMTP_HOST"),
    port: 587,
    secure: false,
    auth: {
      user: Deno.env.get("SMTP_USER"),
      pass: Deno.env.get("SMTP_TOKEN"),
    },
  });

  const postLink = `${SITE_URL}${notification.post_url}`;

  for (const { email, unsubscribe_token } of subscribers!) {
    const unsubscribeUrl = `${SITE_URL}/unsubscribe/?token=${unsubscribe_token}`;
    await transporter.sendMail({
      from: `CrossCurrents <${Deno.env.get("SMTP_USER")}>`,
      to: email,
      subject: `CrossCurrents: ${notification.post_title}`,
      text: [
        `New on CrossCurrents: ${notification.post_title}`,
        "",
        ...(notification.post_excerpt ? [notification.post_excerpt, ""] : []),
        `Read it here: ${postLink}`,
        "",
        "—",
        `Unsubscribe: ${unsubscribeUrl}`,
      ].join("\n"),
      html: `
        <div style="max-width:600px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;color:#333;">
          <p style="margin:0 0 0.5rem;color:#555;font-size:0.9em">New on CrossCurrents</p>
          <h2 style="margin:0 0 1rem;font-size:1.5rem;line-height:1.3">${notification.post_title}</h2>
          ${notification.post_excerpt ? `<p style="margin:0 0 1.5rem;color:#555;font-style:italic;line-height:1.6">${notification.post_excerpt}</p>` : ""}
          <p style="margin:0 0 2rem">
            <a href="${postLink}" style="display:inline-block;padding:0.75rem 1.5rem;background:#333;color:white;text-decoration:none;border-radius:4px;font-family:sans-serif;font-size:0.95rem">
              Read the full post
            </a>
          </p>
          <p style="margin:0;font-size:0.8em;color:#aaa;border-top:1px solid #eee;padding-top:1rem">
            You're receiving this because you subscribed to CrossCurrents.
            <a href="${unsubscribeUrl}" style="color:#aaa">Unsubscribe</a>
          </p>
        </div>
      `,
    });
  }

  await supabase
    .from("pending_notifications")
    .update({ sent_at: new Date().toISOString() })
    .eq("token", token);

  console.log(`Sent notifications for "${notification.post_title}" to ${count} subscriber(s).`);

  return htmlPage(
    "Notifications Sent",
    `<p>Successfully sent <strong>${notification.post_title}</strong> to ${count} subscriber${count === 1 ? "" : "s"}.</p>`
  );
});
