GATE: OPEN — 57 outstanding design-rule findings

# Executive coaching redesign verification

All 14 unit/API tests and 11 Playwright scenarios passed. The build checked all four routes, links, anchors, local assets and the enquiry destination. Dependency audit reported zero known vulnerabilities. The tests exercise first-person statements, unrounded ranking, low/high/mixed answers, ties, focus selection, Back, optional contact capture, an unchecked marketing choice, PDF download and retry behaviour.

Automated WCAG A/AA checks covered the homepage, booking page, privacy notice and active quiz. Keyboard tests covered the skip link, mobile menu, radio group, Back/Continue and focus announcements. Layout checks covered 320, 390, 768, 1024 and 1440 pixels. Desktop and mobile screenshots, the resulting report and the one-page PDF were inspected. The site honours reduced motion. Screen-reader announcements were tested through accessible names and focus; a human screen-reader session was not performed.

Mixed, all-high and all-low PDFs rendered as complete A4 pages with text inside the page bounds. The browser HTML result is the accessible report. The PDF uses a conventional visual layout and is untagged.

Live smoke verification covered all four protected routes, public configuration reads, private writes and reads, idempotent retries, denial of anonymous Blob reads, invalid analytics requests, and a valid anonymous metric. Synthetic records were removed. The optional production email adapter was tested with an injected provider, including failure and retry. Inbox delivery and scheduling-provider confirmation require a configured sender and calendar.

## Design checker

The Taste checker uses a fixed full-screen section rhythm, a limited grid and prescribed visual kit. The delivered layout follows the brief’s asymmetrical portrait, compact credential strip, text-led situations and FAQ, and animated five-bar report sample. The remaining findings and their original descriptions are recorded below. They remain open in this preview and do not represent successful checks.

### Outstanding findings

