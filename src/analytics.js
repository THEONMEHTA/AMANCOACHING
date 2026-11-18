// No identifiers, URL, referrer, result, or answer is included in an event.
import { site } from './site.js';
export function track(event, properties = {}) {
  if (site.leadCapture !== 'vercel') return;
  fetch('/api/events', {
    method:'POST', headers:{'Content-Type':'application/json'}, credentials:'omit',
    referrerPolicy:'no-referrer', keepalive:true, body:JSON.stringify({ event, ...properties }),
  }).catch(() => {});
}
