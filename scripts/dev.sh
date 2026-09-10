#!/usr/bin/env bash
# scripts/dev.sh — start both services locally without Docker.
# Run two terminals: one for agent-runner, one for web.

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Terminal 1 ==="
echo "cd $ROOT/apps/agent-runner"
echo "python -m venv .venv && source .venv/bin/activate"
echo "pip install -r requirements.txt"
echo "export ANTHROPIC_API_KEY=sk-ant-..."
echo "python -m agent_runner.runner"
echo ""
echo "=== Terminal 2 ==="
echo "cd $ROOT/apps/web"
echo "npm install"
echo "npm run dev"
