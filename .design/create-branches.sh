#!/usr/bin/env bash
# Creates design/* branches from main. Run from repo root: bash .design/create-branches.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

apply_branch() {
  local branch="$1"
  local label="$2"
  local globals_file="$3"

  git checkout main
  git checkout -B "$branch"

  cp "$globals_file" app/globals.css
  cp .design/DesignPreviewBanner.tsx app/components/DesignPreviewBanner.tsx

  # Patch layout.tsx — add banner after body opens
  python - <<PY
from pathlib import Path
path = Path("app/layout.tsx")
text = path.read_text(encoding="utf-8")
if "DesignPreviewBanner" not in text:
    text = text.replace(
        'import "./globals.css";',
        'import "./globals.css";\nimport { DesignPreviewBanner } from "./components/DesignPreviewBanner";',
    )
    text = text.replace(
        "      <body className=",
        f'      <DesignPreviewBanner label="{label}" branch="{branch}" />\n      <body className=',
    )
    path.write_text(text, encoding="utf-8")
PY

  git add app/globals.css app/components/DesignPreviewBanner.tsx app/layout.tsx
  git commit -m "Design preview: ${label} palette (local experiments only)."
  git push -u origin "$branch"
}

apply_branch "design/cosmic-indigo" "Cosmic indigo" ".design/cosmic-indigo-globals.css"
apply_branch "design/warm-dawn" "Warm dawn" ".design/warm-dawn-globals.css"
apply_branch "design/electric-teal" "Electric teal" ".design/electric-teal-globals.css"

git checkout main
echo "Done. design/* branches pushed. main unchanged except docs."
