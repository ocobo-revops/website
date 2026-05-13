# Performance baseline — pre-refactor reference

Reference numbers captured before any [PRD #120](../../README.md) perf slice lands. Every subsequent perf slice (#151–#162) compares itself against this document.

**Status:** lab + real-user baselines captured 2026-05-13
**Last updated:** 2026-05-13
**Method:** PageSpeed Insights API (lab Lighthouse + CrUX p75) + Vercel Speed Insights dashboard (site-wide, route patterns not configured)

---

## URLs measured

The 6 routes that #120 sub-issues will refactor or that anchor the site's UX:

| # | Route | URL |
|---|-------|-----|
| 1 | Homepage | https://www.ocobo.co/ |
| 2 | Blog index | https://www.ocobo.co/blog |
| 3 | Blog detail | https://www.ocobo.co/blog/structurer-la-croissance-pour-liberer-la-vente-exemple-surfe |
| 4 | Jobs index | https://www.ocobo.co/jobs |
| 5 | Jobs detail | https://www.ocobo.co/fr/jobs/revenue-operations-manager |
| 6 | Client story | https://www.ocobo.co/clients/ekodev |

Same URLs used for every re-measurement. If any of routes 3/5/6 disappears, replace with a comparable peer and note the swap in the changelog at the bottom of this doc.

---

## How to re-run

### PageSpeed Insights API (lab + CrUX in one call)

Get an API key at https://developers.google.com/speed/docs/insights/v5/get-started, export it, then run the committed scripts in `scripts/perf/`:

```bash
export PSI_KEY=<your-key>
bash scripts/perf/baseline-run.sh        # dumps /tmp/psi-*.json (6 files)
bash scripts/perf/baseline-extract.sh    # prints metrics as JSON, one block per URL
```

See `scripts/perf/README.md` for details.

### Local Lighthouse CLI (alternative, no API key)

```bash
pnpm dlx lighthouse \
  https://www.ocobo.co/ \
  --preset=desktop \
  --form-factor=mobile \
  --output=json --output=html \
  --output-path=./lh-home \
  --chrome-flags="--headless=new"
```

Repeat per URL. Slower (real Chrome run) but offline-friendly.

### Vercel Speed Insights (real-user p75)

Real-user p75 metrics live in the Vercel dashboard:

https://vercel.com/wabdsgn/ocobo/speed-insights

Filter: last 7 days, mobile. Capture LCP / CLS / INP / TTFB per route and paste into the **real-user** table below.

---

## Results

### Lab metrics — PageSpeed Insights (mobile, performance category)

Captured 2026-05-13 via `scripts/perf/baseline-run.sh`.

| Route | Perf score | LCP (ms) | CLS | FCP (ms) | TTFB (ms) | TBT (ms) |
|-------|-----------:|---------:|------:|---------:|----------:|---------:|
| Homepage | 54 | 8 185 | 0.009 | 3 971 | 12 | 296 |
| Blog index | 37 | 6 826 | 0.000 | 3 933 | 47 | 2 153 |
| Blog detail | 66 | 5 176 | 0.007 | 3 001 | 26 | 332 |
| Jobs index | 64 | 3 901 | 0.002 | 2 551 | 45 | 668 |
| Jobs detail | 71 | 3 301 | 0.016 | 2 701 | 6 | 572 |
| Client story | 71 | 3 451 | 0.003 | 3 151 | 43 | 457 |

### Real-user p75 — CrUX (last 28 days, mobile)

| Route | LCP p75 (ms) | CLS p75 | INP p75 (ms) | TTFB p75 (ms) |
|-------|-------------:|--------:|-------------:|--------------:|
| Homepage | n/a | n/a | n/a | n/a |
| Blog index | n/a | n/a | n/a | n/a |
| Blog detail | n/a | n/a | n/a | n/a |
| Jobs index | n/a | n/a | n/a | n/a |
| Jobs detail | n/a | n/a | n/a | n/a |
| Client story | n/a | n/a | n/a | n/a |

**Note:** CrUX returned `null` for every metric on every route. The site does not have enough Chrome real-user traffic to surface in the public CrUX dataset. **Implication:** rely on Vercel Speed Insights for real-user data, and on the lab numbers above for repeatable before/after comparisons.

### Real-user p75 — Vercel Speed Insights (last 7 days, mobile, site-wide)

Captured 2026-05-13. Per-route breakdown unavailable — Vercel's Routes tab shows only `Unknown` because route patterns are not configured for this React Router v7 app. Numbers below are **site-wide aggregate** across all routes.

| Scope | LCP p75 | CLS p75 | INP p75 | TTFB p75 | FCP p75 | FID p75 | RES |
|-------|--------:|--------:|--------:|---------:|--------:|--------:|----:|
| All routes (mobile) | 2 750 ms | 0 | 144 ms | 450 ms | 1 740 ms | 21 ms | 95 / Great |

Geographic outlier: Algeria p75 in "Needs Improvement" band (74) — small sample, likely network-bound. Not actionable from code.

**Follow-up needed:** configure Vercel route patterns so per-route p75 becomes visible. Tracked separately if/when this measurement gap hurts.

---

## Targets (from PRD #120)

| Metric | PRD estimate | Lab observed (worst page) | Real-user p75 (site-wide) | Target |
|--------|-------------:|--------------------------:|--------------------------:|-------:|
| LCP mobile | 3.5–4.2 s | **8.2 s** (homepage) | 2.75 s | < 2.5 s |
| CLS | 0.12–0.15 | 0.016 (jobs detail) | 0 | < 0.1 |
| INP | 300–400 ms | 2 153 ms TBT proxy (blog index) | 144 ms | < 200 ms |
| TTFB | 800–1 200 ms | 47 ms | 450 ms | < 600 ms |
| Perf score (lab) | ~6.5 / 10 | **37 / 100** (blog index) | n/a | 90+ |
| Real Experience Score | n/a | n/a | 95 / Great | > 90 |

## Key takeaways from baseline

1. **Real users are doing dramatically better than the lab suggests.** Lab homepage LCP 8.2 s vs site-wide real-user p75 LCP 2.75 s. Causes: Vercel CDN warm cache, faster real devices/networks, and CrUX/PSI's worst-case mobile throttling. **Trust real-user numbers for product decisions; trust lab numbers for repeatable before/after diffs.**
2. **Real-user CWV are already mostly green.** INP 144 ms ✅, CLS 0 ✅, TTFB 450 ms ✅, RES 95 ✅. Only LCP (2.75 s) just barely misses < 2.5 s. → **PRD #120 may be overscoped.** Consider whether the full perf programme is justified or whether the LCP-focused slices alone deliver most of the value.
3. **LCP is the only real-user metric still missing target** (2.75 s vs 2.5 s). The hero-image fix from #151 is likely sufficient to close this gap. #161 (second wave) is probably gravy.
4. **Blog index TBT 2.1 s is a lab outlier**, but **real-user INP is 144 ms site-wide** — so the issue may be lab-only mobile throttling on HubSpot scripts, not actual user pain. **Verify against per-route real-user data before prioritising #158 (HubSpot lazy).**
5. **TTFB lab (47 ms) vs real-user (450 ms)** — 10× gap likely from cold-start serverless on real-user traffic. Data-fetching slices (#152–#155) target the cold-start path, so they will matter at p99 even if p75 is fine. **Recalibrate expected gain: smaller absolute, but still real for tail latencies.**
6. **Per-route real-user data is missing.** Vercel Routes tab shows only `Unknown` because RR v7 route patterns aren't registered. This blocks targeted measurement. Worth a small follow-up task before #151 if we want per-route validation of the LCP fix.
7. **CrUX returned null** — site too small for the public dataset. Not a blocker; Vercel Speed Insights covers real-user.

---

## Changelog

| Date | Author | Notes |
|------|--------|-------|
| 2026-05-13 | scaffold | Initial doc + URL list + commands. No data captured yet — #150 still open. |
| 2026-05-13 | baseline | Lab metrics captured via PSI for all 6 URLs. CrUX null everywhere (insufficient traffic). Vercel Speed Insights still pending. Key finding: LCP much worse than PRD estimated (8.2 s on homepage); CLS already in target; TBT 2.1 s on blog index is the INP outlier. |
| 2026-05-13 | vercel-rum | Site-wide real-user p75 captured from Vercel Speed Insights. Per-route unavailable (no route patterns configured). Numbers far better than lab: LCP 2.75 s (vs lab 8.2 s), INP 144 ms ✅, CLS 0 ✅, TTFB 450 ms ✅, RES 95. Reframes PRD #120 scope: only LCP still misses target by 250 ms; #151 alone may close the gap. |
