const fs = require('fs');

let code = fs.readFileSync('scripts/strip-comments-runner.js', 'utf8');

const newLogic = `
const args = process.argv.slice(2);
let files = [];
if (args.length > 0) {
    files = args.filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
} else {
    files = getAllJSFiles(process.cwd());
}
`;
code = code.replace('const targetDir = process.cwd();\nconst files = getAllJSFiles(targetDir);', newLogic);
fs.writeFileSync('scripts/strip-comments-runner.js', code);
