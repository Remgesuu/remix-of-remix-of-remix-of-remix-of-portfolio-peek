#!/bin/bash

set -e

echo "🔧 Starting dependency conflict resolution..."

cd /vercel/share/v0-project

echo "📦 Removing node_modules and lock files..."
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml
rm -f bun.lock
rm -f yarn.lock

echo "🧹 Clearing npm cache..."
npm cache clean --force

echo "✏️ Updating package.json to fix dependencies..."

# Create corrected package.json without lovable-tagger and with vite 6
node << 'NODEJS'
const fs = require('fs');
const path = require('path');

const packagePath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Remove lovable-tagger if it exists
if (pkg.devDependencies && pkg.devDependencies['lovable-tagger']) {
  delete pkg.devDependencies['lovable-tagger'];
  console.log('✓ Removed lovable-tagger');
}

// Fix vite version
if (pkg.devDependencies && pkg.devDependencies['vite']) {
  pkg.devDependencies['vite'] = '^6.0.0';
  console.log('✓ Downgraded vite to ^6.0.0');
}

// Fix @vitejs/plugin-react version
if (pkg.devDependencies && pkg.devDependencies['@vitejs/plugin-react']) {
  pkg.devDependencies['@vitejs/plugin-react'] = '^4.3.1';
  console.log('✓ Updated @vitejs/plugin-react to ^4.3.1');
}

// Fix vitest version
if (pkg.devDependencies && pkg.devDependencies['vitest']) {
  pkg.devDependencies['vitest'] = '^3.0.0';
  console.log('✓ Updated vitest to ^3.0.0');
}

// Add overrides to force vite 6.0.0 for all dependencies
pkg.overrides = { 'vite': '^6.0.0' };
console.log('✓ Added vite 6.0.0 to overrides');

// Ensure packageManager is set
pkg.packageManager = 'npm@11.6.2';
console.log('✓ Set packageManager to npm');

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
console.log('\n✅ package.json has been updated successfully');
NODEJS

echo ""
echo "🚀 Installing dependencies with npm..."
npm install --legacy-peer-deps

echo ""
echo "✨ Dependency resolution complete!"
echo "You can now run: npm run dev"
