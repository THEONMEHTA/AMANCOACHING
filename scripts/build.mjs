import { build, context } from 'esbuild';
import { cp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const watch = process.argv.includes('--serve');
const destination = resolve('dist');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp('public', destination, { recursive: true });
const configuredCapture =
  process.env.VERCEL === '1' ? 'vercel' : process.env.VITE_LEAD_CAPTURE || 'unconfigured';
const preview =
  process.env.SITE_MODE !== 'production' ||
  (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');
const origin =
  process.env.SITE_URL || (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : '');
const base = origin ? new URL(origin).origin : '';
const routes = [
  [
    'home',
    'index.html',
    'Executive leadership coaching with Aman Davegun',
    'Coaching for mid-to-senior leaders in complex organisations. Take the free Leadership Snapshot or arrange a discovery call.',
  ],
  [
    'leadership-quiz',
    'pages/leadership-quiz.html',
    'The Leadership Snapshot',
    'Reflect on fifteen leadership behaviours and see a personalised action for the week. No email required.',
  ],
  [
    'book',
    'pages/book.html',
    'Book a free discovery call',
    'Bring one leadership challenge to a complimentary discovery conversation with Aman.',
  ],
  [
    'privacy',
    'pages/privacy.html',
    'Privacy notice',
    'How Aman Coaching handles quiz reflections, optional report requests and discovery enquiries.',
  ],
];
const layout = await readFile('pages/layout.html', 'utf8');
for (const [page, file, title, description] of routes) {
  const path = page === 'home' ? '/' : '/' + page;
  const meta = preview
    ? '<meta name="robots" content="noindex, nofollow">'
    : base
      ? '<link rel="canonical" href="' + base + path + '">'
      : '';
  const body = await readFile(file, 'utf8');
  const values = { page, title, description, body, origin: base, meta };
  const html = layout.replace(/{{(\w+)}}/g, (_, key) => values[key]);
  const dir = destination + path;
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, 'index.html'), html);
}
await writeFile(
  'dist/robots.txt',
  preview ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n'
);
const options = {
  entryPoints: ['src/main.js'],
  bundle: true,
  outdir: 'dist/assets',
  splitting: true,
  format: 'esm',
  minify: true,
  target: ['es2022'],
  loader: { '.woff2': 'file', '.woff': 'file' },
  external: ['/images/*'],
  define: {
    'import.meta.env.VITE_BOOKING_URL': JSON.stringify(process.env.VITE_BOOKING_URL || ''),
    'import.meta.env.VITE_LEAD_CAPTURE': JSON.stringify(configuredCapture),
    'import.meta.env.PRODUCTION_REPORTS': JSON.stringify(
      !preview &&
        process.env.REPORT_EMAIL_ENABLED === 'true' &&
        Boolean(process.env.RESEND_API_KEY && process.env.REPORT_FROM)
    ),
  },
};
if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  await ctx.serve({ servedir: 'dist', host: '127.0.0.1', port: 5173 });
  console.log('Local: http://127.0.0.1:5173');
} else await build(options);
