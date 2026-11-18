import { list, get } from '@vercel/blob';
const [day] = process.argv.slice(2);
if (day && !/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error('Use a UTC date in YYYY-MM-DD format.');
const counts = {};
let cursor;
do {
  const page = await list({ prefix: 'metrics/' + (day ? day + '/' : ''), cursor });
  for (const blob of page.blobs) {
    const stored = await get(blob.pathname, { access: 'private' });
    if (stored?.statusCode !== 200) throw new Error('Could not read metric.');
    const { event, step, source } = await new Response(stored.stream).json();
    const label = [event, step, source].filter(Boolean).join(' ');
    counts[label] = (counts[label] || 0) + 1;
  }
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);
console.table(counts);
