import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const vercel=JSON.parse(await readFile('vercel.json'));
const csp=vercel.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
test.beforeEach(async({page})=>{
 await page.route('**/api/events',route=>route.fulfill({status:204}));
 await page.route('**/api/content?*',route=>route.fulfill({status:404}));
});
async function finish(page,values) {
 await page.goto('/leadership-quiz');await page.getByRole('button',{name:'Start my snapshot'}).click();
 for(const [index,value] of values.entries()){
  await page.getByRole('radio').nth(value-1).check();
  await page.getByRole('button',{name:index===14?'See my results':'Continue'}).click();
 }
}
test('ungated mixed report, minimal optional capture, recoverable failure, PDF and booking',async({page})=>{
 const events=[],payloads=[];
 await page.route('**/api/events',route=>{events.push(route.request().postDataJSON());return route.fulfill({status:204});});
 await page.route('**/api/leads',route=>{payloads.push(route.request().postDataJSON());return route.fulfill({status:payloads.length===1?503:201,json:payloads.length===1?{ok:false,error:'Please retry.'}:{ok:true,emailSent:false}});});
 await page.route('**/leadership-quiz/',async route=>{const response=await route.fetch();return route.fulfill({response,headers:{...response.headers(),'Content-Security-Policy':csp}});});
 await finish(page,[4,5,2,3,3,4,4,2,3,3,4,4,3,4,4]);
 await expect(page.getByRole('heading',{name:'Strategic capacity',exact:true})).toBeFocused();await expect(page.getByText(/Block 30 minutes/)).toBeVisible();expect(payloads).toHaveLength(0);
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download my PDF'}).click();expect((await download).suggestedFilename()).toMatch(/\.pdf$/);
 await page.getByRole('button',{name:'Save a snapshot request'}).click();await expect(page.getByRole('checkbox')).not.toBeChecked();
 await page.getByLabel('Email address').fill('qa@visitor.invalid');await page.getByRole('button',{name:'Save my request'}).click();await expect(page.getByText('Please retry.')).toBeVisible();
 await page.getByRole('button',{name:'Save my request'}).click();await expect(page.getByText('Your request was saved privately. No email was sent.')).toBeVisible();
 expect(payloads[0]).not.toHaveProperty('answers');expect(payloads[0]).not.toHaveProperty('name');expect(payloads[0].totals).toEqual([12,13,7,10,10]);expect(payloads[0]['submission-id']).toBe(payloads[1]['submission-id']);
 await page.getByRole('link',{name:'Book a free discovery call',exact:false}).last().click();await expect(page).toHaveURL(/\/book\/?$/);
 expect(events.filter(e=>e.event==='quiz_step_completed').map(e=>e.step)).toEqual(Array.from({length:15},(_,i)=>i+1));expect(events).toContainEqual({event:'booking_clicked',source:'results'});expect(JSON.stringify(events)).not.toContain('visitor.invalid');
});
test('back retains selection, first question can return to intro, choice alone never advances',async({page})=>{
 await page.goto('/leadership-quiz');await page.getByRole('button',{name:'Start my snapshot'}).click();
 await page.getByRole('radio').nth(3).check();await page.getByRole('button',{name:'Back'}).click();await page.getByRole('button',{name:'Start my snapshot'}).click();await expect(page.getByRole('radio').nth(3)).toBeChecked();
 await page.getByRole('button',{name:'Continue'}).click();await page.getByRole('radio').nth(1).check();await page.getByRole('button',{name:'Back'}).click();
 await expect(page.getByRole('radio').nth(3)).toBeChecked();await page.getByRole('button',{name:'Continue'}).click();await expect(page.getByRole('radio').nth(1)).toBeChecked();
});
test('all high lets the visitor choose the action',async({page})=>{
 await finish(page,Array(15).fill(5));await expect(page.getByText(/refine one of them/)).toBeVisible();await page.getByRole('combobox').selectOption('delegation');await expect(page.getByText(/Give someone ownership/)).toBeVisible();
});
test('working email fallback, private enquiry and configured calendar without result parameters',async({page})=>{
 await page.goto('/book');await expect(page.getByRole('link',{name:/achieve@/})).toHaveAttribute('href','mailto:achieve@amancoaching.com');
 await page.route('**/api/leads',route=>route.fulfill({status:201,json:{ok:true,emailSent:false}}));await page.getByLabel('Your name').fill('QA');await page.getByLabel('Email address').fill('qa@visitor.invalid');await page.getByRole('button',{name:/Save my call request/}).click();await expect(page.getByText(/No appointment has been booked/)).toBeVisible();
 await page.route('**/api/content?key=site',route=>route.fulfill({json:{credentials:[],bookingUrl:'https://calendar.invalid/aman',sessions:null,reportEmailEnabled:false}}));await page.reload();await expect(page.getByRole('link',{name:/Open Aman/})).toHaveAttribute('href','https://calendar.invalid/aman');
});
