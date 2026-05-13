# Performance baseline — pre-refactor reference

Reference numbers captured before any [PRD #120](../../README.md) perf slice lands. Every subsequent perf slice (#151–#162) compares itself against this document.

**Status:** scaffolded, awaiting first run
**Last updated:** _pending — fill in after first run_
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

| Route | Perf score | LCP (ms) | CLS | FCP (ms) | TTFB (ms) | TBT (ms) |
|-------|-----------:|---------:|----:|---------:|----------:|---------:|
| Homepage | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ |
| Blog index | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ |
| Blog detail | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ |
| Jobs index | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ |
| Jobs detail | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ |
| Client story | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ |

### Real-user p75 — CrUX (last 28 days, mobile)

| Route | LCP p75 (ms) | CLS p75 | INP p75 (ms) | TTFB p75 (ms) |
|-------|-------------:|--------:|-------------:|--------------:|
| Homepage | _pending_ | _pending_ | _pending_ | _pending_ |
| Blog index | _pending_ | _pending_ | _pending_ | _pending_ |
| Blog detail | _pending_ | _pending_ | _pending_ | _pending_ |
| Jobs index | _pending_ | _pending_ | _pending_ | _pending_ |
| Jobs detail | _pending_ | _pending_ | _pending_ | _pending_ |
| Client story | _pending_ | _pending_ | _pending_ | _pending_ |

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

| Metric | Current estimate | Target |
|--------|-----------------:|-------:|
| LCP p75 mobile | 3.5–4.2 s | < 2.5 s |
| CLS p75 | 0.12–0.15 | < 0.1 |
| INP p75 | 300–400 ms | < 200 ms |
| TTFB p75 | 800–1 200 ms | < 600 ms |
| Perf score (lab) | ~6.5 | 9+ |

---

## Changelog

| Date | Author | Notes |
|------|--------|-------|
| 2026-05-13 | scaffold | Initial doc + URL list + commands. No data captured yet — #150 still open. |
