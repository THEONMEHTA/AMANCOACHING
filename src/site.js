export const site = {
  leadCapture: import.meta.env.VITE_LEAD_CAPTURE,
  emailAvailable: false,
  bookingUrl: '',
};
export async function loadContent(key) {
  // Vercel can serve owner-published copy immediately. Local builds use bundled defaults.
  if (site.leadCapture === 'vercel') {
    const response = await fetch('/api/content?key=' + key, {cache:'no-store'}).catch(() => null);
    if (response?.ok && response.headers.get('content-type')?.includes('application/json')) return response.json();
  }
  const response = await fetch('/content/' + key + '.json', {cache:'no-cache'});
  if (!response.ok) throw new Error('Content unavailable.');
  return response.json();
}
export async function loadSite() {
  const config = await loadContent('site');
  const url = config.bookingUrl || import.meta.env.VITE_BOOKING_URL;
  if (url && new URL(url).protocol === 'https:') site.bookingUrl = url;
  site.emailAvailable = config.reportEmailEnabled === true && import.meta.env.PRODUCTION_REPORTS;
  return config;
}
