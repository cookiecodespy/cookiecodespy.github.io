# Design QA · AI Race Gazette

final result: passed

## Reference and scope

Source: original public/assets/reference-look.jpg, 864 × 1536. Implementation captured at viewport 864 × 1536, deviceScaleFactor 1, home state. Combined comparison: qa/comparison.png, source left, rendered implementation right. Additional captures: qa/article-desktop.png, qa/home-mobile.png, qa/article-mobile.png, mobile viewport 390 × 844.

This is a faithful adaptation of the requested newspaper direction, with real verified headlines replacing reference copy. The reference embeds an example expanded article into its home; the product opens each article as its own route and uses the lower home area for navigable editions. The reference year 2024 is corrected to actual coverage dates in 2026. No claim of pixel-identical layout or a complete historical archive.

## Iteration

Initial capture found P1 horizontal overflow at 390px caused by an unbroken mobile title, and P2 image heights inherited from HTML dimensions, producing a stretched portrait crop. Fixed by preserving the title line break, making image heights automatic, and using explicit aspect ratios. Recaptured at the same viewport and state. Browser test now confirms no horizontal overflow in home and article.

Initial header emblem was a square crop; replaced with an individually generated transparent engraved globe. All raster assets are final project files; no CSS illustration stand-ins.

## Comparison

- Typography: strong Bodoni Moda newspaper hierarchy, uppercase masthead, Newsreader body, distinct editorial metadata. Freely licensed self-hosted fonts. Headlines wrap naturally to fit verified article copy.
- Layout: masthead, search, views and month/topic filters, double rules, bordered two-column hero, four newspaper columns, and individual worn edition sheets. Mobile uses stacked hero, two-column headlines and single-column editions.
- Color: dark brown ink, honey-cream parchment, burnt edges, sparse rust-red metadata. Center remains legible; signs of wear stay mainly around the border.
- Images: matching copperplate engraving style, generated humanoid/globe, mountains/laboratory, headquarters, and globe emblem. Paper cutout has real alpha; irregular edges appear against the outside background. All article illustrations have visible synthetic-image credits.
- Interactions: article/edition routing, direct-link reload, back navigation, accent-insensitive search, combined company/month/topic filters, list/cover toggles, empty/reset, copy-link feedback, external source links and RSS. Visible keyboard focus, semantic labels, reduced-motion and print styles.

## Verification

Three logic tests passed. Python data validation and RSS generation passed. Production build passed without unresolved asset warnings. Four packaging tests passed. Chromium browser tests passed, zero page/console errors; qa/browser-results.json records checks. Final assets recaptured after optimization.

Remaining P3: reference has more small print ornaments and company logos. The current version uses clean rules and company name typography. Historical backfill and enabling the recurring task are functional follow-up work, explicitly documented, not claimed as completed by this visual gate.
