import '@fontsource/lora/latin-400.css';
import '@fontsource/lora/latin-400-italic.css';
import '@fontsource/nunito-sans/latin-400.css';
import '@fontsource/nunito-sans/latin-600.css';
import '@fontsource/nunito-sans/latin-700.css';
import './style.css';
import { QUESTIONS, DIMENSIONS, LABELS, GUIDANCE, getResult, isValidEmail } from './quiz.js';
import { site } from './site.js';
import { submitLead } from './leads.js';

const app = document.querySelector('#quiz-app');
const shell = document.querySelector('.quiz-shell');
const section = document.querySelector('#quiz');
const state = { step: 0, answers: {}, name: '', submissionId: crypto.randomUUID(), submitting: false };
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function focusStep() {
  const target = app.querySelector('legend, h3');
  target?.setAttribute('tabindex', '-1');
  // Avoid jumping the entire page when a visitor advances with a keyboard.
  target?.focus({ preventScroll: true });
  const rect = app.getBoundingClientRect();
  if (rect.top < 80 || rect.top > innerHeight - 120) app.scrollIntoView({ block: 'start', behavior: 'instant' });
}
function showQuestion() {
  shell.classList.remove('is-result');
  const question = QUESTIONS[state.step];
  app.innerHTML = `
    <div class="quiz-progress-row"><span>YOUR LEADERSHIP SNAPSHOT</span><span>Question ${state.step + 1} of ${QUESTIONS.length}</span></div>
    <div class="quiz-progress" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${state.step}" aria-valuetext="Question ${state.step + 1} of 6"><span style="width:${((state.step + 1) / QUESTIONS.length) * 100}%"></span></div>
    <fieldset class="quiz-question"><legend><h3>${question.title}</h3></legend><p class="question-help" id="question-help">${question.help}</p>
      <div class="quiz-options" aria-describedby="question-help">${question.options.map(([value, title, detail], i) => `
        <label class="quiz-option" for="answer-${i}"><input id="answer-${i}" name="${question.id}" type="radio" value="${value}" ${state.answers[question.id] === value ? 'checked' : ''}><span><strong>${title}</strong><small>${detail}</small></span></label>`).join('')}</div>
    </fieldset>
    <div class="quiz-controls"><button class="back-button" id="quiz-back" type="button">← ${state.step ? 'Back' : 'Quiz introduction'}</button><button class="btn btn--primary" id="quiz-next" type="button" ${state.answers[question.id] === undefined ? 'disabled' : ''}>${state.step === QUESTIONS.length - 1 ? 'Get my report' : 'Next question'} <span aria-hidden="true">→</span></button></div>`;
  app.querySelectorAll('input[type="radio"]').forEach(input => input.addEventListener('change', () => {
    state.answers[question.id] = DIMENSIONS.includes(question.id) ? Number(input.value) : input.value;
    app.querySelector('#quiz-next').disabled = false;
  }));
  app.querySelector('#quiz-next').addEventListener('click', () => {
    if (state.answers[question.id] === undefined) return;
    if (state.step < QUESTIONS.length - 1) { state.step++; showQuestion(); } else showLeadForm();
  });
  app.querySelector('#quiz-back').addEventListener('click', () => {
    if (state.step > 0) { state.step--; showQuestion(); } else { app.innerHTML = intro; attachStart(); focusStep(); }
  });
  focusStep();
}
function showLeadForm() {
  app.innerHTML = `
    <span class="quiz-tag">YOUR REFLECTION IS COMPLETE</span><h3 style="margin-top:18px">Your next step is ready.</h3>
    <p class="lead-intro">Share your details so Aman can follow up about your snapshot. Your full report and PDF will be available here immediately.</p>
    <form id="lead-form" class="lead-form" novalidate>
      <div class="field"><label for="lead-name">Your name</label><input id="lead-name" name="name" autocomplete="name" required maxlength="100" value="${escape(state.name)}"></div>
      <div class="field"><label for="lead-email">Email address</label><input id="lead-email" name="email" type="email" autocomplete="email" required maxlength="254" aria-describedby="lead-privacy"></div>
      <div class="honeypot" aria-hidden="true"><label>Leave empty <input name="company-website" tabindex="-1" autocomplete="off"></label></div>
      <label class="checkbox-row"><input type="checkbox" name="marketing-consent" value="yes"><span>I would also like occasional coaching tips and offers from Aman Coaching. This is optional, and I can withdraw permission.</span></label>
      <p class="form-note" id="lead-privacy">Your details and answers will be shared with Aman Coaching. <button type="button" class="inline-button privacy-open">Read the privacy notice</button>. Your report is not automatically emailed.</p>
      <button class="btn btn--primary" type="submit">Get my report <span aria-hidden="true">→</span></button>
      <p class="form-status" id="lead-status" role="status"></p>
    </form>
    <div class="quiz-controls"><button class="back-button" id="lead-back" type="button">← Back</button><button class="inline-button" id="skip-lead" type="button">View without sharing details</button></div>`;
  app.querySelector('#lead-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (state.submitting) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = data.get('name').trim(), email = data.get('email').trim();
    const status = app.querySelector('#lead-status');
    if (!name || !isValidEmail(email)) { status.textContent = 'Please enter your name and a valid email address.'; status.classList.add('error'); return; }
    if (data.get('company-website')) { status.textContent = 'We could not process this submission. Please try again.'; return; }
    state.name = name;
    const result = getResult(state.answers);
    state.submitting = true;
    form.querySelector('button[type="submit"]').disabled = true;
    app.setAttribute('aria-busy', 'true');
    status.textContent = 'Saving your details…';
    status.classList.remove('error');
    try {
      await submitLead('leadership-snapshot', {
        name, email, role: result.role, 'preferred-focus': LABELS[state.answers.focus], focus: LABELS[result.focus],
        answers: JSON.stringify(state.answers), 'report-version': site.reportVersion,
        'marketing-consent': data.get('marketing-consent') ? 'yes' : 'no',
        'consent-version': site.consentVersion, 'submitted-at': new Date().toISOString(),
        'submission-id': state.submissionId, 'company-website': '',
      });
      showReport(true);
    } catch (error) {
      status.textContent = error.message || 'We could not send your details. Please try again or view your report without submitting.';
      status.classList.add('error');
    } finally {
      state.submitting = false;
      app.setAttribute('aria-busy', 'false');
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
  app.querySelector('#lead-back').addEventListener('click', () => { if (!state.submitting) showQuestion(); });
  app.querySelector('#skip-lead').addEventListener('click', () => { if (!state.submitting) { state.name = ''; showReport(false); } });
  wirePrivacy(app);
  focusStep();
}
function showReport(submitted) {
  const result = getResult(state.answers);
  shell.classList.add('is-result');
  const intro = result.allEstablished
    ? 'You describe established habits in all four areas. Use your chosen focus as an experiment to build on what is already working.'
    : result.balanced
      ? 'Your responses are balanced across the four areas. We have used your preferred focus to give you a practical starting point.'
      : result.guidance.intro;
  const tied = result.focusAreas.length > 1 && !result.balanced
    ? `Your responses also suggest attention to ${result.focusAreas.filter(id => id !== result.focus).map(id => LABELS[id].toLowerCase()).join(' and ')}. Start with one change rather than tackling every area at once.` : '';
  app.innerHTML = `
    <div class="result-header"><div><span class="quiz-tag">${state.name ? `${escape(state.name.toUpperCase())} / ` : ''}YOUR LEADERSHIP SNAPSHOT</span><h3>${result.guidance.title}</h3></div><button class="back-button" id="retake" type="button">Retake the quiz ↺</button></div>
    ${submitted ? '<p class="form-note" role="status">Your details have been received. Your report is ready below.</p>' : '<p class="form-note">Your details have not been submitted. You can keep a copy of this report.</p>'}
    <p class="result-lede">${intro} ${tied}</p>
    <div class="result-grid"><div><h4>Your responses</h4>${result.responses.map(r => `<div class="response-row"><strong>${r.label}</strong><p>${r.answer}</p></div>`).join('')}</div>
    <div><h4>${result.balanced ? 'Your starting point' : 'An area to draw on'}</h4><p class="strength-copy">${result.balanced ? 'Similar responses do not mean every area feels the same. Your chosen focus gives this plan a direction; change the order of the actions if a different starting point would help.' : result.strengths.map(id => GUIDANCE[id].strength).join(' ')}</p><div class="reflection-prompts"><strong>Two questions to take away</strong>${result.guidance.prompts.map(p => `<p>${p}</p>`).join('')}</div></div></div>
    <div class="result-actions"><h4>Your next 30 days</h4><ol class="action-cards">${result.guidance.actions.map(([when, title, body]) => `<li><small>${when}</small><h5>${title}</h5><p>${body}</p></li>`).join('')}</ol></div>
    <div class="result-footer"><button type="button" class="btn btn--primary" id="download-report">Download my report <span aria-hidden="true">↓</span></button><a class="text-link booking-link" href="${escape(site.bookingUrl || '#contact')}">Request a discovery call <span aria-hidden="true">↗</span></a></div>
    <p id="download-status" class="form-status" role="status"></p>
    <p class="result-disclaimer">This snapshot reflects six self-reported answers. It is a coaching reflection, not a validated assessment or an objective measure of leadership ability. Your answers and report clear when you reload or close this page. Download a copy to keep it.</p>`;
  app.querySelector('#retake').addEventListener('click', () => {
    state.step = 0; state.answers = {}; state.name = ''; state.submissionId = crypto.randomUUID();
    shell.classList.remove('is-result'); showQuestion();
  });
  app.querySelector('#download-report').addEventListener('click', async event => {
    const button = event.currentTarget, status = app.querySelector('#download-status');
    button.disabled = true; status.textContent = 'Preparing your PDF…';
    try {
      const { downloadReport } = await import('./report.js');
      await downloadReport({ result, answers: state.answers, name: state.name });
      status.textContent = 'Your PDF has been downloaded. Keep it somewhere private.';
    } catch {
      status.textContent = 'The PDF could not be created. Please try again, or use your browser’s print option to save this report.';
    } finally { button.disabled = false; }
  });
  app.querySelectorAll('.booking-link').forEach(wireBooking);
  focusStep();
}
const intro = app.innerHTML;
function attachStart() { app.querySelector('#quiz-start')?.addEventListener('click', showQuestion); }
attachStart();

const privacy = document.querySelector('#privacy-dialog');
function wirePrivacy(root = document) {
  root.querySelectorAll('.privacy-open').forEach(button => button.addEventListener('click', () => privacy.showModal()));
}
wirePrivacy();
privacy.querySelector('.dialog-close').addEventListener('click', () => privacy.close());
privacy.addEventListener('click', event => { if (event.target === privacy) { const r = privacy.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) privacy.close(); } });
function wireBooking(link) {
  if (site.bookingUrl) { link.href = site.bookingUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
}
document.querySelectorAll('.booking-link').forEach(wireBooking);
const contact = document.querySelector('#contact-form');
contact.addEventListener('submit', async event => {
  event.preventDefault();
  if (contact.dataset.submitting === 'true' || !contact.reportValidity()) return;
  const data = new FormData(contact), status = document.querySelector('#contact-status');
  if (data.get('company-website')) return;
  const name = data.get('name').trim(), email = data.get('email').trim();
  if (!name || !isValidEmail(email)) { status.textContent = 'Please enter your name and a valid email address.'; return; }
  contact.dataset.submitting = 'true';
  const button = contact.querySelector('button[type="submit"]'); button.disabled = true;
  status.textContent = 'Sending your request…'; status.classList.remove('error');
  try {
    await submitLead('discovery-request', { name, email, message: data.get('message').trim(), 'consent-version': site.consentVersion, 'company-website': '' });
    status.textContent = 'Your request has been received. Aman can follow up by email to arrange a conversation. A call is not yet booked.';
    contact.reset();
  } catch (error) {
    status.textContent = site.leadCapture === 'unconfigured' ? 'Your request has not been sent. This preview is not connected to lead capture yet.' : (error.message || 'We could not send your request. Please try again.');
    status.classList.add('error');
  } finally { contact.dataset.submitting = 'false'; button.disabled = false; }
});
