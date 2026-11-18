import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS, DIMENSIONS, LABELS, GUIDANCE, getResult, validateAnswers, isValidEmail } from '../src/quiz.js';
const base = { role: 'senior', focus: 'delegation', clarity: 1, influence: 1, delegation: 3, sustainability: 0 };

test('quiz has six questions and every question has four unique options', () => {
  assert.equal(QUESTIONS.length, 6);
  for (const q of QUESTIONS) { assert.equal(q.options.length, 4); assert.equal(new Set(q.options.map(o => o[0])).size, 4); }
});
test('selects reported focus and relative strengths with deterministic actions', () => {
  const r = getResult(base);
  assert.equal(r.focus, 'delegation'); assert.deepEqual(r.strengths, ['sustainability']);
  assert.equal(r.guidance.actions.length, 3); assert.equal(r.guidance.prompts.length, 2);
});
test('preferred focus breaks a tie without overriding an unequal result', () => {
  assert.equal(getResult({ ...base, sustainability: 3, focus: 'sustainability' }).focus, 'sustainability');
  assert.equal(getResult({ ...base, focus: 'clarity' }).focus, 'delegation');
  assert.equal(getResult({ ...base, clarity: 3, focus: 'influence' }).focus, 'clarity');
});
test('balanced responses use chosen focus and clearly identify equal pattern', () => {
  for (const value of [0, 1, 2, 3]) {
    const r = getResult({ ...base, clarity: value, influence: value, delegation: value, sustainability: value });
    assert(r.balanced); assert.equal(r.focus, 'delegation'); assert.equal(r.allEstablished, value === 0);
  }
});
test('rejects missing, out-of-range and wrong-type answers', () => {
  for (const key of QUESTIONS.map(q => q.id)) { const a = { ...base }; delete a[key]; assert(!validateAnswers(a)); assert.throws(() => getResult(a)); }
  for (const bad of [-1, 4, NaN, '3', null, {}, undefined]) assert(!validateAnswers({ ...base, clarity: bad }));
  assert(!validateAnswers({ ...base, role: 'unrecognised' }));
  assert(!validateAnswers({ ...base, focus: '<script>' }));
});
test('every valid scoring pattern produces complete report content', () => {
  let count = 0;
  for (let c = 0; c < 4; c++) for (let i = 0; i < 4; i++) for (let d = 0; d < 4; d++) for (let s = 0; s < 4; s++) for (const focus of DIMENSIONS) {
    const r = getResult({ ...base, clarity: c, influence: i, delegation: d, sustainability: s, focus });
    assert(DIMENSIONS.includes(r.focus)); assert(r.guidance.title.length > 0);
    for (const action of r.guidance.actions) assert(action.every(text => typeof text === 'string' && text.length > 0));
    assert.equal(r.responses.length, 4); count++;
  }
  assert.equal(count, 1024);
});
test('email validation accepts common addresses and rejects unsafe values', () => {
  assert(isValidEmail('achieve@amancoaching.com')); assert(isValidEmail('person+coaching@business.co.uk'));
  for (const value of ['', 'name', 'a@b', 'a b@c.com', '<script>@c.com', 'a\n@b.com', 'a'.repeat(255) + '@b.com']) assert(!isValidEmail(value));
});
