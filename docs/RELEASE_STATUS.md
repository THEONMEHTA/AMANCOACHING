# Verified Vercel preview

- **Preview:** https://aman-coaching-snapshot-20261118-h70on16s8-0013s-projects.vercel.app
- **Project dashboard:** https://vercel.com/0013s-projects/aman-coaching-snapshot-20261118
- **Deployed source commit:** `76f6b78455586d72571d3084f1b4e3775739de2a`.
- **Live checks completed:** 2026-11-18T09:59:05.090Z (UTC / GMT).
- **Environment:** preview, protected by Vercel sign-in; no client domain was changed.
- **Storage:** `aman-coaching-preview-leads`, private Blob store in London, connected to preview/development.
- **Submissions:** quiz leads and discovery requests saved privately; no email sent to Aman or respondents.
- **Live verification:** both forms stored records; private reads worked for the authenticated owner; anonymous reads returned 403; retries succeeded; two synthetic QA records were removed. GET/list access returns 405 and cross-origin submission returns 403.
- **Checks:** 14 unit/API tests pass. 14 browser tests pass, including the deployed CSP and PDF download; dependency audit has zero vulnerabilities. Design gate: PASS with four documented exceptions; copy lint: zero warnings. See [QA report](QA_REPORT.md).
- **Lead review:** Vercel project → Storage → aman-coaching-preview-leads → Browse → submissions. Private CSV/JSON export instructions are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Setup deployment cleanup

Vercel automatically assigned the new project's first setup deployment to its production environment before an explicit preview deployment was created. That unused setup deployment is protected, noindex, has no production-connected lead store, and does not use the client's domain. It is not the preview URL above.

A request to delete that setup deployment and its automatic project aliases was stopped by Vercel CLI with `confirmation_required`; the tool explicitly requires a human's approval even with `--yes`. Approval was requested in the conversation. Until it is given, the unused deployment is retained. No approval was inferred or bypassed.

## Scope of delivery

This is a working preview prepared for review. Client acceptance and payment have not been verified; no hackathon revenue is claimed. Production launch, client ownership transfer, domain changes and email notifications remain separate steps.
