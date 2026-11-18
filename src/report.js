import { jsPDF } from 'jspdf';
import { disclaimer } from './quiz.js';

const ink = [24, 38, 34],
  moss = [61, 92, 75],
  muted = [77, 87, 79],
  ivory = [246, 243, 236],
  rule = [195, 203, 189];
const clean = (text) => String(text).replace(/[’‘]/g, "'").replace(/[–—]/g, '-');

export function createReport(result, focusId) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  pdf.setProperties({ title: 'Your Leadership Snapshot', author: 'Aman Coaching' });
  const left = 20,
    right = 190,
    width = right - left;
  let y;
  function font(size, face = 'helvetica', style = 'normal', colour = ink) {
    pdf.setFont(face, style);
    pdf.setFontSize(size);
    pdf.setTextColor(...colour);
  }
  function page() {
    pdf.setFillColor(...ivory);
    pdf.rect(0, 0, 210, 297, 'F');
    font(17, 'times', 'italic');
    pdf.text('Aman Coaching', left, 17);
    font(8, 'helvetica', 'bold', moss);
    pdf.text('PERSONAL REFLECTION', right, 16, { align: 'right' });
    pdf.setDrawColor(...rule);
    pdf.line(left, 22, right, 22);
    y = 34;
  }
  function room(height) {
    if (y + height > 272) {
      pdf.addPage();
      page();
    }
  }
  function lines(text, size, face = 'helvetica', style = 'normal', colour = ink) {
    font(size, face, style, colour);
    const wrapped = pdf.splitTextToSize(clean(text), width);
    for (const part of wrapped) {
      room(size * 0.45);
      font(size, face, style, colour);
      pdf.text(part, left, y);
      y += size * 0.45;
    }
  }
  function label(value) {
    lines(value, 8, 'helvetica', 'bold', moss);
    y += 3;
  }
  page();
  lines('Your Leadership Snapshot', 29, 'times');
  lines('A reflection on the last four weeks', 11, 'times', 'italic', muted);
  y += 7;
  const focus = result.low.find((row) => row.id === focusId);
  label('WHERE TO FOCUS NEXT');
  lines(focus ? focus.label : 'Choose your focus', 21, 'times');
  y += 2;
  if (result.balanced)
    lines('All five areas share the same score. Choose a habit you would like to practise.', 10);
  else if (result.low.length > 1)
    lines('These areas share the lowest score: ' + result.low.map((d) => d.label).join(', ') + '.', 10);
  if (result.allHigh)
    lines('You report consistent habits in every area. Choose one to refine this week.', 10);
  else if (focus) lines(focus.growth, 10);
  if (focus) {
    y += 4;
    label('TRY THIS WEEK');
    lines(focus.action, 12, 'times');
  }
  y += 8;
  room(87);
  label('YOUR FIVE AREAS');
  for (const row of result.rows) {
    room(14);
    font(11);
    pdf.text(clean(row.label), left, y);
    font(9, 'helvetica', 'normal', muted);
    pdf.text(row.band, right - 18, y, { align: 'right' });
    font(10, 'helvetica', 'bold', moss);
    pdf.text(row.score + '/5', right, y, { align: 'right' });
    pdf.setFillColor(...rule);
    pdf.rect(left, y + 3, width, 1.4, 'F');
    pdf.setFillColor(...moss);
    pdf.rect(left, y + 3, (width * row.total) / 15, 1.4, 'F');
    y += 12;
  }
  y += 4;
  label('YOUR MOST CONSISTENT AREA');
  lines(
    result.balanced
      ? 'All five areas are level.'
      : result.high.map((row) => row.label + ' (' + row.score + '/5)').join(', ') + '.',
    14,
    'times'
  );
  if (result.high.length === 1) lines(result.high[0].strength, 10);
  y += 7;
  lines(disclaimer, 9, 'helvetica', 'normal', muted);
  for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
    pdf.setPage(i);
    pdf.setDrawColor(...rule);
    pdf.line(left, 279, right, 279);
    font(9, 'helvetica', 'normal', moss);
    pdf.text('Executive & transformational leadership coaching', left, 285);
    pdf.text(i + ' / ' + pdf.getNumberOfPages(), right, 285, { align: 'right' });
  }
  return pdf;
}
