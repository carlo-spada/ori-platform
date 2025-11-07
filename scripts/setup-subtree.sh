#!/bin/bash

# One-time setup: Add aur4 as a remote
git remote add aur4 https://github.com/carlo-spada/aur4.git

# Pull aur4 changes into frontend subfolder
git subtree pull --prefix=frontend aur4 main --squash

echo "✅ Subtree configured. To sync future changes from Lovable:"
echo "  git subtree pull --prefix=frontend aur4 main --squash"