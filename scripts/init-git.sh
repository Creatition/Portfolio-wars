#!/usr/bin/env bash
# Initialize the Portfolio Wars git repo and make the first commit.
# Run from the mvp/ directory:
#   bash scripts/init-git.sh

set -euo pipefail

cd "$(dirname "$0")/.."
echo "→ Initializing git repo in $(pwd)"

if [ -d .git ]; then
  echo "  .git already exists — skipping init"
else
  git init -b main >/dev/null
  echo "  ✓ git init -b main"
fi

git config user.email "creatition@proton.me"
git config user.name  "Creatition"
echo "  ✓ configured user.email and user.name (this repo only)"

git add -A
echo "  ✓ staged $(git ls-files --cached | wc -l | tr -d ' ') files"

git commit -m "$(cat <<'EOF'
Initial commit: Portfolio Wars MVP

- Monorepo with npm workspaces (apps/web, apps/api, packages/shared)
- @pw/web: Next.js 14 frontend, deploys to Cloudflare Pages
- @pw/api: Fastify + tRPC backend, deploys to Railway
- @pw/shared: types, tRPC router, mock data
- contracts/: Hardhat sub-project with FundingContract.sol stub
- DEPLOYMENT.md walks through Railway + Cloudflare setup
EOF
)" >/dev/null
echo "  ✓ first commit made"

echo ""
echo "Next steps:"
echo "  1. Create a private repo on GitHub (gh repo create or web UI)"
echo "  2. git remote add origin git@github.com:<your-handle>/portfolio-wars.git"
echo "  3. git push -u origin main"
echo ""
echo "Then follow DEPLOYMENT.md to wire up Railway + Cloudflare."
