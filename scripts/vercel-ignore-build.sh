#!/bin/bash

# Vercel Ignored Build Step
# This script determines whether Vercel should build/deploy
# Exit 1 = Build, Exit 0 = Skip build

echo "Checking if build should proceed..."
echo "Branch: $VERCEL_GIT_COMMIT_REF"
echo "Commit: $VERCEL_GIT_COMMIT_SHA"

# Only build on main branch (production)
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  echo "✅ Main branch detected - proceeding with deployment"
  exit 1
fi

# Skip builds on all other branches (dev, feature branches, etc.)
echo "⏭️  Non-production branch - skipping deployment"
exit 0
