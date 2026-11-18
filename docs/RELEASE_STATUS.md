# Executive coaching redesign preview

[Open the protected preview](https://aman-coaching-snapshot-20261118-ihesfftp1-0013s-projects.vercel.app) · [Vercel deployment](https://vercel.com/0013s-projects/aman-coaching-snapshot-20261118/8kP1zN8JEaSdJGL5VxtJik9awWy8)

The Kora-style redesign, with the original credential badges and published figures, was deployed to the existing Vercel Preview environment from commit `0d443b81d197d8472d28792f6e2079971c5e8cfa`. Authenticated verification completed on **18 November 2026 at 14:08:12 UTC**. Anonymous homepage access returned a redirect to Vercel authentication.

The homepage loaded with the fullscreen hero, the EMCC, NHS, CMI and RCOT badges, and the 2,000+ hours, 97% and 10+ years figures. The quiz, booking and privacy routes responded successfully. Both private submission types saved, survived an identical retry, and returned HTTP 403 on anonymous storage reads. The event endpoint rejected an unexpected email field and stored the allowed anonymous step event. The two synthetic submissions and the metric were removed. Preview delivery sends no email.

The homepage now has its own discovery form. It posts to the same private `/api/leads` endpoint as `/book`, and the live API path was covered by the smoke test.

[Lead review and deployment](DEPLOYMENT.md) · [Editing, approval and event map](CLIENT_HANDOVER.md) · [QA results](QA_REPORT.md)

The current review link requires access to Vercel. The earlier setup deployment remains in the project. The client domain, live calendar, client email account and payment flow have not been activated. Client acceptance and paid delivery for the hackathon require separate evidence.
