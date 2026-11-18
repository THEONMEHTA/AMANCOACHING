import { build, context } from 'esbuild';
import { cp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
const watch = process.argv.includes('--serve');
const root = resolve('.');
const destination = resolve('dist');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp('public', destination, { recursive: true });
const configuredCapture = process.env.NETLIFY === 'true' ? 'netlify' : (process.env.VITE_LEAD_CAPTURE || 'unconfigured');
if (!['netlify', 'unconfigured'].includes(configuredCapture)) throw new Error('Unsupported VITE_LEAD_CAPTURE value.');
const booking = process.env.VITE_BOOKING_URL || '';
if (booking && !/^https:\/\//i.test(booking)) throw new Error('Booking URL must use HTTPS.');
let html = await readFile('index.html', 'utf8');
html = html.replace('/src/main.js', '/assets/main.js').replace('</head>', '<link rel="stylesheet" href="/assets/main.css">\n</head>');
const origin = process.env.URL || process.env.SITE_URL || '';
if (origin) {
  const base = new URL(origin).origin;
  html = html.replace('content="/images/share.jpg"', `content="${base}/images/share.jpg"`);
  html = html.replace('</head>', `<link rel="canonical" href="${base}/"><meta property="og:url" content="${base}/">\n</head>`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /thank-you.html\nSitemap: ${base}/sitemap.xml\n`);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc></url><url><loc>${base}/accessibility.html</loc></url></urlset>`);
}
await writeFile('dist/index.html', html);
const options = {
  absWorkingDir: root, entryPoints: ['src/main.js'], bundle: true, outdir: 'dist/assets',
  splitting: true, format: 'esm', minify: true, target: ['es2022'],
  loader: { '.woff2': 'file', '.woff': 'file', '.ttf': 'file' },
  define: {
    'import.meta.env.VITE_BOOKING_URL': JSON.stringify(booking),
    'import.meta.env.VITE_LEAD_CAPTURE': JSON.stringify(configuredCapture),
  },
  logLevel: 'info',
};
if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  const server = await ctx.serve({ servedir: 'dist', host: '127.0.0.1', port: 5173 });
  console.log(`Local: http://${server.hosts?.[0] || '127.0.0.1'}:${server.port}`);
} else {
  await build(options);
  console.log(`Built static site. Lead capture: ${configuredCapture}.`);
}
