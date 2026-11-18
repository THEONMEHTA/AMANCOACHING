GATE: PASS

# Preview verification report

Verified 18 November 2026. This reports the implemented preview, not client payment or acceptance.

## Functional and live checks

- 14 unit/API tests pass. They cover 1,024 scoring/preference combinations, complete report content, ties, validation, cross-origin rejection, body limits, private writes, storage errors, conflict/retry handling and native no-JavaScript enquiries.
- 14 browser tests pass and cover the full quiz, back navigation, skip-email report, optional marketing consent, submission payloads/failures, PDF download, mobile menu, accessibility and widths 320, 390, 768, 820, 1024 and 1440. The suite also checks the deployed content-security policy and PDF download.
- Automated WCAG A/AA checks pass for the landing page and active quiz. This is not a claim of full manual accessibility conformance. The untagged PDF has an accessible HTML alternative.
- Four report variants rendered as three pages each; text presence and page bounds checked on all 12 pages. A representative full three-page report was also inspected visually.
- Live preview homepage HTTP 200 through authenticated Vercel CLI. Anonymous website access redirects to Vercel login; the final login page's HTTP 200 is not public website access.
- Both live forms returned HTTP 201 and stored server-derived records in private Blob storage. Anonymous reads of each private record returned HTTP 403. Idempotent retries returned HTTP 201. Both synthetic QA records were removed.
- The API has no public listing (GET 405); a different Origin is rejected (403). Success reports emailSent=false. No email service or notification integration is installed.
- Noindex and security headers verified. A secret scan found no server Blob token in browser assets. Dependency audit reports zero vulnerabilities.

## Design and copy

Service page; oxblood-grey palette, chosen for an editorial professional identity, with Lora / Nunito Sans. Photo hero with client portrait and solid text panel on the right; flat grounds, no shaders, word-highlight report statement, centred navigation, column footer, block buttons. Voice is practical and reflective, focused on leadership decisions rather than unsupported outcome promises.

Client portrait is reused from the existing business website; provenance and distribution licences are in ASSET_SOURCES.md. No testimonial, accreditation or numerical client-outcome claim was invented. No stock face substitutes for the coach. Final copy lint: 0 FAIL, 0 WARN. Desktop and mobile page screenshots were visually reviewed; tablet fit is covered by browser tests. No assumed prices, addresses, phone numbers or response times are published.

## Documented gate exceptions

- `nav` — header.nav.nav--centre > div.wrap.nav__bar > a.nav__logo.wordmark "aman COACHING": The two-line Aman / COACHING wordmark is an intentional logo lockup, not a navigation label wrapping. It stays within the header at all tested widths.
- `no-visual` — section#quiz "A little reflection. A useful next step.": This is the requested working quiz application, not a feature illustration. The interactive questions and report are the primary content; a decorative photograph would displace the form.
- `text-only` — section#coaching "Coaching for the decisions ahead.": This section provides the coaching explanation and six substantive FAQs. The skill permits text-led FAQs; no additional stock person or unverified proof is needed.
- `no-visual` — section#quiz "A little reflection.A useful next step.": This is the requested working quiz application, not a feature illustration. The interactive questions and report are the primary content; a decorative photograph would displace the form.

## Performance and remaining limits

Local headless measurements: 762.8 KiB transferred on desktop, 443.9 KiB on mobile; zero broken requests and zero measured layout shift. Performance script: 0 FAIL, 3 WARN. Two warnings concern a busy host CPU and one concerns the 590.8 KiB desktop photograph. These are local CPU-relative measurements, not real-user field data or a production SLA.

The gate's remaining non-blocking warnings are listed below. Runtime UI and data protection take precedence over a decorative visual in the working quiz. Forms are deliberately allowed to grow rather than clip their contents. All exceptions are recorded; kit assets were not edited.

