#!/bin/bash
# Environment Setup Script for lan-onasis-monorepo
# Fixes PATH issues for Node.js, Bun, and Turborepo

echo "🔧 Setting up development environment..."

# Set proper PATH
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/Users/$USER/.bun/bin:/Users/$USER/.local/bin:$PATH"

echo "✅ Environment configured:"
echo "Node.js: $(which node 2>/dev/null && node --version 2>/dev/null || echo 'Not found')"
echo "npm: $(which npm 2>/dev/null && npm --version 2>/dev/null || echo 'Not found')"
echo "Bun: $(which bun 2>/dev/null && bun --version 2>/dev/null || echo 'Not found')"
echo "Turborepo: $(which turbo 2>/dev/null && npx turbo --version 2>/dev/null || echo 'Not found')"

echo ""
echo "🚀 Ready to use:"
echo "  bun install          # Install dependencies"
echo "  bun run dev          # Start development"
echo "  bun run build        # Build all packages"
echo "  npx turbo build      # Turborepo build"
echo "  npx turbo dev        # Turborepo dev mode"

# Make this script executable
chmod +x "$0"

echo ""
echo "💡 To permanently fix your shell, add this to your ~/.zshrc:"
echo 'export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$HOME/.bun/bin:$HOME/.local/bin:$PATH"'
