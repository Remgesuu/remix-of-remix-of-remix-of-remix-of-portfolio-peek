#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting dependency conflict resolution...\n');

const projectRoot = '/vercel/share/v0-project';
process.chdir(projectRoot);

// Step 1: Remove node_modules and lock files
console.log('📦 Removing node_modules and lock files...');
const dirsToRemove = ['node_modules'];
const filesToRemove = ['package-lock.json', 'pnpm-lock.yaml', 'bun.lock', 'yarn.lock'];

dirsToRemove.forEach(dir => {
  const fullPath = path.join(projectRoot, dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`  ✓ Removed ${dir}`);
  }
});

filesToRemove.forEach(file => {
  const fullPath = path.join(projectRoot, file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`  ✓ Removed ${file}`);
  }
});

// Step 2: Clear npm cache
console.log('\n🧹 Clearing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (e) {
  console.log('  ⚠️  Cache clear had issues but continuing...');
}

// Step 3: Update package.json
console.log('\n✏️ Updating package.json to fix dependencies...');
const packagePath = path.join(projectRoot, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Remove lovable-tagger
if (pkg.devDependencies && pkg.devDependencies['lovable-tagger']) {
  delete pkg.devDependencies['lovable-tagger'];
  console.log('  ✓ Removed lovable-tagger');
}

// Fix vite version
if (pkg.devDependencies && pkg.devDependencies['vite']) {
  pkg.devDependencies['vite'] = '^6.0.0';
  console.log('  ✓ Downgraded vite to ^6.0.0');
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
console.log('\n✅ package.json has been updated successfully');

// Step 4: Install dependencies
console.log('\n🚀 Installing dependencies with npm...\n');
try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('\n✨ Dependency resolution complete!');
  console.log('You can now run: npm run dev');
} catch (e) {
  console.error('\n❌ Error during npm install. Please check the error above.');
  process.exit(1);
}
