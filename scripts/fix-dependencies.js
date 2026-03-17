#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting dependency conflict resolution...\n');

const projectRoot = '/vercel/share/v0-project';

// STEP 1: Update package.json FIRST (before removing anything)
console.log('✏️ Updating package.json to fix dependencies...');
const packagePath = path.join(projectRoot, 'package.json');

if (!fs.existsSync(packagePath)) {
  console.error(`❌ package.json not found at ${packagePath}`);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Remove lovable-tagger
if (pkg.devDependencies && pkg.devDependencies['lovable-tagger']) {
  delete pkg.devDependencies['lovable-tagger'];
  console.log('  ✓ Removed lovable-tagger');
}

// Fix vite version
if (pkg.devDependencies && pkg.devDependencies['vite']) {
  pkg.devDependencies['vite'] = '^6.0.0';
  console.log('  ✓ Set vite to ^6.0.0');
}

// Fix @vitejs/plugin-react version  
if (pkg.devDependencies && pkg.devDependencies['@vitejs/plugin-react']) {
  pkg.devDependencies['@vitejs/plugin-react'] = '^4.3.1';
  console.log('  ✓ Updated @vitejs/plugin-react to ^4.3.1');
}

// Fix vitest version
if (pkg.devDependencies && pkg.devDependencies['vitest']) {
  pkg.devDependencies['vitest'] = '^3.0.0';
  console.log('  ✓ Updated vitest to ^3.0.0');
}

// Add overrides
pkg.overrides = { 'vite': '^6.0.0' };
console.log('  ✓ Added vite 6.0.0 to overrides');

// Set packageManager
pkg.packageManager = 'npm@11.6.2';
console.log('  ✓ Set packageManager to npm');

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
console.log('\n✅ package.json has been updated successfully\n');

// STEP 2: Remove node_modules and lock files
console.log('📦 Removing node_modules and lock files...');

const toRemove = [
  path.join(projectRoot, 'node_modules'),
  path.join(projectRoot, 'package-lock.json'),
  path.join(projectRoot, 'pnpm-lock.yaml'),
  path.join(projectRoot, 'bun.lock'),
  path.join(projectRoot, 'yarn.lock')
];

toRemove.forEach(item => {
  if (fs.existsSync(item)) {
    if (fs.statSync(item).isDirectory()) {
      fs.rmSync(item, { recursive: true, force: true });
    } else {
      fs.unlinkSync(item);
    }
    console.log(`  ✓ Removed ${path.basename(item)}`);
  }
});
console.log('✓ Cleaned up old dependencies\n');

// STEP 3: Install dependencies
console.log('🚀 Installing dependencies with npm and --legacy-peer-deps...\n');
try {
  execSync('npm install --legacy-peer-deps', { 
    cwd: projectRoot,
    stdio: 'inherit' 
  });
  console.log('\n✨ Dependency resolution complete!');
  console.log('You can now run: npm run dev');
} catch (e) {
  console.error('\n❌ Error during npm install.');
  process.exit(1);
}
