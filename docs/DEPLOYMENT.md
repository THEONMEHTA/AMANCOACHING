# Vercel preview and private storage

The existing project is `aman-coaching-snapshot-20261118` under `0013s-projects`. Its London private Blob store, `aman-coaching-preview-leads`, is attached to Preview and Development. Deployment Protection was turned off on 18 November 2026 so the hackathon committee can view previews. Noindex headers remain enabled, and lead storage stays private. To restore it, enable Vercel Authentication under Project Settings → Deployment Protection. Use the release status for the tested deployment.

## Local checks and preview deployment

```sh
npm ci
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npx vercel deploy --environment preview
```

Run `npm run dev` to serve static content at the printed local address. Restart after editing HTML or public JSON. The static server renders results but does not write real records. Vercel provides the content, event and lead functions. Protected live QA uses synthetic records that are deleted after verification.

```sh
npx vercel env pull .env.local --environment development
node --env-file=.env.local scripts/smoke-deployment.mjs <preview-url>
node --env-file=.env.local scripts/export-leads.mjs
npm run audit:commits
```

The export reads authenticated private records and writes restricted JSON and CSV under ignored `private/lead-exports/`. Never distribute those files with the website or evidence. Only supplied configuration keys are publicly readable. The leads and events endpoints accept same-origin writes and have no public listing. Environment files, deployment credentials and the private Blob token stay outside Git and the client bundle.

## Optional report email on a future production release

The preview always stores optional requests without sending. Production delivery is implemented with Resend’s send-email API. To enable it after approval, connect a separate private production store, verify a sender domain in Resend, configure server-only `RESEND_API_KEY` and `REPORT_FROM`, set `REPORT_EMAIL_ENABLED=true` and `SITE_MODE=production` in the Vercel Production environment, then build for that environment. Finally set `reportEmailEnabled` in the production site JSON. The request form changes to “Email me my snapshot” when enabled. Only the respondent receives that requested message. There is no notification to Aman and no marketing campaign.

The server checks the settings independently, validates aggregate totals and chosen focus, saves the request, then submits a plain-text report with a provider idempotency key. It records provider acceptance in a separate private receipt. Errors preserve the visible result, PDF and retry option. Acceptance does not establish inbox delivery. Monitor receipts and provider delivery logs after enabling. Test a consenting recipient with the verified sender before a public switch. Review the privacy notice, retention policy, headers, indexing and canonical domain before launch. The existing preview workbook and evidence remain independent of a production rollout.
