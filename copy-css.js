const fs = require('fs');
const path = require('path');

// Create dist directory structure
const distErrorDir = path.join(__dirname, 'dist/pages/error');
if (!fs.existsSync(distErrorDir)) {
  fs.mkdirSync(distErrorDir, { recursive: true });
}

// Copy CSS file
const sourceCssPath = path.join(__dirname, 'src/pages/error/Error404.module.css');
const destCssPath = path.join(__dirname, 'dist/pages/error/Error404.module.css');

try {
  fs.copyFileSync(sourceCssPath, destCssPath);
  console.log(`Copied CSS file from ${sourceCssPath} to ${destCssPath}`);
} catch (error) {
  console.error(`Error copying CSS file: ${error.message}`);
  process.exit(1);
}