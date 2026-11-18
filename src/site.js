export const site = {
  name: 'Aman Coaching',
  reportVersion: 'leadership-snapshot-1.0',
  consentVersion: '2026-11-18',
  // Private enquiry storage is the default. Supply a verified HTTPS calendar URL to replace it.
  bookingUrl: import.meta.env.VITE_BOOKING_URL || '',
  leadCapture: import.meta.env.VITE_LEAD_CAPTURE || 'unconfigured',
};
if (site.bookingUrl && !/^https:\/\//i.test(site.bookingUrl)) {
  throw new Error('VITE_BOOKING_URL must be a verified HTTPS URL.');
}
