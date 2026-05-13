# Perf measurement scripts

Helpers for capturing CWV baselines and re-measurements against the URL set frozen in `docs/project/performance-baseline.md`.

## Setup

Get a PageSpeed Insights API key: https://developers.google.com/speed/docs/insights/v5/get-started

```bash
export PSI_KEY=<your-key>
```

## Run a measurement

```bash
bash scripts/perf/baseline-run.sh        # dumps 6 JSON files to /tmp/psi-*.json
bash scripts/perf/baseline-extract.sh    # prints the key CWV metrics per URL
```

Override output directory via `PSI_OUT_DIR`:

```bash
PSI_OUT_DIR=./tmp/perf-$(date +%Y%m%d) bash scripts/perf/baseline-run.sh
```

## URLs measured

Six routes, source of truth: `docs/project/performance-baseline.md`.

## What to do with the output

For the initial baseline (#150), paste the extract output into `docs/project/performance-baseline.md` tables. For re-measurements after each #120 slice, compare against that doc.
