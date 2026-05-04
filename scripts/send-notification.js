const nodemailer = require('nodemailer');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_TOKEN = process.env.SMTP_TOKEN;
const SITE_URL = process.env.SITE_URL || 'https://crosscurrents.ink';
const POST_TITLE = process.env.POST_TITLE;
const POST_URL = process.env.POST_URL;
const POST_EXCERPT = process.env.POST_EXCERPT || '';

async function main() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/subscribers?confirmed=eq.true&select=email,unsubscribe_token`,
    {
      headers: {
        apikey: SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      },
    }
  );

  if (!res.ok) {
    console.error('Failed to fetch subscribers:', res.status, await res.text());
    process.exit(1);
  }

  const subscribers = await res.json();
  console.log(`Sending to ${subscribers.length} subscriber(s)…`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.protonmail.ch',
    port: 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_TOKEN },
  });

  const postLink = `${SITE_URL}${POST_URL}`;

  for (const { email, unsubscribe_token } of subscribers) {
    const unsubscribeUrl = `${SITE_URL}/unsubscribe/?token=${unsubscribe_token}`;

    await transporter.sendMail({
      from: `CrossCurrents <${SMTP_USER}>`,
      to: email,
      subject: `New post: ${POST_TITLE}`,
      text: [
        `New on CrossCurrents: ${POST_TITLE}`,
        '',
        ...(POST_EXCERPT ? [POST_EXCERPT, ''] : []),
        `Read it here: ${postLink}`,
        '',
        '—',
        `Unsubscribe: ${unsubscribeUrl}`,
      ].join('\n'),
      html: `
        <p>New on CrossCurrents:</p>
        <h2 style="margin:0.5rem 0"><a href="${postLink}" style="color:#0066cc;text-decoration:none">${POST_TITLE}</a></h2>
        ${POST_EXCERPT ? `<p style="color:#555;font-style:italic">${POST_EXCERPT}</p>` : ''}
        <p><a href="${postLink}">Read the full post →</a></p>
        <p style="margin-top:2rem;font-size:0.85em;color:#999">
          You're receiving this because you subscribed to CrossCurrents.<br>
          <a href="${unsubscribeUrl}" style="color:#999">Unsubscribe</a>
        </p>
      `,
    });

    console.log(`  Sent to ${email}`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
