#!/bin/bash

# Manual Branch Sync Script
# This script synchronizes all agent branches with the main branch
# It should be run by someone with push access to the repository

set -e

echo "🔄 Manual Branch Synchronization"
echo "================================"
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository root"
    exit 1
fi

# Check if we can access the remote repository
echo "Checking GitHub connection..."
if ! git ls-remote origin main &>/dev/null; then
    echo "❌ Error: Cannot access remote repository. Please ensure you're authenticated."
    echo "   You may need to run: gh auth login"
    exit 1
fi

echo "✅ Connection verified"
echo "⚠️  Note: This script requires push access to the repository."
echo "   If the sync fails due to permissions, please check your access rights."
echo ""

# Fetch latest changes
echo "Fetching latest changes from origin..."
git fetch --all
echo ""

# Run the branch sync script
echo "Running branch synchronization..."
node scripts/branch-sync-agent.js

echo ""
echo "✅ Branch synchronization completed successfully!"
