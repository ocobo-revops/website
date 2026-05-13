# Performance baseline — pre-refactor reference

Reference numbers captured before any [PRD #120](../../README.md) perf slice lands. Every subsequent perf slice (#151–#162) compares itself against this document.

**Status:** lab baseline captured 2026-05-13 ; Vercel Speed Insights pending
**Last updated:** 2026-05-13
**Method:** PageSpeed Insights API (lab Lighthouse + CrUX p75) + Vercel Speed Insights dashboard

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

### Real-user p75 — Vercel Speed Insights (last 7 days, mobile)

| Route | LCP p75 (ms) | CLS p75 | INP p75 (ms) | TTFB p75 (ms) |
|-------|-------------:|--------:|-------------:|--------------:|
| Homepage | _pending_ | _pending_ | _pending_ | _pending_ |
| Blog index | _pending_ | _pending_ | _pending_ | _pending_ |
| Blog detail | _pending_ | _pending_ | _pending_ | _pending_ |
| Jobs index | _pending_ | _pending_ | _pending_ | _pending_ |
| Jobs detail | _pending_ | _pending_ | _pending_ | _pending_ |
| Client story | _pending_ | _pending_ | _pending_ | _pending_ |

---

## Targets (from PRD #120)

| Metric | PRD estimate | Lab observed (worst page) | Target |
|--------|-------------:|--------------------------:|-------:|
| LCP mobile | 3.5–4.2 s | **8.2 s** (homepage) | < 2.5 s |
| CLS | 0.12–0.15 | 0.016 (jobs detail) | < 0.1 |
| INP (proxied by TBT lab) | 300–400 ms | **2 153 ms** TBT (blog index) | < 200 ms |
| TTFB | 800–1 200 ms | 47 ms (worst lab) | < 600 ms |
| Perf score | ~6.5 / 10 | **37 / 100** (blog index) | 90+ |

## Key takeaways from baseline

1. **LCP is dramatically worse than the PRD estimated** — homepage 8.2 s, blog index 6.8 s, all six pages above the 2.5 s target. Hero image + above-fold images are the dominant cost. → #151 (`<OptimizedImage>` + hero) and #161 (second wave) are the highest-leverage slices.
2. **CLS is already in target everywhere** (worst 0.016 vs target < 0.1). The PRD over-estimated CLS risk. CLS-focused work can be deprioritised; image dimensions still matter for LCP, not for CLS.
3. **TTFB is excellent in the lab** (6–47 ms). The PRD's 800–1 200 ms estimate must come from cold-start / real-user p75, not lab cold. → keep the data-fetching slices (#152, #153, #154, #155) but recalibrate expected gains downward for TTFB; their main upside is reduced bundle blocking + earlier LCP, not raw TTFB.
4. **Blog index TBT 2.1 s is the INP outlier.** Likely script-heavy listing page (HubSpot + carousels). → #158 (HubSpot lazy) is more important than the PRD ranking suggested.
5. **No CrUX data.** Cannot triangulate real-user perception. Vercel Speed Insights is the only real-user source. Worth checking whether Speed Insights has enough samples per route.

---

## Changelog

| Date | Author | Notes |
|------|--------|-------|
| 2026-05-13 | scaffold | Initial doc + URL list + commands. No data captured yet — #150 still open. |
| 2026-05-13 | baseline | Lab metrics captured via PSI for all 6 URLs. CrUX null everywhere (insufficient traffic). Vercel Speed Insights still pending. Key finding: LCP much worse than PRD estimated (8.2 s on homepage); CLS already in target; TBT 2.1 s on blog index is the INP outlier. |
