import { interpret, disclaimer } from '../src/quiz.js';
export function renderEmail(content, record) {
  const result = interpret(content, record.totals);
  const focus = result.low.find((row) => row.id === record.focus);
  return [
    'Your Leadership Snapshot',
    'Your reflection on the last four weeks.',
    result.balanced
      ? 'All five areas are level.'
      : 'Most consistent: ' + result.high.map((d) => d.label + ' (' + d.score + '/5)').join(', '),
    result.low.length > 1 && !result.balanced
      ? 'Joint lowest: ' + result.low.map((d) => d.label).join(', ')
      : '',
    result.allHigh ? 'You report consistent habits across all five areas. Choose one to refine.' : '',
    focus
      ? 'Your focus: ' + focus.label + '\nThis week: ' + focus.action
      : 'Choose one of these habits to practise this week.',
    result.rows.map((row) => row.label + ' — ' + row.score + '/5 · ' + row.band).join('\n'),
    disclaimer,
    'Aman Coaching',
  ]
    .filter(Boolean)
    .join('\n\n');
}
export async function sendReport(record, content) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': 'snapshot/' + record.id,
    },
    body: JSON.stringify({
      from: process.env.REPORT_FROM,
      to: [record.email],
      subject: 'Your Leadership Snapshot from Aman Coaching',
      text: renderEmail(content, record),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Mail provider unavailable.');
}
