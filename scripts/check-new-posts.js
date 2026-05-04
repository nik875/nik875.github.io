const nodemailer = require('nodemailer');
const matter = require('gray-matter');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.DB_SECRET_KEY;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_TOKEN = process.env.SMTP_TOKEN;
const AUTHOR_EMAIL = 'nikhil@kalidasu.com';
const EDGE_FN_URL = `${SUPABASE_URL}/functions/v1/trigger-notification`;

const NEW_POST_FILES = (process.env.NEW_POST_FILES || '').trim();
if (!NEW_POST_FILES) {
  console.log('No new posts found.');
  process.exit(0);
}

const files = NEW_POST_FILES.split('\n').filter(Boolean);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-');
}

function deriveUrl(filepath, title, frontmatterSlug) {
  const filename = path.basename(filepath, '.md');
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  const slug = frontmatterSlug || slugify(title);
  return `/${year}/${month}/${day}/${slug}/`;
}

function extractMetadata(filepath) {
  const raw = fs.readFileSync(filepath, 'utf8');
  const { data, content } = matter(raw);

  const title = data.title || path.basename(filepath, '.md');

  let excerpt = '';
  if (data.abstract) {
    // Strip markdown links for plain-text use
    excerpt = String(data.abstract).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  } else {
    // First non-empty, non-heading paragraph
    const paras = content.split(/\n{2,}/).map(p => p.trim()).filter(p => p && !p.startsWith('#'));
    excerpt = (paras[0] || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_]/g, '');
  }

  const url = deriveUrl(filepath, title, data.slug);
  return url ? { title, excerpt, url } : null;
}

async function storePendingNotification(post) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pending_notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SECRET_KEY,
      'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      post_title: post.title,
      post_url: post.url,
      post_excerpt: post.excerpt,
      expires_at: expiresAt,
    }),
  });

  if (!res.ok) throw new Error(`Failed to store notification: ${await res.text()}`);
  const [row] = await res.json();
  return row.token;
}

async function sendAuthorEmail(post, token) {
  const triggerUrl = `${EDGE_FN_URL}?token=${token}`;
  const transporter = nodemailer.createTransport({
    host: 'smtp.protonmail.ch',
    port: 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_TOKEN },
  });

  await transporter.sendMail({
    from: `CrossCurrents <${SMTP_USER}>`,
    to: AUTHOR_EMAIL,
    subject: `New post ready to notify: ${post.title}`,
    text: [
      `A new post was published: "${post.title}"`,
      '',
      `URL: https://crosscurrents.ink${post.url}`,
      '',
      post.excerpt ? `Excerpt: ${post.excerpt}` : '',
      '',
      'Click the link below to send a notification to all subscribers.',
      'This link is valid for 30 days.',
      '',
      triggerUrl,
    ].filter(l => l !== undefined).join('\n'),
    html: `
      <p>A new post was published:</p>
      <h2 style="margin:0.5rem 0">${post.title}</h2>
      ${post.excerpt ? `<p style="color:#555;font-style:italic">${post.excerpt}</p>` : ''}
      <p style="margin-top:1.5rem">
        <a href="${triggerUrl}" style="display:inline-block;padding:0.75rem 1.5rem;background:#333;color:white;text-decoration:none;border-radius:4px;font-family:sans-serif">
          Send to subscribers
        </a>
      </p>
      <p style="font-size:0.85em;color:#999;margin-top:1rem">This link is valid for 30 days.</p>
    `,
  });

  console.log(`Sent author notification for "${post.title}" (token: ${token})`);
}

async function main() {
  for (const filepath of files) {
    console.log(`Processing: ${filepath}`);
    const post = extractMetadata(filepath);
    if (!post) {
      console.warn(`  Skipping — could not derive URL from filename: ${filepath}`);
      continue;
    }
    const token = await storePendingNotification(post);
    await sendAuthorEmail(post, token);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
