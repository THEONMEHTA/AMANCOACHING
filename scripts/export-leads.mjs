import { list, get } from '@vercel/blob';
import { mkdir, writeFile, chmod } from 'node:fs/promises';
import { resolve } from 'node:path';
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Load the server-only Blob token from the project environment. Do not put it in a VITE_ variable or Git.');
const records=[];let cursor;
do {
 const page=await list({prefix:'submissions/',cursor,limit:1000});
 for(const blob of page.blobs) {
  const result=await get(blob.url,{access:'private'});
  if(result?.statusCode!==200) throw new Error('A private record could not be read.');
  const body=await new Response(result.stream).json();records.push(body);
 }
 cursor=page.hasMore?page.cursor:undefined;
} while(cursor);
const folder=resolve('private/lead-exports');await mkdir(folder,{recursive:true,mode:0o700});
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const jsonPath=resolve(folder,`submissions-${stamp}.json`);
await writeFile(jsonPath,JSON.stringify(records,null,2)+'\n',{mode:0o600});
const columns=['id','type','receivedAt','name','email','role','preferredFocus','focus','message','marketingConsent','consentVersion','reportVersion'];
const csvCell=value=>{let text=String(value??'');if(/^[=+\-@\t\r\n]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
const csvPath=resolve(folder,`submissions-${stamp}.csv`);
await writeFile(csvPath,[columns.join(','),...records.map(record=>columns.map(key=>csvCell(record[key])).join(','))].join('\r\n')+'\r\n',{mode:0o600});
await chmod(jsonPath,0o600);await chmod(csvPath,0o600);
console.log(`Exported ${records.length} private records to ${folder}. Do not commit or share these files publicly.`);
