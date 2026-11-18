import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {band, calculate, questionsFor} from '../src/quiz.js';
import {validEvent} from '../server/events.js';
import {renderEmail} from '../server/email.js';
const content=JSON.parse(await readFile('public/content/snapshot.json'));
test('fifteen unique statements in three interleaved rounds',()=>{
 const questions=questionsFor(content); assert.equal(new Set(questions.map(q=>q.statement)).size,15);
 assert.deepEqual(questions.slice(0,5).map(q=>q.dimension),questions.slice(10).map(q=>q.dimension));
});
test('all low and all high reflect ties; high scores refine a habit',()=>{
 for(const value of [1,5]){
  const r=calculate(content,Array(15).fill(value));assert.equal(r.low.length,5);assert.equal(r.high.length,5);assert(r.balanced);assert.equal(r.allHigh,value===5);
  assert.equal(r.rows[0].score,value.toFixed(1));
 }
});
test('mixed means, partial ties and band boundaries',()=>{
 const r=calculate(content,[4,5,2,3,3,4,4,2,3,3,4,4,3,4,4]);
 assert.equal(r.high[0].score,'4.3');assert.equal(r.low[0].score,'2.3');assert.equal(r.low[0].id,'strategy');
 assert.equal(calculate(content,[1,1,2,5,5,1,1,2,5,5,1,1,2,5,5]).low.length,2);
 assert.deepEqual([2.4,2.5,3.7,3.8].map(band),['Less consistent','Developing consistency','Developing consistency','More consistent']);
});
test('incomplete, sparse and invalid inputs never score',()=>{
 for(const values of [[],Array(15),Array(14).fill(4),Array(15).fill('3'),Array(15).fill(6)]) assert.throws(()=>calculate(content,values));
});
test('analytics permits only event-specific fields',()=>{
 assert(validEvent({event:'quiz_step_completed',step:15}));assert(validEvent({event:'booking_clicked',source:'results'}));
 for(const input of [{event:'quiz_start',email:'a@b.c'},{event:'result_viewed',scores:[]},{event:'quiz_step_completed',step:0},{event:'booking_clicked',source:'calendar'}]) assert(!validEvent(input));
});
test('email contains the scored report and one action without raw answers',()=>{
 const body=renderEmail(content,{totals:[9,13,7,8,9],focus:'strategy'});assert.match(body,/Strategic capacity — 2.3/);assert.match(body,/Block 30 minutes/);assert.doesNotMatch(body,/timely decisions even/);
});
