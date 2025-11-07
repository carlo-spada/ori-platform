#!/bin/bash

# Sync script to pull changes from aur4 repo into monorepo frontend

echo "🔄 Syncing changes from aur4 to aura-platform/frontend..."

# Save current directory
MONOREPO_DIR=$(pwd)

# Check if we're in the monorepo root
if [ ! -f "pnpm-workspace.yaml" ]; then
  echo "❌ Error: Run this script from the aura-platform root directory"
  exit 1
fi

# Pull latest changes from aur4
echo "📥 Fetching latest from aur4..."
cd ../aur4/aur4
git pull origin main

# Copy changes to monorepo frontend (excluding git and node_modules)
echo "📋 Copying files to monorepo frontend..."
rsync -av --exclude='.git' \
          --exclude='node_modules' \
          --exclude='dist' \
          --exclude='pnpm-lock.yaml' \
          --exclude='package-lock.json' \
          --exclude='.env' \
          ./ "$MONOREPO_DIR/frontend/"

# Return to monorepo
cd "$MONOREPO_DIR"

# Check for changes
if git diff --quiet frontend/; then
  echo "✅ No changes to sync"
else
  echo "📝 Changes detected in frontend/"
  git add frontend/
  git status

  echo ""
  echo "To commit these changes, run:"
  echo "  git commit -m 'sync: Update frontend from Lovable'"
fi

echo "✨ Sync complete!"