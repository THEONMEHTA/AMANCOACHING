import { put, get } from '@vercel/blob';
import { createLeadHandler } from '../server/leads.js';
import { readContent } from '../server/content.js';
import { sendReport } from '../server/email.js';

export default {fetch:createLeadHandler({
  write:put,
  read:async pathname=>{
    const existing=await get(pathname,{access:'private',useCache:false});
    return existing?.statusCode===200 ? new Response(existing.stream).json() : null;
  },
  ready:()=>Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  loadQuiz:()=>readContent('snapshot'),
  canEmail:async()=>process.env.VERCEL_ENV==='production' && process.env.SITE_MODE==='production' &&
    process.env.REPORT_EMAIL_ENABLED==='true' && Boolean(process.env.RESEND_API_KEY && process.env.REPORT_FROM) &&
    (await readContent('site')).reportEmailEnabled===true,
  send:sendReport,
  markSent:path=>put(path,'{"accepted":true}',{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'}),
})};
