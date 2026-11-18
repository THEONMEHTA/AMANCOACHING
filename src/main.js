import './style.css';
import './kora.css';
import { calculate, disclaimer, questionsFor } from './quiz.js';
import { loadContent, loadSite, site } from './site.js';
import { submitLead } from './leads.js';
import { track } from './analytics.js';

const byId = (id) => document.getElementById(id);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );
if (document.body.dataset.page === 'home') {
  const oldRoutes = {
    '#quiz': '/leadership-quiz',
    '#contact': '/book',
    '#coaching': '/#approach',
    '#report': '/#snapshot',
  };
  if (oldRoutes[location.hash]) location.replace(oldRoutes[location.hash]);
  else track('homepage_viewed');
}
const menu = document.querySelector('details.menu');
menu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) menu.open = false;
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href="/book"]');
  if (link && (document.body.dataset.page === 'home' || byId('result-title')))
    track('booking_clicked', { source: byId('result-title') ? 'results' : 'homepage' });
});
const sample = byId('sample-bars');
if (sample && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        sample.classList.add('in-view');
        observer.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  observer.observe(sample);
}
const settings = loadSite()
  .then((config) => {
    if (site.emailAvailable && byId('delivery-privacy'))
      byId('delivery-privacy').textContent =
        'If you request an email, Resend processes your address and report to deliver your copy.';
    if (byId('credentials'))
      byId('credentials').replaceChildren(
        ...config.credentials.map((label) =>
          Object.assign(document.createElement('li'), { textContent: label })
        )
      );
    if (Number.isInteger(config.sessions) && config.sessions > 0 && byId('session-copy'))
      byId('session-copy').prepend(
        'Over ' + config.sessions + ' sessions, we work towards your goals. '
      );
    if (site.bookingUrl && byId('calendar')) {
      const link = Object.assign(document.createElement('a'), {
        href: site.bookingUrl,
        className: 'button',
        textContent: 'Open Aman’s calendar ↗',
        referrerPolicy: 'no-referrer',
      });
      byId('calendar').append(link);
      byId('contact-form').querySelector('h2').textContent = 'Or request a call';
    }
  })
  .catch(() => {}); // The static contact destination remains available.

function bindRequest(form, kind, extra, onSuccess) {
  let id = crypto.randomUUID();
  const status = form.querySelector('[role=status]');
  form.addEventListener('input', () => {
    id = crypto.randomUUID();
    status.textContent = '';
    const submitted = form.querySelector('button[hidden]');
    if (submitted) {
      submitted.hidden = false;
      submitted.disabled = false;
      for (const field of form.querySelectorAll('input,textarea')) field.disabled = false;
    }
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('button[type=submit],button:not([type])');
    if (submit.disabled) return;
    submit.disabled = true;
    status.textContent = 'Saving your request…';
    try {
      const fields = Object.fromEntries(new FormData(form));
      const response = await submitLead(kind, { ...fields, ...extra(), 'submission-id': id });
      onSuccess(response);
      submit.hidden = true;
      for (const field of form.querySelectorAll('input,textarea')) field.disabled = true;
    } catch (error) {
      status.textContent = error.message;
      submit.disabled = false;
    }
  });
}
for (const form of document.querySelectorAll('#contact-form, #home-contact-form')) {
  bindRequest(
    form,
    'discovery-request',
    () => {
      // The homepage form folds its interest choice into the stored message field.
      const interest = form.querySelector('input[name=interest]:checked')?.value;
      const message = form.querySelector('textarea[name=message]')?.value.trim() || '';
      return interest ? { message: ('Interested in: ' + interest + '. ' + message).trim() } : {};
    },
    () => {
      form.querySelector('[role=status]').textContent =
        'Your call request was saved privately. No appointment has been booked.';
    }
  );
}
initialiseHome();

function initialiseHome() {
  if (document.body.dataset.page !== 'home') return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('k-js');
  // Reveal headings and cards as they enter the viewport.
  const revealed = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealed.forEach((el) => io.observe(el));
  } else revealed.forEach((el) => el.classList.add('is-in'));

  // Word-by-word statement that brightens while scrolling.
  const words = document.querySelector('.k-words');
  if (words && !reduced) {
    const label = words.textContent;
    words.setAttribute('aria-label', label);
    words.innerHTML = label
      .split(' ')
      .map((word) => '<span class="w" aria-hidden="true">' + esc(word) + '</span>')
      .join(' ');
    const spans = [...words.children];
    const update = () => {
      const box = words.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight - box.top) / (innerHeight * 0.75)));
      spans.forEach((span, index) =>
        span.style.setProperty(
          '--o',
          String(Math.min(1, Math.max(0.18, progress * spans.length * 1.1 - index)))
        )
      );
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  // Process steps: one expanded panel at a time.
  const phases = document.querySelectorAll('.k-phase');
  phases.forEach((phase) =>
    phase.querySelector('button').addEventListener('click', () => {
      phases.forEach((other) => {
        const open = other === phase;
        other.classList.toggle('is-open', open);
        other.querySelector('button').setAttribute('aria-expanded', String(open));
      });
    })
  );

  // FAQ filter pills.
  const tabs = document.querySelectorAll('.k-tabs button');
  const items = document.querySelectorAll('.k-faq details');
  const show = (group) => {
    tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.faq === group)));
    items.forEach((item) => (item.hidden = item.dataset.faq !== group));
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => show(tab.dataset.faq)));
  if (tabs.length) show('coaching');
}

