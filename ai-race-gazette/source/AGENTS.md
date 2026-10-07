# Prototype Instructions

## Gazette product decisions

2026-10-07 layout revision: preserve the generated parchment and engravings, but use Downloads/ai-race-daily-retro-newspaper-v4.html as the source of truth for home structure and copy. Header with centered name, metadata left and search right; full-width bordered project summary immediately below; view/month buttons then company/topic chips; directly below show individual article covers or worn horizontal list rows. No featured hero, recent-headlines section or separate hemeroteca heading between summary and results. Each cover opens that article, and identical filters apply in both views.

Public Spanish AI/technology newspaper hosted in cookiecodespy/cookiecodespy.github.io/ai-race-gazette. Main reference: public/assets/reference-look.jpg. Match warm parchment, genuinely cut/singed irregular edges, engraved imagery, strong newspaper hierarchy, and complete internal articles with official sources. Do not describe the retro design in public product copy.

User selected hourly editorial updates through ChatGPT + GitHub, not Codex, Work or a paid API. Read docs/gazette-v1-standard.md first, then docs/research-backbone.md, docs/editorial-policy.md, docs/content-model.md, docs/article-v2-schema.md, docs/article-depth.md, docs/image-policy.md, docs/scheduled-task.md, docs/automation-operations.md, docs/coordination.md and docs/roadmap.md. Use research/source-registry.json as a baseline coverage checklist, never as a closed company list. Routine editorial updates should touch data/RSS/coverage only when there is a material change; no-op hourly checks must create no commit. Do not modify visual code during routine news updates. Publish only Gazette paths; preserve the repository root page. User explicitly authorized Playwright/Chromium verification when the integrated browser is unavailable.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

2026-10-07 editorial audit: one independent article per meaningful launch/feature, unlimited company/day articles. A shared source URL is valid across different eventKeys. Group minor updates; preserve article IDs for corrections. Company/topic/month/day filters combine. Historical coverage is partial. As of the 2026-10-07 audit there are 48 verified articles across 14 dates; Sep 1–7 contains 36 verified articles and is marked complete. Original prototype entries remain research leads, never automatic facts.

2026-10-07 discovery rule: company filters are data-driven from `article.company`. Do not hard-code a closed company list. When a relevant new actor is verified, publish its first article with a canonical company name and the filter will appear automatically. New source domains must not require a frontend change. Do not create empty company categories.

2026-10-07 automation rule: the newsroom task runs hourly. If there is no material verified news, correction or status change, it must make no commit and must not change updatedAt. Historical backfill is a separate deep-research workflow; never fill calendar gaps with synthetic stories.

2026-10-07 concurrency rule: Automation & Newsroom and Historical Backfill may write to the same archive. Read `docs/coordination.md`. Before every write, refetch current `main`, merge by id/eventKey and preserve all concurrent changes. Never overwrite `news.json` from a stale snapshot. On a same-event conflict, abort that article and reconcile instead of forcing a commit.


2026-10-07 article-depth rule: cover cards stay concise, but internal article pages should be substantial. Standard stories target roughly 700–1,200 words when sources support it; major launches may be 1,200–2,000 words; minor updates can be 350–600. Never pad with speculation. Historical Backfill should enrich existing short articles while preserving id/eventKey.


2026-10-07 Reporter V2 rule: `docs/gazette-v1-standard.md` is the controlling editorial standard. Reporter V2 is the default for new material. During migration, V2 articles keep legacy fields required by the current frontend and may add the optional fields in `docs/article-v2-schema.md`. Do not create another short-form backlog.

2026-10-07 visual rule: follow `docs/image-policy.md`. The hourly Newsroom may select existing editorial art and write an image brief; new binary image generation/upload is a separate Visual Desk capability until a reliable automated pipeline is proven.

2026-10-07 scheduled-write rule: read `docs/automation-operations.md`. A blocked unattended GitHub mutation is an operational approval/security limitation, not proof that repository permissions are missing. Never loop retries or leave partial mirror state.


2026-10-07 daily coverage rule: public `data/news.json.dailyCoverage` mirrors `docs/history-coverage.json`. Every article date must have a ledger row and verifiedArticles must equal the real count. Keep both synchronized in any publication that changes daily coverage. Empty hourly checks remain no-op.


2026-10-07 Research Backbone rule: `docs/research-backbone.md` adapts the strongest provenance/discovery ideas from `cookiecodespy/spanish-news-nlp-pipeline`. `research/source-registry.json` is a baseline of official sources and must not suppress open discovery. The current product does not depend on SQLite, exact-byte ingestion or evidence bundles during hourly runs; those remain future research-service capabilities.
