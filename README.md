# Aman Coaching — leadership quiz funnel

Initial website audit and implementation plan · 18 November 2026

**Objective:** turn website visitors into qualified coaching enquiries through a useful leadership self-reflection quiz, a personalised report and an optional discovery call.

**Current release.** Aman Davegun’s executive coaching site includes a Kora-style homepage with her original walkway photograph as a fullscreen hero, a fifteen-statement Leadership Snapshot, a discovery-call route and a privacy notice. Visitors see their five scores, choose or receive one weekly action, and download a PDF without supplying details. Optional report and call requests go to the private Vercel store. Email delivery is disabled in preview. The confirmed direct business address is **achieve@amancoaching.com**.

[Open the redesigned Vercel preview](https://aman-coaching-snapshot-20261118-ihesfftp1-0013s-projects.vercel.app) (Vercel access required). [Release verification](docs/RELEASE_STATUS.md) · [QA results](docs/QA_REPORT.md) · [Editing and analytics guide](docs/CLIENT_HANDOVER.md).

## Run the current build

```sh
npm ci
npm run dev
```

```sh
npm test
npm run test:e2e
npm run build
npm run audit:commits
```

Install browser dependencies once with `npx playwright install chromium` before browser tests. The static local preview deliberately does not submit leads. A Vercel build enables `/api/leads`, which saves validated submissions privately. Review them in the project’s Storage dashboard; her email credentials are not required.

- [Vercel deployment and private lead review](docs/DEPLOYMENT.md)
- [Client handover](docs/CLIENT_HANDOVER.md)
- [Hackathon evidence and deadlines](docs/HACKATHON_EVIDENCE.md)
- [Timestamped audit log](AUDIT_LOG.md)
- [Design decisions](docs/DESIGN_PLAN.md) and [asset sources](docs/ASSET_SOURCES.md)

The free lead magnet has no checkout. Client payment for this build is a separate transaction and has not been verified. Payment and delivery evidence must both precede **18 November 2026, 18:00 GMT**; target handover is 17:30 GMT. Full commit timestamps can be exported with `npm run audit:commits`.

## Original audit and planning reference

The sections below were recorded in the initial commit. They describe the original proposal, not an assertion that every future feature has been built. The current implementation and deployment guide above take precedence.

## 1. Website audit

### Scope and evidence

Reviewed public page content, HTML metadata, navigation destinations and HTTP redirects on 18 November 2026. Sources are linked below. No forms were submitted. No access to Framer, analytics, email systems or booking accounts was available. This is a content and funnel audit, not a rendered visual, accessibility, security or performance assessment. Conversion impact is a hypothesis until measured.

| Priority | Finding and evidence | Recommended action |
| --- | --- | --- |
| P0 | Discovery-call buttons use a [Framer link](https://framer.link/nXsH2Pr) that resolves to template remix/login. | Replace every booking destination and test confirmation. |
| P0 | [Contact](https://amanachieve.framer.website/contact) contains a Franco support email and US contact details. | Publish verified business details. |
| P0 | [About](https://amanachieve.framer.website/about), [Pricing](https://amanachieve.framer.website/pricing) and [FAQ](https://amanachieve.framer.website/faq) contain unrelated template content. | Replace or remove these routes and repair incoming links. |
| P1 | The [homepage](https://amancoaching.com) asks for calls; newsletter signup offers little immediate value. | Introduce the quiz as the primary entry point. |
| P1 | Homepage outcomes are broad; six services compete. | Lead with one audience, problem and next step. |
| P1 | Homepage credentials offer credibility, but extracted counters conflict with surrounding claims. | Verify figures; check animated counter rendering before diagnosing a display defect. |
| P1 | Footer social links point to internal content; [LinkedIn](https://amanachieve.framer.website/blog/5-essential-strategies-for-sustainable-business-growth) opens an article. | Audit all destinations. |
| P1 | The custom domain redirects to Framer; canonical metadata names the Framer domain. | Make the chosen custom domain canonical. |

Additional source checks: `/robots.txt` and `/sitemap.xml` on the custom domain returned 404 during this audit; review crawl configuration at launch. No standalone privacy notice was found in the inspected navigation; that does not establish that none exists. Repeated extracted sections may be responsive variants, not visible duplication.

### Strategic interpretation

The proposed funnel should help a visitor recognise a specific leadership challenge before asking for a conversation. Preserve the emphasis on practical, sustainable leadership, but replace the generic entry point with a clear exchange: a short reflection exercise in return for a useful, personalised action plan.

Fix the existing trust and booking problems before directing traffic to the new funnel. A quiz will not compensate for visitors finding unrelated pricing or a nonfunctional booking path.

## 2. Audience and offer

**Working primary audience:** mid-to-senior leaders in complex organisations who feel stretched by competing priorities, difficult conversations or too much responsibility. Healthcare is a potential specialist entry point to validate with Aman; the first version should not assume all prospects work in healthcare.

**Primary commercial outcome:** qualified discovery calls for individual leadership coaching. Corporate buyers should have a separate enquiry route rather than being pushed through an individual self-assessment.

**Proposed lead magnet:** the **Leadership Clarity Snapshot**.

**Promise:** “Find your next leadership focus — and leave with a practical plan for the next 30 days.”

**Draft supporting copy:** “Reflect on how you prioritise, communicate, delegate and sustain your energy. Answer 12 questions to receive your leadership snapshot, your strongest area and three actions to try.”

Aim for 3–4 minutes, then validate timing with real users before publishing that claim. Position the tool as coaching reflection, not a validated psychometric test, diagnosis, performance rating or predictor of career success.

## 3. Proposed visitor journey

1. **Arrive:** homepage, dedicated quiz landing page, LinkedIn post or referral link introduces one concrete benefit.
2. **Understand the exchange:** show question count, estimated time, sample report and how email is used before the quiz starts.
3. **Reflect:** answer 12 questions, one per screen, with progress, back navigation and answers retained during the session.
4. **Choose delivery:** after the final question, request an email for the full report. First name is optional; employer, phone and job title are not required. Provide a clear option to view a brief summary without email.
5. **Receive value:** show the personalised report immediately after successful submission, provide a PDF download and email a secure report link. Do not make the visitor wait for email delivery to see the result.
6. **Take a next step:** offer an optional discovery call framed around their chosen leadership focus. State duration once confirmed with Aman.
7. **Continue with permission:** send a short follow-up sequence only to people who separately opt into coaching tips and offers.

Keep the booking route available to visitors who are ready to speak immediately. Do not require a quiz to book.

## 4. Homepage and landing-page redesign

Proposed homepage order:

1. **Hero:** audience, specific outcome, primary “Take the leadership quiz” CTA and secondary discovery-call link.
2. **Recognition:** three familiar situations such as constant firefighting, carrying too many decisions and avoiding difficult conversations.
3. **Report preview:** a clearly labelled fictional example showing the actual deliverable and three practical actions.
4. **How it works:** reflect → receive your snapshot → choose your next step.
5. **Meet Aman:** approved portrait, relevant experience, coaching approach and verified credentials.
6. **Evidence:** permissioned testimonials or case studies with context; omit unsupported numbers and logos.
7. **Coaching offer:** clarify who individual coaching helps, what the engagement involves and how to explore fit. Link corporate enquiries separately.
8. **FAQs:** assessment limitations, email use, report access and what happens on a call.
9. **Final quiz CTA and footer:** accurate contact, social, privacy and booking destinations.

Use a focused `/leadership-quiz` landing page for campaigns, with fewer navigation distractions. Establish reusable typography, spacing and colour tokens, an approachable professional tone and readable mobile layouts. Approve visual direction with Aman before implementation; current visual styling has not been assessed in a browser.

## 5. Quiz specification

### Draft question set

Ask respondents to consider the past four weeks. Use the same positive wording and scale throughout: **1 Almost never · 2 Rarely · 3 Sometimes · 4 Often · 5 Almost always**. All 12 scored questions are required; allow the visitor to exit at any point. Pilot the wording with Aman and representative leaders before release.

| Dimension | ID | Statement |
| --- | --- | --- |
| Strategic clarity | C1 | I can name the leadership priorities that matter most right now. |
| Strategic clarity | C2 | I protect time for important work beyond immediate requests. |
| Strategic clarity | C3 | I make decisions using a clear sense of what success looks like. |
| Confidence and influence | I1 | I communicate my perspective clearly when the stakes are high. |
| Confidence and influence | I2 | I address difficult conversations promptly and constructively. |
| Confidence and influence | I3 | I ask stakeholders for the support or alignment I need. |
| Delegation and team ownership | D1 | I give others clear outcomes and room to decide how to deliver them. |
| Delegation and team ownership | D2 | I clarify ownership so decisions do not all come back to me. |
| Delegation and team ownership | D3 | I help people develop rather than taking their work back. |
| Sustainable leadership | S1 | I set realistic boundaries around my availability. |
| Sustainable leadership | S2 | I notice pressure early and adjust how I work. |
| Sustainable leadership | S3 | I make time to recover and reflect between demanding periods. |

Optional, unscored context after the questions: “Which area would you most like to work on?” with the four dimensions as choices. Use this to tailor examples and the call invitation; never silently change the score. Avoid collecting sensitive workplace narratives in the MVP.

### Scoring and result selection

- Each dimension contains three answers. Calculate `dimensionScore = round(((sum - 3) / 12) * 100)`.
- Scores describe reported habits on this questionnaire. They are not population percentiles or externally benchmarked leadership ability.
- Use unrounded values for comparisons. Highest dimension = reported strength; lowest = suggested development focus.
- If dimensions tie, display joint strengths/focuses rather than inventing precision. If a single action sequence is needed, use the respondent's chosen focus when tied, otherwise a documented order: clarity, influence, delegation, sustainability.
- Suggested content bands: 0–33 “Explore first”, 34–66 “Build consistency”, 67–100 “Build on this”. These are editorial groupings, not validated thresholds; Aman must review them.
- If all four scores are equal, say the response pattern is balanced and invite the visitor to choose a focus. Do not manufacture a distinctive personality type.
- Do not calculate an overall leadership grade or label a person as a “weak leader”.
- Recalculate on the server from validated answer IDs and values; never trust a browser-supplied result.

**Example:** clarity answers 2, 3, 2 produce 33/100; influence 4, 4, 4 produces 75; delegation 3, 3, 3 produces 50; sustainability 2, 2, 2 produces 25. The report recognises influence and suggests sustainability as the initial focus. A different optional preference can guide the invitation without altering those results.

## 6. Personalised report

Deliver the same underlying report as accessible HTML and a printable/downloadable PDF. Aim for a concise 4–6 pages, adjusted after layout review.

| Section | Personalisation and value |
| --- | --- |
| Snapshot | Optional first name, completion date and a supportive interpretation of reported habits. |
| Four dimensions | Labelled score bars, text equivalents and plain-language explanations. Avoid implying clinical precision. |
| Strength | Explain the highest area, including how to apply it and what overusing it might look like. Handle ties explicitly. |
| Development focus | Explain the lowest area using relevant question responses, with language such as “Your answers suggest…”. |
| Three actions | One immediate experiment, one weekly habit and one 30-day review, selected from coach-approved content. |
| Reflection and next step | Two focused prompts, space to note progress and an optional discovery-call link. |

**Example sustainability action plan:** this week, identify one recurring availability pressure and communicate a realistic boundary; each week, protect one reflection block; after 30 days, review what changed and decide what to keep. Adapt actions to the person's authority and context; avoid promises of guaranteed outcomes.

Use a versioned library of Aman-approved interpretations and actions for the first release. Deterministic report assembly gives every answer pattern a predictable, reviewable result and avoids requiring generative AI to launch. If AI-written narrative is later introduced, keep scoring deterministic, disclose processing and require grounded output plus a safe template fallback.

## 7. Email and discovery-call handoff

| Timing | Message | Eligibility |
| --- | --- | --- |
| Immediately | Requested report link, short summary and download/access help. | People requesting email delivery. |
| Day 2 | One practical exercise matched to their focus. | Separate marketing opt-in. |
| Day 5 | A relevant, approved coaching example or reflection. | Separate marketing opt-in. |
| Day 8 | Invitation to discuss their leadership focus on a discovery call. | Separate marketing opt-in. |

The delivery email should focus on fulfilling the requested report. Confirm final consent wording and message classification before launch. Keep marketing permission optional and unchecked; refusing marketing must not block the report. Record permission wording/version, timestamp and source. Unsubscribe and booking events should stop the relevant promotional sequence.

Use a verified sender domain and test authentication, bounce handling and spam placement. A failed delivery should offer resend without creating duplicate leads or duplicate sequences. Confirm bookings through the booking provider's server event where supported; a click alone does not establish a booked call.

## 8. Proposed implementation

**Provisional architecture:** retain the existing marketing site initially, repair its links and add a dedicated quiz application. Prefer a same-domain path if hosting supports it; otherwise use an approved subdomain with deliberate attribution and cross-domain navigation. Decide whether to rebuild the marketing site only after confirming access, budget and editing needs.

Select the application framework, database, email provider and booking integration during technical discovery. There is no existing application in this repository, and none is assumed. Required capabilities:

- Mobile-friendly quiz with keyboard navigation, visible labels, focus management, reduced-motion support, useful validation and recoverable errors.
- Server-side validation, scoring and report assembly from versioned question/content definitions.
- Minimal lead storage linked to a quiz attempt and report version; separate delivery status and marketing consent.
- Private report storage with high-entropy, expiring access tokens, no personal information in URLs, no public indexing or shared caching, and rate-limited access/resend endpoints. Define expiry in user-facing copy and provide a recovery path.
- PDF generation from the same report model as HTML, checked for clipping, readable text and correct page breaks.
- Reliable queued email delivery with retry limits, idempotent submissions and verified provider callbacks.
- Secrets held on the server, restricted operational access and logs that avoid answers, email addresses and report tokens.
- Accessible content editing process for Aman, initially through versioned files with review rather than a bespoke admin dashboard.

Core records: `QuizAttempt` (question version, answers, scores, completion time), `Lead` (email, optional name), `ConsentRecord` (purpose, state, wording version, timestamp), `Report` (content/scoring version, access expiry), and `Delivery` (provider reference, status, retry count). Define deletion and retention periods with the business before production; include provider copies and backups in that decision.

Publish a clear privacy notice identifying the business, purposes, processors, retention and contact route. Review the final data flow, marketing permissions and analytics choices against applicable requirements before collecting live leads. Do not collect employer names, medical information or third-party employee details for this quiz.

## 9. Measurement and optimisation

Instrument the funnel before launching campaigns. Collect aggregate events without sending answer values, names, email addresses or private report URLs to analytics.

| Event / measure | Definition |
| --- | --- |
| `quiz_landing_view` → `quiz_start` | Start rate = unique starts / unique quiz landing visits. |
| `quiz_start` → `quiz_complete` | Completion rate = completed attempts / started attempts. |
| `quiz_complete` → `lead_captured` | Capture rate = successful email submissions / completed attempts. |
| `report_ready`, `report_view`, `report_download` | Report availability, consumption and PDF usage; track failures separately. |
| `report_view` → `booking_click` | Interest in discussing the result. |
| `booking_confirmed` | Provider-confirmed bookings / captured leads, using an agreed attribution window. |
| Qualified and attended calls | Coach-recorded fit and attendance; evaluate lead quality alongside volume. |
| `report_failed`, `delivery_failed` | Operational failures requiring action. |

Use anonymous attempt IDs and deduplicate events. Preserve approved campaign attribution without carrying personal data in URLs. Confirm analytics/cookie behaviour before production.

No baseline conversion data is available. Establish a baseline before setting commercial targets. First optimise the largest observed drop-off, then test one variable at a time: headline, report preview or delivery step. Judge success through qualified calls and usefulness feedback, not email volume alone. Suppress marketing to unsubscribed leads regardless of quiz behaviour.

## 10. Delivery plan and acceptance criteria

### Phase 1 — validate and repair

- [ ] Confirm priority audience, coaching offer, booking duration and qualification criteria with Aman.
- [ ] Obtain access to the existing site and confirm domain/hosting ownership.
- [ ] Correct booking links, template routes, footer destinations, contact details and canonical configuration.
- [ ] Verify credentials, statistics, testimonials and permitted use of client logos.
- [ ] Approve the question set, sample reports, privacy text and email wording.

**Exit:** all public conversion paths are relevant and working; the coach has approved the proposed content and assessment limitations.

### Phase 2 — prototype the experience

- [ ] Design homepage/landing page, quiz, optional email step, results and report layouts for mobile and desktop.
- [ ] Write content for all four dimensions and score bands, including ties and balanced profiles.
- [ ] Review representative report outputs with Aman and a small group of target users.
- [ ] Confirm editing workflow, integrations, hosting and data lifecycle.

**Exit:** users understand the offer and report, can complete the flow unaided, and the proposed time estimate has evidence.

### Phase 3 — build the complete funnel

- [ ] Implement quiz, server validation, deterministic scoring and versioned report assembly.
- [ ] Add immediate HTML results, downloadable PDF and private email delivery.
- [ ] Integrate booking, consent-aware follow-ups and operational failure handling.
- [ ] Add analytics, privacy controls and deployment configuration.

**Exit:** a complete attempt produces the correct report and delivery, with marketing sent only when permission exists.

### Phase 4 — verify and launch

- [ ] Test scoring extremes, mixed answers, thresholds, ties, equal scores, malformed submissions and content-version consistency.
- [ ] Test the full journey, no-email summary, declined marketing, refresh/back behaviour, repeat submissions and delivery/booking failures.
- [ ] Verify report token expiry, private access, input validation, rate limits and webhook verification.
- [ ] Review keyboard/screen-reader flow, contrast, mobile layouts and PDFs with long names and all result combinations.
- [ ] Verify links, email delivery, unsubscribe suppression, attribution and booking confirmation using test accounts.
- [ ] Confirm no template content, placeholder contacts or unverified claims remain on linked public routes.
- [ ] Agree launch ownership, monitoring, rollback and a post-launch review date.

**Exit:** all critical journeys pass, real integrations are verified, and failures have a usable recovery path. Start with a controlled launch, then review aggregate conversion and lead quality before expanding traffic.

## 11. Decisions to resolve before implementation

These do not block this planning commit:

- Is healthcare the initial niche, or should launch target leaders across sectors?
- Which coaching engagement should follow the report, and what makes an enquiry qualified?
- What site, domain, email and booking systems are already owned and available?
- Which biography, credentials, outcomes, portraits and testimonials can be published?
- Who approves quiz interpretations, maintains content and follows up enquiries?
- What retention, report-link expiry, campaign budget and launch constraints should apply?

**MVP boundary:** one audience-led quiz, four dimensions, deterministic personalised HTML/PDF reports, email delivery, optional nurture and a working booking handoff. Client accounts, employer dashboards, team benchmarking, paid assessments, multilingual support and AI-generated advice are later decisions.
