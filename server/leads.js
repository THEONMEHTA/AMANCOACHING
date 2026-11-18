import { randomUUID } from 'node:crypto';
import { getResult, LABELS, isValidEmail, validateAnswers } from '../src/quiz.js';

const MAX_BODY_BYTES = 8192;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const consentVersion = '2026-11-18';
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (body, status = 200) => Response.json(body, { status, headers });
const fail = (message, status = 400) => json({ ok: false, error: message }, status);
const safeText = (value, max) => typeof value === 'string' && value.trim().length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);

async function readBody(request) {
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) throw new Error('TOO_LARGE');
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = []; let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error('TOO_LARGE'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}

export function createLeadHandler({ write, read = async () => null, ready = () => true, now = () => new Date() }) {
  return async function handle(request) {
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...headers, Allow: 'POST' } });
    // No CORS endpoint: the same-origin site is the only intended submitter.
    const origin = request.headers.get('origin');
    if (origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return fail('Please submit from this website.', 403);
    const type = (request.headers.get('content-type') || '').split(';')[0].trim();
    if (!['application/json', 'application/x-www-form-urlencoded'].includes(type)) return fail('Unsupported submission format.', 415);
    let input;
    try {
      const body = await readBody(request);
      input = type === 'application/json' ? JSON.parse(body) : Object.fromEntries(new URLSearchParams(body));
    } catch (error) { return fail(error.message === 'TOO_LARGE' ? 'Please shorten your submission.' : 'Please check your submission.', error.message === 'TOO_LARGE' ? 413 : 400); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return fail('Please check your submission.');
    if (input['company-website']) return fail('We could not accept this submission.');
    const kind = input['form-name'];
    if (!['leadership-snapshot', 'discovery-request'].includes(kind)) return fail('Unknown submission type.');
    if (!safeText(input.name, 100) || !input.name.trim() || !isValidEmail(input.email)) return fail('Please enter your name and a valid email address.');
    const id = input['submission-id'] || randomUUID();
    if (typeof id !== 'string' || !UUID.test(id)) return fail('Please refresh and try again.');
    const record = {
      id, type: kind, receivedAt: now().toISOString(), name: input.name.trim(), email: input.email.trim(),
      siteMode: 'preview', emailSent: false, consentVersion,
    };
    if (kind === 'leadership-snapshot') {
      let answers;
      try { answers = typeof input.answers === 'string' ? JSON.parse(input.answers) : input.answers; } catch { return fail('Please complete the quiz before submitting.'); }
      if (!validateAnswers(answers)) return fail('Please complete all six quiz questions.');
      const result = getResult(answers);
      record.answers = Object.fromEntries(['role', 'focus', 'clarity', 'influence', 'delegation', 'sustainability'].map(key => [key, answers[key]]));
      record.role = result.role;
      record.preferredFocus = LABELS[answers.focus];
      record.focus = LABELS[result.focus];
      record.reportVersion = 'leadership-snapshot-1.0';
      record.marketingConsent = input['marketing-consent'] === 'yes';
    } else {
      if (input.message !== undefined && !safeText(input.message, 1500)) return fail('Please keep your message under 1,500 characters.');
      record.message = (input.message || '').trim();
      record.marketingConsent = false;
    }
    if (!ready()) return fail('Submissions are temporarily unavailable. Your report is still available without submitting.', 503);
    const pathname = `submissions/${kind}/${id}.json`;
    try {
      // The SDK refuses a mismatched public store. No public-storage fallback is allowed.
      await write(pathname, JSON.stringify(record), {
        access: 'private', contentType: 'application/json', addRandomSuffix: false,
        allowOverwrite: false, cacheControlMaxAge: 60,
      });
    } catch (error) {
      // Recover a timed-out write/retry by reading the exact opaque path, without overwriting.
      const existing = await read(pathname).catch(() => null);
      if (existing?.id === id && existing?.type === kind) {
        const keys = ['name', 'email', 'answers', 'message', 'marketingConsent', 'consentVersion', 'reportVersion'];
        if (!keys.every(key => JSON.stringify(existing[key]) === JSON.stringify(record[key]))) return fail('This request ID has already been used. Please refresh before submitting a new request.', 409);
      } else {
        // Do not log request bodies, personal details or the storage token.
        console.error('Private submission storage failed.');
        return fail('Your details could not be saved. Please try again, or view your report without submitting.', 503);
      }
    }
    if (type === 'application/x-www-form-urlencoded') return new Response(null, { status: 303, headers: { ...headers, Location: '/thank-you.html' } });
    return json({ ok: true, emailSent: false }, 201);
  };
}
