import { site } from './site.js';

export async function submitLead(formName, fields) {
  if (site.leadCapture !== 'netlify') {
    throw new Error('Your details have not been sent. This preview is not connected to lead capture. You can still view and download your report.');
  }
  const body = new URLSearchParams({ 'form-name': formName, ...fields });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: controller.signal,
      credentials: 'same-origin',
    });
    if (!response.ok) throw new Error('We could not save your details. Please try again, or view your report without submitting.');
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request took too long. Please try again. Your report is still available without submitting.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
