#!/bin/bash
# Run this script from the model-arena directory on the host to create commits
# for the polish pass changes.
set -e
cd "$(dirname "$0")"

git config user.name "solomonneas"
git config user.email "me@solomonneas.dev"

# Single commit for all polish pass fixes
git add -A
git commit -m "perf: polish pass — timeline animation, type safety, bundle, labels

- Timeline: persistent D3 scene with incremental visibility updates
  instead of full SVG clear+rebuild on every rAF tick
- BarChart: remove hoveredBar from useEffect deps (unused in effect)
- Bundle: remove duplicate d3 submodule deps (keep umbrella only)
- VariantPicker: correct labels/descriptions to match actual variants
- Types: replace Record<string,number> with typed ModelBenchmarks interface
- Timeline: add Other fallback group so unmatched models aren't dropped
- Timeline: add codestral to Mistral family pattern"

echo "Done. Run: git log --oneline -5"
