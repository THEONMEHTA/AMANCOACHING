# SHIPYARD evidence checklist

Rule source supplied by the user: [Make Me Money participant guide](https://docs.google.com/document/d/1kq7J7_eGZtN4Isgl05pdplJq9uLtaQPpOhLB2nzW1YQ/edit). Read via public text export on 18 November 2026. This checklist summarises the applicable rules; the original guide and organiser rulings govern.

## Deadlines in GMT / UTC

- Client handover target: **18 November 2026, 17:30**.
- Leaderboard freeze: **18 November 2026, 18:00**. Payment and delivery must both be evidenced before this deadline.
- Evidence pack: **19 November 2026, 18:00**.

## Records maintained by this repository

- `AUDIT_LOG.md`: timestamped request, file and verification summaries after major steps.
- Git history: descriptive setup, implementation, QA and deployment-configuration commits. Git stores author and committer timestamps including timezone offsets.
- `npm run audit:commits`: exports every commit's full SHA, subject, author timestamp and commit timestamp to `evidence/commit-history.json` and `.md`. Run after the final commit and after any subsequent work. Generated evidence is ignored to avoid an endlessly self-referential commit log; the actual history is authoritative.
- `docs/ASSET_SOURCES.md`: client image, font and skill provenance. No copied competitor website, fake testimonials, customer-logo claims or scraped contact data.
- Unit/browser tests and build checks: reproduce with the commands in `docs/DEPLOYMENT.md`.

## Evidence still required outside the repository

| Record | What to retain | Current status |
| --- | --- | --- |
| Buyer eligibility | Evidence the payer is a real customer who qualifies under the guide; existing clients, friends and other participants are excluded by the supplied rules. | Not verified in this session. |
| Agreed scope and price | Client agreement, invoice and agreed deliverables. | Not supplied. |
| Payment | Live-mode GBP Stripe payment record with transaction ID, paid-at timestamp, amount, fees and refund state; if another payment platform, organiser approval and required reports. | No payment verified. |
| Delivery | Actual live URL, deployed source SHA, deployment time, lead-delivery check and client handover message/acknowledgement. | No live delivery verified. |
| Human intervention | Team-channel `/touch` entries for human prompts, changes and customer interactions, following the guide's one-sitting/day ruling. | Repository notes do not submit Discord touches. |
| Spending | `/spend` entries and receipts for applicable costs within the shared £100 cap; retain all costs/fees and apply the guide's definitions and rulings. | No purchase made by this session; account charges and prior spending not assessed. |
| Full agent history | Conversation export and generation/tool logs, including failed attempts and later corrections. | This file and the audit log are summaries, not a full export. |

## Payment is separate from the lead magnet

The public leadership quiz is free. This website does not need a checkout to collect leads. The payment relevant to the hackathon is the client's payment for the delivered build. No price, live payment link or Stripe account was supplied, so no checkout or payment claim has been invented.

If taking payment through Stripe, use a live payment link in GBP in the same account connected to the organisers. The guide uses `/stripe connect` and `/stripe status`; never paste keys into chat or Git. Record actual payment time rather than payout/verification time. Preserve proof of net revenue and deduct refunds/fees according to the guide. Do not count the project as revenue until the paid-and-delivered requirement is satisfied.

## Final evidence preparation

1. Regenerate commit history after the last source commit and retain the full repository/history (not only a source ZIP).
2. Export the conversation and retain the source agreement, invoice, payment record and receipts privately.
3. Record the verified live URL, deployed SHA, form/mailbox test and client acceptance timestamps.
4. Confirm `/touch`, `/spend`, Stripe connection or any approved non-Stripe daily/final reporting have been completed in the team channel.
5. Submit the organiser's evidence pack by 19 November, 18:00 GMT. No submission to organisers has been made by this session.
