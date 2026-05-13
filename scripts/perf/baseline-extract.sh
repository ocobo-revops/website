#!/usr/bin/env bash
# Extract key CWV metrics from PSI JSON dumps produced by baseline-run.sh.
# Prints one JSON object per URL — lab metrics + CrUX p75 fields.
set -euo pipefail

in_dir="${PSI_OUT_DIR:-/tmp}"

shopt -s nullglob
files=("$in_dir"/psi-*.json)
if [ ${#files[@]} -eq 0 ]; then
  echo "No psi-*.json files in $in_dir — run scripts/perf/baseline-run.sh first" >&2
  exit 1
fi

for f in "${files[@]}"; do
  echo "=== $(basename "$f" .json) ==="
  jq '{
    score: .lighthouseResult.categories.performance.score,
    lcp_ms: .lighthouseResult.audits["largest-contentful-paint"].numericValue,
    cls: .lighthouseResult.audits["cumulative-layout-shift"].numericValue,
    fcp_ms: .lighthouseResult.audits["first-contentful-paint"].numericValue,
    ttfb_ms: .lighthouseResult.audits["server-response-time"].numericValue,
    tbt_ms: .lighthouseResult.audits["total-blocking-time"].numericValue,
    crux_lcp_p75: .loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile,
    crux_cls_p75: .loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile,
    crux_inp_p75: .loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile,
    crux_ttfb_p75: .loadingExperience.metrics.EXPERIENCE_FIRST_CONTENTFUL_PAINT_MS.percentile
  }' "$f"
done
