#!/bin/bash
set -e

echo "🧹 Cleaning up old installations..."
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml bun.lock yarn.lock

echo "🔧 Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

echo "📦 Installing dependencies with legacy peer deps flag..."
npm install --legacy-peer-deps --verbose

echo "✅ Installation complete!"
echo "Run 'npm run dev' to start the development server."