- **edge-left** (12). starts at x 358.1; the lines are 82 and the column starts starts at x 524.3; the lines are 82 and the column starts starts at x 966.7; the lines are 82 and the column starts starts at x 748.6; the lines are 82 and the column starts starts at x 707.9; the lines are 82 and the column starts starts at x 1210.8; the lines are 82 and the column starts starts at x 1280; the lines are 82 and the column starts
- **container-edges** (7). a <footer> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6) the section needs exactly one in-flow child .wrap (it has 2 in-flow children, 0 .wrap) (SR-6) the section needs exactly one in-flow child .wrap (it has 3 in-flow children, 0 .wrap) (and 2 more like it: "Meet Aman DavegunI know ", "Before we meetA few ques") (SR-6) the h2 starts 626px right of the container's left: every h1 and h2 starts on it, 2px either way (SR-6) 1 text block starts on a left line at x 618, 536px from the container's left: text starts on the container's left, or on one split line (x 624, 732, 840) (SR-6) 1 text block starts on a left line at x 443, 361px from the container's left: text starts on the container's left, or on one split line (x 624, 732, 840) (and 3 more like it: x 429, "What’s on your mind?", x 122) (SR-6) "What’s on your mind?" is set centred across 1276px, over half the 1276px container: text that wide is set left (SR-6)
- **screen-short** (5). 815px tall; one screen under the nav is 900px 634px tall; one screen under the nav is 900px 751px tall; one screen under the nav is 900px 477px tall; one screen under the nav is 900px 415px tall; one screen under the nav is 900px
- **neighbour** (5). framed, 55px of #snapshot section.snapshot-band "The Leadership SnapshotSee where" shows framed, 27px of #meet section.wrap.section "Meet Aman DavegunI know the pres" shows framed, 44px of section.wrap.section section.wrap.section "Before we meetA few questions. W" shows framed, 85px of section.closing section.closing "A conversation with AmanWhat’s o" shows framed, 101px of the footer shows
- **section-height** (4). the section is 71px tall (0.1 screens), 829px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2) the section is 101px tall (0.1 screens), 799px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2) the section starts at 3101px, 401px below the screen grid (3 x 900px): sections start on whole screens (SR-2) the section starts at 2356px, 344px above the screen grid (3 x 900px): sections start on whole screens (SR-2)
- **no-visual** (3). no picture, effect or mock in this section; a feature section needs a visual
- **text-only** (2). the section is only text: no picture, icon, mock or effect in it (2 sections like it at this width) the closing section is only text: no picture, icon, mock or effect in it (2 sections like it at this width)
- **section-tile** (2). the section is 634px tall (0.70 screens at 1440x900), shorter than the screen: its tile (the screen from its top) shows 634px of it and 266px of the next section, its heading "See where you’re strong. Find " on screen the section is 477px tall (0.53 screens at 1440x900), shorter than the screen: its tile (the screen from its top) shows 477px of it and 415px of the next section, its heading "What’s on your mind?" on screen
- **one-section** (2). the screen at scroll 3806px (the top of section 7) shows 415px of section 8 and the heading of section 8 whole and the content of 2 sections, over 24px each beside section 7: a screen shows one section (another may peek 8px, 24px WARN) (SR-4) the screen at scroll 2700px (stride 3) shows 401px of section 5 and the content of 2 sections, over 24px each beside section 6: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- **split-pair** (2). the two columns of the split start 52px apart at the top (centred on each other): a split's columns are top-aligned, 8px either way (SR-8) the split's columns are off the page's one pair of lines: its right column starts at x 749, on none of the split lines 624 (k=5), 732 (k=6), 840 (k=7) (SR-8)
- **off-grid** (2). left edge at 35px, 15px off the page margin at 20px (39 elements, like div.portrait-frame) left edge at 35.5px, 15.5px off the page margin at 20px (39 elements, like p.eyebrow); 2 more in this section off the grid too (li:nth-of-type(2) at 35.5px, li:nth-of-type(3) at 35.5px)
- **screen-height** (2). 477px, 0.53 screens; a section is exactly one or two (--h) 415px, 0.46 screens; a section is exactly one or two (--h)
- **button-styles** (1). 3 button styles on the page: pill, outline #3d5c4b x1 ("Book a free call ↗"); pill, fill #233c31 x1 ("Take the leadership quiz →"); pill, fill #f6f3ec x2 ("Start my Leadership Snapshot →")
- **copy-fact** (1). the first screen holds no number, price, date, place, platform or genre
- **copy-headings** (1). "Your remit got bigger. Your time didn’t." names no product, part, place or section (7 headings like it; at most one brand line per page) (and 6 more like it: "You’re accountable for d", "You’re still the person ", "See where you’re strong.", "Explore the fit", ...)
- **moment-none** (1). a service page (--type) deals no moment: every kind carries one, two on a long page (moments.md)
- **section-air** (1). the content fills 35.2% of the section's height (25 of 71px): 55% or more (40% WARN) (SR-3)
- **one-heading** (1). headings of two sections show whole on one screen at 10 of 78 scroll positions (12.8%; at scroll 1800, 3150, 3200, 3250px), here with "See where you’re strong. Find wh": at most 3% on a desktop (SR-5)
- **hero-fill** (1). the next section shows on the first screen: it starts at 657px on a 800px screen (the hero ends at 657px) (also at 768)
- **neighbour-ground** (1). framed, 18px of #snapshot section.snapshot-band "The Leadership SnapshotSee where"'s ground shows
- **hero-fold** (1). ends at y 967, past the fold (844): 1.07 screens tall

### Applied exceptions

- **nav**. The two lines form the designed wordmark and remain within the header at every tested size.
- **spill**. The two offset arch outlines form a deliberately layered portrait frame and never overflow the page.
- **scroll-reveal**. The brief explicitly requests one entrance animation of the five sample bars. All labels and values remain readable without animation.
- **copy-headline**. The supplied headline is paired with the immediately preceding executive coaching eyebrow and a next-sentence audience description.
- **copy-two-fragment**. All three headlines are verbatim launch copy requested by the client brief.

### Non-blocking observations

