import { site } from './site.js';

export async function submitLead(formName, fields) {
  if (site.leadCapture !== 'vercel') throw new Error('Your details have not been sent. You can still view and download your report.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'form-name': formName, ...fields }),
      signal: controller.signal, credentials: 'same-origin',
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.ok !== true) throw new Error(data?.error || 'We could not save your details. Please try again, or view your report without submitting.');
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request took too long. Please try again. Your report is still available without submitting.');
    throw error;
  } finally { clearTimeout(timeout); }
}
