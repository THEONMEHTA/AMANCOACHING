import test from 'node:test';
import assert from 'node:assert/strict';
import { createLeadHandler } from '../server/leads.js';
const answers = { role: 'senior', focus: 'delegation', clarity: 1, influence: 2, delegation: 3, sustainability: 0 };
const payload = { 'form-name': 'leadership-snapshot', name: 'QA Visitor', email: 'qa@visitor.invalid', answers, 'marketing-consent': 'no', 'submission-id': 'cbf65ef9-51ba-49a0-ab36-17d104cdce1e' };
function request(data = payload, extra = {}) {
 return new Request('https://preview.vercel.app/api/leads', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://preview.vercel.app', ...extra.headers }, body: typeof data === 'string' ? data : JSON.stringify(data) });
}
function fixture(options = {}) {
 const writes = [];
 return { writes, handler: createLeadHandler({ write: async (...args) => writes.push(args), now: () => new Date('2026-11-18T10:00:00Z'), ...options }) };
}

test('stores a validated record privately with server-derived result and no email', async () => {
 const {handler,writes} = fixture();
 const response = await handler(request({...payload,focus:'forged client value',role:'forged'}));
 assert.equal(response.status,201); assert.deepEqual(await response.json(),{ok:true,emailSent:false});
 const [path,body,options] = writes[0]; const record=JSON.parse(body);
 assert(path.endsWith(`${payload['submission-id']}.json`)); assert(!path.includes(payload.email));
 assert.equal(record.focus,'Delegation & ownership'); assert.equal(record.role,'Leading leaders');
 assert.equal(record.receivedAt,'2026-11-18T10:00:00.000Z'); assert.equal(record.emailSent,false); assert.equal(record.marketingConsent,false);
 assert.equal(options.access,'private'); assert.equal(options.allowOverwrite,false); assert.equal(response.headers.get('cache-control'),'no-store');
});
test('does not write invalid, oversized, unsolicited or cross-origin payloads', async () => {
 const {handler,writes}=fixture();
 for(const data of [{...payload,email:'bad'}, {...payload,name:' '}, {...payload,name:'a'.repeat(101)}, {...payload,answers:{}}, {...payload,answers:'{'}, {...payload,'company-website':'bot'}, {...payload,'form-name':'unknown'}, {...payload,'submission-id':'../private'}]) assert.equal((await handler(request(data))).status,400);
 assert.equal((await handler(request('{'))).status,400);
 assert.equal((await handler(request('x'.repeat(9000)))).status,413);
 assert.equal((await handler(request(payload,{headers:{origin:'https://other.invalid'}}))).status,403);
 assert.equal((await handler(request(payload,{headers:{origin:''}}))).status,403);
 assert.equal((await handler(request(payload,{headers:{'content-type':'text/plain'}}))).status,415);
 assert.equal(writes.length,0);
});
test('GET has no public submission listing', async()=>{
 const {handler,writes}=fixture();const response=await handler(new Request('https://preview.vercel.app/api/leads'));
 assert.equal(response.status,405); assert.equal(writes.length,0);
});
test('missing or failed storage returns an error rather than false success',async()=>{
 const missing=fixture({ready:()=>false});assert.equal((await missing.handler(request())).status,503);assert.equal(missing.writes.length,0);
 const failed=fixture({write:async()=>{throw new Error('test storage failure');}});assert.equal((await failed.handler(request())).status,503);
});
test('duplicate opaque submission id is an idempotent retry',async()=>{
 const {handler}=fixture({write:async()=>{const e=new Error();e.name='BlobPathnameAlreadyExistsError';throw e;}});
 assert.equal((await handler(request())).status,201);
});
test('enquiry records save a bounded message and never opt into marketing',async()=>{
 const {handler,writes}=fixture();
 assert.equal((await handler(request({...payload,'form-name':'discovery-request',message:'A test request.','marketing-consent':'yes'}))).status,201);
 const record=JSON.parse(writes[0][1]);assert.equal(record.message,'A test request.');assert.equal(record.marketingConsent,false);assert.equal(record.answers,undefined);
 assert.equal((await handler(request({...payload,'form-name':'discovery-request',message:'a'.repeat(1501)}))).status,400);
});
test('native no-JavaScript enquiry form saves then redirects',async()=>{
 const {handler,writes}=fixture();
 const req=new Request('https://preview.vercel.app/api/leads',{method:'POST',headers:{origin:'https://preview.vercel.app','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({'form-name':'discovery-request',name:'QA Visitor',email:'qa@visitor.invalid',message:'Test'})});
 const response=await handler(req);assert.equal(response.status,303);assert.equal(response.headers.get('location'),'/thank-you.html');assert.equal(writes.length,1);
});
