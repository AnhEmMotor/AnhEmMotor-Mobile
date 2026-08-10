const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

function getAllJSFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (
      file === 'node_modules' ||
      file === '.git' ||
      file === '.expo' ||
      file === 'android' ||
      file === 'ios' ||
      file === 'dist' ||
      file === 'dist-web'
    ) {
      continue;
    }

    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJSFiles(filePath, fileList);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const args = process.argv.slice(2);
let files = [];
if (args.length > 0) {
  files = args.filter((f) => f.endsWith('.js') || f.endsWith('.jsx'));
} else {
  files = getAllJSFiles(process.cwd());
}

files.forEach((file) => {
  if (file.includes('config') || file.includes('.eslintrc') || file.includes('scripts')) {
    return;
  }

  try {
    const content = fs.readFileSync(file, 'utf8');
    const stripped = strip(content);

    if (content !== stripped) {
      fs.writeFileSync(file, stripped, 'utf8');
    }
  } catch (e) {
    console.error('Failed to strip comments from ' + file + ':', e);
  }
});
console.log('Comments stripped successfully.');
