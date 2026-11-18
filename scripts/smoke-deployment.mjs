// Explicit live-preview QA: writes clearly labelled synthetic records, checks privacy, then deletes them.
import { get, del } from '@vercel/blob';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const target = new URL(process.argv[2]);
assert(target.protocol === 'https:' && target.hostname.endsWith('.vercel.app'), 'Use the Vercel preview deployment URL.');
assert(process.env.BLOB_READ_WRITE_TOKEN, 'Load the server-only storage environment first.');
const temporary = await mkdtemp(join(tmpdir(), 'aman-preview-qa-'));
const completed = [];
async function curl(path, { body, origin = target.origin } = {}) {
 const output = join(temporary, `${randomUUID()}.txt`);
 const args = ['--yes','vercel','curl',path,'--deployment',target.origin,'--','--silent','--show-error','--output',output,'--write-out','%{http_code}'];
 if (body) {
  const file=join(temporary,`${randomUUID()}.json`);await writeFile(file,JSON.stringify(body),{mode:0o600});
  args.push('--request','POST','--header','Content-Type: application/json','--header',`Origin: ${origin}`,'--data-binary',`@${file}`);
 }
 const stdout=execFileSync('npx',args,{encoding:'utf8',timeout:60000,stdio:['ignore','pipe','pipe']});
 const status=Number(stdout.trim().match(/(\d{3})$/)?.[1]);
 return {status,body:await readFile(output,'utf8')};
}
try {
 const page=await curl('/');assert.equal(page.status,200);assert(page.body.includes('Aman Coaching'));assert(page.body.includes('noindex, nofollow'));
 const noList=await curl('/api/leads');assert.equal(noList.status,405);
 const rejected=await curl('/api/leads',{body:{},origin:'https://unrelated.invalid'});assert.equal(rejected.status,403);
 for(const kind of ['leadership-snapshot','discovery-request']) {
  const id=randomUUID();const pathname=`submissions/${kind}/${id}.json`;
  const body={'form-name':kind,name:'[QA] Automated preview check',email:'qa@submission.invalid','submission-id':id,'marketing-consent':'no',answers:{role:'senior',focus:'delegation',clarity:1,influence:2,delegation:3,sustainability:0},message:'Synthetic QA record. No email should be sent.'};
  try {
   const response=await curl('/api/leads',{body});assert.equal(response.status,201,response.body);
   assert.deepEqual(JSON.parse(response.body),{ok:true,emailSent:false});
   const saved=await get(pathname,{access:'private',useCache:false});assert.equal(saved?.statusCode,200);
   const record=await new Response(saved.stream).json();assert.equal(record.id,id);assert.equal(record.emailSent,false);assert.equal(record.marketingConsent,false);
   if(kind==='leadership-snapshot')assert.equal(record.focus,'Delegation & ownership');
   const anonymous=await fetch(saved.blob.url);assert.notEqual(anonymous.status,200,'Private record was publicly readable');
   const retry=await curl('/api/leads',{body});assert.equal(retry.status,201,'Idempotent repeat did not succeed');
   completed.push({type:kind,stored:true,anonymousReadStatus:anonymous.status,retryStatus:retry.status,removed:false});
  } finally {
   await del(pathname);
   if(completed.at(-1)?.type===kind)completed.at(-1).removed=true;
  }
 }
 const evidence={verifiedAt:new Date().toISOString(),deploymentUrl:target.origin,sourceSHA:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),homepageStatus:200,noIndex:true,publicListStatus:405,crossOriginStatus:403,emailIntegration:false,checks:completed};
 await mkdir('evidence',{recursive:true});await writeFile('evidence/deployment-verification.json',JSON.stringify(evidence,null,2)+'\n');
 console.log(`Live preview verified: page, private writes/reads, rejected anonymous reads, retries and cleanup. ${completed.length} QA records removed. No email integration.`);
} finally {await rm(temporary,{recursive:true,force:true});}
