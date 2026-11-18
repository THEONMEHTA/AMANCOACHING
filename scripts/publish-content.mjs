import { readFile } from 'node:fs/promises';
import { put } from '@vercel/blob';
import { validateContent } from '../server/content.js';
const [key, file] = process.argv.slice(2);
if (!file || !process.env.BLOB_READ_WRITE_TOKEN)
  throw new Error('Provide the content key, JSON file and private store environment.');
const data = validateContent(key, JSON.parse(await readFile(file, 'utf8')));
await put('configuration/' + key + '.json', JSON.stringify(data), {
  access: 'private',
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'application/json',
  cacheControlMaxAge: 60,
});
console.log('Published ' + key + ' content to the connected store.');
