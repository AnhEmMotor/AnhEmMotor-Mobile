const fs = require('fs');
fs.writeFileSync('.husky/pre-commit', 'npx lint-staged\n');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg['lint-staged'] = {
  "**/*.{js,jsx}": [
    "node scripts/strip-comments-runner.js",
    "eslint --fix"
  ]
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
