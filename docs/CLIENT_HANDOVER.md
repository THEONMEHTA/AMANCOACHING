# Aman Coaching handover

## Visitor journeys

Visitors can take the fifteen-question Snapshot, see scores and a weekly action, and download a PDF without sharing an email. The optional preview form saves a private report request. A separate booking page accepts private call requests and includes Aman’s confirmed direct email. Both journeys work independently.

## Edit copy and settings

- **Questions and recommendations.** Edit `public/content/snapshot.json`. Each of the five dimensions has a stable ID, three statements, one strength, one growth interpretation and one action. Keep the IDs, order and 1–5 scale. Increment the report version when wording or interpretation changes. The web, PDF and optional email use the same data.
- **Credentials and session count.** Edit `public/content/site.json`. Use only approved wording. Set `sessions` to the approved number when confirmed. The professional background strip is also present in `index.html` as a static fallback. Keep the fallback and biography consistent when changing the published site.
- **Scheduling.** Set `bookingUrl` in site settings to the confirmed HTTPS scheduling address. The booking route then shows a direct link. It never attaches results or contact details. The private request form and verified email remain available.
- **Edit without a website rebuild.** Copy the relevant JSON, edit it, then run the command below from a trusted computer with the private store environment. The authenticated publisher validates and writes only the named configuration file. New page loads read it through a public, read-only endpoint exposing only site or quiz content. Restore default wording by publishing the repository’s original JSON. Confirm that the loaded token belongs to the intended store. Match version-controlled defaults in the next reviewed release.
- **Photography, long-form copy and the privacy notice.** Update `index.html`, the files in `pages/` and the two WebP crops in `public/images/`, then deploy a reviewed preview.

```sh
node --env-file=.env.local scripts/publish-content.mjs snapshot public/content/snapshot.json
node --env-file=.env.local scripts/publish-content.mjs site public/content/site.json
```

## Review submissions and counts

In Vercel Storage, open the private preview lead store. The two folders under `submissions/` contain report requests and discovery enquiries. Administrators can export them locally with the deployment guide. The version-two report stores a respondent’s email, five totals, focus, version and separate marketing choice. It excludes raw answers and name. Earlier version-one records retain their original schema. Individual question answers remain in tab memory. Closing or refreshing clears them.

## Analytics event map

| Event | Payload beyond event name | Meaning |
| --- | --- | --- |
| homepage_viewed | none | Homepage loaded |
| quiz_start | source, homepage or other | First start in this quiz flow |
| quiz_step_completed | step, integer 1–15 | First successful Continue at this step in the flow |
| quiz_completed | none | All fifteen answers submitted in the browser |
| result_viewed | none | Results rendered |
| report_requested | none | Optional request accepted |
| booking_clicked | source, homepage or results | Visitor followed a booking CTA to the booking page |

Review counts by UTC day with `node --env-file=.env.local scripts/funnel-counts.mjs YYYY-MM-DD`. Compare homepage-sourced starts with homepage views, completions with all starts, and results-sourced booking clicks with result views. The counts describe events. Repeated clicks, privacy tools, different visits and overlapping date windows affect ratios. They do not identify unique visitors or confirm appointments. No tracking cookie or visitor identifier is used. A scheduling provider would need to supply a reliable booking confirmation before booked calls could be measured.

## Before going public

Aman should approve the professional title and credential strip, coaching format and session count, portrait use, privacy wording and retention period, scheduling URL and sender identity. Collect written consent for any future testimonial or case study before adding it. No quotes or employer logos appear in this release. Public delivery and hackathon payment are recorded separately.