- **flush**. its first line sits 23px under the top edge of div.credentials, where the ground changes
- **same-action**. "Book a free discovery call ↗" is a button in one place and a text link in another: one action in two looks
- **same-action**. "Take the leadership quiz →" is a button in one place and a text link in another: one action in two looks
- **copy-actions**. 2 labels for one target /book: "Book a free call ↗", "Book a free discovery call ↗"
- **copy-actions**. 2 labels for one target /leadership-quiz: "Take the leadership quiz →", "Start my Leadership Snapshot →"
- **copy-actions**. the main action "Take the leadership quiz" does not read word for word the same in the closing section
- **section-gaps**. 121px between these sections, -50% against the median 240px
- **section-gaps**. 145px between these sections, -40% against the median 240px
- **section-gaps**. 117px between these sections, -52% against the median 245px of gaps at a change of ground
- **section-gaps**. uneven space at the edge of a band: 155px outside its edge, 80px inside it (the space on either side of a change of ground reads as one gap only when the two match)
- **heading-align**. 5 section headings sit on the left, 1 centred: "What’s on your mind?"
- **one-screen**. 4 sections are shorter than the screen, so the next one's heading or picture shows with them: "When leadership gets harder." is 634px of the 900px under the nav, and "See where you’re strong. Find " shows below it ("See where you’re str", "How coaching works.", "A few questions.")
- **section-air**. the content fills 41.7% of the section's height (199 of 477px): 55% or more (40% WARN) (SR-3)
- **right-edge**. its right edge stops 15px short of the content's right edge (370px), which div.arch-line reaches
- **right-edge**. its right edge stops 57px short of the content's right edge (370px), which article.paper reaches
- **grounds**. 4 flat grounds across the page (#f6f3ec section x6, #233c31 section x2, #fbfaf5 band, #e4e8da section): three at most (the base, a surface, an inverse)
- **copy-stat-strip**. stat strip x1
- **copy-eyebrows**. 9 eyebrow or kicker labels

### Local performance snapshot

The checker ran on a headless CPU browser. Measurements are from a local build and do not establish field performance.

```text
perf dist/index.html @ 1440px
  PASS  host CPU load (before/after)               32/42 %
  PASS  total transfer                             376.5 KiB      html 3.3K  css 4.8K  js 6.2K  font 70.7K  img 287.9K  other 3.7K
  PASS  requests                                   14             13 by load
  PASS  images bytes                               287.9 KiB      2 files
  PASS  largest image                              151.1 KiB      images/aman-city.webp
  PASS  JS parsed                                  11.7 KiB       4 files, 6.2K gz
  PASS  CSS                                        4.8 KiB        1 files
  PASS  font families                              2              Lora, Nunito Sans
  PASS  font files                                 4              70.7K
  PASS  font bytes                                 70.7 KiB
  PASS  images without width+height                0
  PASS  below-fold images not lazy                 0
  PASS  oversized images (natural > 2.2x shown)    0
  PASS  WebGL live at load                         0
  PASS  WebGL live at bottom                       0
  PASS  WebGL peak live                            0              0 contexts made in all
  PASS  long tasks                                 0              runs 1, , max 0ms
  PASS  blocking time                              0 ms           runs 1,  ms; at load 0ms
  PASS  FCP (CPU, relative)                        80 ms
  PASS  LCP (CPU, relative)                        80 ms          img
  PASS  layout shift                               0.002          at load 0.002
  PASS  modules loaded, never mounted              0
  PASS  broken requests                            0
  PASS  page height                                5.3 screens    DOM 190 nodes

perf dist/index.html @ 390px
  PASS  host CPU load (before/after)               32/42 %
  PASS  total transfer                             376.5 KiB      html 3.3K  css 4.8K  js 6.2K  font 70.7K  img 287.9K  other 3.7K
  PASS  requests                                   14             13 by load
  PASS  images bytes                               287.9 KiB      2 files
  PASS  largest image                              151.1 KiB      images/aman-city.webp
  PASS  JS parsed                                  11.7 KiB       4 files, 6.2K gz
  PASS  CSS                                        4.8 KiB        1 files
  PASS  font families                              2              Lora, Nunito Sans
  PASS  font files                                 4              70.7K
  PASS  font bytes                                 70.7 KiB
  PASS  images without width+height                0
  PASS  below-fold images not lazy                 0
  WARN  oversized images (natural > 2.2x shown)    2              aman-editorial.webp 900px for 335; aman-city.webp 820px for 350
  PASS  WebGL live at load                         0
  PASS  WebGL live at bottom                       0
  PASS  WebGL peak live                            0              0 contexts made in all
  PASS  long tasks                                 0              runs 1, , max 0ms
  PASS  blocking time                              0 ms           runs 1,  ms; at load 0ms
  PASS  FCP (CPU, relative)                        92 ms
  PASS  LCP (CPU, relative)                        92 ms          img
  PASS  layout shift                               0.000          at load 0.000
  PASS  modules loaded, never mounted              0
  PASS  broken requests                            0
  PASS  page height                                7 screens      DOM 190 nodes

SUMMARY dist/index.html: 0 FAIL, 1 WARN  -> WARN
```
