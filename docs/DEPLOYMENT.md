# Vercel preview and private submission storage

Updated 18 November 2026 following the user's decision to host a preview before gaining access to the client's email. This supersedes the earlier Netlify plan in Git history.

## Current architecture

- Static responsive site built with esbuild, with a Vercel Node.js function at `/api/leads`.
- Quiz and enquiry submissions are saved as JSON records in a **private Vercel Blob store**. No submission files are publicly readable, and there is no public list/read API.
- No SMTP, email provider, notification webhook or marketing automation is installed. **No email is sent to Aman or the respondent.**
- Browser reports remain available immediately as HTML and PDF. Viewing a report without sharing details does not create a lead record.
- Preview pages declare `noindex, nofollow`, `robots.txt` disallows crawling, and `vercel.json` sets `X-Robots-Tag`. Search directives are not authentication; preserve Vercel Deployment Protection for a restricted preview.

## Project and store

Created through the authenticated Vercel CLI:

- Project: `aman-coaching-snapshot-20261118` in the user's `0013s-projects` account.
- Private store: `aman-coaching-preview-leads`, region `lhr1`.
- Store attached to the **preview and development** environments. Production is deliberately not connected yet.
- Runtime secret: `BLOB_READ_WRITE_TOKEN`, set by the storage integration. It stays server-side and is never embedded in the browser bundle. Local `.env.local` and `.vercel/` are ignored by Git and deployment upload rules.

The exact verified preview URL and source SHA are recorded in `RELEASE_STATUS.md` after deployment.

## Run and verify locally

```sh
npm ci
npm run dev
```

Open the Local URL printed by the command. HTML/public files are copied at startup; restart after editing them. JavaScript and CSS rebuild while the server runs. The static development server deliberately does not handle real submissions; it shows an error rather than pretending to save one. Use the deployed preview to test the real storage endpoint, or `npx vercel dev` after linking the project.

```sh
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm audit
npm run audit:commits
```

Browser tests use intercepted submission responses and never email anyone. API tests inject a storage writer; they verify validation, private-write options, failure handling and server-derived results. Real storage is checked separately after deployment with clearly labelled synthetic QA records.

## Deploy a preview

```sh
npx vercel link --project aman-coaching-snapshot-20261118
npx vercel
```

Use the existing linked project; do not create a second store or project. `vercel.json` sets the build command, `dist` output, London function region, security headers and a 30-second function limit. Vercel sets `VERCEL=1`, enabling the API transport during the build. Do not set a `VITE_` variable containing a storage token.

For a fresh account/project, create a **Private** Blob store in the Storage tab and connect it to preview/development. The CLI equivalent is:

```sh
npx vercel blob create-store aman-coaching-preview-leads --access private --region lhr1 --environment preview --environment development --yes
```

This command is shown for reproducibility; the store already exists. Never substitute public storage for lead data. Missing/misconfigured storage returns an error and leaves no-email report access available.

## Review submissions without email

1. Sign in to the Vercel project.
2. Open **Storage → aman-coaching-preview-leads → Browse**.
3. Look under `submissions/leadership-snapshot/` for quiz leads, and `submissions/discovery-request/` for enquiries. Each record has an opaque ID, server receipt timestamp and `emailSent: false`.
4. Open/download the private JSON through authenticated Vercel access. Do not publish blob links, share your storage token or commit records into this repository.

For a local CSV/JSON export, pull the development environment into an ignored local file, then run:

```sh
npx vercel env pull .env.local --environment development
node --env-file=.env.local scripts/export-leads.mjs
```

The export writes to the ignored `private/lead-exports/` directory with restrictive file permissions and guards CSV formula prefixes. The command prints a count and directory, never the personal records. Use the dashboard to delete records you no longer need. The proposed 90-day review in the notice is an operational process, not an automatic deletion job.

## Endpoint behaviour

- Accepts only same-origin POSTs with JSON, or a native URL-encoded enquiry form when JavaScript is off.
- Caps request bodies at 8 KiB; validates name/email, allowed form types, answer IDs/ranges, optional message length and honeypot.
- Recalculates role/focus from validated answers; ignores client-supplied result labels. Keeps explicit marketing permission separate from the enquiry.
- Uses private writes and an opaque UUID path, avoiding personal information in URLs. Retries of an already saved UUID are idempotent.
- Sends success only after storage accepts the record; errors never claim the lead was saved. Responses are `no-store` and do not contain lead details or blob URLs.
- Has no public GET/list endpoint. Logs a generic storage error without request content. Origin checks and honeypot reduce unintended submissions but are not an authentication or complete abuse-prevention system; use deployment protection for this preview and configure WAF/rate limits before a public campaign.

## Before a future production launch

- Have the client approve copy, portrait rights, questions, report content and the privacy/data ownership arrangements.
- Agree the lead retention process and who may access submissions; transfer or grant the intended account ownership.
- If wanted, connect a verified calendar URL through `VITE_BOOKING_URL` and test it.
- Decide whether to add email notifications. Do not enable them implicitly; mailbox access is not needed for the current private collection flow.
- Connect a private store to production, revisit preview wording, remove noindex directives deliberately, and set the verified canonical domain. `SITE_MODE=production` alone does not remove the staging header in `vercel.json`.
- Map the client domain only with authorised DNS access and an agreed cutover. Retain rollback instructions and repeat a controlled form test.

Official references checked: [private Blob storage](https://vercel.com/docs/vercel-blob/private-storage), [Blob CLI](https://vercel.com/docs/cli/blob), [Node functions](https://vercel.com/docs/functions/runtimes/node-js).
