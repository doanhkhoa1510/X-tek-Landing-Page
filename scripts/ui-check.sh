#!/usr/bin/env bash
# Usage: npm run ui:check -- [filter] [widths]
#   filter  only shots whose name contains it, e.g. "header", "mobile/landing", "page-careers"
#   widths  comma list of desktop,tablet,mobile (default all)
# Env: PORT (default 4400). Needs `npx astro dev --port 4400` running.
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${PORT:-4400}"
ONLY="${1:-}"
WIDTHS="${2:-desktop,tablet,mobile}"
TMP="$HOME/.dev-browser/tmp/ui-check"
OUT=".ui-check"

curl -sf -o /dev/null "http://localhost:$PORT/" || { echo "No dev server on :$PORT. Run: npx astro dev --port $PORT"; exit 1; }

cfg=$(printf '{"base":"http://localhost:%s","only":"%s","widths":["%s"]}' "$PORT" "$ONLY" "${WIDTHS//,/\",\"}")
rm -rf "$TMP"
sed "s|__CFG__|$cfg|" scripts/ui-check.js | dev-browser --timeout 900
rm -rf "$OUT" && cp -R "$TMP" "$OUT"
echo "Screenshots + report.json in $OUT/"