- `scroll-reveal` — div.wrap > div.report-layout > div.report-copy > h3.mo-wh__text "Make room for the leadership work that n": starts "color" (0.2 s) the moment it is scrolled into view (an IntersectionObserver) on span.mo-w:nth-of-type(1) (inside a dealt moment's section, [data-moment]: an enter moment is expected on every kind; its still is judged under reduced motion)
- `copy-actions` — (the page): the main action "Start the quiz" does not read word for word the same in the closing section
- `section-gaps` — section#quiz / section#coaching: uneven space at the edge of a band: 126px outside its edge, 270px inside it (the space on either side of a change of ground reads as one gap only when the two match)
- `links` — header.nav.nav--centre > div.wrap.nav__bar > nav.nav__links > a.nav__link:nth-of-type(3) "Get in touch": "Get in touch" goes to #contact, in the footer
- `links` — div.wrap > div.report-layout > div.report-copy > a.text-link "Get your snapshot ↗": "Get your snapshot ↗" only scrolls to #quiz, where nothing completes it
- `links` — div.wrap > div.coaching-layout > div.coaching-copy > a.text-link.booking-link "Request a discovery call ↗": "Request a discovery call ↗" goes to #contact, in the footer
- `nav-labels` — header.nav.nav--centre > a.skip-link "Skip to content": "Skip to content" opens a section headed "Leadership coaching for senior leaders."
- `nav-labels` — header.nav.nav--centre > div.wrap.nav__bar > nav.nav__links > a.nav__link:nth-of-type(1) "Your report": "Your report" opens a section headed "Your leadership, in perspective."
- `nav-labels` — header.nav.nav--centre > div.wrap.nav__bar > nav.nav__links > a.nav__link:nth-of-type(3) "Get in touch": "Get in touch" opens a section headed "Bring your next leadership question."
- `link-styles` — footer#contact > div.wrap > div.footer-bottom > a.inline-button "Accessibility": text links in 3 looks: no line, regular (2, like "See the coaching →"); no line, bold (3, like "Get your snapshot ↗"); underline, regular (1, like "Accessibility")
- `nav-current` — header.nav.nav--centre: the nav stays on screen with 3 links to the page's sections, but never marks the one you are in (no link changes as the page scrolls)
- `grounds` — section#top "AMAN COACHING · WEBSITE PREVIEW Leadersh": 4 flat grounds across the page (#1b1b1b section, #e2e2e2 section x2, #d6d6d6 section, #7d0c14 footer): three at most (the base, a surface, an inverse)
- `action-repeat` — header.nav.nav--centre > div.wrap.nav__bar > div.nav__actions > a.btn.btn--primary "start the quiz": "start the quiz" shows 2 times on the first screen at 1440px (nav, hero): the nav's button and the hero's; nothing else on the screen may repeat it
- `nav` — header.nav.nav--centre > div.wrap.nav__bar > button.nav__toggle "Menu ＋": the nav is lopsided: its last item ends 7px inside the content's edge (366px), while its first starts on the other edge
- `tap-size` — p#contact-note > button.inline-button.privacy-open "Read the privacy notice": a 125x19px tap target: under the 44px a phone needs
- `body-size` — div.coaching-layout > div.questions > details:nth-of-type(1) > p "Mid-to-senior leaders and people taking ": 5 of 8 paragraphs of running text are set under 16px (14, 15px)
- `section-gaps` — section#coaching / footer#contact: 571px between these sections, +58% against the median 361px of gaps at a change of ground
- `grounds` — section#report > div.wrap > div.report-layout > article.report-preview "aman / EXAMPLE REPORT YOUR LEADERSHIP SN": 4 flat grounds across the page (#e2e2e2 section x4, #f5f1eb band, #d6d6d6 section, #7d0c14 footer): three at most (the base, a surface, an inverse)
- `fold-cut` — div.hero-text > div.hero__text > div.btn-row > a.btn.btn--primary "Start the quiz ↗": the hero's button "Start the quiz ↗" is cut by the bottom of the first screen (8px of its 48px below the fold)

Client acceptance, payment evidence, production domain, ownership transfer, manual screen-reader review, campaigns and email notifications remain outside the verified preview release.
