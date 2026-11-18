import { jsPDF } from 'jspdf';
import { GUIDANCE, LABELS } from './quiz.js';

const INK = [125, 12, 20];
const MUTED = [104, 77, 79];
const clean = value => String(value).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/→/g, 'to');

// Report content is coach-reviewable template text; no name or email is embedded in the PDF.
export function createReport({ result, date = new Date() }) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  pdf.setProperties({ title: 'Your leadership snapshot | Aman Coaching', author: 'Aman Coaching', subject: 'Personal leadership reflection and 30-day action plan' });
  const left = 22, width = 166;
  let y = 0;
  function page(label) {
    pdf.setFillColor(250, 248, 245); pdf.rect(0, 0, 210, 297, 'F');
    pdf.setTextColor(...INK); pdf.setFont('times', 'normal'); pdf.setFontSize(23); pdf.text('aman /', left, 23);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.text(label, 188, 21, { align: 'right' });
    pdf.setDrawColor(212, 196, 194); pdf.line(left, 30, 188, 30);
    y = 46;
  }
  function text(value, { size = 11, colour = INK, gap = 7, font = 'helvetica', style = 'normal', lineHeight = 6, maxWidth = width } = {}) {
    pdf.setTextColor(...colour); pdf.setFont(font, style); pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(clean(value), maxWidth);
    const height = lines.length * lineHeight;
    if (y + height > 265) { pdf.addPage(); page('LEADERSHIP SNAPSHOT / CONTINUED'); }
    pdf.text(lines, left, y, { lineHeightFactor: lineHeight / (size * 0.35278) });
    y += height + gap;
  }
  function heading(value) { text(value, { size: 27, font: 'times', lineHeight: 11, gap: 10 }); }
  function footer() {
    const total = pdf.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      pdf.setPage(p); pdf.setDrawColor(212, 196, 194); pdf.line(left, 273, 188, 273);
      pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...MUTED); pdf.setFontSize(8);
      pdf.text('AMAN COACHING / PERSONAL REFLECTION', left, 281);
      pdf.text(`${p} / ${total}`, 188, 281, { align: 'right' });
    }
  }
  page('YOUR PERSONAL LEADERSHIP SNAPSHOT');
  text(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), { size: 9, colour: MUTED, gap: 8 });
  heading(result.guidance.title);
  const intro = result.allEstablished
    ? 'You describe established habits in all four areas. Use your preferred focus as an experiment to build on what is already working.'
    : result.balanced
      ? 'Your responses are balanced across all four areas. Your preferred focus gives this plan a practical starting point.'
      : result.guidance.intro;
  text(intro, { size: 12, lineHeight: 7, gap: 10 });
  text('YOUR RESPONSES', { size: 9, style: 'bold', gap: 5 });
  for (const response of result.responses) {
    text(response.label, { size: 11, style: 'bold', gap: 1, lineHeight: 5 });
    text(response.answer, { size: 10, colour: MUTED, gap: 6, lineHeight: 5 });
  }
  text('This is a coaching reflection based on six self-reported answers. It is not a validated assessment, diagnosis or objective rating of leadership ability.', { size: 9, colour: MUTED, lineHeight: 5, gap: 3 });

  pdf.addPage(); page('YOUR NEXT 30 DAYS');
  heading('Turn reflection into action.');
  text(`Your focus: ${LABELS[result.focus]}. Choose actions that fit your responsibilities and the decisions you can influence.`, { size: 11, gap: 12 });
  result.guidance.actions.forEach(([when, title, body], i) => {
    text(`${String(i + 1).padStart(2, '0')} / ${when.toUpperCase()}`, { size: 9, colour: MUTED, gap: 3 });
    text(title, { size: 19, font: 'times', lineHeight: 8, gap: 3 });
    text(body, { size: 11, lineHeight: 6.5, gap: 14 });
  });
  text('A note to your future self', { size: 14, font: 'times', gap: 4 });
  text('What would you like to notice when you revisit this plan?', { size: 10, colour: MUTED, gap: 8 });
  pdf.setDrawColor(212, 196, 194);
  for (let i = 0; i < 2; i++) { pdf.line(left, y + i * 10, 188, y + i * 10); }

  pdf.addPage(); page('REFLECTION AND YOUR NEXT CONVERSATION');
  heading('Keep the conversation going.');
  text(result.balanced ? 'YOUR STARTING POINT' : 'AN AREA TO DRAW ON', { size: 9, style: 'bold', gap: 4 });
  text(result.balanced
    ? 'Similar responses do not mean every area feels the same. Start with your preferred focus and change the order of the actions if a different starting point would help.'
    : result.strengths.map(id => GUIDANCE[id].strength).join(' '), { size: 11, gap: 10 });
  if (result.focusAreas.length > 1 && !result.balanced) {
    text(`Your responses also suggest attention to ${result.focusAreas.filter(id => id !== result.focus).map(id => LABELS[id].toLowerCase()).join(' and ')}. You can revisit those areas after trying your first change.`, { size: 10, colour: MUTED, gap: 8 });
  }
  result.guidance.prompts.forEach(prompt => {
    text(prompt, { size: 13, font: 'times', lineHeight: 7, gap: 5 });
    pdf.setDrawColor(212, 196, 194); pdf.line(left, y + 5, 188, y + 5); y += 22;
  });
  text('A conversation with Aman', { size: 19, font: 'times', gap: 4 });
  text('If you would like support applying your snapshot, email Aman to request a discovery conversation. Bring this report or the leadership question that matters most to you.', { size: 11, gap: 5 });
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11); pdf.setTextColor(...INK);
  pdf.textWithLink('achieve@amancoaching.com', left, y, { url: 'mailto:achieve@amancoaching.com?subject=My%20leadership%20snapshot' });
  y += 14;
  text('Report version: leadership-snapshot-1.0. Your report contains your reflection answers. Keep it somewhere private and share it only if you choose.', { size: 9, colour: MUTED, lineHeight: 5 });
  footer();
  return pdf;
}
export async function downloadReport(data) {
  createReport(data).save('aman-leadership-snapshot.pdf');
}
