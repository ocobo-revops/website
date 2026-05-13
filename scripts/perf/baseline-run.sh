#!/usr/bin/env bash
# Run PageSpeed Insights against the 6 baseline URLs and dump raw JSON to /tmp.
# Requires: PSI_KEY env var (get one at https://developers.google.com/speed/docs/insights/v5/get-started)
set -euo pipefail

: "${PSI_KEY:?Set PSI_KEY first — export PSI_KEY=<your-key>}"

urls=(
  "https://www.ocobo.co/"
  "https://www.ocobo.co/blog"
  "https://www.ocobo.co/blog/structurer-la-croissance-pour-liberer-la-vente-exemple-surfe"
  "https://www.ocobo.co/jobs"
  "https://www.ocobo.co/fr/jobs/revenue-operations-manager"
  "https://www.ocobo.co/clients/ekodev"
)

out_dir="${PSI_OUT_DIR:-/tmp}"
mkdir -p "$out_dir"

for url in "${urls[@]}"; do
  slug=$(echo "$url" | sed 's|https://www.ocobo.co||' | tr -c 'a-zA-Z0-9' '_' | sed 's|^_||;s|_$||')
  [ -z "$slug" ] && slug="home"
  curl -sG "https://www.googleapis.com/pagespeedonline/v5/runPagespeed" \
    --data-urlencode "url=$url" \
    --data-urlencode "strategy=mobile" \
    --data-urlencode "category=performance" \
    --data-urlencode "key=$PSI_KEY" \
    -o "$out_dir/psi-$slug.json"
  echo "✓ $slug → $out_dir/psi-$slug.json"
done
