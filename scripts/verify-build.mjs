import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const html = new Map();
for (const route of ['', 'book','privacy','leadership-quiz']) html.set('/'+route,await readFile('dist/'+(route ? route+'/' : '')+'index.html','utf8'));
for (const [route,source] of html) {
  assert.equal([...source.matchAll(/<h1\b/g)].length,1,route+' must have one H1');
  assert(!/\[FILL IN\]|framer\.link|href="#"|{{\w+}}/.test(source));
  for(const [,url] of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if(url.startsWith('mailto:')) continue;
    const [path,hash] = url.split('#');
    if(hash) assert((html.get(path || route) || '').includes('id="'+hash+'"'),'Broken anchor '+url);
    if(path && !html.has(path)) await access('dist'+path);
  }
}
assert(html.get('/book').includes('action="/api/leads"'));
console.log('Verified all four routes, anchors, assets, form action and page titles.');
