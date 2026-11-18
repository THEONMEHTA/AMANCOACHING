# Deploy and hand over Aman Coaching

Prepared for 18 November 2026. The code is deployable; an actual production URL, form notifications and client acceptance must be verified separately. Do not present a local preview or a successful build as live delivery.

## Supported deployment: Netlify

This release uses Netlify Forms for lead persistence, spam filtering and email notification. It does not require an application server or an email API key. Deploying the same static files to Vercel, Replit or another host will **not** provide lead capture; migrate the forms backend before choosing another host.

1. Import this Git repository into the intended Netlify account, or connect its remote repository. Deploy the final committed branch from the repository root. Build command and publish directory are set in `netlify.toml` (`npm ci && npm test && npm run build`, `dist`). Node 22 is specified.
2. Enable form detection in the site's Netlify Forms settings before the production deploy. Confirm both `leadership-snapshot` and `discovery-request` are discovered after deployment. The static HTML definitions include every posted field.
3. Netlify sets `NETLIFY=true` and `URL` during connected builds. The build uses these to enable native form submission, canonical/share metadata and the sitemap. Leave `VITE_BOOKING_URL` unset to use the on-page request form. If supplied later, it must be a verified HTTPS calendar URL.
4. In **Forms → Submission notifications → Add notification**, select email notifications for both forms (or all forms) and set the recipient to **achieve@amancoaching.com**. Use a subject such as `Aman Coaching: %{formName} / %{submissionId}`.
5. If Netlify asks for recipient confirmation, Aman must confirm the email. Some accounts require the recipient to be an active team member instead. Do not mark email delivery complete until notifications are active and a controlled submission has arrived in her inbox.
6. Submit one clearly identified QA entry to each live form, using an email address you control and with marketing unchecked. Confirm each record exists in the Netlify dashboard and the notification arrives at `achieve@amancoaching.com`. These tests may send real notification emails to the explicitly requested destination; remove QA records afterwards.
7. Download a report from the live site, follow the request/contact links and test on a phone. Confirm the email Reply-To is the submitter and request confirmation does not claim a booked appointment.
8. Use the Netlify-provided HTTPS URL for immediate handover. Map `amancoaching.com` only with the owner's DNS access and an agreed cutover; preserve the previous site's settings for rollback. Repeat form checks after domain changes.
9. Send the client the actual live URL, a report download, the source handover and lead inbox instructions. Record when it was sent and the acknowledgement separately. No client handover message has been sent by this build session.

Official references checked 18 November 2026: [form setup](https://docs.netlify.com/manage/forms/setup/), [notifications](https://docs.netlify.com/manage/forms/notifications/), [build configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Local development and verification

```sh
npm ci
npm run dev
```

Open the Local URL printed by the command. HTML/public assets are copied at startup; restart after editing them. JavaScript and CSS rebuild while the server runs. The local preview deliberately does not send real form submissions.

```sh
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm audit
npm run audit:commits
```

The browser tests run against an isolated local server and mock submission responses. They verify UI behaviour and payloads, not live Netlify storage or mailbox delivery. Tests never send messages to Aman.

For a static archive intended **only for Netlify**, run `NETLIFY=true npm run build`, upload `dist`, enable form detection and configure notifications as above. A source-connected Netlify build is preferred because it automatically provides the deployment origin. Outside Netlify, `npm run build` defaults to submission-disabled mode to avoid pretending leads were received by an unsupported host.

## Operating the funnel

- **Leads:** Netlify Forms → `leadership-snapshot`. Includes name, email, role, responses, selected focus, report version and separate marketing preference.
- **Enquiries:** Netlify Forms → `discovery-request`. Includes name, email and optional enquiry. Both forms use a honeypot. Netlify may quarantine submissions as spam; review those when troubleshooting.
- **Reports:** generated in the visitor's browser and available as HTML and a three-page PDF. They are not emailed automatically and do not persist after reload. No API inference or external assessment service receives answers.
- **Marketing:** no automatic campaign is installed. Contact only opted-in leads for tips/offers; treat a specific enquiry separately. Maintain suppression records if exporting to an email tool. A received lead is not marketing permission by itself.
- **Retention:** the privacy notice proposes a 90-day review. Assign an owner and schedule deletion/review in the client's process; this application does not automate deletion or enforce a retention clock.
- **Editing:** quiz questions and all four report variants are in `src/quiz.js`; visual tokens in `src/style.css`; public settings in `src/site.js`; shared PDF layout in `src/report.js`.
- **Access:** client should own the Netlify site, notifications and repository access. Review account permissions, usage limits and form storage with her before launch. Never put tokens or submission exports into Git.
- **Rollback:** restore the last verified Netlify deployment. For a domain cutover, keep the old DNS configuration until the new site and email flow have passed checks.

## Launch status to record

- Production URL and deployed source SHA: not yet recorded.
- Both forms detected: not yet verified on a live deployment.
- `achieve@amancoaching.com` notification confirmation: not yet verified.
- Controlled submissions received in dashboard and mailbox: not yet verified.
- Client copy/privacy/portrait publication approval: not yet recorded.
- Payment and delivery evidence: see `HACKATHON_EVIDENCE.md`.