async function initialiseQuiz() {
  const app = byId('quiz-app');
  const content = await loadContent('snapshot');
  const questions = questionsFor(content);
  const answers = Array(questions.length).fill(null);
  const tracked = new Set();
  let step = 0,
    result,
    focusId;
  const referrer = document.referrer ? new URL(document.referrer) : null;
  const startSource =
    referrer?.origin === location.origin && referrer.pathname === '/' ? 'homepage' : 'other';
  const focusHeading = () => app.querySelector('[tabindex="-1"]')?.focus();
  function question() {
    const item = questions[step];
    app.innerHTML =
      '<div class="question-box"><div class="question-meta"><span>Question ' +
      (step + 1) +
      ' of 15</span><span>Last four weeks</span></div><div class="track" aria-hidden="true"><i style="width:' +
      ((step + 1) / 15) * 100 +
      '%"></i></div>' +
      '<h1 class="statement" id="statement" tabindex="-1"><span class="sr">Question ' +
      (step + 1) +
      ' of 15. </span>' +
      esc(item.statement) +
      '</h1>' +
      '<form id="question-form"><fieldset class="choice-set" aria-labelledby="statement"><legend class="sr">How often?</legend><div class="choices">' +
      content.choices
        .map(
          (label, i) =>
            '<label class="choice"><input type="radio" name="rating" required value="' +
            (i + 1) +
            '" ' +
            (answers[step] === i + 1 ? 'checked' : '') +
            '><b>' +
            (i + 1) +
            '</b><span>' +
            esc(label) +
            '</span></label>'
        )
        .join('') +
      '</div></fieldset><div class="q-actions"><button class="quiet" type="button" id="back">← Back</button><button class="button" type="submit">' +
      (step === 14 ? 'See my results' : 'Continue') +
      ' →</button></div></form></div>';
    focusHeading();
    byId('question-form').addEventListener('change', (event) => {
      answers[step] = Number(event.target.value);
    });
    byId('back').onclick = () => {
      if (step) {
        step--;
        question();
      } else {
        app.innerHTML = intro;
        activateStart();
        byId('start').focus();
      }
    };
    byId('question-form').onsubmit = (event) => {
      event.preventDefault();
      if (!tracked.has(step)) {
        track('quiz_step_completed', { step: step + 1 });
        tracked.add(step);
      }
      if (step < 14) {
        step++;
        question();
        return;
      }
      result = calculate(content, answers);
      focusId = result.balanced ? null : result.low[0].id;
      track('quiz_completed');
      renderResult();
      track('result_viewed');
    };
  }
  function focusContent() {
    const area = result.low.find((row) => row.id === focusId);
    const explanation = result.balanced
      ? 'All five areas have the same score. Choose the habit you would like to practise.'
      : result.low.length > 1
        ? 'These areas share your lowest score: ' +
          result.low.map((row) => row.label).join(', ') +
          '. Here is one place to start.'
        : '';
    const heading = area ? esc(area.label) : 'Choose your focus';
    const choice = result.balanced
      ? '<label class="focus-select">Focus for this week<select id="pick-focus"><option value="">Choose an area</option>' +
        result.low
          .map(
            (row) =>
              '<option value="' +
              esc(row.id) +
              '" ' +
              (row.id === focusId ? 'selected' : '') +
              '>' +
              esc(row.label) +
              '</option>'
          )
          .join('') +
        '</select></label>'
      : '';
    return (
      '<h1 id="result-title" tabindex="-1">' +
      heading +
      '</h1><div class="result-focus">' +
      (explanation ? '<p>' + esc(explanation) + '</p>' : '') +
      choice +
      (result.allHigh
        ? '<p>You report consistent habits across all five areas. Use this week to refine one of them.</p>'
        : '') +
      (area
        ? '<p role="status">' +
          (result.allHigh ? '' : esc(area.growth) + ' ') +
          '<strong>Try this week.</strong> ' +
          esc(area.action) +
          '</p>'
        : '') +
      '</div>'
    );
  }
  function renderResult() {
    const strengths = result.high.map((row) => esc(row.label) + ' (' + row.score + '/5)').join(', ');
    app.innerHTML =
      '<article class="results"><p class="eyebrow">Where to focus next</p><div id="focus-content">' +
      focusContent() +
      '</div>' +
      '<div class="result-grid"><section class="paper"><h2>Your five areas</h2><div class="bars">' +
      result.rows
        .map(
          (row) =>
            '<div class="bar-row"><span>' +
            esc(row.label) +
            '</span><b>' +
            row.score +
            ' / 5</b><i style="--score:' +
            (row.total / 15) * 100 +
            '%"></i><span class="score-band">' +
            row.band +
            '</span></div>'
        )
        .join('') +
      '</div></section>' +
      '<section class="quiz-guide"><h2>Your most consistent area</h2><p>' +
      (result.balanced
        ? 'All five areas are level at ' + result.high[0].score + '/5.'
        : (result.high.length > 1 ? 'Joint highest: ' : '') +
          strengths +
          '. ' +
          (result.high.length === 1
            ? esc(result.high[0].strength)
            : 'You reported these habits equally often.')) +
      '</p></section></div>' +
      '<p class="fine">' +
      disclaimer +
      '</p><section class="report-next"><h2>Keep your Snapshot</h2><div class="report-actions"><button class="button" id="pdf">Download my PDF ↓</button><button class="quiet" id="request-copy" aria-expanded="false" aria-controls="copy-form">' +
      (site.emailAvailable ? 'Email me my snapshot' : 'Save a snapshot request') +
      '</button></div><p class="status" id="pdf-status" role="status"></p>' +
      '<form class="email-form" id="copy-form" hidden><p>' +
      (site.emailAvailable
        ? 'Receive a copy of these five scores and your action by email.'
        : 'This preview saves your request privately. It sends no email. Download the PDF for a copy now.') +
      '</p><label>Email address<input name="email" type="email" maxlength="254" autocomplete="email" required></label><label class="check"><input type="checkbox" name="marketing-consent" value="yes">I would also like coaching updates from Aman.</label><p class="fine"><a href="/privacy" target="_blank" rel="noopener">How we use your details (opens a new tab)</a></p><button type="submit" class="button">' +
      (site.emailAvailable ? 'Email my snapshot' : 'Save my request') +
      '</button><p class="status" role="status"></p></form>' +
      '<h2>Discuss my results with Aman</h2><p>Bring one real leadership challenge. We’ll talk through what you want to change and whether coaching is the right fit.</p><a class="text-link" href="/book">Book a free discovery call ↗</a></section></article>';
    focusHeading();
    function syncFocus() {
      const pick = byId('pick-focus');
      if (pick)
        pick.onchange = () => {
          focusId = pick.value || null;
          byId('focus-content').innerHTML = focusContent();
          syncFocus();
          byId('pick-focus').focus();
          byId('copy-form').dispatchEvent(new Event('input'));
        };
    }
    syncFocus();
    byId('pdf').onclick = async () => {
      try {
        const { createReport } = await import('./report.js');
        createReport(result, focusId).save('aman-leadership-snapshot.pdf');
      } catch {
        byId('pdf-status').textContent =
          'The PDF could not be downloaded. Your full report is still on this page.';
      }
    };
    byId('request-copy').onclick = () => {
      const form = byId('copy-form');
      form.hidden = !form.hidden;
      byId('request-copy').setAttribute('aria-expanded', String(!form.hidden));
      if (!form.hidden) form.elements.email.focus();
    };
    bindRequest(
      byId('copy-form'),
      'leadership-snapshot',
      () => ({
        version: content.version,
        totals: result.rows.map((row) => row.total),
        focus: focusId,
        delivery: site.emailAvailable ? 'email' : 'store',
      }),
      (response) => {
        byId('copy-form').querySelector('[role=status]').textContent = response.emailSent
          ? 'Your snapshot was accepted for email delivery.'
          : 'Your request was saved privately. No email was sent.';
        track('report_requested');
      }
    );
  }
  const intro = app.innerHTML;
  let started = false;
  function activateStart() {
    byId('start').disabled = false;
    byId('start').onclick = () => {
      if (!started) {
        track('quiz_start', { source: startSource });
        started = true;
      }
      question();
    };
  }
  await settings;
  activateStart();
}
if (byId('quiz-app'))
  initialiseQuiz().catch(() => {
    byId('load-status').textContent = 'The questions could not load. Refresh this page to try again.';
  });
