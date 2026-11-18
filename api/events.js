import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';
import { validEvent } from '../server/events.js';
import { readBody } from '../server/leads.js';
export default {async fetch(request) {
  if(request.method!=='POST') return new Response(null,{status:405,headers:{Allow:'POST'}});
  if(request.headers.get('origin')!==new URL(request.url).origin || request.headers.get('sec-fetch-site')==='cross-site') return new Response(null,{status:403});
  if(!request.headers.get('content-type')?.startsWith('application/json')) return new Response(null,{status:415});
  let event;
  try {event=JSON.parse(await readBody(request));} catch {return new Response(null,{status:400});}
  if(!validEvent(event)) return new Response(null,{status:400});
  try {
    const date=new Date().toISOString().slice(0,10);
    const receipt=randomUUID();
    await put('metrics/'+date+'/'+receipt+'.json',JSON.stringify(event),{access:'private',addRandomSuffix:false,contentType:'application/json'});
    return Response.json({date,receipt},{status:201,headers:{'Cache-Control':'no-store'}});
  } catch {return new Response(null,{status:503});}
}};
