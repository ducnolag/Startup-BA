#!/usr/bin/env bash
# scripts/test.sh — run tests across the monorepo.

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== agent-runner (pytest) ==="
cd "$ROOT/apps/agent-runner"
if [ ! -d ".venv" ]; then
  echo "No .venv found. Run scripts/dev.sh first."
  exit 1
fi
source .venv/bin/activate 2>/dev/null || .venv/Scripts/activate
pytest -q

echo ""
echo "=== web (type-check + lint) ==="
cd "$ROOT/apps/web"
if [ ! -d "node_modules" ]; then
  echo "No node_modules. Run 'npm install' first."
  exit 1
fi
npx tsc --noEmit
npm run lint
